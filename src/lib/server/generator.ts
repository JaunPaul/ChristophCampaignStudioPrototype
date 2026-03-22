import { env } from '$env/dynamic/private';
import { PageSchema, IntermediatePageSchema, EditPlanSchema, type Page, type IntermediatePage, type EditPlan } from '$lib/schema';

export const generationProgress = new Map<string, string>();

// Helper to call OpenRouter
async function callOpenRouter({ model, systemPrompt, userPrompt }: { model: string, systemPrompt: string, userPrompt: string }) {
	const apiKey = env.OPENROUTER_API_KEY;
	if (!apiKey) {
		throw new Error('OPENROUTER_API_KEY is not set');
	}

	const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${apiKey}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			model,
			messages: [
				{ role: 'system', content: systemPrompt },
				{ role: 'user', content: userPrompt }
			],
			response_format: { type: 'json_object' }
		})
	});

	if (!response.ok) {
		const text = await response.text();
		throw new Error(`OpenRouter API error (${response.status}): ${text}`);
	}

	const data = await response.json();
	const content = data.choices?.[0]?.message?.content;
	
	if (!content) {
		throw new Error('No content returned from OpenRouter');
	}

	// Try to extract JSON if the model wrapped it in markdown
	const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
	const jsonString = jsonMatch ? jsonMatch[1] : content;

	return JSON.parse(jsonString);
}

// Step 1
async function generateIntermediateContent(prompt: string): Promise<IntermediatePage> {
	const systemPrompt = `You are an expert direct-response landing page strategist and conversion copywriter.

Your task is to turn a user's free-text request into a small, structured landing-page content plan for a prototype landing page generator.

You are NOT generating HTML.
You are NOT generating the final application schema.
You are creating a concise intermediate content object that will later be transformed into the app's final JSON schema.

The landing page is for a very small prototype that supports only these section concepts:

* hero
* benefits
* lead form

You must produce content that is:

* clear
* believable
* concise
* conversion-oriented
* aligned with the user's likely intent

Infer reasonable details when the user is vague, but do not become wild or overly creative.
Do not invent fake testimonials, client names, statistics, or unverifiable claims.
Do not include legal-risky guarantees or misleading promises.
Do not include any markdown, commentary, explanation, or prose outside the JSON object.

Your output must be a single valid JSON object with exactly this shape:

{
"title": "string",
"goal": "string",
"audience": "string",
"offer_summary": "string",
"hero": {
"headline": "string",
"subheadline": "string",
"cta_label": "string"
},
"benefits": {
"title": "string",
"items": [
{
"title": "string",
"body": "string"
}
]
},
"lead_form": {
"title": "string",
"description": "string",
"button_label": "string"
}
}

Rules:

* \`benefits.items\` must contain exactly 3 items
* keep headlines punchy and not overly long
* keep subheadlines to 1–2 sentences maximum
* CTA labels should be action-oriented
* make the lead form copy feel natural and low-friction
* the title should be suitable as an internal page title
* the goal should be a short phrase like "book_call", "request_quote", "join_waitlist", or "speaker_inquiry"
* audience should be a short plain-English description
* offer_summary should summarize the core offer in one sentence
* avoid hypey phrases like "revolutionary", "game-changing", or "best-in-class"
* do not use exclamation marks
* prefer confident, professional language
* keep copy suitable for a premium service business
* avoid generic filler like "we are passionate about"
* return JSON only`;

	const userPrompt = `Generate the intermediate landing-page content object for this request:\n\n${prompt}`;

	const rawJson = await callOpenRouter({
		model: 'google/gemini-3.1-flash-lite-preview',
		systemPrompt,
		userPrompt
	});

	return IntermediatePageSchema.parse(rawJson);
}

