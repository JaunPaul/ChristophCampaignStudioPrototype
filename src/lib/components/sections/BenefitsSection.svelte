<script lang="ts">
	import type { BenefitsSection } from '$lib/schema';
	
	let { section } = $props<{ section: BenefitsSection }>();
</script>

<section class="bg-surface py-32 px-6">
	<div class="max-w-6xl mx-auto">
		<h2 class="text-4xl md:text-5xl font-bold text-on-surface mb-24 max-w-3xl text-left border-b border-outline-variant pb-8">
			{section.props.title}
		</h2>
		
		<div class="grid md:grid-cols-3 gap-y-16 gap-x-12">
			{#each section.props.items as item, i}
				<div class="bg-surface-container-low p-10 min-h-[340px] relative transition-transform duration-300 hover:-translate-y-2 flex flex-col justify-end group border-t border-on-surface/10">
					<div class="absolute top-8 right-8 text-secondary font-bold text-6xl opacity-20 group-hover:opacity-100 transition-opacity">
						0{i + 1}
					</div>
					
					<h3 class="text-3xl font-bold text-on-surface mb-4 uppercase tracking-tight">{item.title}</h3>
					<p class="text-tertiary leading-relaxed text-base">{item.body}</p>
				</div>
			{/each}
		</div>
	</div>
</section>
