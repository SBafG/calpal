# Handoff: Cal·Pal — Skandinavisk modernism

Editorial, magazine-style redesign of the Cal·Pal home page (`calpal.ekeron.com`).
Huge serif typography, restrained palette, asymmetric grid, season-aware
accent color. The opposite of typical "calendar widget" aesthetics — this
should feel like reading an annual almanac, not opening Google Calendar.

## About the design files

The files in this bundle are **design references created in HTML** — a
working React/Babel prototype that shows intended look and behavior. They
are **not production code to ship as-is**.

The task is to **recreate this design in the Cal·Pal codebase's existing
environment** (whatever framework the user built with in Claude Code —
Next.js, plain React, etc.), using its established patterns, libraries
and conventions. The TypeScript files in this folder are a starting
point that maps 1:1 to the prototype, but feel free to:

- split components further,
- swap inline styles for the codebase's CSS-in-JS / Tailwind / CSS modules,
- replace placeholder data with the real calendar data layer,
- adjust accessibility (the prototype skips ARIA labels and focus states).

## Fidelity

**High-fidelity.** Pixel-perfect intent. Colors, type ramps, spacing, and
hierarchy are all final. Recreate them precisely.

## Files in this bundle

| File | Purpose |
|---|---|
| `README.md` | This document |
| `tokens.css` | All design tokens as CSS variables — colors, type, spacing, density modes, season palettes |
| `types.ts` | TypeScript types for the calendar data shape |
| `CalPal.tsx` | Full home page component, broken into sub-components (Masthead, TodayStats, CalendarGrid, Sidebar, etc.) |
| `screenshots/` | Reference PNGs of the design — top section + four seasonal palette variants. See `screenshots/README.md` for an index. |
| `prototypes/Cal·Pal v3.html` | The live HTML prototype — open in a browser to see the design working, with a Tweaks panel for accent / season / density |
| `prototypes/Cal·Pal Design Directions.html` | Side-by-side comparison of the three explored directions (Almanackan 1855, Naturkalendern, Skandinavisk modernism — this one). For reference only |
| `prototypes/v3-final.jsx`, `prototypes/shared-data.js` | Source of the prototype, in case you want to read the raw markup |

## Screens / Views

### 1. Home page — "Idag"

The only screen in this handoff. URL: `/`.

The page has a strict top-to-bottom structure:

```
┌─────────────────────────────────────────────────┐
│ TopStrip       date · week · weather │ nav       │  ← 18 px padding, hairline below
├─────────────────────────────────────────────────┤
│                                                 │
│           Cal·Pal                  nr cxlvii    │  ← Masthead — huge wordmark
│                                                 │
├─────────────────────────────────────────────────┤
│ Idag  │ Namnsdag │ Dag av året │ Dagar kvar     │  ← TodayStats — 4 cards
│ onsdag│ Beda     │ 147         │ 218            │
├─────────────────────────────────────────────────┤
│                                       │         │
│  maj                  ← apr / jun →   │ Solhöjd │
│                                       │ ───     │
│  MÅN TIS ONS TOR FRE LÖR SÖN          │ Pollen  │
│  ┌──────────────────────────┐         │ ───     │
│  │  27  28  29  30   1  2  3 │         │ Bonde-  │
│  │  ... full grid ...        │         │ prak.   │
│  └──────────────────────────┘         │ ───     │
│                                       │ Dagens  │
│  MÅNADENS ESSÄ │ "Maj är blommornas..."│ ord     │
│                                       │ ───     │
│                                       │ Säsong  │
├─────────────────────────────────────────────────┤
│ Cal·Pal · Stockholm    "Hwarken hast..."         │  ← Footer
└─────────────────────────────────────────────────┘
```

#### Sections, top to bottom

1. **TopStrip** — 18 px vertical padding, horizontal padding = `--cp-pad-x`.
   Left: small ink star glyph + uppercase eyebrow with full date, week, temp.
   Right: nav links (Idag, Räknare, Klämdagar, Arkiv) at 12 px, letter-spacing
   `.16em`, uppercase. Active link gets a 1.5 px bottom border in `--cp-ink`.

