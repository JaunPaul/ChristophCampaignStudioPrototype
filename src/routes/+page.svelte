<script lang="ts">
	import { enhance } from '$app/forms';

	let { form } = $props<{ form: { error?: string } }>();

	let loading = $state(false);
	let statusMessage = $state('');
	let generationId = $state(crypto.randomUUID());
</script>

<div class="mx-auto max-w-xl px-6 py-12">
	<div class="mb-10 text-center">
		<h1 class="mb-4 text-5xl font-extrabold tracking-tight text-white md:text-6xl text-left sm:text-center">
			AI Landing Page Generator
		</h1>
		<p class="text-lg text-tertiary text-left sm:text-center">
			Describe your ideal landing page and our AI will generate a prototype instantly.
		</p>
	</div>

	<div class="bg-surface-container-low p-8 shadow-[0_10px_40px_rgba(0,0,0,0.4)] relative">
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
				<label for="prompt" class="mb-2 block text-xs font-bold uppercase tracking-widest text-tertiary"> Prompt </label>
				<textarea
					id="prompt"
					name="prompt"
					rows="4"
					required
					placeholder="e.g. A landing page for a new dog walking service in New York..."
					class="input-kinetic resize-none"
				></textarea>
			</div>

			<button
				type="submit"
				disabled={loading}
				class="btn-primary w-full mt-6"
			>
				{loading ? statusMessage : 'Generate AI Page'}
			</button>
		</form>
	</div>
</div>
