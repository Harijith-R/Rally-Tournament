# RALLY 2026 — Master Design System Specification

> **Document Status**: Foundational Design Constitution (v1.0)  
> **Brand**: RALLY 2026 (`RALLY TOURNAMENT 2026`)  
> **Tagline**: `EVERY POINT MATTERS.`  
> **Domain**: `https://rally.harijith.com` (GitHub Pages)  
> **Scope**: Authoritative visual, interaction, accessibility, performance, and page-level specification governing all React, TypeScript, Tailwind CSS, GSAP, and Three.js / React Three Fiber implementations.

---

## 1. Brand Identity Specifications

### 1.1 Positioning & Creative Direction
**RALLY 2026** is a premier Men's Doubles badminton championship uniting **6 teams** and **68 registered athletes** across **2 balanced groups (34 players per group)** competing under a high-stakes **100-point race format** with mandatory elimination checkpoints at **25, 50, and 75 points**.

The digital identity combines five calibrated visual registers:
1. **3D & Hyperrealism** — Full-screen cinematic opening sequence (shuttlecock, BWF doubles court, sculpted silver RALLY trophy) and interactive 3D trophy showcases.
2. **Cinematic Storytelling** — Dramatic darkened indoor arena photography, directional spotlight scrims, and measured vertical pacing on the Homepage.
3. **Premium Editorial Grids** — Sharp architectural framing, bold F1-inspired team liveries, and crisp athlete registries for Teams and Players pages.
4. **Minimalist Data Presentation** — Zero-clutter, tabular-numeral schedules, verified results, and standings tables that never fabricate missing data.
5. **Luxury Trophy Presentation** — Sculpted brushed-silver metallic craftsmanship framed on dark obsidian plinths with subtle lime-green rim illumination.

### 1.2 Reference Benchmarks
- International Formula 1 championship digital platforms (sharp geometry, livery discipline, broadcast tabular clarity).
- Luxury automotive launch sites (restrained dark slate atmospheres, dramatic directional studio lighting, interactive 3D hero focal points).
- High-end international sports editorial publications (generous breathing room, strict typographic hierarchy, high-contrast photography).

### 1.3 Brand Wordmark & Lockup Rules
- **Primary Wordmark**: `RALLY 2026` rendered in **Oswald Bold (700)**, uppercase, letter-spacing `+0.12em` to `+0.16em`.
  - `RALLY` in Pure White (`#FFFFFF`).
  - `2026` in Championship Lime (`#A3E635`).
- **Tagline**: `EVERY POINT MATTERS.` — Always paired directly beneath major brand lockups in Oswald Medium (500) at `+0.16em`–`+0.24em` tracking.
- **Clearspace**: Minimum clearspace around the top-bar wordmark equals the cap-height of the `R` glyph (`>= 20px` on all sides).
- **Strict Prohibition**: Never attach status pills, region tags, version numbers, or decorative pulsing dots next to the wordmark in the navigation bar.

### 1.4 Voice, Tone & Anti-Slop Discipline
- **Editorial Voice**: Authoritative, concise, athletic, and factual. Plain human UI labels (`Explore Teams`, `View Fixtures`, `Reset`, `Skip Intro`, `Watch Intro`) — zero gimmicky jargon or hype filler.
- **Data Integrity**: Never invent captains, player portraits, fixtures, scores, or unconfirmed standings points rules.
- **Visual Restraint**:
  - **Zero Static Pills**: Metadata (groups, player counts, dates, match numbers) is rendered as unboxed inline typography separated by middots (`·`), never wrapped in rounded pill chips.
  - **Sharp Architectural Geometry**: `0px` to `2px` border radius across cards, buttons, inputs, and tables.
  - **No Thick Left Accent Stripes**: Never use `border-l-4` callout clichés. Use top `3px` livery stripes on Team Cards or subtle all-around `1px` hairline borders.
  - **No Ghost Watermarks or Code-Comment Headers**: Zero giant low-opacity background text behind sections; zero `//` or `>_` prefixes on headings.
  - **No Pulsing Status Dots**: Static typography and icons only.

---

## 2. Global Design Tokens

All design tokens are codified in `design-system/rally-2026/tokens.css` as CSS Custom Properties (`:root`) paired with Tailwind CSS v4 `@theme` mappings so DOM components, SVG team emblems, GSAP animations, and Three.js shaders share one canonical source of truth.

### Token Architecture Overview

