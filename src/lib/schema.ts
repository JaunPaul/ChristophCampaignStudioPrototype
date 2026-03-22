import { z } from 'zod';

export const HeroSectionSchema = z.object({
	type: z.literal('hero'),
	props: z.object({
		headline: z.string(),
		subheadline: z.string(),
		ctaLabel: z.string()
	})
});

export const BenefitsSectionSchema = z.object({
	type: z.literal('benefits'),
	props: z.object({
		title: z.string(),
		items: z.array(
			z.object({
				title: z.string(),
				body: z.string()
			})
		)
	})
});

export const LeadFormSectionSchema = z.object({
	type: z.literal('lead_form'),
	props: z.object({
		title: z.string(),
		description: z.string(),
		buttonLabel: z.string()
	})
});

export const SectionSchema = z.discriminatedUnion('type', [
	HeroSectionSchema,
	BenefitsSectionSchema,
	LeadFormSectionSchema
]);

export const EditPlanSchema = z.object({
	change_summary: z.string(),
	tone_direction: z.string(),
	audience_adjustment: z.string(),
	layout_action: z.enum(['keep', 'reorder']),
	section_order: z.array(z.enum(['hero', 'benefits', 'lead_form'])).length(3),
	edit_scope: z.object({
		hero: z.enum(['keep', 'revise']),
		benefits: z.enum(['keep', 'revise']),
		lead_form: z.enum(['keep', 'revise'])
	}),
	hero_guidance: z.string(),
	benefits_guidance: z.string(),
	lead_form_guidance: z.string()
});

export const PageSchema = z.object({
	title: z.string(),
	goal: z.string(),
	audience: z.string(),
	sections: z.array(SectionSchema)
});

export const IntermediatePageSchema = z.object({
	title: z.string(),
	goal: z.string(),
	audience: z.string(),
	offer_summary: z.string(),
	hero: z.object({
		headline: z.string(),
		subheadline: z.string(),
		cta_label: z.string()
	}),
	benefits: z.object({
		title: z.string(),
		items: z.array(
			z.object({
				title: z.string(),
				body: z.string()
			})
		).length(3)
	}),
	lead_form: z.object({
		title: z.string(),
		description: z.string(),
		button_label: z.string()
	})
});


export type HeroSection = z.infer<typeof HeroSectionSchema>;
export type BenefitsSection = z.infer<typeof BenefitsSectionSchema>;
export type LeadFormSection = z.infer<typeof LeadFormSectionSchema>;
export type Section = z.infer<typeof SectionSchema>;
export type Page = z.infer<typeof PageSchema>;
export type IntermediatePage = z.infer<typeof IntermediatePageSchema>;
export type EditPlan = z.infer<typeof EditPlanSchema>;

