import { json } from '@sveltejs/kit';
import { generationProgress } from '$lib/server/generator';

export function GET({ params }) {
	const status = generationProgress.get(params.id) || '';
	return json({ status });
}