| Category | Prefix | Purpose |
| :--- | :--- | :--- |
| Brand & Canvas | `--rally-bg-*` | Primary (`#101820`), secondary (`#17212B`), elevated (`#1D2A38`), arena void (`#0A1016`) |
| Brand Accents | `--rally-accent-*` | Championship Lime (`#A3E635`), hover state (`#B6F24C`), brushed silver (`#C0C0C0`) |
| Text Hierarchy | `--rally-text-*` | Primary (`#FFFFFF`), body (`#D4DCE4`), muted (`#AAB3BD`), subtle (`#6E7C8B`) |
| Hairline Borders | `--rally-border-*` | Default (`rgba(255,255,255,0.10)`), strong (`rgba(255,255,255,0.22)`), lime focus (`rgba(163,230,53,0.55)`) |
| F1 Livery Teams | `--rally-team-[1-6]-*` | Solid colour, dark surface tint, border accent for Teams 1 through 6 |
| Typography | `--rally-font-*`, `--rally-text-size-*` | Oswald display/stats + Inter body/UI fluid type scale |
| Radii | `--rally-radius-*` | `0px` (sharp), `2px` (precision) — strictly enforcing architectural sharpness |
| Spacing & Grid | `--rally-space-*`, `--rally-container-max` | 4px/8px baseline rhythm and `1360px` max content container |
| Motion | `--rally-duration-*`, `--rally-ease-*` | Standardized interaction timings (`150ms–700ms`) and settling curves |
| Elevation Layers | `--rally-z-*` | Base (`0`), sticky navbar (`40`), mobile drawer (`45`), 3D intro overlay (`50`) |

---

## 3. Typography System

### 3.1 Font Families (Strict 2-Family Rule)
1. **Display, Headings & Condensed Statistics**: **`Oswald`** (Google Fonts weights `400`, `500`, `600`, `700`).
   - Used for hero titles, section headings, card titles, scoreboard figures, animated stat counters, and team/group headers.
   - Always apply `text-wrap: balance` to display headlines to prevent single-word trailing orphans.
2. **Body Prose & Interface Controls**: **`Inter`** (Google Fonts weights `400`, `500`, `600`, `700`).
   - Used for navigation links, editorial copy, rule descriptions, search inputs, table labels, and metadata.
   - Dark-mode optical compensation: apply `letter-spacing: 0.005em` and `-webkit-font-smoothing: antialiased` on dark slate surfaces to preserve stroke legibility.

### 3.2 Fluid Type Scale

| Role | Token | Font | Size (Mobile → Desktop) | Weight | Line Height | Tracking |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Hero Display | `--rally-type-hero` | Oswald | `clamp(3.25rem, 7.5vw, 6.5rem)` (`52px–104px`) | 700 | `0.94` | `+0.06em` |
| Page Title (`h1`) | `--rally-type-h1` | Oswald | `clamp(2.5rem, 5vw, 3.75rem)` (`40px–60px`) | 700 | `1.02` | `+0.06em` |
| Section Heading (`h2`) | `--rally-type-h2` | Oswald | `clamp(1.875rem, 3.2vw, 2.75rem)` (`30px–44px`) | 700 | `1.08` | `+0.06em` |
| Card / Subheading (`h3`) | `--rally-type-h3` | Oswald | `clamp(1.375rem, 2vw, 1.875rem)` (`22px–30px`) | 600 | `1.15` | `+0.05em` |
| Condensed Stat Figure | `--rally-type-stat` | Oswald | `clamp(2.75rem, 4.5vw, 3.75rem)` (`44px–60px`) | 700 | `1.00` | `+0.02em` |
| Tagline / Sub-Hero | `--rally-type-tagline` | Oswald | `clamp(1.25rem, 2.4vw, 2.125rem)` (`20px–34px`) | 500 | `1.15` | `+0.16em` |
| Lead Body | `--rally-type-lead` | Inter | `1.0625rem` (`17px`) | 400 | `1.60` | `+0.005em` |
| Standard Body | `--rally-type-body` | Inter | `0.9375rem` (`15px`) | 400 | `1.62` | `+0.005em` |
| UI Control / Button | `--rally-type-ui` | Inter | `0.75rem` (`12px`) | 600 | `1.00` | `+0.14em` |
| Quiet Metadata / Kicker | `--rally-type-meta` | Inter | `0.75rem` (`12px`) | 500 | `1.40` | `+0.14em` |

### 3.3 Tabular Numerals Discipline
Every numeric figure — animated counters (`06`, `68`, `02`, `100`), standings columns (`Played`, `Won`, `Lost`, `Pts`), match scores (`100 – 84`), squad slot indices (`01`–`12`), and player counts — **must** apply `font-variant-numeric: tabular-nums` (`tabular-nums`) for razor-sharp vertical alignment.

---

## 4. Colour System

