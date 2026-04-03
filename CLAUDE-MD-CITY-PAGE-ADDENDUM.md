# DDAN — City Page Generation Rules (CLAUDE.md Addendum)

## APPEND THIS TO THE EXISTING CLAUDE.md IN THE PROJECT

---

## CITY PAGE GENERATION RULES — MANDATORY

These rules apply to every page generated under /cleaning/[city]/, /repair/[city]/, and /parts/[city]/.

### RULE 1: NO TEMPLATE SWAPPING
Every city page must be hardcoded HTML/Astro. Do NOT use a shared template that interpolates city names into generic paragraphs. Every intro paragraph, every problem description, every FAQ answer must be written specifically for that city using data from src/data/ddan_cities_data.json.

### RULE 2: THE SWAP TEST
Before committing any city page, mentally swap the city name with another city. If the content still makes sense without changes, the content is too generic. Rewrite it with local specifics.

### RULE 3: MANDATORY LOCAL DATA POINTS
Every city page MUST include at least 3 of these city-specific data points woven into the body copy (not just listed in a sidebar):
- Name of the local fire marshal's office
- Specific neighborhoods or commercial corridors
- Dominant roof types in that area
- Restaurant density or cuisine impact
- High-volume institutions (universities, military, tourist venues)
- Common equipment problems specific to that city
- Seasonal demand patterns

### RULE 4: COMPARISON-BASED GENERATION
When generating titles, metas, H1s, and body content for city pages, you MUST include what has already been written for prior cities. This prevents convergence on the same "obvious" phrasing.

Process:
1. Generate city page 1 — no comparison needed
2. Generate city page 2 — include city 1's title/meta/H1 in the prompt: "Write something structurally different from this"
3. Generate city page N — include all N-1 prior titles/metas/H1s

Track in running files:
```
/tmp/written-cleaning-titles.json
/tmp/written-cleaning-metas.json
/tmp/written-repair-titles.json
/tmp/written-repair-metas.json
/tmp/written-parts-titles.json
/tmp/written-parts-metas.json
/tmp/used-faq-questions.txt
```

### RULE 5: SEO ELEMENT DIVERSITY MINIMUMS

| Element | Cleaning (14 pages) | Repair (29 pages) | Parts (29 pages) |
|---------|--------------------|--------------------|-------------------|
| Title patterns | 5 min | 8 min | 8 min |
| Meta patterns | 7 min | 10 min | 10 min |
| H1 patterns | 4 min | 6 min | 6 min |
| FAQ questions | ALL unique | ALL unique | ALL unique |

"Different pattern" means structurally different — not just different words. "Hood Cleaning in Nashville" and "Hood Cleaning in Smyrna" are the SAME pattern. "Hood Cleaning in Nashville" and "Nashville's Trusted Hood Cleaning Experts" are DIFFERENT patterns.

### RULE 6: MANDATORY INTERLINKING
Every city page MUST include:
1. Cross-vertical links to same city (cleaning→repair→parts for that city)
2. Neighbor city links (2-3 closest cities in same vertical)
3. At least 2 contextual inline links to standalone service detail pages
4. Breadcrumb back to hub page
5. CTA to /contact/ or popup form

See SEO-INTERLINKING-MAP.md for the full neighbor map and link rules.

### RULE 7: SCHEMA ON EVERY PAGE
Every city page must include:
- LocalBusiness schema (with areaServed set to THIS city)
- Service schema (with serviceType matching the vertical)
- BreadcrumbList schema
- FAQPage schema wrapping the FAQ section
- Open Graph tags (title, description, image, url)
- Canonical URL

### RULE 8: CONTENT LENGTH MINIMUMS
- Tier 1 cities (Nashville, Clarksville, Murfreesboro, Franklin, Bowling Green, Hendersonville, Columbia, Shelbyville): 1,200+ words
- Tier 2 cities: 800+ words
- Tier 3 cities: 600+ words

### RULE 9: IMAGE HANDLING
- Each city page gets a hero background image (can be shared across cities for now)
- Alt text must include city name + service keyword
- Image filenames should be semantic: exhaust-fan-repair-nashville-tn.webp

### RULE 10: ONE COMMIT PER CITY
Commit each city page individually so we can track progress and revert if needed:
```
git commit -m "City page: /cleaning/nashville-tn/"
```

### RULE 11: QA AFTER EACH BATCH OF 5
After every 5 city pages:
1. Grep for duplicate titles: extract all titles, strip city names, count unique patterns
2. Grep for duplicate metas: same process
3. Check FAQ questions against /tmp/used-faq-questions.txt for duplicates
4. Spot-read 2 pages side by side — do they pass the swap test?
5. npm run build — zero errors

Report findings before continuing to next batch.

---

## CITY DATA FILE LOCATION
src/data/ddan_cities_data.json

## REFERENCE DOCUMENTS
- CITY-PAGE-CONTENT-BRIEF.md — what unique content each section needs
- SEO-INTERLINKING-MAP.md — every link destination and context
- CONTENT-UNIQUENESS-METHODOLOGY.md — the full methodology (agency guidelines)
- UNIQUE-CONTENT-REWRITE.md — execution template

---

## VERTICAL-SPECIFIC NOTES

### Cleaning Pages
- 14 cities only
- Primary keyword: "hood cleaning" / "kitchen hood cleaning"
- Every page must mention NFPA 96
- Cleaning frequency table is SHARED content (OK to reuse)
- Local compliance section is UNIQUE (different fire marshal per city)

### Repair Pages
- 29 cities
- Primary keyword: "exhaust fan repair" / "hood repair"
- FANS ARE 90% OF REPAIRS — lead with fan content
- Emergency repair messaging on every page
- Common failures section is UNIQUE per city (from JSON)

### Parts & Installation Pages
- 29 cities
- Primary keyword: "exhaust fan parts" / "restaurant hood parts"
- FANS FRONT AND CENTER — 60% of content weight
- Installation is the upsell, not the hook
- "Call for Free Fitting Consult" is the CTA, not "Buy Now"
- Two audiences: restaurant owners + other hood companies
- Product types are SHARED (OK to reuse) but intro and local context are UNIQUE

### Kentucky Cities
- Bowling Green: slug = bowling-green-ky, state = KY
- Fort Campbell: slug = fort-campbell-ky, state = KY
- All other cities: state = TN
- Schema areaServed must reflect correct state