// Step 2
async function transformContentToPage(intermediate: IntermediatePage): Promise<Page> {
	const systemPrompt = `You are a strict JSON transformation engine.

Your task is to convert a validated intermediate landing-page content object into the exact final page schema required by the application.

You do not write marketing strategy.
You do not explain anything.
You do not add commentary.
You do not add fields not defined by the schema.
You do not invent new section types.
You do not return markdown.
You return only a single valid JSON object.

The application supports only these section types:

* "hero"
* "benefits"
* "lead_form"

You must output exactly this final schema shape:

{
"title": "string",
"goal": "string",
"audience": "string",
"sections": [
{
"type": "hero",
"props": {
"headline": "string",
"subheadline": "string",
"ctaLabel": "string"
}
},
{
"type": "benefits",
"props": {
"title": "string",
"items": [
{
"title": "string",
"body": "string"
}
]
}
},
{
"type": "lead_form",
"props": {
"title": "string",
"description": "string",
"buttonLabel": "string"
}
}
]
}

Transformation rules:

* \`title\`, \`goal\`, and \`audience\` map directly from the input
* the output \`sections\` array must contain exactly 3 sections
* section order must always be:
  1. hero
  2. benefits
  3. lead_form
* map:
  * input.hero.cta_label -> output.sections[0].props.ctaLabel
  * input.lead_form.button_label -> output.sections[2].props.buttonLabel
* preserve the wording unless a tiny formatting normalization is required
* do not include \`offer_summary\` in the final output
* if the input cannot be mapped cleanly, still return valid JSON using the closest valid mapping possible
* never return null for required fields
* return valid JSON only`;

	const userPrompt = `Transform this intermediate landing-page content object into the exact final application schema.\n\nInput JSON:\n${JSON.stringify(intermediate, null, 2)}`;

	const rawJson = await callOpenRouter({
		model: 'nvidia/nemotron-3-super-120b-a12b:free',
		systemPrompt,
		userPrompt
	});

	return PageSchema.parse(rawJson);
}

// Fallback logic
export async function generateMockPage(prompt: string): Promise<Page> {
	const defaultTitle = `Landing Page for "${prompt.slice(0, 30)}..."`;

	return {
		title: defaultTitle,
		goal: 'Capture leads and explain value proposition',
		audience: 'General audience interested in the product',
		sections: [
			{
				type: 'hero',
				props: {
					headline: `Welcome to the solution for: ${prompt.split(' ')[0] || 'Everything'}`,
					subheadline: `Discover how we can help you achieve your goals with our innovative approach to ${prompt.slice(0, 50)}.`,
					ctaLabel: 'Get Started Today'
				}
			},
			{
				type: 'benefits',
				props: {
					title: 'Why Choose Us?',
					items: [
						{
							title: 'Lightning Fast',
							body: 'Our platform is optimized for speed.'
						},
						{
							title: 'High Conversion',
							body: 'Built using templates proven to turn visitors into customers.'
						},
						{
							title: 'Fully Reliable',
							body: 'Uptime you can count on, 24/7 support.'
						}
					]
				}
			},
			{
				type: 'lead_form',
				props: {
					title: 'Ready to learn more?',
					description: 'Sign up for our newsletter to receive the latest updates.',
					buttonLabel: 'Subscribe Now'
				}
			}
		]
	};
}

// Orchestrator
export async function generatePageFromJson(prompt: string, id: string): Promise<Page> {
	const setProgress = (msg: string) => {
		console.log(`[${id}] ${msg}`);
		generationProgress.set(id, msg);
	};

	try {
		setProgress('Initializing generator...');
		if (!env.OPENROUTER_API_KEY) {
			setProgress('API Key missing. Falling back to mock generator...');
			return await generateMockPage(prompt);
		}

		setProgress('Step 1: Planning content and copywriting...');
		const intermediate = await generateIntermediateContent(prompt);

		setProgress('Step 2: Generating final page schema...');
		const finalPage = await transformContentToPage(intermediate);

		setProgress('Finalizing display...');
		return finalPage;
	} catch (error) {
		console.error('Error generating page via OpenRouter pipeline. Falling back to mock generator.', error);
		setProgress('Error occurred. Falling back to mock generator...');
		return await generateMockPage(prompt);
	}
}