### 4.1 60–30–10 Allocation Discipline
- **60% Dominant Dark Slate Canvas**: `#101820` (`--rally-bg-primary`) and `#0A1016` (`--rally-bg-void` for footer/3D arena).
- **30% Structural Surfaces & Metallic Neutrals**: `#17212B` (`--rally-bg-secondary`), `#1D2A38` (`--rally-bg-elevated`), `#C0C0C0` (`--rally-silver`), and `#AAB3BD` (`--rally-text-muted`).
- **10% Focused Championship Accent**: `#A3E635` (`--rally-accent-lime`) used selectively for primary actions, active navigation underlines, 25/50/75/100 checkpoints, winning score highlights, and restrained 3D plinth illumination. **Never** flood large backgrounds with lime or apply glowing neon drop-shadows.

### 4.2 Core Brand Palette & WCAG AA Verification

| Swatch | Hex | Role | Contrast on `#101820` | Contrast on `#17212B` | Pass |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Primary Background | `#101820` | Main viewport canvas | — | — | Base |
| Secondary Surface | `#17212B` | Cards, tables, toolbars | 1.19:1 surface delta | — | Surface |
| Elevated Surface | `#1D2A38` | Hover rows, active controls | 1.44:1 surface delta | 1.21:1 | Surface |
| Primary Text | `#FFFFFF` | Headings, primary copy | **17.6:1** | **15.8:1** | AAA |
| Body Secondary | `#D4DCE4` | Long-form descriptions | **12.9:1** | **11.5:1** | AAA |
| Muted Text | `#AAB3BD` | Labels, metadata, timestamps | **8.4:1** | **7.5:1** | AAA |
| Metallic Silver | `#C0C0C0` | Trophy highlights, subtle trim | **10.1:1** | **9.0:1** | AAA |
| Championship Lime | `#A3E635` | Primary CTA bg, active accent | **12.4:1** (fg on dark) / **12.4:1** (`#101820` text on lime) | **11.1:1** | AAA |

### 4.3 Six Bold F1 Livery High-Contrast Team Colours
Engineered after motorsport constructor liveries so every team is unmistakably recognizable at a glance across cards, geometric emblems, roster monograms, fixtures, and standings without clashing with Championship Lime (`#A3E635`).

| Team | Group | Players | Livery Name | Primary Hex | Subtle Tint (`14%`) | Emblem Geometry |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TEAM 1** | Group A | 12 | Scuderia Crimson | `#EF233C` | `rgba(239, 35, 60, 0.14)` | Angular Chevron Shield |
| **TEAM 2** | Group B | 12 | Apex Racing Blue | `#2563EB` | `rgba(37, 99, 235, 0.14)` | Championship Crest Shield |
| **TEAM 3** | Group A | 11 | Petronas Emerald | `#00C896` | `rgba(0, 200, 150, 0.14)` | Precision Faceted Diamond |
| **TEAM 4** | Group B | 11 | Papaya Motorsport Orange | `#FF7A00` | `rgba(255, 122, 0, 0.14)` | Architectural Crest Frame |
| **TEAM 5** | Group A | 11 | Alpine Ultraviolet | `#8B5CF6` | `rgba(139, 92, 246, 0.14)` | Aero Swept Wings |
| **TEAM 6** | Group B | 11 | Titanium Velocity Cyan | `#06B6D4` | `rgba(6, 182, 212, 0.14)` | Hexagonal Velocity Prism |

> **Color-Blind & Accessibility Rule**: Team colour is never the sole identifier. Every team indicator is always paired with explicit text (`TEAM 1`–`TEAM 6`), numeric emblem (`01`–`06`), and Group label (`Group A` / `Group B`).

### 4.4 Measured Photography Contrast Scrims
Whenever typography overlays arena photography:
- **Horizontal Hero Scrim**: `linear-gradient(90deg, #101820 0%, rgba(16, 24, 32, 0.84) 48%, rgba(16, 24, 32, 0.28) 100%)`
- **Vertical Grounding Scrim**: `linear-gradient(0deg, #101820 0%, rgba(16, 24, 32, 0.12) 55%, rgba(16, 24, 32, 0.58) 100%)`

---

## 5. Spacing and Layout System

### 5.1 Spatial Scale (8px Harmonic Rhythm with 4px Precision Sub-Steps)
- `4px` (`--rally-space-1`) — Tight icon-to-label micro gaps.
- `8px` (`--rally-space-2`) — Inline metadata separator spacing.
- `12px` (`--rally-space-3`) — Compact form/list gaps.
- `16px` (`--rally-space-4`) — Minimum container padding, mobile gutters, compact card padding.
- `20px` (`--rally-space-5`) — Standard player card padding, grid gaps.
- `24px` (`--rally-space-6`) — Standard desktop grid gutter (`gap-6`), section sub-blocks.
- `32px` (`--rally-space-8`) — Desktop horizontal page padding, major card outer padding (`p-8`).
- `48px` (`--rally-space-12`) — Header-to-content spacing, major block separation.
- `80px–112px` (`--rally-space-20` to `--rally-space-28`) — Section vertical breathing room on desktop (`py-20 sm:py-28`).

