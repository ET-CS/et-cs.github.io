import { defineConfig, devices } from '@playwright/test';
import { TEST_BUILD_ENV } from './src/lib/build';

const PORT = 4399;
const isCI = Boolean(process.env.CI);
// Lets a machine with a preinstalled Chromium run the tests without `playwright install`.
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;

export default defineConfig({
	testDir: 'tests',
	fullyParallel: true,
	forbidOnly: isCI,
	reporter: isCI ? [['github'], ['html', { open: 'never' }]] : 'list',
	use: {
		baseURL: `http://localhost:${PORT}`,
		trace: 'retain-on-failure',
		...(executablePath ? { launchOptions: { executablePath } } : {}),
	},
	projects: [
		{ name: 'desktop', use: { ...devices['Desktop Chrome'] } },
		// Layout-sensitive tests (tagged @responsive) also run 320 CSS px wide: the width at which
		// WCAG 2.2 success criterion 1.4.10 (Reflow) requires content to fit without scrolling.
		{ name: 'mobile', use: { ...devices['Galaxy S9+'] }, grep: /@responsive/ },
	],
	// Builds a test version of the site (fixture posts, separate output directory) and serves it on
	// its own port. It never reuses a running server: on Astro's default port that would be a dev or
	// preview server with real content, and a leftover test server would serve a stale build.
	// `--ignore-lock` keeps the preview server in the foreground so Playwright owns its lifecycle.
	webServer: {
		command: `npm run build && npm run preview -- --port ${PORT} --ignore-lock`,
		env: {
			[TEST_BUILD_ENV]: 'true',
			// West of UTC: a date formatted in local time instead of UTC would show the previous day.
			TZ: 'America/Los_Angeles',
		},
		port: PORT,
		reuseExistingServer: false,
		timeout: 120_000,
	},
});
