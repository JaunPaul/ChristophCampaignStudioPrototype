<script lang="ts">
	import SectionRenderer from '$lib/components/SectionRenderer.svelte';
	import { enhance } from '$app/forms';

	let { data, form } = $props();

	let loading = $state(false);
	let statusMessage = $state('');
	let editId = $state(crypto.randomUUID());
</script>

<svelte:head>
	<title>{data.validatedPage.title}</title>
</svelte:head>

<div class="min-h-screen flex flex-col font-sans bg-gray-50">
	<header class="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center text-sm shadow-md">
		<div class="flex items-center gap-4 text-gray-400">
			<a href="/" class="hover:text-white transition-colors flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-md text-gray-300 shadow-sm border border-gray-700 hover:border-gray-500">
				&larr; Back to Generator
			</a>
			<span class="text-xs max-w-md truncate bg-gray-800 px-3 py-1.5 rounded-md border border-gray-700" title={data.pageRecord.prompt}>
				<span class="font-bold text-gray-500 mr-2">Prompt:</span>
				{data.pageRecord.prompt}
			</span>
		</div>
		<div class="text-indigo-400 font-semibold tracking-wide">
			Preview Mode
		</div>
	</header>
	
	<main class="flex-grow shadow-2xl ring-1 ring-gray-900/5 sm:mx-auto sm:my-8 sm:w-full sm:max-w-6xl sm:rounded-2xl overflow-hidden bg-white mb-32">
		{#each data.validatedPage.sections as section}
			<SectionRenderer {section} />
		{/each}
	</main>
</div>

<div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] p-4 sm:p-6 z-50">
	<div class="max-w-4xl mx-auto">
		<form method="POST" action="?/edit" class="flex flex-col sm:flex-row gap-4 items-center" use:enhance={() => {
			loading = true;
			statusMessage = 'Starting edit...';
			const interval = setInterval(async () => {
				try {
					const res = await fetch(`/api/progress/${editId}`);
					if (res.ok) {
						const d = await res.json();
						if (d.status) statusMessage = d.status;
					}
				} catch (e) {}
			}, 500);

			return async ({ update }) => {
				clearInterval(interval);
				loading = false;
				editId = crypto.randomUUID();
				await update();
			};
		}}>
			<input type="hidden" name="id" value={editId} />
			<div class="flex-grow w-full">
				<input 
					name="prompt"
					type="text" 
					required
					placeholder="E.g. make the tone more premium, or shorten the headline..." 
					class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-900"
				/>
			</div>
			<button 
				type="submit" 
				disabled={loading}
				class="w-full sm:w-auto bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors whitespace-nowrap disabled:opacity-50"
			>
				{loading ? statusMessage : 'Apply changes'}
			</button>
		</form>
		{#if form?.error}
			<p class="text-red-500 text-sm mt-2">{form.error}</p>
		{/if}
	</div>
</div>