### 5.2 Spatial Math Laws
1. **Outer Padding >= Inner Gap**: Every card's outer padding (`24px`–`32px`) is strictly greater than or equal to the internal gap between its children (`12px`–`20px`).
2. **Sharp Surface Geometry**: All cards, buttons, inputs, and tables use `--rally-radius-sharp: 0px` or `--rally-radius-precision: 2px`.
3. **Single-Elevation Depth**: Maximum one surface step per screen (`#101820` canvas → `#17212B` surface bordered by `1px solid rgba(255, 255, 255, 0.10)`). Avoid nesting bordered cards inside bordered cards; separate interior zones with `1px` horizontal hairline dividers (`border-t border-white/10`) and whitespace.
4. **Balanced Editorial Density**: Generous hero/section breathing room paired with crisp, aligned multi-column grids and scannable data rows.

### 5.3 Container & Column Architecture
- **Max Content Width**: `1360px` (`--rally-container-max`), centered with `px-5 sm:px-8` gutters.
- **Desktop (`>= 1024px`)**: 12-column editorial grid (`24px`–`32px` gutter).
  - Teams Grid: 3 columns (`grid-cols-3`, 2 balanced rows of 3 teams).
  - Players Directory: 4 columns on `xl` (`1280px+`), 3 columns on `lg`.
  - Tournament Groups & Standings: 2 equal columns (`Group A` | `Group B`).
- **Tablet (`768px–1023px`)**: 2-column grid for Teams, Players, and Rules; full-width stacked Standings tables.
- **Mobile (`< 768px`)**: Single-column flow (`px-5`), 2x2 grid for Homepage KPI counters.

---

## 6. Navigation Design

### 6.1 Desktop Sticky Header (`lg: >= 1024px`)
- **Height**: `72px` (`h-[72px]`), `position: fixed; top: 0; inset-x: 0; z-index: 40`.
- **Scroll Behavior**:
  - *At top (`scrollY <= 28px`)*: Subtle dark top scrim (`bg-gradient-to-b from-[#101820]/85 via-[#101820]/40 to-transparent`), `border-b border-transparent`.
  - *Scrolled (`scrollY > 28px`)*: Solid dark slate (`bg-[#101820]/95 border-b border-white/10`) for crisp separation over scrolled content.
- **Strict 3-Zone Contract**:
  1. **Left — Brand Wordmark**: Single-line `RALLY 2026` (`whitespace-nowrap shrink-0`).
  2. **Center/Right — 8 Primary Text Links**: `Home`, `Teams`, `Players`, `Fixtures`, `Results`, `Standings`, `Rules`, `Champions`.
     - Pure single-line typography (`text-sm font-medium whitespace-nowrap`), never boxed pills.
     - Active & Hover State: Text transitions `#AAB3BD → #FFFFFF` within `200ms`; bottom `2px` `#A3E635` underline animates via `scaleX(0 → 1)` (`origin-left`).
  3. **Far Right — Single Utility Action**: Sharp hairline button `Watch Intro` (`border-white/15 bg-[#17212B]/80`) to replay the 3D opening sequence on demand.

### 6.2 Mobile Navigation (`< 1024px`)
- **Top Bar Height**: `64px` (`h-16`) — strictly honoring the `<= 15%` mobile viewport sticky height cap.
- **Controls**: Compact `RALLY 2026` wordmark on left + `44px × 44px` architectural menu toggle button on right (`aria-expanded`, animated icon switch `Menu` ↔ `X`).
- **Slide-Out Drawer**:
  - Full-height right-aligned drawer (`max-w-xs`, `#101820`, `border-l border-white/10`) over `bg-black/75` backdrop.
  - Translates smoothly (`translateX(100% → 0%)`, `300ms ease-out`).
  - Stacked `Oswald` `24px` route links separated by `1px` hairlines (`min-height: 48px` tap targets) + bottom `Replay 3D Intro` action.
  - Locks body scroll while open and closes automatically on route navigation or Escape key.

---

## 7. Button Styles

All buttons enforce single-line labels (`whitespace-nowrap shrink-0`), sharp `0px–2px` geometry, `>= 40px` desktop / `>= 44px` mobile height, horizontal padding `≈ 2×` vertical padding, `150–200ms` transitions, and `2px solid #A3E635` `focus-visible` outlines (`outline-offset: 2px`).

