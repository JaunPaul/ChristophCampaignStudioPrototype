<script lang="ts">
	import type { Section } from '$lib/schema';
	import HeroSectionComponent from './sections/HeroSection.svelte';
	import BenefitsSectionComponent from './sections/BenefitsSection.svelte';
	import LeadFormSectionComponent from './sections/LeadFormSection.svelte';

	let { section } = $props<{ section: Section }>();
</script>

{#if section.type === 'hero'}
	<HeroSectionComponent {section} />
{:else if section.type === 'benefits'}
	<BenefitsSectionComponent {section} />
{:else if section.type === 'lead_form'}
	<LeadFormSectionComponent {section} />
{:else}
	<!-- Unknown section types must not render -->
{/if}
