<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>Generated Pages</title>
</svelte:head>

<div class="max-w-4xl mx-auto py-12 px-6">
	<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-6">
		<h1 class="text-4xl font-bold text-white uppercase tracking-tight">
			Your Landing Pages
		</h1>
		<a href="/" class="btn-primary">
			Create New Page
		</a>
	</div>

	{#if data.pages.length === 0}
		<div class="bg-surface-container-low border-t border-white/5 p-12 text-center text-tertiary">
			No pages generated yet.
		</div>
	{:else}
		<div class="bg-surface-container-low border-t border-white/5 overflow-hidden text-left relative z-10 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
			<ul class="divide-y divide-white/5">
				{#each data.pages as page}
					<li>
						<a href="/pages/{page.id}" class="block hover:bg-surface-container-lowest transition-colors p-8">
							<div class="flex items-start sm:items-center justify-between gap-4 flex-col sm:flex-row">
								<div class="truncate pr-4 flex-1 w-full">
									<p class="text-xl font-bold text-secondary truncate mb-2 uppercase tracking-tight">
										{page.title}
									</p>
									<p class="text-base text-tertiary truncate" title={page.prompt}>
										{page.prompt}
									</p>
								</div>
								<div class="shrink-0 text-xs font-bold uppercase tracking-widest text-tertiary opacity-50">
									{new Date(page.created_at).toLocaleDateString()}
								</div>
							</div>
						</a>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>