| Variant | Background | Text | Border | Hover State | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Primary (Championship Lime)** | `#A3E635` | `#101820` | None | `#B6F24C` | One dominant CTA per decision block (`Explore Teams`, `Visit Champions Hall`) |
| **Secondary (Hairline Ghost)** | `rgba(16,24,32,0.80)` | `#FFFFFF` | `1px solid rgba(255,255,255,0.24)` | Border `#A3E635`, Text `#A3E635` | Paired secondary actions (`View Fixtures`, `Read All 10 Official Rules`, `Skip Intro`) |
| **Tertiary (Editorial Arrow Link)** | Transparent | `#C0C0C0` | None | Text `#A3E635`, arrow shifts `+4px` (`translateX`) | Section view-all links (`All Six Teams`, `Full Schedule`) |
| **Segmented Filter Control** | Container `#101820` (`border-white/15 p-1`) | Active `#101820` on `#A3E635`; Inactive `#AAB3BD` | None inside container | Inactive text → `#FFFFFF` | Interactive client-side filters (All / Group A / Group B; All / Upcoming / Completed) |
| **Disabled State** | Preserves variant geometry | `opacity: 0.40` | Preserves hairline | `pointer-events: none` | Reset button when no filters active |

---

## 8. Team Card Styles

### 8.1 Anatomy of the Six Championship Team Cards
- **Container**: `#17212B`, `1px solid rgba(255, 255, 255, 0.10)`, `0px` radius, `28px–32px` padding.
- **Livery Accent**: `3px` solid full-width top stripe using the team's F1 livery colour (`--rally-team-[1-6]`).
- **Header Row**:
  - Left: Quiet unboxed metadata line (`GROUP A · 12 PLAYERS`, `12px`, `tabular-nums`, `#AAB3BD` with `#A3E635` group accent) above bold **Oswald 36px** Team Name (`TEAM 1`–`TEAM 6`).
  - Right: Custom `56px–64px` geometric SVG **Team Emblem** combining `#101820` core, `#C0C0C0` metallic inner linework, F1 livery outer stroke, and bold Oswald team number (`01`–`06`).
- **Mid Zone**: Clean squad preview line (first 4 real player names separated by `·` plus `+X more`) or architectural colour bar (`Team Identity 01`). Zero invented captains or stock photography.
- **Footer Action Row**: `border-t border-white/10 pt-5`, single-line `VIEW TEAM` / `VIEW SQUAD` label + right chevron that translates `+4px` on hover.
- **Hover Physics**: `transform: translateY(-4px)` (`200ms cubic-bezier(0.16, 1, 0.3, 1)`), border brightens to `rgba(255,255,255,0.30)`, emblem scales subtly to `1.05`.

### 8.2 Team Detail Header Banner
Full-width `#17212B` architectural header capped by a `4px` full-bleed F1 livery stripe, displaying `88px` Team Emblem, Group + exact player count metadata, `72px` Oswald Team Name, and a compact 3-metric strip (`Played`, `Won`, `Lost` in `tabular-nums`).

---

## 9. Player Card Styles

### 9.1 Player Registry Card Anatomy (All 68 Athletes)
- **Container**: Horizontal compact architectural tile (`#17212B`, `border border-white/10`, `16px–20px` padding, `0px` radius).
- **Initials Monogram Portrait**: `48px × 48px` dark square (`#101820`, `border border-white/15`) featuring bold `Oswald` initials (`VI`, `MA`, `VB`, `V5`, etc.) grounded by an interior bottom `2px` team F1 livery bar (`box-shadow: inset 0 -2px 0 0 var(--rally-team-x)`).
- **Identity Stack**:
  - Player Name in `Oswald 18px–20px SemiBold` (`#FFFFFF`, `truncate` overflow protection).
  - Unboxed Metadata Row (`12px Inter`, `tabular-nums`): `8px × 8px` solid livery square + `TEAM X` (`#D4DCE4`) `·` `Group A/B` (`#AAB3BD`).
- **Team Roster Variant**: Adds right-aligned muted two-digit squad order index (`01`–`12`, `#6E7C8B`, `tabular-nums`).
- **Duplicate Name Integrity Rule**: Searching `Manoj` MUST display three distinct, clickable records with separate unique IDs (`p-t1-04 · TEAM 1 · Group A`, `p-t2-01 · TEAM 2 · Group B`, `p-t5-11 · TEAM 5 · Group A`). Searching `Vishnu` MUST display `Vishnu (Blue B06)` (`TEAM 2`), `Vishnu Krishnan` (`TEAM 5`), and `Vishnu 5 AM` (`TEAM 6`) independently.

