# Stripe and Linear — reference audit for Trail

Research date: October 24, 2026. Purpose: extract design principles for a small personal-work app, not copy either company's product or reproduce an entire marketing site.

## Evidence and limits

Inspected the rendered public homepages at a 1280 × 720 desktop viewport, including hero, lower product sections and open product navigation. Seven original viewport screenshots are stored in `references/`. Stripe's homepage resolved to its India locale. Also read first-party design articles linked below. No authenticated dashboards, mobile viewport audit, exhaustive site crawl, proprietary design-token extraction or motion-performance measurement was performed. Screenshot appearance can vary by locale, animation frame and viewport.

The learner's description of cursor-responsive artwork is a requested quality. This audit does not establish the exact cursor interaction or implementation of the current homepage artwork. Never report proposed Trail timings or colours as extracted vendor values.

## Sources

- [Stripe homepage](https://stripe.com/) — rendered light composition, product panels and navigation.
- [Linear homepage](https://linear.app/) — rendered dark composition, product framing, principles section and navigation.
- [Linear: A calmer interface for a product in motion](https://linear.app/now/behind-the-latest-design-refresh), March 12, 2026 — secondary chrome recedes; simplify icons and separators; make actions predictable. This directly supports Trail's next-action-first requirement.
- [Linear: How we redesigned the Linear UI](https://linear.app/now/how-we-redesigned-the-linear-ui), March 28, 2024 — use complete representative screens to explore alignment and hierarchy, and stress-test the design before broad implementation.
- [Stripe: To design and develop an interactive globe](https://stripe.com/blog/globe), September 1, 2020 — a historical engineering example of custom dimensional artwork, not evidence of the current homepage implementation. Trail should not inherit its engineering scale.

## Screenshot index

| Capture | What to inspect |
|---|---|
| `references/stripe-home-desktop.jpg` | Light hero; strong left text alignment; saturated artwork concentrated toward one side; compact CTA. |
| `references/stripe-products-desktop.jpg` | Unequal panel widths; quiet neutral containers; product demonstrations provide colour and depth. |
| `references/stripe-navigation-desktop.jpg` | Open menu; grouped columns, shared baselines and concise descriptions. |
| `references/linear-home-desktop.jpg` | Dark hero; restrained navigation; large sans-serif type; content breathes. Capture includes an animation/loading frame, not a typography defect finding. |
| `references/linear-product-desktop.jpg` | App framing; nested surfaces; restrained accents; distinction between navigation and work. |
| `references/linear-principles-desktop.jpg` | Fine line illustrations; columns divided quietly; limited text hierarchy. |
| `references/linear-navigation-desktop.jpg` | Open panel; subdued border and backdrop; active navigation treatment; consistent groups. |

## Translation matrix — our design analysis

| Dimension | Reference lesson | Adaptation to propose for Trail | Boundary |
|---|---|---|---|
| Composition | Stripe isolates expressive artwork; Linear gives content a clear hierarchy. | Put a readable next action at the start of the page; give the route one deliberate supporting region. | No tall hero artwork above the work controls. |
| Density | Marketing pages can use large gaps; product views need more usable information. | Spacious action area, compact secondary rows and disclosed history. | Do not copy landing-page whitespace until Start is below the fold. |
| Typography | Headline, explanatory text and metadata use different weights and contrast. | A restrained sans-serif family; task instructions remain reading-size, not advertising-size. | No giant multi-line task poster or tiny grey instructions. |
| Colour | Expressive colour works against a stable neutral base. | White/near-white shell, dark text; colour concentrated in progress graphics and interaction states. | Do not put rainbow gradients on every button or panel. |
| Material | Borders, tonal surfaces and shadows establish layers. | Shared baselines, subtle dividers and a soft graphic surface; shadows mainly for overlays. | No heavy glass, thick outlines or nested card stacks. |
| Navigation | Consistent grouped navigation makes destinations predictable. | Few named destinations; secondary controls stay visually quiet and predictable. | No copied mega-menu, workspace tree or enterprise sidebar. |
| Controls | A small number of treatments establishes an action hierarchy. | One obvious Start/Resume; quiet editing and exploration; clear disabled/loading states. | Not every action gets an accent-filled pill. |
| Graphics | Product-specific visuals are more memorable than unrelated ornament. | A custom route that exposes actual session history and meaningful milestones. | No stock 3D object, floating orb or gradient with no record behind it. |
| Interaction | State changes should help orientation and confirm actions. | Local checkpoint emphasis, controlled scene depth, stable selection and nearby explanatory detail. | No pointer-following forms, moving text or accidental task switching. |
| Motion | Expressiveness belongs where it serves the product. | Quiet hover response outside focus; restrained focus atmosphere; finite completion feedback. | Motion behaviour below is a Trail proposal, not measured reference behaviour. |
| Trust | A polished surface still needs intelligible behaviour. | Honest storage/AI explanations, realistic sample records, visible recovery and useful errors. | No manufactured impact metrics or decorative security claims. |

## The synthesis

The proposed visual formula is **Stripe-inspired light surfaces and selective colour, with Linear-inspired hierarchy, alignment and restrained controls**. Strava remains the functional analogy for a revisitable route; the learner is not asking for a location map.

Do not create a Stripe homepage above an unrelated Trail dashboard. The progress representation, task interaction and calm focus state must share a visual system. All exact numbers in `design-brief.md` are proposed Trail defaults to test, not the brands' internal design specifications.

## What “human-made” must mean in review

It is an aspiration, not a measurable production method. Evaluate deliberate hierarchy, purposeful graphics, coherent states, exact spacing/alignment, legible realistic content and polished controls. A design can use AI assistance and still meet these qualities. Conversely, reference names in a prompt are not evidence of visual quality.
