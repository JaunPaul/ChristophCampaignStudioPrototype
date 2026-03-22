<script lang="ts">
	import type { LeadFormSection } from '$lib/schema';
	
	let { section } = $props<{ section: LeadFormSection }>();
</script>

<section class="bg-white py-24 px-6 border-t border-gray-200">
	<div class="max-w-xl mx-auto text-center">
		<h2 class="text-3xl font-bold text-gray-900 mb-4">
			{section.props.title}
		</h2>
		<p class="text-lg text-gray-600 mb-8">
			{section.props.description}
		</p>
		
		<form class="flex flex-col sm:flex-row gap-3 justify-center" onsubmit={(e) => e.preventDefault()}>
			<input 
				type="email" 
				placeholder="Enter your email" 
				required
				class="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-auto flex-1 outline-none text-gray-900"
			/>
			<button 
				type="submit"
				class="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors whitespace-nowrap"
			>
				{section.props.buttonLabel}
			</button>
		</form>
		<p class="text-sm text-gray-500 mt-4">We care about your data in our privacy policy.</p>
	</div>
</section>