### 9.2 Search & Filter Toolbar
Single-row responsive dark toolbar (`#17212B`, `border border-white/10`, `20px` padding) combining:
- Full-text search input (`#101820`, `44px` height, magnifying glass affordance icon, instant clear `X` button).
- Segmented Group selector (`All Groups` | `Group A` | `Group B`).
- Team select dropdown (`All Teams (6)` + Teams 1–6 synchronized with active group filter).
- `Reset` button + live count readout (`Showing X of 68 registered players`).

---

## 10. Fixture and Result Card Styles

### 10.1 Scheduled Fixture Row Card
- **Layout**: 12-column horizontal bar on desktop (`#17212B`, `border border-white/10`, `24px` padding), stacking cleanly on mobile.
  - *Cols 1–3*: `Match 01 · Group A` (`#A3E635`, `tabular-nums`) over `Date · Time` (`#AAB3BD`).
  - *Cols 4–9*: Centered matchup `[Emblem] TEAM A  vs  TEAM B [Emblem]` in `Oswald 24px`.
  - *Cols 10–12*: Right-aligned `Court` name (`#FFFFFF`) over status label (`Upcoming` / `Completed` in `#A3E635` text — no pill badges).

### 10.2 Completed Result Summary Card
- **Header Strip**: `border-b border-white/10 pb-4`, left `Match XX · Group X · Date`, right `Winner: TEAM X` in `#A3E635`.
- **Scoreboard Row**: 12-column grid with Team A identity (left), bold `Oswald 48px` `tabular-nums` final score (`100 – 87`, winning score in `#A3E635`) center, and Team B identity (right).
- **Footer**: Concise official match summary prose (if present in JSON) + right-aligned `View Match Report →` action linking to the detailed result view.
- **No Live Scoreboard**: Strictly completed, committee-published match outcomes only.

### 10.3 Official Empty / Pending States
When `fixtures.json` or `results.json` has `matches: []`:
- Asymmetric 12-column editorial split card (`#17212B`, `border border-white/10`):
  - Left 6 columns: Affordance icon (`Calendar` / `Trophy`), bold `Oswald 44px` official headline (`FIXTURES COMING SOON` or `RESULTS WILL BE ANNOUNCED HERE`), explanatory copy, group lineup summary, and direct navigation links to Teams / Rules / Standings.
  - Right 6 columns: High-contrast championship photography (`shuttlecock_net_detail` or `court_geometry_editorial`) with subtle dark bottom scrim.

---

## 11. Table Design (Standings)

- **Outer Frame**: `#17212B`, `1px solid rgba(255, 255, 255, 0.10)`, `overflow-x: auto` wrapper for narrow screens so columns never crush.
- **Section Header**: `Oswald 30px` table title (`GROUP A`, `GROUP B`, or `OVERALL STANDINGS`) paired with right-aligned `12px` lime metadata (`3 TEAMS · 34 PLAYERS`).
- **Column Structure & Alignment**:
  - `Pos` (left-aligned, `80px`, `tabular-nums`, displays `—` before matches start)
  - `Team` (left-aligned, `36px` geometric emblem + `Oswald 20px` team name link + quiet `Group X · N Players` subline)
  - `Played` (right-aligned, `tabular-nums`)
  - `Won` (right-aligned, `tabular-nums`)
  - `Lost` (right-aligned, `tabular-nums`)
  - `Pts` (right-aligned, `Oswald 20px Bold`, `#A3E635`, `tabular-nums`, displays `—` until official points allocation is confirmed)
- **Row Styling**: `1px` horizontal hairlines (`divide-y divide-white/10`), `#101820/60` uppercase `11px` header row, subtle `rgba(255,255,255,0.025)` row hover highlight. Zero table row dot scatter.
- **Pre-Tournament Governance**: When `pointsSystemConfirmed: false`, display a clean full-width pre-tournament notice explaining that official points allocation and tie-breaker criteria will be published upon match commencement.

---

## 12. Responsive Breakpoints

| Breakpoint | Min Width | Target Devices | Grid & Navigation Behavior |
| :--- | :--- | :--- | :--- |
| `base` | `0px` | Small & standard mobile | 1-col cards, 2x2 KPI strip, `64px` sticky header + slide-out drawer, `px-5` gutters |
| `sm` | `640px` | Large phones / landscape | 2-col Players & Rules grids, expanded hero typography, `px-8` gutters |
| `md` | `768px` | Tablets (portrait) | 2-col Teams grid, horizontal 0→100 milestone track visible, split toolbar controls |
| `lg` | `1024px` | Laptops & tablets (landscape) | Full 8-link desktop navbar (`72px`), 3-col Teams grid, 2-col Group A/B & Standings tables, 4-col KPI strip |
| `xl` | `1280px` | Desktop monitors | 4-col Players directory, generous `1360px` container framing |
| `2xl` | `1440px+` | Wide studio displays | Centered `1360px` editorial grid with expansive full-bleed hero arena photography |

