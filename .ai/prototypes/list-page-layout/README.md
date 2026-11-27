# List page layout: before / after

A clickable proposal for three small changes to backend list pages. Open `index.html` and use the **Layout proposal** panel on the right. You can switch everything with **Before / After**, or each change on its own.

- **Before** is upstream `main` today: the People list, measured in the running app.
- **After** adds the three changes below, two fixes from open pull requests (items 4 and 5) and a frameless table (item 6).
- **Simulated screen** (default 2560 px, a 4K monitor at 150%) renders the mockup at that width, scaled down to fit your window. The full-width change only shows on wide screens, so you can see it on a laptop.

This is a static HTML mockup, not implementation. It uses the app's own tokens: `tokens.css` is generated from `apps/mercato/src/app/globals.css` by `.ai/skills/om-mockup-prototype/scripts/sync-tokens.mjs`. All data is fictional.

## The three changes

### 1. Full width for table-only views

> As a sales rep working on a large monitor, I want a table-only view such as People to use the whole width next to the sidebar, so that I can see more columns without scrolling sideways.

- Today `<main>` is capped at `max-w-screen-2xl` (1536 px) and centred (`packages/ui/src/backend/AppShell.tsx:1618`, `.ai/ds-rules.md:330`).
- Unused width of the content area: about **9%** at 1920 px, **34%** at 2560 px (4K at 150%), **57%** at 3840 px (4K at 100%). Below ~1780 px the cap is not visible.
- Acceptance:
  - A page opts in explicitly, e.g. `contentWidth: 'full'` in its page metadata. The default stays exactly as today, so pages and third-party modules that do not opt in are unchanged.
  - Opt in only where the table is the only element of the view (People, Companies, …).
  - The table card and its header bar always span the full width, as in ClickUp, Asana or Jira. Columns keep their natural width instead of being stretched; the spare space sits between the last data column and the frozen Actions column at the right edge. Check **Screen → Team roles**.
  - Forms, detail pages and views with several sections keep the 1536 px cap. Check **Screen → Person form** and **Screen → Sales overview**.
- Proposed rule in `.ai/ds-rules.md`: keep "Constrain max content width → `max-w-screen-2xl mx-auto`" and add "Exception: a view whose only element is a DataTable uses the full content width." Issue #8640 asks for the same.

### 2. Pinned pagination, only the table body scrolls

> As a user going through a long list, I want the pagination and the column headers to stay visible, so that I can change the page or check a column name without scrolling the whole page.

- Today the whole page scrolls, so the column headers and the pagination scroll out of view.
- Acceptance:
  - On desktop (≥ 1024 px) the table fills the remaining height. Its body scrolls, while the headers and the pagination stay in place.
  - The mockup shows 100 rows per page by default, where the difference is most visible.
  - The table card always fills the window height. With few rows the empty space stays inside the card and the pagination stays at the bottom. Set the page size to **6 per page**, or open **Team roles**.
  - A message above the table reduces the table's height instead of pushing the pagination off screen. Turn on **Show an alert above the table**.
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

### 4. Compact footer (from #9227)

#9227 makes the footer row compact. In demo mode it also cuts the reserve for the floating contact button: today it adds about 80 px below the content and another 80 px inside the footer, so the pinned pagination ends far above the bottom of the screen. Turn on **Demo mode** in the panel to see it (off by default, as in a production install).

### 5. Pinned selection column (from #8961)

Today the pinned Name column slides over the checkboxes when the table scrolls sideways. #8961 pins the selection column too, with Name next to it.

### 6. Frameless table

> As a user of a table-only view, I want the table to sit directly on the page, so that no frame and padding take space from the rows.

- The card frame, its rounded corners and the top and bottom page padding go away; the side padding stays. The look matches DataTable's existing `embedded` mode (no border, page background).
- Only table-only views; forms and mixed views keep their cards.

## Column resizing

The column dividers in the header work as in DataTable today: drag one to resize the column, double-click it to reset. In "after", resizing a column only changes the spare space before the frozen Actions column; the other columns keep their width.

## What does not change

Colours, typography, toolbar, filters, row actions, the mobile layout and every page that does not opt in. "Before" was measured against the People list on upstream `main`; at the same window size the table card has the same position and width.

## Next step, out of scope

On phones the table is barely usable. A separate vertical card ("gallery") view with pagination in the top menu would fit better. That needs its own decision.

## Cost in code (estimate)

- `AppShell`: an optional page-level width setting, default unchanged.
- `DataTable`: a height-bounded scroll container for opted-in pages, and shadow classes toggled by the scroll position.
- `ds-rules.md`: one added line.

## Mockup limitations

- Icons are an inline SVG sprite and texts are hardcoded. Production code uses `lucide-react` and `useT()`.
- The "Unused width" readout uses the simulated screen width, or the mockup area when the simulation is off.