// Editor Step 1
async function generatePageEditPlan(page: Page, changePrompt: string): Promise<EditPlan> {
    const systemPrompt = `You are an expert landing page editor and conversion copy strategist.

Your task is to interpret a user's requested change to an existing landing page and convert that request into a concise structured edit plan.

You are NOT returning the final page JSON.
You are NOT generating HTML.
You are planning a targeted update to an existing page that already follows a strict schema.

The page supports only these section types:

* hero
* benefits
* lead_form

Your job is to:

* understand the current page
* understand the user’s requested change
* decide which sections should change
* preserve unchanged content wherever possible
* recommend a section order only if needed
* produce short guidance for a second model that will generate the final updated page JSON

Be conservative.
Do not rewrite the whole page unless the user clearly requests a major rewrite.
Prefer surgical edits over broad rewrites.

Do not output markdown.
Do not output explanation outside the JSON object.
Return only one valid JSON object.

Your output must match exactly this shape:

{
"change_summary": "string",
"tone_direction": "string",
"audience_adjustment": "string",
"layout_action": "keep" | "reorder",
"section_order": ["hero", "benefits", "lead_form"],
"edit_scope": {
"hero": "keep" | "revise",
"benefits": "keep" | "revise",
"lead_form": "keep" | "revise"
},
"hero_guidance": "string",
"benefits_guidance": "string",
"lead_form_guidance": "string"
}

Rules:

* \`section_order\` must contain exactly the 3 allowed section types, each once
* if the user does not clearly ask for layout/order changes, use \`layout_action: "keep"\` and preserve the current order
* if a section does not need change, mark it as \`keep\`
* guidance fields should be concise and actionable
* preserve the existing page intent unless the user explicitly changes it
* do not invent claims, testimonials, numbers, or credentials
* use professional, believable language
* return JSON only`;

	const userPrompt = `Create an edit plan for this existing page and requested change.\n\nCurrent page JSON:\n${JSON.stringify(page, null, 2)}\n\nRequested change:\n${changePrompt}`;

	const rawJson = await callOpenRouter({
		model: 'google/gemini-3.1-flash-lite-preview',
		systemPrompt,
		userPrompt
	});

	return EditPlanSchema.parse(rawJson);
}

// Editor Step 2
async function applyPageEditPlan(page: Page, editPlan: EditPlan): Promise<Page> {
    const systemPrompt = `You are a strict landing page JSON editor.

Your task is to update an existing landing page JSON object using a structured edit plan.

You must return a complete updated page JSON object that exactly matches the application schema.

You are not explaining anything.
You are not writing markdown.
You are not returning a patch.
You are returning a full valid updated page object.

The only allowed section types are:

* "hero"
* "benefits"
* "lead_form"

The final JSON must have exactly this shape:

{
"title": "string",
"goal": "string",
"audience": "string",
"sections": [
{
"type": "hero",
"props": {
"headline": "string",
"subheadline": "string",
"ctaLabel": "string"
}
},
{
"type": "benefits",
"props": {
"title": "string",
"items": [
{
"title": "string",
"body": "string"
}
]
}
},
{
"type": "lead_form",
"props": {
"title": "string",
"description": "string",
"buttonLabel": "string"
}
}
]
}

Editing rules:

* preserve the existing page as much as possible
* only revise sections marked as \`revise\` in the edit plan
* keep sections marked as \`keep\` as close to unchanged as possible
* preserve \`title\`, \`goal\`, and \`audience\` unless the edit plan clearly implies a change
* if \`layout_action\` is \`keep\`, preserve the current section order
* if \`layout_action\` is \`reorder\`, use the exact order in \`section_order\`
* the final output must still contain exactly one hero, one benefits section, and one lead_form section
* \`benefits.items\` must contain exactly 3 items
* do not add unsupported fields
* do not remove required fields
* do not return null for required fields
* do not invent testimonials, customer names, statistics, or unverifiable claims
* return valid JSON only`;

	const userPrompt = `Update this page JSON using the structured edit plan.\n\nCurrent page JSON:\n${JSON.stringify(page, null, 2)}\n\nEdit plan JSON:\n${JSON.stringify(editPlan, null, 2)}`;

	const rawJson = await callOpenRouter({
		model: 'nvidia/nemotron-3-super-120b-a12b:free',
		systemPrompt,
		userPrompt
	});

	return PageSchema.parse(rawJson);
}

export async function updatePageFromPrompt(page: Page, changePrompt: string, id: string): Promise<Page> {
    const setProgress = (msg: string) => {
		console.log(`[${id}] ${msg}`);
		generationProgress.set(id, msg);
	};

	try {
        if (!env.OPENROUTER_API_KEY) {
			setProgress('Error: API Key missing. Editing not possible without OpenRouter.');
			throw new Error('API Key missing');
		}

		setProgress('Step 1: Planning page edits...');
		const editPlan = await generatePageEditPlan(page, changePrompt);

		setProgress('Step 2: Applying page edits...');
		const updatedPage = await applyPageEditPlan(page, editPlan);

		setProgress('Refreshed display.');
		return updatedPage;
	} catch (error) {
		console.error('Error in edit pipeline.', error);
		setProgress('Error occurred during editing.');
        throw error;
	}
}
