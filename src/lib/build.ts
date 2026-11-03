/**
 * Name of the environment variable that marks a test build. Test builds load fixture posts
 * instead of real content and write to a separate output directory, so they never replace the
 * production build. Playwright sets it when it builds the site under test.
 */
export const TEST_BUILD_ENV = 'ASTRO_TEST_BUILD';

export const isTestBuild = process.env[TEST_BUILD_ENV] === 'true';
