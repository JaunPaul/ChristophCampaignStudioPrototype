import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { pages } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { PageSchema } from '$lib/schema';
import { updatePageFromPrompt } from '$lib/server/generator';

export const load = (async ({ params }) => {
	const record = await db.query.pages.findFirst({
		where: eq(pages.id, params.id)
	});

	if (!record) {
		error(404, 'Page not found');
	}

	try {
        const parsedJson = JSON.parse(record.page_json);
        const validatedPage = PageSchema.parse(parsedJson);

		return {
			pageRecord: record,
			validatedPage
		};
	} catch (e) {
		console.error('Invalid page schema', e);
		error(500, 'Invalid page data stored in database');
	}
}) satisfies PageServerLoad;

export const actions = {
	edit: async ({ request, params }) => {
		const data = await request.formData();
		const prompt = data.get('prompt')?.toString();
		const id = data.get('id')?.toString() || crypto.randomUUID();

		if (!prompt) return fail(400, { error: 'Prompt is required' });

		const record = await db.query.pages.findFirst({
			where: eq(pages.id, params.id)
		});
		if (!record) return fail(404, { error: 'Page not found' });

		const parsedJson = JSON.parse(record.page_json);
		const validatedPage = PageSchema.parse(parsedJson);

		try {
			const updatedPage = await updatePageFromPrompt(validatedPage, prompt, id);
			
			await db.update(pages).set({
				page_json: JSON.stringify(updatedPage)
			}).where(eq(pages.id, params.id));

			return { success: true };
		} catch (error) {
			console.error('Edit error:', error);
			return fail(500, { error: 'Failed to apply edits' });
		}
	}
};
