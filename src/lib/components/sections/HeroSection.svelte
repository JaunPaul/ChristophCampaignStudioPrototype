<script lang="ts">
	import type { HeroSection } from '$lib/schema';
	
	let { section } = $props<{ section: HeroSection }>();
</script>

<section class="bg-indigo-900 border-b border-indigo-800 text-white py-24 px-6 text-center">
	<div class="max-w-3xl mx-auto space-y-6">
		<h1 class="text-5xl font-extrabold tracking-tight">
			{section.props.headline}
		</h1>
		<p class="text-xl text-indigo-200">
			{section.props.subheadline}
		</p>
		<div class="pt-6">
			<button class="bg-white text-indigo-900 font-semibold px-8 py-4 rounded-full shadow-lg hover:bg-indigo-50 transition-colors text-lg">
				{section.props.ctaLabel}
			</button>
		</div>
	</div>
</section>