---

## 13. Animation Guidelines (Summary)

Full motion, Three.js PBR, and GSAP choreography specifications live in **`design-system/rally-2026/animation-guidelines.md`**. Core principles:
- **Latency Budget**: Routine UI hover/focus/tab feedback settles in `<= 200ms` using `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Compositor-Only**: Animate strictly `transform`, `opacity`, and `filter` — never layout properties (`width`, `height`, `top`, `left`, `margin`).
- **6-Scene 3D Opening Sequence**: Continuous `~9.2s` Three.js + React Three Fiber + GSAP timeline (Darkness → Shuttlecock → Acceleration with subtle lime trail → Court Reveal → RALLY Trophy Rise → Brand Reveal) with an `isTransitioning` phase fading all UI text overlays **2 seconds prior** to homepage transition.
- **Interactive Hero & Champions 3D Trophy**: Transparent-backed interactive 3D trophy positioned cleanly in the upper-left hero canvas clear of `RALLY 2026` typography, plus full studio stage viewer on the Champions page.
- **Reduced Motion & Fallbacks**: Full `prefers-reduced-motion` compliance, software-WebGL detection, once-per-session playback with instant `Skip Intro` & `Watch Intro` replay, and high-craft static photographic fallbacks when WebGL is unavailable.

---

## 14. Accessibility Requirements (WCAG 2.1 AA)

- **Contrast**: Minimum `4.5:1` for normal text, `3:1` for large headings and UI boundaries. All brand text tokens achieve `7.5:1` to `17.6:1` (AAA) on `#101820` and `#17212B`.
- **Keyboard Navigation**: Every interactive link, button, filter tab, search input, drawer trigger, and Skip Intro control is keyboard-reachable in logical DOM order with a high-visibility `2px solid #A3E635` `focus-visible` ring.
- **Touch Targets**: Minimum `40px × 40px` on desktop and `44px × 44px` on mobile touch devices.
- **Semantic Landmarks & ARIA**: Proper `<header>`, `<nav aria-label="...">`, `<main>`, `<section>`, `<article>`, `<footer>`, `<h1>`–`<h3>` hierarchy, `aria-expanded` on mobile menu, `sr-only` labels on search/select inputs, descriptive `alt` text on all imagery, and `aria-hidden="true"` on decorative SVGs and middot separators.
- **No Hue-Only State Signaling**: Winners, active tabs, and team affiliations always combine colour with explicit text labels or underlines.
- **Non-Blocking Motion**: `Skip Intro` is immediately interactive from frame 0; scroll reveals never hide primary content from assistive technologies.

---

## 15. Performance Guidelines

- **Lighthouse Target**: `90+` Performance, `95+` Accessibility, `95+` Best Practices, `100` SEO.
- **Code Splitting & Lazy 3D Loading**:
  - Dynamically import (`React.lazy` + `Suspense`) all Three.js / React Three Fiber canvases (`CinematicIntro`, `TrophyShowcaseCanvas`) so non-3D pages pay zero WebGL bundle cost.
  - Dedicated Vite manual chunks separating `three`, `@react-three/*`, `gsap`, and `react-router-dom`.
- **WebGL Efficiency**:
  - Software-WebGL detection (`SwiftShader|llvmpipe|softpipe`) scales down DPR to `1`, disables shadow maps and antialiasing without altering scene geometry or layout.
  - Zero `backdrop-filter` / `backdrop-blur` overlays on top of active WebGL canvases.
  - Zero per-frame React state updates in `useFrame`; pre-allocated reusable `THREE.Vector3` scratch objects and deterministic `.dispose()` cleanup on unmount.
- **Media & Fonts**:
  - Serve optimized compressed imagery (WebP/AVIF/optimized JPEG), preconnect to `fonts.googleapis.com` and `fonts.gstatic.com` with `display=swap`.
  - No large looping MP4 hero background videos.
  - Blender `.glb` models (when dropped into `trophyGlbUrl`) must be Draco/Meshopt compressed (`< 2.5 MB`).
- **GitHub Pages (`rally.harijith.com`) Asset Integrity**:
  - Root custom domain build uses `VITE_BASE_PATH=/`, `HashRouter` for zero nested-route 404s, `public/CNAME` (`rally.harijith.com`), and `import.meta.env.BASE_URL` for all JSON fetches under `public/data/tournaments/2026/`.

---

## 16. Individual Page Design Guidelines

