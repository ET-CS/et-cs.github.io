import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';
import { SITE_TITLE, SITE_URL } from '../src/consts';

/** Pages of the test build, including the fixture posts in `tests/fixtures/blog/`. */
const PAGES = [
	{ path: '/', heading: "Hi, I'm Itai.", status: 200 },
	{ path: '/blog/', heading: 'Writing', status: 200 },
	{ path: '/about/', heading: 'About', status: 200 },
	{ path: '/blog/typography/', heading: 'Typography test post', status: 200 },
	{ path: '/blog/minimal/', heading: 'Minimal test post', status: 200 },
	{ path: '/does-not-exist/', heading: 'Page not found', status: 404 },
] as const;

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

/** Collects console errors and uncaught exceptions for the lifetime of the page. */
function trackErrors(page: Page): string[] {
	const errors: string[] = [];
	page.on('console', (message) => {
		if (message.type() !== 'error') return;
		// Chromium logs the HTTP status of the document itself, which is expected on the 404 page.
		// Failed subresources (scripts, styles, images) still count.
		if (message.location().url === page.url() && message.text().includes('status of 404')) return;
		errors.push(message.text());
	});
	page.on('pageerror', (error) => errors.push(error.message));
	return errors;
}

async function expectNoAccessibilityViolations(page: Page): Promise<void> {
	const { violations } = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
	expect(violations).toEqual([]);
}

const themeToggle = (page: Page) => page.getByRole('button', { name: 'Dark theme' });

for (const { path, heading, status } of PAGES) {
	test.describe(`page ${path}`, () => {
		test('renders without errors', async ({ page }) => {
			const errors = trackErrors(page);
			const response = await page.goto(path);

			expect(response?.status()).toBe(status);
			expect(await page.title()).toContain(SITE_TITLE);
			await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading);
			await expect(page.getByRole('banner')).toBeVisible();
			await expect(page.getByRole('contentinfo')).toBeVisible();
			expect(errors).toEqual([]);
		});

		test(
			'fits the viewport without horizontal scrolling',
			{ tag: '@responsive' },
			async ({ page }) => {
				await page.goto(path);
				const overflow = await page.evaluate(
					() => document.documentElement.scrollWidth - document.documentElement.clientWidth,
				);
				expect(overflow).toBeLessThanOrEqual(0);
			},
		);

		for (const colorScheme of ['light', 'dark'] as const) {
			test(
				`is accessible with the ${colorScheme} system theme`,
				{ tag: '@responsive' },
				async ({ page }) => {
					await page.emulateMedia({ colorScheme });
					await page.goto(path);
					await expectNoAccessibilityViolations(page);
				},
			);
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

	expect(visited).toContain('/blog/typography/');
});

test.describe('theme toggle', () => {
	test('switches theme, reflects state and remembers the choice', async ({ page }) => {
		await page.emulateMedia({ colorScheme: 'light' });
		await page.goto('/');
		const root = page.locator('html');

		await expect(themeToggle(page)).toHaveAttribute('aria-pressed', 'false');
		await themeToggle(page).click();
		await expect(root).toHaveAttribute('data-theme', 'dark');
		await expect(themeToggle(page)).toHaveAttribute('aria-pressed', 'true');

		await page.reload();
		await expect(root).toHaveAttribute('data-theme', 'dark');
		await expect(themeToggle(page)).toHaveAttribute('aria-pressed', 'true');

		await themeToggle(page).click();
		await expect(root).toHaveAttribute('data-theme', 'light');
	});

	for (const systemScheme of ['light', 'dark'] as const) {
		test(`chosen theme is accessible over a ${systemScheme} system theme`, async ({ page }) => {
			await page.emulateMedia({ colorScheme: systemScheme });
			await page.goto('/blog/typography/');
			await themeToggle(page).click();
			await expect(page.locator('html')).toHaveAttribute(
				'data-theme',
				systemScheme === 'light' ? 'dark' : 'light',
			);
			await expectNoAccessibilityViolations(page);
		});
	}
});

test.describe('without JavaScript', () => {
	test.use({ javaScriptEnabled: false });

	test('pages render and the theme toggle is hidden', async ({ page }) => {
		await page.goto('/blog/typography/');
		await expect(page.getByRole('heading', { level: 1 })).toHaveText('Typography test post');
		await expect(page.locator('#theme-toggle')).toBeHidden();
	});
});

test.describe('navigation', () => {
	test('marks the current page and section', async ({ page }) => {
		const nav = page.getByRole('navigation', { name: 'Main' });

		await page.goto('/blog/');
		await expect(nav.getByRole('link', { name: 'Writing' })).toHaveAttribute(
			'aria-current',
			'page',
		);

		await page.goto('/blog/minimal/');
		await expect(nav.getByRole('link', { name: 'Writing' })).toHaveAttribute(
			'aria-current',
			'true',
		);
		await expect(nav.getByRole('link', { name: 'About' })).not.toHaveAttribute('aria-current');
	});
});

test.describe('posts', () => {
	test('are listed newest first with dates in UTC', async ({ page }) => {
		await page.goto('/blog/');
		const items = page.getByRole('main').getByRole('listitem');
		await expect(items).toHaveText([
			/Typography test post\s*Jan 15, 2026/,
			/Minimal test post\s*Dec 31, 2025/,
		]);
	});

	test('show publish and update dates and the hero image', async ({ page }) => {
		await page.goto('/blog/typography/');
		const article = page.getByRole('article');
		await expect(article.locator('time')).toHaveText(['Jan 15, 2026', 'Feb 1, 2026']);
		await expect(article.locator('time').first()).toHaveAttribute('datetime', '2026-01-15');
		await expect(article.getByRole('img', { name: /mountain/ })).toBeVisible();
	});

	test('have article metadata', async ({ page }) => {
		await page.goto('/blog/typography/');
		await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'article');
		await expect(page.locator('meta[property="article:published_time"]')).toHaveAttribute(
			'content',
			'2026-01-15T00:00:00.000Z',
		);
		await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
			'href',
			`${SITE_URL}/blog/typography/`,
		);
	});
});

test('404 page is kept out of search results', async ({ page }) => {
	await page.goto('/does-not-exist/');
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
	await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
});

test('feeds and crawler files are served', async ({ request }) => {
	const rss = await request.get('/rss.xml');
	expect(rss.status()).toBe(200);
	const feed = await rss.text();
	expect(feed).toContain('<language>en</language>');
	expect(feed).toContain(`${SITE_URL}/blog/typography/`);
	expect(feed).toContain(`${SITE_URL}/blog/minimal/`);

	const sitemap = await request.get('/sitemap-index.xml');
	expect(sitemap.status()).toBe(200);

	const robots = await request.get('/robots.txt');
	expect(robots.status()).toBe(200);
	expect(await robots.text()).toContain(`Sitemap: ${SITE_URL}/sitemap-index.xml`);
});
