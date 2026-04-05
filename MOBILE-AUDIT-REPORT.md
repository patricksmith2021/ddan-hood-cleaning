# DDAN Mobile Audit Report
## Generated: April 5, 2026

---

### Summary

| Page | Perf | A11y | SEO | LCP | CLS | TBT |
|------|------|------|-----|-----|-----|-----|
| Homepage | 68 | 91 | 92 | 11.9s | 0.156 | 0ms |
| Cleaning Hub | 78 | 93 | 100 | 5.8s | 0.039 | 0ms |
| Repair City (Murfreesboro) | 78 | 89 | 100 | 5.8s | 0.03 | 0ms |
| Parts City (Hendersonville) | 78 | 93 | 100 | 5.7s | 0.002 | 0ms |
| Contact | 79 | 88 | 100 | 5.5s | 0.003 | 0ms |
| About | 80 | 93 | 100 | 5.3s | 0.001 | 0ms |
| FAQ | 79 | 93 | 100 | 5.5s | 0 | 0ms |
| Grease Containment | 76 | 93 | 100 | 6.6s | 0.01 | 0ms |
| Thank You | 76 | 93 | 61 | 6.8s | 0 | 0ms |

**Key:** Perf = Performance (0-100), A11y = Accessibility, LCP = Largest Contentful Paint (target <2.5s), CLS = Cumulative Layout Shift (target <0.1), TBT = Total Blocking Time (target <200ms)

---

### Critical Issues (fix immediately)

#### 1. LCP is extremely high on ALL pages (5-12 seconds)
- **Homepage: 11.9s** (target is 2.5s — nearly 5x too slow)
- All other pages: 5-7s (still 2-3x above target)
- **Root cause:** Hero background images are loaded via CSS `background-image` which the browser cannot discover until CSS is parsed. No `<link rel="preload">` for hero images.
- **Fix:** Add `<link rel="preload" as="image" href="/images/[hero].webp">` in the `<head>` for each page's hero image. Consider using `<img>` with `fetchpriority="high"` instead of CSS background for the hero.

#### 2. Render-blocking resources (~740ms delay on every page)
- Google Fonts CSS (`fonts.googleapis.com`) blocks rendering
- **Fix:** Add `font-display: swap` and/or use `<link rel="preconnect">` (already done) + `<link rel="preload">` for the font CSS. Or self-host the fonts.

#### 3. Homepage CLS is 0.156 (above 0.1 threshold)
- 2 layout shifts detected — likely from images loading without explicit width/height, or the scroll-reveal animation
- **Fix:** Add explicit `width` and `height` attributes to all `<img>` tags. Check if reveal animations cause shifts.

#### 4. Thank You page SEO score: 61
- `noindex` meta tag is correctly set (this is intentional for a post-conversion page)
- Low score is expected — the page IS blocked from indexing by design
- **No fix needed** — this is correct behavior

---

### Warnings (fix soon)

#### 5. Images without explicit `width` and `height` (causes CLS)
Found across all pages. Key offenders:
- `Footer.astro` — payment methods image
- `Header.astro` — logo images (mobile and desktop)
- `InlineCTA.astro` — truck image
- `TruckCTA.astro` — truck image
- `PopupForm.astro` — trust badge logos (Google, Facebook, Yelp)
- `LocationPage.astro` — service card images, truck
- All city pages — hero trust badges (Google/Facebook/Yelp logos)
- All city pages — service card images
- **Fix:** Add `width` and `height` attributes matching the image's natural dimensions

#### 6. Color contrast failures (A11y)
- "Background and foreground colors do not have a sufficient contrast ratio" — appears on EVERY page
- Likely the orange (#FF5E15) text on dark backgrounds or grey (#999) text on black
- **Fix:** Audit all text colors. #999 on #111 fails WCAG AA. Use #B3B3B3 minimum for body text on #111.

#### 7. iframe missing title (A11y)
- Google Maps embed `<iframe>` has no `title` attribute
- Appears on every page that includes the Maps embed (contact page, footer)
- **Fix:** Add `title="DDAN Hood Cleaning service area map"` to the Maps iframe

#### 8. Links without descriptive text
- Homepage: 10 links found with non-descriptive text
- Likely the social media icon links in the footer (using SVGs with no visible text)
- **Fix:** Ensure all icon-only links have `aria-label` attributes (most already do — check for any missing)

#### 9. Select elements without labels (Contact page)
- The service dropdown `<select>` doesn't have a `<label>` element associated
- **Fix:** Add `<label for="service" class="sr-only">Select Service</label>` or use `aria-label`

#### 10. Heading order not sequential
- Pages may jump from H1 to H3 without H2, or have other ordering issues
- **Fix:** Audit heading hierarchy on each page template

#### 11. Large network payloads (Homepage: 3,465 KiB)
- Homepage loads ~3.4MB total
- **Fix:** Lazy-load below-fold images, compress hero slideshow images further, consider removing unused images

#### 12. `whitespace-nowrap` on hero trust badges
- Found on all 14 cleaning city pages (and likely repair/parts too)
- These divs contain the Google/Facebook/Yelp star badges in the hero
- On narrow screens, `whitespace-nowrap` can cause horizontal overflow
- `overflow-x: hidden` on `<html>` prevents scrollbar but content may be clipped
- **Fix:** Remove `whitespace-nowrap` or wrap the badges in `overflow-hidden` containers

---

### Passing

- **TBT (Total Blocking Time): 0ms on all pages** — excellent, no JavaScript blocking
- **SEO: 100 on all pages except homepage (92) and thank-you (61, intentional)**
- **Accessibility: 88-93 across all pages** — good baseline, minor fixes needed
- **Viewport meta tag:** Correctly set in BaseLayout.astro
- **All grids have mobile collapse:** Every inline CSS grid has a matching `@media (max-width: 768px)` query
- **No fixed-width overflow issues:** No hard-coded pixel widths found
- **overflow-x: hidden on html:** Global protection against horizontal scroll
- **Content width:** No content-width violations detected

---

### CSS Audit Findings

| Check | Result |
|-------|--------|
| Grids missing mobile collapse | 0 — all grids have media queries |
| Fixed widths that overflow | 0 — none found |
| overflow-x protection | Yes — set on `<html>` |
| Viewport meta tag | Yes — correct |
| whitespace-nowrap risks | 10+ files in cleaning pages (hero badges) |
| Images without width/height | 20+ instances across components and pages |

---

### Recommended Fix Order (highest impact first)

1. **Preload hero images** — Add `<link rel="preload">` for each page's hero background image in BaseLayout or per-page. This alone could cut LCP by 3-5 seconds.
2. **Self-host Google Fonts** (or preload font CSS) — Eliminates 740ms render-blocking delay on every page.
3. **Add width/height to all `<img>` tags** — Eliminates CLS across the site.
4. **Fix color contrast** — Bump #999 text to #B3B3B3 for WCAG AA compliance.
5. **Add title to Google Maps iframe** — Quick accessibility win.
6. **Add labels to form select elements** — Quick accessibility win.
7. **Remove whitespace-nowrap from hero badges** — Prevents potential clipping on narrow screens.
8. **Compress homepage images further** — Reduce 3.4MB payload.
9. **Fix heading order** — Ensure H1 > H2 > H3 sequence on all pages.
10. **Add descriptive text/aria-labels to all icon-only links** — Verify footer social links.
