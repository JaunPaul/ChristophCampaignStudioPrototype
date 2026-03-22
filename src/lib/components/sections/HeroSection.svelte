<script lang="ts">
	import type { HeroSection } from '$lib/schema';

	let { section } = $props<{ section: HeroSection }>();
</script>

<section class="w-full border-b border-on-surface/10 bg-surface">
	<div class="grid min-h-[70vh] lg:grid-cols-2">
		<div
			class="flex flex-col justify-center space-y-8 px-6 py-24 text-left lg:py-32 lg:pr-16 lg:pl-20 xl:pl-32"
		>
			<h1
				class="text-4xl leading-none font-extrabold tracking-tight text-on-surface md:text-5xl md:leading-[1.1]"
			>
				{section.props.headline}
			</h1>
			<p class="max-w-xl text-xl leading-relaxed text-tertiary">
				{section.props.subheadline}
			</p>
			<div class="flex flex-col gap-4 pt-8 sm:flex-row">
				<button class="btn-primary w-full text-xl sm:w-auto">
					{section.props.ctaLabel}
				</button>
			</div>
		</div>
		<div class="relative min-h-[400px] w-full lg:min-h-full">
			<img
				src="/ch-header.jpg"
				alt="Hero Decoration"
				class="absolute inset-0 h-full w-full object-cover"
			/>
		</div>
	</div>
</section>
