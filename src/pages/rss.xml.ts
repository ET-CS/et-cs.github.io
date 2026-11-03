import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { SITE_DESCRIPTION, SITE_LANGUAGE, SITE_TITLE, SITE_URL } from '../consts';
import { getPosts, postUrl } from '../lib/posts';

export const GET: APIRoute = async () => {
	const posts = await getPosts();
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: SITE_URL,
		customData: `<language>${SITE_LANGUAGE}</language>`,
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.pubDate,
			link: postUrl(post),
		})),
	});
};
