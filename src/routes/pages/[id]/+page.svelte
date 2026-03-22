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

<div class="min-h-screen flex flex-col font-sans bg-surface text-on-surface">
	<header class="bg-surface-container-lowest border-b border-white/5 px-6 py-4 flex justify-between items-center text-sm relative z-50">
		<div class="flex items-center gap-4 text-tertiary">
			<a href="/" class="btn-secondary px-3 py-1.5 text-xs">
				&larr; Back to Generator
			</a>
			<span class="text-xs max-w-md truncate bg-surface-container-low px-3 py-1.5 rounded-sm border border-white/5" title={data.pageRecord.prompt}>
				<span class="font-bold text-secondary mr-2 uppercase tracking-widest">Prompt:</span>
				{data.pageRecord.prompt}
			</span>
		</div>
		<div class="text-secondary font-bold tracking-widest uppercase text-xs">
			Preview Mode
		</div>
	</header>
	
	<main class="flex-grow w-full bg-surface mb-32">
		{#each data.validatedPage.sections as section}
			<SectionRenderer {section} />
		{/each}
	</main>
</div>

<div class="fixed bottom-0 left-0 right-0 bg-surface-container-lowest border-t border-white/5 shadow-[0_-10px_40px_rgba(0,0,0,0.6)] p-6 sm:p-8 z-50">
	<div class="max-w-4xl mx-auto">
		<form method="POST" action="?/edit" class="flex flex-col sm:flex-row gap-8 items-end w-full relative" use:enhance={() => {
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
			<div class="flex-grow w-full relative">
				<label for="prompt-edit" class="absolute -top-6 left-0 text-xs font-bold uppercase tracking-widest text-secondary">Edit Prompt</label>
				<input 
					id="prompt-edit"
					name="prompt"
					type="text" 
					required
					placeholder="E.g. make the tone more premium, or shorten the headline..." 
					class="input-kinetic text-lg"
				/>
			</div>
			<button 
				type="submit" 
				disabled={loading}
				class="btn-primary w-full sm:w-auto whitespace-nowrap lg:self-end mt-4 text-lg"
			>
				{loading ? statusMessage : 'Apply changes'}
			</button>
		</form>
		{#if form?.error}
			<p class="text-primary text-sm mt-4 font-bold">{form.error}</p>
		{/if}
	</div>
</div>
