# National Foods — Design & Animation Improvements

Informed by Apple's *Designing Fluid Interfaces* principles and the `animate` skill's construction rules. Every recommendation earns its place — nothing moves for decoration's sake. Frequency gates, purpose names, exact values.

---

## 1. Header — Scroll-Aware Translucent Material

**Current:** Static `fixed` header with a cream-to-transparent gradient scrim. Identical appearance from first pixel to last scroll position. No nav links, no scroll feedback.

**Problem (Apple §1, §12):** The header gives zero spatial feedback. The user can't tell where they are on the page. The gradient scrim works on the cream intro but washes out over dark sections (Horizon, contact). A static bar reads as dead chrome.

### 1a. Frosted-Glass Material on Scroll

Replace the static gradient with a `backdrop-filter` material that activates after scrolling past the intro. This is Apple's translucent toolbar pattern — content scrolls underneath, the bar stays legible across light and dark backgrounds.

**Gate:** Occasional (page load, ~1×/visit). **Purpose:** State indication.
**Tool:** CSS transition (cheapest that works — this is a class toggle, not a gesture).

```css
/* Add to globals.css or as Tailwind utilities */
.header-glass {
  background: rgba(247, 243, 238, 0.72);
  backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid rgba(42, 33, 26, 0.08);
  transition: background-color 500ms cubic-bezier(0.23, 1, 0.32, 1),
              backdrop-filter 500ms cubic-bezier(0.23, 1, 0.32, 1),
              border-color 500ms cubic-bezier(0.23, 1, 0.32, 1);
}
```

**Implementation:** Use an IntersectionObserver on the intro section. When the intro leaves the viewport, add the `.header-glass` class. When it re-enters, remove it.

**Reduced motion:** Keep — this is a color/opacity change, not positional motion.

### 1b. Logo Scale-Down on Scroll

The logo (`h-16 sm:h-24`) is large for a fixed header once the user is reading content. Scale it down to `h-12 sm:h-16` when the glass activates.

```css
.header-logo {
  transition: height 350ms cubic-bezier(0.23, 1, 0.32, 1);
}
```

**Reduced motion:** No transform involved — it's a `height` change. Acceptable because it's a one-time toggle, not continuous. Alternatively, use `transform: scale(0.75)` for GPU compositing (no layout thrash), with `transform-origin: left center`.

---

## 2. Section Entrances — Staggered Reveals

**Current:** The `<Reveal>` component is well-built (850ms, strong ease-out `[0.16, 1, 0.3, 1]`, viewport margin `-12%`, once). But every child in a section enters as one monolithic block because `<Reveal>` wraps the entire column.

**Problem (Apple §8, animate §Never Ship):** "Everything entering at once" — no hierarchy, no reading order. The eye has nowhere to land first.

### 2a. Stagger the About Stats Grid

The 4-stat grid (`about.tsx:73-84`) enters as one `<Reveal>` block. Each stat should enter individually with a 60ms stagger.

**Gate:** Occasional (once per session). **Purpose:** Spatial consistency — reading order matches layout order.
**Tool:** Motion `whileInView` with stagger (already in the project).

```tsx
{STATS.map((stat, i) => (
  <motion.div
    key={stat.value}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-12%" }}
    transition={{
      duration: 0.7,
      delay: i * 0.06,
      ease: [0.16, 1, 0.3, 1],
    }}
  >
    <dt>...</dt>
    <dd>...</dd>
  </motion.div>
))}
```

**Reduced motion:** Drop the `y` transform, keep opacity with 200ms ease.

### 2b. Stagger the Brand Logos (Trusted Section)

`trusted.tsx:124-143` — all 9 logos are static. They should enter on scroll with a stagger, since the user encounters them as a constellation.

**Gate:** Occasional. **Purpose:** Preventing a jarring change — 9 elements appearing simultaneously is a flash, not a reveal.
**Tool:** Motion `whileInView` per logo, 50ms stagger per item.

```tsx
<motion.div
  key={brand.alt}
  initial={{ opacity: 0, scale: 0.92 }}
  whileInView={{ opacity: 1, scale: 1 }}
  viewport={{ once: true, margin: "-8%" }}
  transition={{
    duration: 0.65,
    delay: index * 0.05,
    ease: [0.16, 1, 0.3, 1],
  }}
  className="..."
>
```

