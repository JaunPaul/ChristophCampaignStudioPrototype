<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>Generated Pages</title>
</svelte:head>

<div class="max-w-4xl mx-auto py-12 px-6">
	<div class="flex items-center justify-between mb-8">
		<h1 class="text-3xl font-bold text-gray-900">
			Your Landing Pages
		</h1>
		<a href="/" class="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 shadow-sm transition-colors">
			Create New Page
		</a>
	</div>

	{#if data.pages.length === 0}
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center text-gray-500">
			No pages generated yet.
		</div>
	{:else}
		<div class="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden text-left">
			<ul class="divide-y divide-gray-200">
				{#each data.pages as page}
					<li>
						<a href="/pages/{page.id}" class="block hover:bg-gray-50 transition-colors p-6">
							<div class="flex items-center justify-between">
								<div class="truncate pr-4">
									<p class="text-lg font-medium text-indigo-600 truncate mb-1">
										{page.title}
									</p>
									<p class="text-sm text-gray-500 truncate" title={page.prompt}>
										{page.prompt}
									</p>
								</div>
								<div class="shrink-0 text-sm text-gray-400">
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
