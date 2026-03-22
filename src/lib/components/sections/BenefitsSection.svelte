<script lang="ts">
	import type { BenefitsSection } from '$lib/schema';
	
	let { section } = $props<{ section: BenefitsSection }>();
</script>

<section class="bg-gray-50 py-24 px-6">
	<div class="max-w-5xl mx-auto">
		<h2 class="text-3xl font-bold text-center text-gray-900 mb-16">
			{section.props.title}
		</h2>
		
		<div class="grid md:grid-cols-3 gap-12">
			{#each section.props.items as item}
				<div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
					<div class="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
						<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
						</svg>
					</div>
					<h3 class="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
					<p class="text-gray-600 leading-relaxed">{item.body}</p>
				</div>
			{/each}
		</div>
	</div>
</section>