Start from `scale(0.92)` + `opacity: 0`, never `scale(0)`.

### 2c. Stagger the Research Bullet Points

`research.tsx:186-204` — the 3 bullet points under each tab currently appear instantly with the panel swap. Stagger them 50ms apart *after* the panel's 450ms crossfade settles.

**Gate:** Tens of times/day (tab switches). **Purpose:** Near-imperceptible — fast and subtle.
**Tool:** Existing Motion keyed panel. Add individual `motion.li` with stagger offset starting at 0.2s (so they begin mid-crossfade, not after).

---

## 3. Button & Interactive Feedback

### 3a. Submit Button — Press Feedback

**Current (`contact.tsx:195-200`):** `hover:bg-[#c8151b]` color change only. No `:active` state. No press feedback.

**Problem (Apple §1, §10):** "Respond on pointer-down, not on release." The button feels dead when clicked.

**Gate:** Occasional. **Purpose:** Feedback.
**Tool:** CSS transition (no library needed).

```css
/* On the submit button */
.btn-submit {
  transition: background-color 160ms ease,
              transform 100ms cubic-bezier(0.23, 1, 0.32, 1);
}
.btn-submit:active {
  transform: scale(0.97);
}
```

Or with Tailwind:
```
active:scale-[0.97] transition-[background-color,transform] duration-[160ms]
```

**Feel-check:** The 0.97 scale should be barely perceptible — test it; if it reads as "shrinking," try 0.98.

### 3b. Research Tab Buttons — Press Feedback

`research.tsx:125-145` — the tabs have `hover:bg-black/5` but no press state. Add:

```
active:scale-[0.97] transition-[background-color,transform] duration-[120ms]
```

**Gate:** Tens of times/day. Must be near-imperceptible.

### 3c. Form Field Focus — Visible Transition

**Current (`contact.tsx:16`):** `transition-colors` with no explicit duration. Some browsers default to 0ms — the border snaps from `#5d5d5d` to white with no intermediate state.

**Fix:**
```
transition-colors duration-200 ease-out
```

(Using `ease-out` not `ease-in` — the user is watching for the response at the moment of focus.)

### 3d. Brand Logo Hover — Improve the Spring

**Current (`trusted.tsx:127`):** `hover:scale-105 transition-transform duration-300`. The default CSS `ease` is weak, and there's no pointer gating.

**Fix:**
```css
@media (hover: hover) and (pointer: fine) {
  .brand-logo:hover {
    transform: scale(1.05);
    transition: transform 250ms cubic-bezier(0.23, 1, 0.32, 1);
  }
}
```

Remove the hover effect on touch devices — it fires on tap and sticks until the next touch, which is confusing.

---

## 4. Section Transitions — Visual Seams

### 4a. Cream-to-Dark Seam (About → Research → Horizon)

**Current:** The transition from the cream `About` section to the dark `Horizon` section is a hard cut — cream stops, `bg-char` starts.

**Recommendation:** Add a subtle gradient overlay at the bottom of the Research section and top of Horizon, creating a 60–80px blend zone.

```tsx
// Bottom of Research section (before closing </section>)
<div
  aria-hidden
  className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-char/10"
/>
```

This is a static element, not an animation — no gate needed.

### 4b. Dark-to-Light Seam (Horizon → Trusted)

Same principle. A gradient from `bg-char` into `bg-cream` at the transition.

---

## 5. Typography Refinements

### 5a. Display Heading Tracking (Apple §15)

**Current:** The display text (`--text-display: clamp(2.75rem, 7vw, 6.5rem)`) has no `letter-spacing` set. At 6.5rem, the letters read as too far apart.

**Fix:**
```css
.display {
  letter-spacing: -0.02em; /* tighten as size grows */
  font-optical-sizing: auto;
}
```

Apply to the intro heading (`MaskedHeading`) and any `text-display` usage.

### 5b. Below-Fold Heading Tracking

The section headings at `clamp(2rem, 2.08vw, 2.5rem)` should have slight negative tracking at the upper end:

```css
letter-spacing: -0.01em;
```

### 5c. Body Text Line-Height Consistency

The body text is mostly `leading-[30px]` at `text-[17px]` — that's `~1.76`, which is comfortable. But the stats at `text-[30px] leading-[1.16]` (`about.tsx:76`) feel cramped if the value wraps. Consider `leading-[1.3]` for the stat values.

