import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { isTestBuild } from './lib/build';

const blog = defineCollection({
	// Test builds render fixture posts so tests don't depend on (or break with) real content.
	loader: glob({
		base: isTestBuild ? './tests/fixtures/blog' : './src/content/blog',
		pattern: '**/*.{md,mdx}',
	}),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.object({ src: image(), alt: z.string() }).optional(),
		}),
});

export const collections = { blog };
