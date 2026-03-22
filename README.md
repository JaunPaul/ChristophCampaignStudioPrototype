# AI Landing Page Generator MVP

This is an end-to-end working prototype of an AI Landing Page Generator built with:
- SvelteKit (Svelte 5)
- Drizzle ORM
- Better SQLite3
- Tailwind CSS via Tailwind Vite plugin

## Getting Started

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Environment Setup**
   The project requires a `.env` file at the root. (Created automatically)
   ```bash
   echo "DATABASE_URL=sqlite.db" > .env
   ```

3. **Run Migrations**
   Use Drizzle to create your local SQLite database:
   ```bash
   npm run db:push
   ```

4. **Start Dev Server**
   Start the SvelteKit development server:
   ```bash
   npm run dev
   ```

Then, open your browser to `http://localhost:5173`. You can enter any free-text prompt to generate and preview a structured landing page!

## Files Created
- `src/lib/server/db/schema.ts` (Drizzle Database Schema)
- `src/lib/schema.ts` (Zod validation schemas for dynamic pages)
- `src/lib/server/generator.ts` (Deterministic Page Generator implementation)
- `src/routes/+page.svelte` (Prompt Form Home Screen)
- `src/routes/+page.server.ts` (Form Submission logic storing to SQLite)
- `src/routes/pages/[id]/+page.svelte` and server (Preview Renderer loader)
- `src/routes/pages/+page.svelte` and server (Pages history list)
- `src/lib/components/SectionRenderer.svelte` (Dynamic UI entrypoint)
- `src/lib/components/sections/*.svelte` (Hero, Benefits, LeadForm implementations)
