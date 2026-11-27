# List page layout: before / after

A clickable proposal for three small changes to backend list pages. Open `index.html` and use the **Layout proposal** panel in the bottom-left corner. You can switch everything with **Before / After**, or each change on its own.

This is a static HTML mockup, not implementation. It uses the app's own tokens: `tokens.css` is generated from `apps/mercato/src/app/globals.css` by `.ai/skills/om-mockup-prototype/scripts/sync-tokens.mjs`. All data is fictional.

## The three changes

### 1. Full width for table-only views

> As a sales rep working on a large monitor, I want a table-only view such as People to use the whole width next to the sidebar, so that I can see more columns without scrolling sideways.

- Today `<main>` is capped at `max-w-screen-2xl` (1536 px) and centred (`packages/ui/src/backend/AppShell.tsx:1618`, `.ai/ds-rules.md:330`).
- Unused width of the content area: about **9%** at 1920 px, **34%** at 2560 px (4K at 150%), **57%** at 3840 px (4K at 100%). Below ~1780 px the cap is not visible.
- Acceptance:
  - A page opts in explicitly, e.g. `contentWidth: 'full'` in its page metadata. The default stays exactly as today, so pages and third-party modules that do not opt in are unchanged.
  - Opt in only where the table is the only element of the view (People, Companies, …).
  - Forms, detail pages and views with several sections keep the 1536 px cap. Check **Screen → Person form**.
- Proposed rule in `.ai/ds-rules.md`: keep "Constrain max content width → `max-w-screen-2xl mx-auto`" and add "Exception: a view whose only element is a DataTable uses the full content width." Issue #8640 asks for the same.

### 2. Pinned pagination, only the table body scrolls

> As a user going through a long list, I want the pagination and the column headers to stay visible, so that I can change the page or check a column name without scrolling the whole page.

- Today the whole page scrolls, so the column headers and the pagination scroll out of view.
- Acceptance:
  - On desktop (≥ 1024 px) the table fills the remaining height. Its body scrolls, while the headers and the pagination stay in place.
  - With few rows, the table shrinks and the pagination sits right below them. Set the page size to **3 per page**.
  - Banners above the table reduce the table's height instead of pushing the pagination off screen. Turn on **Banner above table**.
  - There is only one vertical scrollbar.
  - Below 1024 px nothing changes; the page scrolls as today.

### 3. Shadows on pinned columns only when content is hidden

> As a user, I want the shadow next to a pinned column only when something is actually hidden under it, so that the table does not look cut off when it is not.

- Today the shadows next to the pinned Name and Actions columns are always painted (`STICKY_LEFT/RIGHT_SHADOW_CLASS`, `packages/ui/src/backend/DataTable.tsx:552-566`). In dark mode they look like a dark band.
- Acceptance:
  - The left shadow appears only after scrolling right.
  - The right shadow disappears at the end of the scroll.
  - When all columns fit, there are no shadows.
  - Colours, widths and the md-and-up rule stay as today.

## What does not change

Colours, typography, toolbar, filters, row actions, the mobile layout and every page that does not opt in. The selection column is shown pinned, as in the approved #8961.

## Next step, out of scope

On phones the table is barely usable. A separate vertical card ("gallery") view with pagination in the top menu would fit better. That needs its own decision.

## Cost in code (estimate)

- `AppShell`: an optional page-level width setting, default unchanged.
- `DataTable`: a height-bounded scroll container for opted-in pages, and shadow classes toggled by the scroll position.
- `ds-rules.md`: one added line.

## Mockup limitations

- Icons are an inline SVG sprite and texts are hardcoded. Production code uses `lucide-react` and `useT()`.
- The "Unused width" readout in the panel uses the browser window width.
