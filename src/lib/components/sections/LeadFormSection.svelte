<script lang="ts">
	import type { LeadFormSection } from '$lib/schema';
	
	let { section } = $props<{ section: LeadFormSection }>();
</script>

<section class="bg-surface-container-lowest py-32 px-6">
	<div class="max-w-2xl mx-auto text-left sm:text-center p-12 bg-surface-container-low shadow-[0_10px_40px_rgba(0,0,0,0.6)] relative z-10 border-t border-white/5">
		<h2 class="text-4xl font-bold text-white mb-6">
			{section.props.title}
		</h2>
		<p class="text-lg text-tertiary mb-16">
			{section.props.description}
		</p>
		
		<form class="flex flex-col gap-10" onsubmit={(e) => e.preventDefault()}>
			<div class="relative w-full text-left">
				<label for="email-input" class="absolute -top-6 left-0 text-xs font-bold uppercase tracking-widest text-secondary">Email</label>
				<input 
					id="email-input"
					type="email" 
					placeholder="Enter your email" 
					required
					class="input-kinetic text-lg pl-0 pb-3"
				/>
			</div>
			<button 
				type="submit"
				class="btn-primary w-full md:w-auto whitespace-nowrap lg:self-end mt-4 text-xl"
			>
				{section.props.buttonLabel}
			</button>
		</form>
		<p class="text-[10px] tracking-widest uppercase text-tertiary mt-12 opacity-50 sm:text-center text-left">We care about your data in our privacy policy.</p>
	</div>
</section>
