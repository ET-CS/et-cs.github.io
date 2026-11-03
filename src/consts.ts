/** Site-wide configuration, shared by pages, feeds, tests and the Astro config. */

export const SITE_URL = 'https://et-cs.github.io';
export const SITE_TITLE = 'Itai Sidney Cohen-Solal';
export const SITE_DESCRIPTION = 'A small site by Itai Sidney Cohen-Solal.';
export const SITE_LANGUAGE = 'en';

export const PROFILES = {
	github: { label: 'GitHub', url: 'https://github.com/ET-CS' },
	x: { label: 'X', url: 'https://x.com/etaycs', handle: '@etaycs' },
	website: { label: 'etcs.me', url: 'https://etcs.me' },
} as const;

/** `localStorage` key holding the visitor's explicit theme choice: `'light'` or `'dark'`. */
export const THEME_STORAGE_KEY = 'theme';