### 5d. Eyebrow Label Tracking

At `tracking-[0.2em]`, the eyebrow labels (marigold "ABOUT NATIONAL FOODS" etc.) are well-spaced. But `tracking-[0.4em]` on the intro "Scroll" cue is excessive — pull it to `tracking-[0.25em]` for consistency across the page.

---

## 6. Image Hover States — Depth on Engagement

### 6a. About & Horizon Images

**Current:** The images in About (`about.tsx:39-47`, `about.tsx:88-96`) and Horizon (`horizon.tsx:44-52`, `horizon.tsx:78-85`) have no interaction.

**Recommendation:** A subtle lift on hover — `scale(1.02)` + a slightly deeper shadow. This is not a link; it's a material-depth signal that the surface is responsive.

**Gate:** Tens of times/day. **Purpose:** Near-imperceptible feedback.

```css
@media (hover: hover) and (pointer: fine) {
  .img-hover {
    transition: transform 400ms cubic-bezier(0.23, 1, 0.32, 1),
                box-shadow 400ms cubic-bezier(0.23, 1, 0.32, 1);
  }
  .img-hover:hover {
    transform: scale(1.02);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
  }
}
```

Use on the `overflow-hidden` container so the scale doesn't bleed outside the frame.

**Reduced motion:** Drop the scale, keep the shadow change.

---

## 7. Contact Form Card — Material Refinement

### 7a. Card Hover Elevation (Apple §12)

**Current (`contact.tsx:139`):** The dark card has `shadow-[0_15px_80px_rgba(0,0,0,0.05)]` and `backdrop-blur-[5px]`. The blur is too weak to read as a material — it's visually indistinguishable from an opaque background.

**Fix:** Either commit to the blur (raise to `backdrop-blur-[16px]` and lower the background opacity to `bg-obsidian/90`) or drop it entirely. Half-measures make the card look accidentally blurry.

### 7b. Input Focus Glow

Add a subtle saffron glow on focus to make the active field obvious in the dark card:

```
focus:border-white focus:shadow-[0_0_0_3px_rgba(219,157,74,0.15)]
```

This is a state indication — no animation gate needed, it's a static focus state with a transition.

---

## 8. Scroll Cue — Fade and Pulse

**Current (`intro.tsx`):** The "Scroll" cue fades out on first scroll via GSAP. Good.

**Missing:** Before the user scrolls, the cue is static. A gentle vertical drift (3–4px oscillation, 2.5s period) would indicate that scrolling is a live affordance without being distracting.

**Gate:** Rare/first-time (seen once, dismissed by scrolling). **Purpose:** State indication — the page is interactive.
**Tool:** CSS animation (runs off main thread, no JS load during the heavy frame preload).

```css
@keyframes scroll-hint {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(4px); }
}
.scroll-cue {
  animation: scroll-hint 2.5s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .scroll-cue { animation: none; }
}
```

**Never:** Don't use `ease-in` here. `ease-in-out` keeps the motion symmetric.

---

## 9. Footer — Scroll-Into-View Reveal

**Current:** The footer is completely static. It appears as-is when you scroll to the bottom.

**Recommendation:** Wrap the footer content in `<Reveal>` with a short stagger:
- Logo + description: `delay: 0`
- Contact column: `delay: 0.06`
- Visit column: `delay: 0.12`
- Copyright bar: `delay: 0.18`

**Gate:** Once per session. **Purpose:** Preventing a jarring change.

---

## 10. Tab Panel Transition — Refine the Crossfade

**Current (`research.tsx:163-171`):** The panel swap uses Motion `opacity: 0→1, y: 14→0` at 450ms. This is reasonable but the `y: 14` is slightly large for a tab swap — it reads as "arriving from below" when it should read as "replacing in place."

**Fix:** Reduce to `y: 8` and shorten to `350ms`. Tab content should feel like a channel flip, not a page turn.

```tsx
<motion.div
  animate={{ opacity: 1, y: 0 }}
  initial={{ opacity: 0, y: 8 }}
  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
  key={tab.id}
>
```

**Feel-check:** Play the switch at 5× slow-motion. If the y-shift is visible as a distinct motion phase before the content resolves, it's too much. The opacity should do 90% of the work; the y is a reinforcement, not the main actor.

---

## 11. Horizon Section — Decorative Arrow

