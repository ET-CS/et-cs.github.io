import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { SITE_TITLE } from '../src/consts';

const PAGES = [
	{ path: '/', heading: "Hi, I'm Itai." },
	{ path: '/blog/', heading: 'Writing' },
	{ path: '/about/', heading: 'About' },
] as const;

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

/** Collects console errors and uncaught exceptions for the lifetime of the page. */
function trackErrors(page: Page): string[] {
	const errors: string[] = [];
	page.on('console', (message) => {
		if (message.type() === 'error') errors.push(message.text());
	});
	page.on('pageerror', (error) => errors.push(error.message));
	return errors;
}

for (const { path, heading } of PAGES) {
	test.describe(`page ${path}`, () => {
		test('renders without errors', async ({ page }) => {
			const errors = trackErrors(page);
			const response = await page.goto(path);

			expect(response?.status()).toBe(200);
			await expect(page).toHaveTitle(new RegExp(SITE_TITLE));
			await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading);
			await expect(page.getByRole('banner')).toBeVisible();
			await expect(page.getByRole('contentinfo')).toBeVisible();
			expect(errors).toEqual([]);
		});

		test('fits the viewport without horizontal scrolling', async ({ page }) => {
			await page.goto(path);
			const overflow = await page.evaluate(
				() => document.documentElement.scrollWidth - document.documentElement.clientWidth,
			);
			expect(overflow).toBeLessThanOrEqual(0);
		});

		for (const colorScheme of ['light', 'dark'] as const) {
			test(`has no accessibility violations in ${colorScheme} mode`, async ({ page }) => {
				await page.emulateMedia({ colorScheme });
				await page.goto(path);
				const { violations } = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
				expect(violations).toEqual([]);
			});
		}
	});
}

test('every internal link resolves', async ({ page, request }) => {
	const visited = new Set<string>();
	const queue = ['/'];

	while (queue.length > 0) {
		const path = queue.shift();
		if (path === undefined || visited.has(path)) continue;
		visited.add(path);

		const response = await page.goto(path);
		expect(response?.status(), `GET ${path}`).toBe(200);

		const hrefs = await page
			.locator('a[href^="/"]')
			.evaluateAll((links) => links.map((link) => link.getAttribute('href') ?? ''));
		for (const href of hrefs) {
			const target = href.split('#')[0] ?? href;
			if (target.endsWith('.xml')) {
				expect((await request.get(target)).status(), `GET ${target}`).toBe(200);
			} else if (!visited.has(target)) {
				queue.push(target);
			}
		}
	}

	expect(visited.size).toBeGreaterThanOrEqual(PAGES.length);
});

test('theme toggle switches theme and remembers the choice', async ({ page }) => {
	await page.emulateMedia({ colorScheme: 'light' });
	await page.goto('/');
	const root = page.locator('html');

	await page.getByRole('button', { name: /switch light or dark theme/i }).click();
	await expect(root).toHaveAttribute('data-theme', 'dark');

	await page.reload();
	await expect(root).toHaveAttribute('data-theme', 'dark');

	await page.getByRole('button', { name: /switch light or dark theme/i }).click();
	await expect(root).toHaveAttribute('data-theme', 'light');
});

test('unknown pages show the 404 page', async ({ page }) => {
	const response = await page.goto('/this-page-does-not-exist/');
	expect(response?.status()).toBe(404);
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found');
});

test('feeds and crawler files are served', async ({ request }) => {
	const rss = await request.get('/rss.xml');
	expect(rss.status()).toBe(200);
	expect(await rss.text()).toContain('<rss');

	const sitemap = await request.get('/sitemap-index.xml');
	expect(sitemap.status()).toBe(200);

	const robots = await request.get('/robots.txt');
	expect(robots.status()).toBe(200);
	expect(await robots.text()).toContain('Sitemap: https://et-cs.github.io/sitemap-index.xml');
});

test('blog posts render and are accessible', async ({ page }) => {
	await page.goto('/blog/');
	const postPaths = await page
		.getByRole('main')
		.locator('a[href^="/blog/"]')
		.evaluateAll((links) => links.map((link) => link.getAttribute('href') ?? ''));
	test.skip(postPaths.length === 0, 'No posts published yet');

	for (const path of postPaths.slice(0, 5)) {
		const errors = trackErrors(page);
		expect((await page.goto(path))?.status(), `GET ${path}`).toBe(200);
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
		await expect(page.locator('article time').first()).toBeVisible();

		for (const colorScheme of ['light', 'dark'] as const) {
			await page.emulateMedia({ colorScheme });
			const { violations } = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
			expect(violations, `${path} (${colorScheme})`).toEqual([]);
		}
		expect(errors).toEqual([]);
	}
});
