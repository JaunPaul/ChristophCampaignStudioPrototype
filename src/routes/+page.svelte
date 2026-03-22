<script lang="ts">
	import { enhance } from '$app/forms';

	let { form } = $props<{ form: { error?: string } }>();

	let loading = $state(false);
	let statusMessage = $state('');
	let generationId = $state(crypto.randomUUID());
</script>

<div class="mx-auto max-w-xl px-6 py-12">
	<div class="mb-10 text-center">
		<h1 class="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
			AI Landing Page Generator
		</h1>
		<p class="text-lg text-gray-600">
			Describe your ideal landing page and our AI will generate a prototype instantly.
		</p>
	</div>

	<div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
		<form
			method="POST"
			action="?/generate"
			class="space-y-4"
			use:enhance={() => {
				loading = true;
				statusMessage = 'Starting...';
				const interval = setInterval(async () => {
					try {
						const res = await fetch(`/api/progress/${generationId}`);
						if (res.ok) {
							const data = await res.json();
							if (data.status) statusMessage = data.status;
						}
					} catch (e) {}
				}, 500);

				return async ({ update }) => {
					clearInterval(interval);
					loading = false;
					generationId = crypto.randomUUID();
					await update();
				};
			}}
		>
			<input type="hidden" name="id" value={generationId} />
			{#if form?.error}
				<div class="rounded-md bg-red-50 px-4 py-3 text-sm text-red-600">
					{form.error}
				</div>
			{/if}

			<div>
				<label for="prompt" class="mb-1 block text-sm font-medium text-gray-700"> Prompt </label>
				<textarea
					id="prompt"
					name="prompt"
					rows="4"
					required
					placeholder="e.g. A landing page for a new dog walking service in New York..."
					class="block w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
				></textarea>
			</div>

			<button
				type="submit"
				disabled={loading}
				class="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
			>
				{loading ? statusMessage : 'Generate AI Page'}
			</button>
		</form>
	</div>
</div>
