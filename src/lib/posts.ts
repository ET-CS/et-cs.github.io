import { getCollection } from 'astro:content';

/** All blog posts, newest first. */
export async function getPosts() {
	return (await getCollection('blog')).sort(
		(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
	);
}
