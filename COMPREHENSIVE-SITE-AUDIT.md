# DDAN Hood Services — Comprehensive Site Audit
## Date: 2026-04-12
## Domain: ddanhoodservices.com
## Total pages: 123 (122 indexable + 404)

---

## EXECUTIVE SUMMARY

### Critical Issues (fix before any marketing spend) — 8 found

1. **`/installation/` hub page does not exist** — in sitemap AND linked from all 123 pages via nav. Sitewide 404.
2. **27 pages have ZERO schema markup** — including homepage, all hub pages, service pages, contact, FAQ, reviews.
3. **Console.log leaks PII to browser** — PopupForm.astro and contact.astro log full form data (name, phone, email) to console in production.
4. **Staging (pages.dev) has no noindex** — duplicate content risk from indexable staging deploys.
5. **All form inputs are 14px** — triggers iOS auto-zoom on every form interaction.
6. **10 form inputs missing labels/aria-labels** — screen readers cannot identify fields.
7. **61 duplicate FAQ questions** across city pages — worst: same question on 14 pages verbatim.
8. **2.7 MB template PNG ships in dist** — `images/ddan-service-page-template.png` is a reference file, not a site asset.

### Important Issues (fix within 1 week) — 10 found

9. **63 meta descriptions over 160 chars** — will be truncated in SERPs.
10. **53 city pages missing phone number in meta description.**
11. **H1 patterns not diverse** — cleaning (1 pattern, needs 4+), repair (1 pattern, needs 6+), parts (1 pattern, needs 6+).
12. **27 installation titles missing "DDAN" brand name.**
13. **10 title tags over 60 chars** — homepage worst at 86 chars.
14. **419 images missing width/height attributes** — CLS/Core Web Vitals risk.
15. **125 non-WebP images** — jpg/png files that should be converted.
16. **51 images over 200KB** — 4 over 1MB.
17. **113 occurrences of `615-881-6968` format** — should be standardized to `(615) 881-6968`.
18. **`/locations/` page missing from sitemap.**

### Minor Issues (fix when convenient) — 6 found

