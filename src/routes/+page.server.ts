import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { generatePageFromJson } from '$lib/server/generator';
import { db } from '$lib/server/db';
import { pages } from '$lib/server/db/schema';

function generateSlug(title: string): string {
	return title
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)+/g, '') + '-' + Math.random().toString(36).substring(2, 7);
}

export const actions = {
	generate: async ({ request }) => {
		const data = await request.formData();
		const prompt = data.get('prompt')?.toString();
		const id = data.get('id')?.toString() || crypto.randomUUID();

		if (!prompt) {
			return fail(400, { error: 'Prompt is required' });
		}

		try {
			// Generate page content
			const generatedPage = await generatePageFromJson(prompt, id);

			// Create record
			const slug = generateSlug(generatedPage.title);


			await db.insert(pages).values({
				id,
				prompt,
				title: generatedPage.title,
				slug,
				page_json: JSON.stringify(generatedPage)
			});



		} catch (error) {
			console.error('Generation error:', error);
			if (error instanceof Response) throw error; // Re-throw redirect
			return fail(500, { error: 'Failed to generate page' });
		}

		// If success, redirect
		redirect(303, `/pages/${id}`);
	}
} satisfies Actions;