2. **Masthead** — 52 px top padding / 40 px bottom (regular). Two-column
   grid (`1fr auto`). Left: the wordmark "Cal·Pal" at 192 px, Newsreader
   light, leading 0.84, tracking `-0.04em`. The middle dot is italic and
   colored `--cp-accent`. Right (bottom-aligned): "nummer cxlvii · vår" in
   uppercase eyebrow + "Den svenska kalendern, med själ" in serif italic 22 px.
   Hairline below.

3. **TodayStats** — 4-column grid (`1.2fr 1fr 1fr 1fr`), each card 28 px
   vertical / 24 px horizontal padding, hairline between cards. The first
   card's eyebrow ("Idag") is `--cp-accent`; the rest use `--cp-ink-3`.
   Big text is Newsreader light 58 px, italic only on the first card.

4. **Main grid** — 2-column (`1fr 320px`) with 76 px gap. 48 px top padding.

   **Left column:**
   - **CalendarHeader**: huge italic "maj" (Newsreader light, 108 px) on the
     left, prev/next + a one-line season blurb on the right.
   - **CalendarGrid**: a 6-week table. First column (28 px wide) optionally
     shows week numbers (toggleable). 7 weekday columns with `1fr` each, 12 px
     gap. The weekday header row sits on a 2 px `--cp-ink` rule. Each day
     cell has a 1 px `--cp-rule` top border (the "today" cell is 2 px
     `--cp-ink` instead). Day numerals are Newsreader light 38 px (today: 46).
     A trailing 1 px `--cp-ink` rule closes the grid at the bottom.
   - **MonthEssayQuote**: 56 px top margin, 2-column (`1fr 2fr`) grid.
     Left: "MÅNADENS ESSÄ" accent eyebrow + source citation in italic 20 px.
     Right: the quote in Newsreader light 32 px. The word `koningadrottning`
     gets italic + accent color treatment.

   **Right column (Sidebar):** 36 px vertical gap between blocks.
   - **SolMåne**: section heading, sun arc SVG (the dot is `--cp-accent`),
     dagsljus number in Newsreader light 36 px, day-delta in accent.
     Moon glyph + phase name below.
   - **Pollen**: 4 entries, each a row with name + 4 `--cp-ink` bars (filled
     by `level`) on the left and an italic Swedish severity label on the right.
   - **Bondepraktikan**: 2 px ink top rule + 1 px rule bottom. Accent eyebrow +
     one-line italic quote in Newsreader light 26 px.
   - **Dagens svenska ord**: eyebrow + the word in Newsreader light italic
     64 px + definition in italic 12 px.
   - **Säsong**: small year-progress wheel (32 px radius) with an accent arc
     showing fraction-of-year, + the season label in italic 24 px.

5. **Footer** — 2 px ink top rule, 20 px top / 28 px bottom padding.
   Star + "Cal·Pal · Stockholm · MMXXVI" on the left, an aphorism on the
   right. Both in the uppercase eyebrow style.

## Components

All component code is in `CalPal.tsx`. Public API:

```tsx
import { CalPal } from './CalPal';
import type { CalPalPageData, CalPalSettings } from './types';
import './tokens.css';

<CalPal data={pageData} settings={settings} />
```

Sub-components inside `CalPal.tsx`: `TopStrip`, `Masthead`, `TodayStats`,
`CalendarHeader`, `CalendarGrid`, `DayCellView`, `MonthEssayQuote`,
`Sidebar`, `SidebarSunMoon`, `SidebarPollen`, `SidebarBondepraktikan`,
`SidebarDagensOrd`, `SidebarSeason`, `Footer`, `SectionHeading`, `Star`.
Feel free to extract them into individual files if your project prefers
that convention.

### Component data contracts

See `types.ts`. Highlights:

