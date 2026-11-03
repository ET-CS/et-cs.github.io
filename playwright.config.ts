import { defineConfig, devices } from '@playwright/test';

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
		{ name: 'mobile', use: { ...devices['Pixel 7'] } },
	],
	// Tests run against the production build: run `npm run build` first.
	// `--ignore-lock` keeps the server in the foreground so Playwright owns its lifecycle.
	webServer: {
		command: `npm run preview -- --port ${PORT} --ignore-lock`,
		port: PORT,
		reuseExistingServer: !isCI,
	},
});