### 16.1 Home (`/`)
1. **Section 1 — Full-Screen 3D Cinematic Intro**: Once-per-session overlay (`sessionStorage`), Skip Intro top-right, clean 2s pre-exit overlay fade.
2. **Section 2 — Main Hero**: Full-bleed dramatic indoor badminton arena photography with directional scrims; **interactive 3D RALLY Trophy** cleanly elevated in the upper-left focal frame with generous clearance above the `RALLY 2026` display title, `EVERY POINT MATTERS.` tagline, description (`Six teams. Sixty-eight players. One championship.`), primary `EXPLORE TEAMS` lime CTA, secondary `VIEW FIXTURES` CTA, and `Replay 3D Intro` action.
3. **Section 3 — Tournament Statistics Strip**: Full-width `#17212B` 4-column animated counter band (`06 TEAMS`, `68 PLAYERS`, `02 GROUPS`, `100 WINNING POINTS`).
4. **Section 4 — Meet the Teams**: 3x2 grid of the six F1-livery team cards.
5. **Section 5 — Tournament Groups**: 2-column architectural breakdown (`GROUP A: Teams 1, 3, 5 · 34 Players` | `GROUP B: Teams 2, 4, 6 · 34 Players`).
6. **Section 6 & 7 — Upcoming Fixtures & Latest Results**: Side-by-side 2-column summary panels reading directly from JSON (`FIXTURES COMING SOON` / `RESULTS WILL BE ANNOUNCED HERE` until published).
7. **Section 8 — Tournament Format**: 2-column split (format narrative + court geometry editorial photo) above the horizontal `25 / 50 / 75 / 100` visual milestone diagram.
8. **Section 9 — Championship Trophy Showcase**: 5/7 split combining trophy architectural specifications with a full-stage interactive 360° 3D trophy viewport.
9. **Section 10 — Footer**: Deep arena void (`#0A1016`), RALLY 2026 identity, Replay Intro trigger, full 8-page navigation mirror, and championship format summary.

### 16.2 Teams (`/teams`) & Team Detail (`/teams/:teamId`)
- **Teams Directory**: Editorial header + segmented Group filter (`All Teams (6)` | `Group A (3)` | `Group B (3)`) + 6 premium livery team cards showing exact player counts (`12 / 12 / 11 / 11 / 11 / 11`).
- **Team Detail**: Livery-capped hero banner with `88px` emblem and `Played / Won / Lost` counter box → complete 3-column numbered squad roster (`01`–`12`) with initials monograms → 7/5 bottom split showing Team Match History and Group Opponents.

### 16.3 Players (`/players`)
- **Athlete Registry**: Editorial header → unified search + Group segmented toggle + Team dropdown + Reset toolbar → live count strip (`Showing X of 68 registered players`) → 4-column responsive player cards grid where every player record (including all 3 `Manoj` and 3 `Vishnu` entries) has a unique ID and direct link to their team.

### 16.4 Fixtures (`/fixtures`)
- **Schedule Hub**: Editorial header → dual interactive segmented filter controls (`All Matches` / `Upcoming` / `Completed` + `All Groups` / `Group A` / `Group B`) → horizontal fixture matchup rows when populated, or full 12-column editorial `FIXTURES COMING SOON` split with macro shuttlecock-net photography when pending.

### 16.5 Results (`/results`) & Match Report Detail (`/results/:matchId`)
- **Results Archive**: Editorial header + Group filter → completed match summary cards (Match #, Group, Date, Teams, Final Score, Winner, Summary) or `RESULTS WILL BE ANNOUNCED HERE` editorial split when pending.
- **Match Report Detail**: Verified final scoreboard hero + conditional 2-column detail panels rendering strictly JSON-provided data (Player Participation rosters, 25/50/75 Mandatory Eliminations, Voluntary Substitutions, and Match Progression checkpoints).

### 16.6 Standings (`/standings`)
- **Championship Tables**: Editorial header + view switcher (`Group Tables` | `Overall Table`) → Pre-tournament points-allocation notice (while unconfirmed) → crisp right-aligned tabular standings tables for Group A, Group B, and Overall.

### 16.7 Rules (`/rules`)
- **Regulations Hub**: 6/6 split combining Men's Doubles 100-point format specs (`Doubles · 2v2 · 0–0 · 100 PTS`) with court geometry photography → full-width interactive-clarity `0 → 25 → 50 → 75 → 100` architectural milestone diagram → 2-column grid of all **10 Official Competition Rules** (`01`–`10`) with highlighted framing on Rule 10 (Participation Compliance Forfeit).

### 16.8 Champions (`/champions`)
- **Hall of Honour**: Centered monumental header (`THE CHAMPION WILL BE CROWNED.` pre-announcement, or `TEAM X — CHAMPIONS` post-announcement) → full-width `580px` interactive 3D RALLY Trophy centerpiece stage → either the 6 contending teams grid awaiting coronation, or the announced Championship Banner, Final Score box, full Winning Roster, and Championship Photography gallery.
