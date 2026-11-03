import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { SITE_URL } from './src/consts';
import { isTestBuild } from './src/lib/build';

export default defineConfig({
	site: SITE_URL,
	trailingSlash: 'always',
	outDir: isTestBuild ? './dist-test' : './dist',
	integrations: [mdx(), sitemap()],
	markdown: {
		shikiConfig: {
			themes: { light: 'github-light-high-contrast', dark: 'github-dark-high-contrast' },
			defaultColor: 'light-dark()',
		},
	},
});