19. No global skip-to-content link.
20. Small orange text (#FF5E15) on dark backgrounds fails WCAG AA for normal text at 10+ locations.
21. No focus indicators on links/nav items (buttons and inputs have them).
22. 3 inline grids on contact page lack mobile collapse media queries.
23. 66 "Learn More" generic anchor text instances on repair city card hovers.
24. 5 meta descriptions under 120 chars (privacy, sitemap, thank-you, reviews, where-served).

### Passing Areas

- **Canonical URLs:** All 123 pages have correct canonical tags on ddanhoodservices.com. Zero old domain references.
- **Open Graph tags:** Present on all 123 pages with correct domain.
- **H1 count:** Every page has exactly 1 H1. Zero pages with 0 or 2+.
- **Zero broken images:** All image src references resolve correctly.
- **Zero missing alt text:** Every image has an alt attribute.
- **Email consistency:** All 349 email references are service@ddanhoodservices.com.
- **No exposed credentials:** All secrets properly in env vars.
- **No test recipients:** Production contacts restored.
- **Cross-vertical linking:** 100% complete across all city pages.
- **robots.txt:** Correct with sitemap directive and /api/ disallow.
- **Installation page titles:** Excellent structural diversity (all 27 unique patterns).
- **No placeholder text or banned AI phrases** in rendered content.

---

## DETAILED FINDINGS

### 1. Title Tags

**Total:** 122 | **Unique:** 122 (all unique) | **Duplicates:** 0

**Titles over 60 chars (10):**
| Chars | Page | Title |
|-------|------|-------|
| 86 | `/` | Commercial Hood Cleaning, Repair & Parts \| DDAN Hood Cleaning -- Middle Tennessee |
| 72 | `/cleaning/` | Commercial Kitchen Hood Cleaning Services \| DDAN Hood Cleaning Nashville |
| 71 | `/repair/` | Commercial Kitchen Exhaust Fan Repair \| 24/7 Emergency \| DDAN Nashville |
| 70 | `/grease-containment/` | Grease Containment Solutions for Restaurants & Commercial Kitchens |
| 70 | `/parts-installation/` | Rapid Restaurant Exhaust Fan Parts & Installation \| DDAN Nashville |
| 66 | `/installation/nashville-tn/` | Kitchen Exhaust Installation in Nashville, TN \| DDAN Hood Services |
| 63 | `/installation/nolensville-tn/` | Residential & Commercial Exhaust Installation \| Nolensville |
| 61 | `/about-ddan-hood-cleaning-and-repair/` | About DDAN Hood Cleaning and Repair \| Family-Owned Since 2006 |
| 61 | `/exhaust-fan-belt-motor-repair/` | Exhaust Fan Belt Motor Repair \| DDAN Hood Cleaning and Repair |
| 61 | `/locations/` | Service Areas \| Mid Tennessee \| DDAN Hood Cleaning and Repair |

**Pages missing "DDAN" in title (30):** All 27 installation city pages + grease-containment + how-your-kitchen-ventilation + nfpa-code-96-standards.

**Structural diversity:**
- Installation titles: Excellent (27 unique patterns)
- Cleaning/repair/parts titles: Good (5-7 patterns each)

---

### 2. Meta Descriptions

**Total:** 122 | **Missing:** 0 | **Duplicates:** 0

**Over 160 chars (63 pages):**
- All 14 cleaning city pages
- 16 of 27 installation city pages
- All 27 parts-installation city pages + hub
- 8 of 27 repair city pages
- Homepage (197 chars — worst), about page (174), contact (161)

**Under 120 chars (5 pages):** privacy-policy (57), sitemap (59), thank-you (86), verified-reviews (112), where-does-ddan-serve (110)

**City pages missing phone (615) 881-6968 (53):**
- Cleaning: 11 of 14 missing
- Repair: 21 of 27 missing
- Parts: 21 of 27 missing
- Installation: 0 of 27 missing (all have it)

---

### 3. Heading Hierarchy

**H1 count:** All 122 pages have exactly 1 H1. **PASS.**

**H1 pattern diversity — FAIL on 3 verticals:**
- Cleaning (14 pages): 1 pattern ("Commercial Kitchen Hood Cleaning in [City]") — needs 4+
- Repair (27 pages): 1 pattern ("Emergency Exhaust Fan Repair in [City]") — needs 6+
- Parts (27 pages): 1 pattern ("Rapid Exhaust Fan Parts and Installation in [City]") — needs 6+
- Installation (27 pages): 27 unique patterns — **PASS**

No empty headings. No H3-without-H2 issues.

---

### 4. Schema Markup

**Pages WITH schema:** 95 (all city pages across 4 verticals)
**Pages WITHOUT any schema:** 27

**Missing schema on:**
- Homepage (`/`)
- All 4 hub pages (`/cleaning/`, `/repair/`, `/parts-installation/`, `/installation/` — doesn't exist)
- All standalone service pages (grease-containment, hinge-kit, belt-motor, access-panel, fire-suppression)
- Core pages (about, contact, gallery, reviews, FAQ, NFPA, news, locations, privacy, sitemap, thank-you)
- All 5 LLM bot pages
- How-your-kitchen-ventilation-system-works

**City page schema (95 pages):** All have LocalBusiness + Service + BreadcrumbList + FAQPage. **PASS.**

Domain in schema: ddanhoodservices.com. **PASS.**
Email in schema: service@ddanhoodservices.com. **PASS.**
JSON-LD validity: All parseable. **PASS.**

---

### 5. Canonical URLs & Domain

**All 123 pages:** Canonical present, using ddanhoodservices.com. **PASS.**
**OG tags:** Present on all 123 pages, correct domain. **PASS.**
**Old domain references:** 0 (`ddanhoodcleaning` only appears in TikTok/Pinterest social handles — correct). **PASS.**

---

### 6. Sitemap & Robots

**Sitemap URLs:** 121 | **Actual pages:** 122

**Issues:**
- `/installation/` in sitemap but page DOES NOT EXIST (404)
- `/locations/` exists but NOT in sitemap
- thank-you/404/preview correctly excluded

**robots.txt:** Correct (Allow: /, Sitemap: ddanhoodservices.com, Disallow: /api/ and /preview/)

---

### 7. Internal Linking

**Broken links:** 1 — `/installation/` linked from all 123 pages (nav), page doesn't exist.
**Cross-vertical linking:** 100% complete. **PASS.**
**Pages with <3 links:** 0 (all pages have 200+ links via nav/footer). **PASS.**
**Generic anchor text:** 66 "Learn More" instances on repair city card hovers.

---

### 8. Image SEO

**Missing alt text:** 0. **PASS.**
**Empty alt:** 0. **PASS.**
**Broken images:** 0. **PASS.**
**Missing width/height:** 419 images (CLS risk on every page)
**Over 200KB:** 51 images (worst: ddan-service-page-template.png at 2.7MB)
**Non-WebP:** 125 images (jpg/png that should be converted)

---

### 9. Content Quality

**Placeholder text:** None. **PASS.**
**Banned AI phrases:** 1 instance in non-rendered data file. **PASS.**
**Phone format inconsistency:** 113 occurrences of `615-881-6968` vs 1,148 of `(615) 881-6968`.
**Email consistency:** All correct. **PASS.**
**Old domain:** None in rendered content. **PASS.**
**Duplicate FAQs:** 61 questions duplicated across city pages. Worst: same question on 14 pages.

---

### 10. Mobile & Performance

**Dist size:** 59 MB
**Heaviest HTML:** Parts-installation city pages at 209 KB each
**Heaviest image:** ddan-service-page-template.png at 2.7 MB (should not ship)
**Viewport meta:** Present. **PASS.**
**Form input font-size:** All inputs at 14px (`text-sm`) — triggers iOS auto-zoom. **FAIL.**
**Inline grids without mobile collapse:** 3 on contact page.

---

### 11. Accessibility

**HTML lang:** `en-US` present. **PASS.**
**Skip-to-content:** Missing from global layout. **FAIL.**
**Form labels:** 10 inputs missing labels/aria-labels in PopupForm + contact page.
**Color contrast:** #FF5E15 on dark at text-xs/text-sm fails AA at 10+ locations.
**Focus indicators:** Present on buttons/inputs, missing on links/nav.

---

### 12. Deployment & Security

**Exposed credentials:** None. **PASS.**
**.gitignore:** Covers .env files. **PASS.**
**Debug code:** 10 console.log/error statements in production (2 leak PII — form data logged to browser console).
**Test recipients:** None hardcoded. **PASS.**
**Staging noindex:** MISSING — pages.dev fully indexable. **FAIL.**

---

## RECOMMENDED FIX ORDER

1. **Create `/installation/` hub page** — fixes sitewide 404 + sitemap ghost entry
2. **Remove console.log PII leaks** — PopupForm.astro line 303, contact.astro line 384
3. **Add schema to 27 pages** — homepage is highest priority
4. **Add staging noindex** — prevent duplicate content indexing on pages.dev
5. **Fix form input font-size** — change text-sm to text-base (16px) on all inputs
6. **Add form labels/aria-labels** — 10 inputs across PopupForm + contact
7. **Trim 63 meta descriptions** to under 160 chars
8. **Add phone number to 53 city page metas**
9. **Diversify H1 patterns** — cleaning needs 4+, repair needs 6+, parts needs 6+
10. **Add "DDAN" to 27 installation page titles**
11. **Delete ddan-service-page-template.png** from public/images
12. **Add width/height to 419 images** (focus on shared components first — fixes ~285 at once)
13. **Convert 125 images to WebP**
14. **Compress 51 images over 200KB**
15. **Standardize phone format** — replace 113 instances of `615-881-6968`
16. **Deduplicate 61 FAQ questions** across city pages
17. **Add /locations/ to sitemap**
18. **Add skip-to-content link** to BaseLayout
19. **Add focus indicators** to links and nav items
20. **Fix contact page inline grids** for mobile collapse