- `DayCell` represents one day in the calendar grid. `month: 'prev' | 'current' | 'next'` controls dimming. `weekday: 0..6` is Mon-first. `holiday` and `klam` are optional flags that change rendering.
- `MonthData` has `days: DayCell[]` of exactly **42** (6 weeks × 7 days) + `weeks: number[]` of 6 week numbers.
- `TodayInfo` is everything in the TopStrip + TodayStats + SunMoon. Most fields are pre-formatted strings (e.g. `dayLength: '17 tim 47 min'`) — keep them strings so the design controls formatting.

## Interactions & Behavior

The prototype is intentionally static (it's a design reference). Behavior
the developer should add:

| Element | Behavior |
|---|---|
| TopStrip nav links | Real `<a>` to `/raknare`, `/klamdagar`, `/arkiv`. Active state matches current route. |
| CalendarHeader prev/next | Navigate to previous / next month. URL should be `/?m=2026-04` etc. |
| DayCell | Clickable — opens a per-day modal or page (`/dag/2026-05-27`) with full namnsdag history, sunrise/sunset for that date, "på denna dag" events. |
| Sun arc dot | Animate position based on current time on mount (smoothly slide in from sunrise position). |
| Moon glyph | Compute the crescent shape from `moonLit` and waxing/waning. The prototype uses a generic waxing half. |
| Season switch | Triggered when the active month crosses an equinox/solstice. Set `data-season` on the page root. |

### Hover / focus states

The prototype doesn't show these. Recommended:

- **Nav links**: `:hover` shows a 1.5 px bottom border in `--cp-ink-2`. `:focus-visible` shows a 2 px outline in `--cp-accent`, 4 px offset.
- **DayCell**: `:hover` lifts background to `--cp-tint`; cursor pointer.
- **Day numerals**: never change color on hover (they're typographic, not buttons).

### Responsive behavior

- ≥ 1280 px: design as-shown.
- 960–1279 px: sidebar drops to 280 px, page padding → 40 px. Masthead drops to 144 px.
- < 960 px: single column. Sidebar moves below the calendar. Masthead becomes 64 px. TodayStats becomes a 2×2 grid. The 4-column TodayStats breaks down to a vertical list at < 600 px.
- < 600 px (phone): drop the week-number column. Masthead becomes 48 px. The calendar day cell numeral drops to 24 px / today 28 px.

## State Management

Minimal. The page is mostly server-rendered from these inputs:

- Active month (from URL / today's date)
- Today's full info (namnsdag, sun times, pollen, etc.) — fetched server-side
- Bondepraktikan + dagens ord — pre-baked content tables

Client state:

- The Tweaks panel in the prototype (`season`, `density`, `masthead`,
  `showWeeks`, `showStats`) is a designer tool, not a user feature. In
  production, `season` is derived from the active month, and `density` could
  be a saved user preference in localStorage. `masthead`, `showWeeks` and
  `showStats` should be fixed (don't expose to users — they're for
  design exploration only).

## Design Tokens

Full list in `tokens.css`. Summary:

### Colors

**Structural (don't change between seasons):**

- `--cp-paper`  `#ffffff`
- `--cp-ink`    `#0e0f0d`  ← primary text
- `--cp-ink-2`  `#535551`  ← secondary text
- `--cp-ink-3`  `#8a8c87`  ← tertiary text
- `--cp-rule`   `#e6e5df`  ← hairlines

**Seasonal (swap with `data-season` attribute):**

| Season | `--cp-bg` | `--cp-tint` | `--cp-accent` |
|---|---|---|---|
| `var`    (Spring) | `#fafaf7` | `#f4f6ee` | `#c44a2a` brick |
| `sommar` (Summer) | `#fbfaf3` | `#f7f3e2` | `#d68a18` ochre |
| `host`   (Autumn) | `#fbf8f4` | `#f3ece1` | `#8a3a1a` rust |
| `vinter` (Winter) | `#f7f9fa` | `#ecf0f3` | `#2a4a6a` ink-blue |

The accent is used **sparingly** — once or twice per visible region. Holidays in the calendar, the today eyebrow, the "MÅNADENS ESSÄ" eyebrow, the sun arc dot, the year-progress arc, the italic dot in the wordmark. Don't paint UI chrome with it.

### Typography

- Display serif: **Newsreader** (Google Fonts, weights 300/400/500, italic enabled). Used for everything large or set in italic.
- UI sans: **Inter** (Google Fonts, weights 300–700). Used for body, eyebrows, labels, day-name annotations.
- Avoid Cormorant Garamond, Playfair, or any "wedding" serif — Newsreader's gentle hairlines are core to the magazine feel.

Key scale points are tokens (`--cp-fs-*`) in `tokens.css`. The most important:

- Masthead wordmark: 192 px / serif / weight 300 / tracking `-0.04em`
- Month name "maj": 108 px / serif / weight 300 / italic / tracking `-0.03em`
- Day numerals: 38 px (today 46) / serif / weight 300 / tracking `-0.025em`
- Bondepraktikan quote: 26 px / serif / weight 300 / italic
- Section eyebrows: 10 px / sans / weight 700 / tracking `0.28em` / uppercase
- Date strip: 11 px / sans / weight 400 / tracking `0.22em` / uppercase

### Spacing

`4 / 8 / 12 / 16 / 24 / 32 / 48 / 56 / 72` px scale. The page-level horizontal padding (`--cp-pad-x`) varies with density mode: 40 / 56 / 72 px.

### Borders

- Hairline: `1px solid --cp-rule`
- Strong: `2px solid --cp-ink`

The grid uses strong borders for the weekday-header underline, the today-row top edge, the bondepraktikan top edge, and the footer top edge. Everything else is hairline.

### Radii

The design is intentionally **radius-less**. All corners are square. The only round element is the holiday-dot indicator in `DayCell` (6 × 6 px circle).

## Assets

No image assets in the design. Everything is type, SVG, or layout. SVGs are inlined as JSX:

- `Star` — a tiny 12 px four-point star, used in TopStrip + Footer
- Sun arc + sun dot — `SidebarSunMoon`
- Moon crescent — `SidebarSunMoon`
- Year-progress wheel — `SidebarSeason`

If you want a brand mark for favicons / open-graph, design one from the Star glyph (the literal "North Star" reference is shared between many Swedish almanac brands — keep it simple).

## Fonts

Load from Google Fonts:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;1,6..72,300;1,6..72,400;1,6..72,500&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

For better performance use `next/font` (Next.js) or self-host the WOFF2 subsets.

## Caveats & open questions

1. **Date strip weather** — the prototype hard-codes `Stockholm 13°`. Wire this to whatever weather source the existing site uses (or drop it).
2. **Day-of-year computation** — Cal·Pal already has this on the existing site; just pass it through.
3. **Quote highlight words** — the type `QuoteData.highlightWords` is there for future use. Right now the demo italicizes "koningadrottning" by hand. Implement a string-split pass before shipping.
4. **Other months** — the prototype only ships May 2026 data because that's what the existing site shows. The component is month-agnostic; just pass the right `MonthData`.
5. **Sub-pages** (`/raknare`, `/klamdagar`, `/arkiv`) — these aren't designed. The TopStrip nav links to them, but the pages themselves are out of scope for this handoff. Apply the same masthead + footer + token system to keep the visual language consistent.
6. **Accessibility** — the prototype skips ARIA. Before shipping: add `aria-label` to the sun arc, mark the calendar as `role="grid"` with appropriate roles on cells, ensure focus states.
7. **The italic dot in "Cal·Pal"** — make sure your serif renders the middle dot as an italic glyph and not a regular one. Newsreader does this beautifully. If you swap fonts, verify visually.

## Reference

- Live prototype: open `prototypes/Cal·Pal v3.html` in a browser. The Tweaks panel (bottom-right corner, toggle via the toolbar) lets you swap season, density, accent and masthead size.
- Three-direction comparison: `prototypes/Cal·Pal Design Directions.html` shows this design next to the rejected "Almanackan 1855" and "Naturkalendern" variations.