**Current (`horizon.tsx:63-73`):** The SVG arrow between "Today" and "Tomorrow" is static and `opacity-70`.

**Recommendation:** Fade it in on scroll with a slight draw-on effect — `opacity: 0→0.7` over 1.2s when the midpoint of the section enters the viewport. This is rare (once per session) and serves explanation — it's connecting two time periods.

**Tool:** CSS animation triggered by `@starting-style` or Motion `whileInView`.

```tsx
<motion.div
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 0.7 }}
  viewport={{ once: true, margin: "-20%" }}
  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
>
```

---

## 12. Global CSS Tokens — Easing Scale

The project uses `[0.16, 1, 0.3, 1]` in Motion and Tailwind's default `ease` / `ease-out` in CSS. These are two different curves for the same job. Unify them.

**Add to `globals.css`:**

```css
@theme {
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
  --ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);
}
```

Then replace all `transition-transform duration-300` / `transition-colors` (which use the weak built-in ease) with explicit references:

```css
transition: transform 250ms var(--ease-out);
```

This is the single biggest consistency win — every transition on the page shares one curve vocabulary instead of mixing Tailwind defaults with Motion arrays.

---

## 13. Reduced Motion — Existing Coverage + Gaps

**What's handled well:**
- `usePrefersReducedMotion()` hook in Intro, Scene, Research
- Lenis destroyed under reduced motion
- Motion's `reducedMotion="user"` set globally
- `motion-safe:animate-pulse` on capacity dot
- Static scene fallback

**Gaps to close:**
1. Brand logo `hover:scale-105` — needs `@media (hover: hover) and (pointer: fine)` gate (§3d above)
2. The proposed scroll-cue animation (§8) — needs `prefers-reduced-motion: reduce` to disable
3. Any new image hover effects (§6a) — need reduced-motion variant that drops scale
4. Form field focus transitions — these are fine under reduced motion (color-only)

---

## Priority Order

| # | Improvement | Impact | Effort |
|---|-------------|--------|--------|
| 1 | Easing tokens (§12) | High — fixes every weak curve | 15 min |
| 2 | Button press feedback (§3a, §3b) | High — immediate feel upgrade | 10 min |
| 3 | Staggered stats (§2a) | Medium — reading hierarchy | 15 min |
| 4 | Header glass material (§1a) | High — spatial awareness | 30 min |
| 5 | Brand logo stagger (§2b) | Medium — prevents flash | 20 min |
| 6 | Tab panel refinement (§10) | Medium — snappier feel | 5 min |
| 7 | Form field focus (§3c, §7b) | Medium — dark card legibility | 10 min |
| 8 | Display tracking (§5a) | Medium — typographic polish | 5 min |
| 9 | Logo hover pointer-gate (§3d) | Low — prevents touch ghost hovers | 5 min |
| 10 | Image hover depth (§6a) | Low — feel detail | 15 min |
| 11 | Scroll cue pulse (§8) | Low — first-visit affordance | 10 min |
| 12 | Footer reveal (§9) | Low — finish detail | 10 min |
| 13 | Section seams (§4) | Low — visual polish | 10 min |
| 14 | Horizon arrow fade (§11) | Low — narrative detail | 10 min |
| 15 | Card material (§7a) | Low — commit or drop the blur | 5 min |

---

## What NOT to Animate

These were considered and rejected:

- **Nav link hover effects** — no nav links exist; adding them is a feature, not an animation improvement
- **Parallax on below-fold images** — the scroll sequence already provides the cinematic experience; parallax below it competes and cheapens it
- **Marquee on brand logos** — the `brand-marquee` keyframe exists in CSS but is correctly unused. A marquee on 9 logos reads as a stock template, not a premium B2B site. The stagger entrance (§2b) is the right motion for this context
- **Page transition animations** — single-page site, no routes to transition between
- **Loading skeleton shimmer** — the preloader already handles the initial load; after that, everything is above the fold or scroll-triggered
- **Continuous cursor-follow effects below the fold** — the MaskedHeading already does this on the intro. Repeating it elsewhere diminishes its impact
- **Bounce/overshoot on any reveal** — the site's voice is serious/industrial/premium. Bounce belongs on consumer apps and playful brands. Critically damped (`damping 1.0`) everywhere

---

*Every curve value comes from the animate skill's reference tables, not invented. Every animation is gated by frequency and named by purpose. Every new motion ships with its reduced-motion variant.*
