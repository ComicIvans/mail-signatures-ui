# Mail Signatures UI — Agent Instructions

## Project Overview

This repository contains a Nuxt-based interface for generating reusable HTML email signatures for multiple organizations.

Goals:

- Keep the generator fast, understandable, and reliable.
- Produce HTML that remains practical for real email clients.
- Let maintainers update profiles, fields, and templates without scattering business rules across pages.

Current scope includes:

- A landing page explaining the product clearly.
- A signature generator with profile selection, optional fields, preview, copy, and download flows.
- A usage guide for the supported email clients.
- In-app profile inspection and editing for existing signature definitions.

---

## Tech Stack

- **Framework:** Nuxt 4 + Nitro.
- **UI:** Nuxt UI + Tailwind CSS.
- **Validation:** Zod.
- **Icons:** Tabler + Lucide icon sets.
- **SEO:** `@nuxtjs/seo`.

---

## Repository Structure

- `app/` — application UI, pages, layouts, composables, CSS, and static data.
- `app/data/` — profile and field catalogs used by the generator.
- `app/composables/` — shared generator, catalog, and SEO helpers.
- `app/components/profile/` — profile management UI.
- `app/components/signature/` — preview-oriented signature rendering.
- `shared/` — runtime-safe shared constants.

---

## Language & Copy Rules

### Code vs UI Text

- **Write code and code comments in English.**
- Public UI text is currently **Spanish-only by design**.
- Do not paste user-provided wording into the interface unless explicitly requested.
- Do not add placeholder copy, filler labels, or text aimed only at the developer.
- Any visible text must help an end user understand, configure, or export a signature.

### Signature Content

- Keep descriptive text concise and functional.
- Alt text and accessibility labels should describe the real organization asset, not internal notes.
- Do not introduce extra explanatory paragraphs inside exported HTML unless the signature format explicitly requires them.

---

## Engineering Principles

### Keep Logic Centralized

- Shared page metadata should go through `app/composables/usePageSeo.ts`.
- Profile and field catalog parsing should go through `app/composables/useSignatureCatalog.ts`.
- Signature HTML generation must remain centralized in `app/composables/useSignatureTemplates.ts`.
- If a page becomes responsible for both orchestration and reusable logic, extract the reusable part.

### Keep the Generator Predictable

- Treat `app/data/profiles.json` and `app/data/fields.json` as the source of truth for configurable behavior.
- Validate static JSON before consuming it in the UI.
- Prefer small helpers over page-local ad hoc branching.
- Preserve current template behavior unless the change clearly improves maintainability or compatibility.

### UI & UX

- Reuse the shared layout shell and global surface classes before inventing page-specific wrappers.
- Prefer Nuxt UI components for controls, alerts, cards, navigation, and feedback.
- Keep the preview readable and stable across light and dark application themes.
- Respect reduced-motion users when adding animation.

### Accessibility

- Use semantic landmarks and headings.
- Keep keyboard navigation intact.
- Maintain visible focus states.
- Preserve meaningful `alt`, `aria-label`, and form error messaging.

### SEO

- Keep page-level SEO concise and centralized.
- Avoid duplicating canonical metadata logic page by page.
- Public metadata should describe the current page outcome, not implementation details.

---

## Change Checklist

- Visible copy is useful to end users and not filler.
- Shared logic was extracted instead of duplicated when appropriate.
- The generator still copies and downloads valid HTML.
- Preview remains coherent in both application color modes.
- Reduced-motion behavior is still respected.
- Lint passes.
- Typecheck passes.
