import { defineConfig, devices } from '@playwright/test';
import { TEST_BUILD_ENV } from './src/lib/build';

const PORT = 4321;
const isCI = Boolean(process.env['CI']);
// Lets a machine with a preinstalled Chromium run the tests without `playwright install`.
const executablePath = process.env['PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH'];

export default defineConfig({
	testDir: 'tests',
	fullyParallel: true,
	forbidOnly: isCI,
	retries: isCI ? 1 : 0,
	reporter: isCI ? [['github'], ['html', { open: 'never' }]] : 'list',
	use: {
		baseURL: `http://localhost:${PORT}`,
		trace: 'retain-on-failure',
		...(executablePath ? { launchOptions: { executablePath } } : {}),
	},
	projects: [
		{ name: 'desktop', use: { ...devices['Desktop Chrome'] } },
		// Only layout-sensitive tests (tagged @responsive) also run on a phone viewport.
		{ name: 'mobile', use: { ...devices['Pixel 7'] }, grep: /@responsive/ },
	],
	// Builds a test version of the site (fixture posts, separate output directory) and serves it.
	// `--ignore-lock` keeps the preview server in the foreground so Playwright owns its lifecycle.
	webServer: {
		command: `npm run build && npm run preview -- --port ${PORT} --ignore-lock`,
		env: { [TEST_BUILD_ENV]: 'true' },
		port: PORT,
		reuseExistingServer: !isCI,
		timeout: 120_000,
	},
});
