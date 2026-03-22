import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { desc } from 'drizzle-orm';
import { pages } from '$lib/server/db/schema';

export const load = (async () => {
	const allPages = await db.query.pages.findMany({
		orderBy: [desc(pages.created_at)],
		limit: 50
	});

	return {
		pages: allPages
	};
}) satisfies PageServerLoad;
