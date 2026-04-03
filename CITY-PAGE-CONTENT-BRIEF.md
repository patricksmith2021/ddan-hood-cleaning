# DDAN Hood Cleaning — City Page Content Brief

## Purpose
This document defines exactly what unique content every city page gets across all 3 verticals. Claude Code must follow this brief when generating pages. No two city pages should pass the "swap test" — if you swap city names between two pages and can't tell the difference, the content fails.

---

## THE UNIQUENESS STANDARD

### The Swap Test
Print any two pages of the same vertical (e.g., /cleaning/nashville-tn/ and /cleaning/smyrna-tn/). Cover the city names. Can you tell which city each page is about from the content alone?

If yes → ship it.
If no → rewrite until you can.

### What Makes Content Unique (not just city-name swaps)
- **Local fire marshal name and enforcement style** (from city JSON complianceAndAHJ)
- **Specific neighborhoods, corridors, landmarks** (from city JSON commercialInfrastructure)
- **Dominant roof types in that city** (TPO, EPDM, metal — affects grease containment advice)
- **Restaurant density and cuisine type** (hot chicken grease vs. fast-casual vs. institutional)
- **High-volume institutions** (universities, military bases, tourist venues)
- **Common problems specific to that city** (from city JSON industrySpecific.commonProblems)
- **Seasonal demand patterns** (CMA Fest, military deployment returns, college move-in)
- **Local competitors mentioned** (from city JSON)
- **Proof points / stories** (from city JSON contentSnippets.proofPoint)
- **City-specific FAQs** (from city JSON — already pre-written, 3 per city)

---

## CONTENT SOURCES PER CITY

Every city has this data in `src/data/ddan_cities_data.json`:

```
city.commercialInfrastructure.restaurantDensity     → Use in intro paragraph
city.commercialInfrastructure.buildingDensity        → Use in service area section
city.commercialInfrastructure.dominantCommercialRoofs → Use in grease containment section
city.commercialInfrastructure.highVolumeInstitutions  → Use in "who we serve" section
city.commercialInfrastructure.cuisineImpact           → Use in cleaning-specific content
city.complianceAndAHJ.fireMarshal                     → Use in compliance section
city.complianceAndAHJ.enforcementLevel                → Use in why-you-need-us section
city.complianceAndAHJ.fogProgram                      → Use in grease containment section
city.industrySpecific.commonProblems                   → CRITICAL — unique problem paragraphs
city.industrySpecific.seasonalDemand                   → Use in intro or CTA urgency
city.contentSnippets.heroParagraph                     → Starting point for hero (rewrite, don't copy)
city.contentSnippets.whyThisCityNeeds                  → Starting point for main content (rewrite)
city.contentSnippets.serviceAreaParagraph               → Starting point for service area section
city.contentSnippets.citySpecificFAQs                  → Use directly (already unique per city)
city.contentSnippets.proofPoint                        → Use as a social proof callout
```

---

## PAGE STRUCTURE BY VERTICAL

### CLEANING CITY PAGES (/cleaning/[city-slug]/)

**14 cities. Each page must have ALL of these unique elements:**

| Section | Content Source | Uniqueness Requirement |
|---------|--------------|----------------------|
| Hero H1 | See title diversity table | Structurally unique across 14 pages |
| Hero subtitle | city.contentSnippets.heroParagraph | Rewrite — don't copy verbatim from JSON |
| Intro (200-300 words) | city.contentSnippets.whyThisCityNeeds + commercialInfrastructure | Must mention 2+ local landmarks/neighborhoods. Must reference cuisine type or restaurant density. |
| What We Clean | SHARED content OK (same service everywhere) | Link to relevant detail pages |
| Local Compliance Section | complianceAndAHJ | Must name the specific fire marshal office. Must describe enforcement level in this city specifically. |
| Common Problems Here | industrySpecific.commonProblems | FULLY UNIQUE per city — this is where the real differentiation lives |
| Proof Point | contentSnippets.proofPoint | Unique story per city (already in JSON) |
| Service Area | serviceAreaParagraph + nearby cities | Cross-link to neighboring city cleaning pages |
| FAQ (3-4 questions) | citySpecificFAQs (from JSON) + 1 generic | At least 3 must be city-specific. No two cities share the same questions. |
| CTA | Shared design, unique urgency hook | Reference seasonal demand if available |

### REPAIR CITY PAGES (/repair/[city-slug]/)

**29 cities. Fans = 90% of repairs. Lead with fan repair.**

| Section | Content Source | Uniqueness Requirement |
|---------|--------------|----------------------|
| Hero H1 | See title diversity table | Structurally unique — use "exhaust fan repair" as primary keyword |
| Hero subtitle | Derived from city data | Reference the city's most common repair issue |
| Intro (200-300 words) | commonProblems + commercialInfrastructure | Must describe WHY this city's restaurants break down (runtime hours, cuisine type, roof conditions) |
| What We Repair | SHARED content OK — fans first, then secondary | Fan motor, belt, wheel, bearing, speed controller, then ductwork, hood body, fire suppression |
| Emergency Repair Callout | SHARED design, city-specific phone urgency | "Your [City] kitchen can't wait" |
| Common Failures in [City] | industrySpecific.commonProblems | FULLY UNIQUE — the JSON has specific failure modes per city |
| Brands We Service | SHARED | Loren Cook, CaptiveAire, Canarm, etc. |
| Service Area | serviceAreaParagraph | Cross-link to same city's /cleaning/ and /parts/ pages |
| FAQ (3-4 questions) | citySpecificFAQs + 1 repair-specific | Rotate repair questions — belt vs motor vs full replacement |
| CTA | Shared design, unique urgency | Reference seasonal demand |

### PARTS & INSTALLATION CITY PAGES (/parts/[city-slug]/)

**29 cities. Fans front and center. Installation is the upsell.**

| Section | Content Source | Uniqueness Requirement |
|---------|--------------|----------------------|
| Hero H1 | See title diversity table | Use "exhaust fan parts" or "hood parts & installation" as primary keyword |
| Hero subtitle | Derived from city data | "Same-day parts for [City]'s busiest kitchens" |
| Intro (200-300 words) | commercialInfrastructure + commonProblems | Why [City] restaurants need fast parts access. Reference restaurant density and common equipment failures. |
| Fan Parts (primary section) | SHARED product types | Upblast, downblast, inline, parts (motors, belts, wheels, bearings, curbs, hinge kits) |
| Other Parts | SHARED — MUA, filters, grease containment | Brief sections |
| Installation Upsell | SHARED design | "Discounted installation when you buy from us + warranty" |
| Who This Is For | SHARED — restaurant owners + other hood companies | |
| Service Area | serviceAreaParagraph | Cross-link to same city's /cleaning/ and /repair/ pages |
| FAQ (3-4 questions) | citySpecificFAQs + 1 parts-specific | Rotate: parts sourcing, installation timeline, warranty, emergency availability |
| CTA | Shared design, unique urgency | |

---

## TITLE TAG DIVERSITY REQUIREMENTS

### Rules
- Max 60 characters
- Must contain primary keyword + city name
- Structurally different patterns — not just word swaps
- Brand name at end: "| DDAN"

### Minimum Pattern Count

| Vertical | Total Pages | Min Distinct Title Patterns |
|----------|-------------|---------------------------|
| Cleaning | 14 | 5 |
| Repair | 29 | 8 |
| Parts | 29 | 8 |

### Example Title Patterns (Cleaning)
```
Pattern 1: "Hood Cleaning Services in [City], [ST] | DDAN"
Pattern 2: "[City] Commercial Kitchen Hood Cleaning | DDAN"
Pattern 3: "NFPA 96 Hood Cleaning for [City] Restaurants | DDAN"
Pattern 4: "[City]'s Trusted Hood Cleaning Experts | DDAN"
Pattern 5: "Restaurant Hood Cleaning in [City] | 24/7 | DDAN"
```

### Example Title Patterns (Repair)
```
Pattern 1: "Exhaust Fan Repair in [City], [ST] | DDAN"
Pattern 2: "[City] Commercial Kitchen Fan Repair | 24/7 | DDAN"
Pattern 3: "Emergency Exhaust Fan Repair [City] | DDAN"
Pattern 4: "[City] Restaurant Hood Repair Service | DDAN"
Pattern 5: "24/7 Kitchen Exhaust Repair in [City] | DDAN"
Pattern 6: "Commercial Fan Motor Repair [City], [ST] | DDAN"
Pattern 7: "[City] Hood & Exhaust System Repair | DDAN"
Pattern 8: "Fast Exhaust Fan Repair Near [City] | DDAN"
```

### Example Title Patterns (Parts)
```
Pattern 1: "Exhaust Fan Parts & Installation [City] | DDAN"
Pattern 2: "[City] Restaurant Hood Parts | Same-Day | DDAN"
Pattern 3: "Commercial Kitchen Parts in [City], [ST] | DDAN"
Pattern 4: "[City] Exhaust Fan Parts | Install & Warranty | DDAN"
Pattern 5: "Restaurant Exhaust Parts Near [City] | DDAN"
Pattern 6: "Hood Fan Parts & Installation [City] | DDAN"
Pattern 7: "[City] Commercial Kitchen Fan Parts | DDAN"
Pattern 8: "Same-Day Exhaust Parts in [City], [ST] | DDAN"
```

---

## META DESCRIPTION DIVERSITY REQUIREMENTS

### Rules
- 150-160 characters
- Must contain primary keyword + city name + call to action
- Every meta must reference one city-specific detail (not just city name)
- Structurally different — more patterns than titles

### Minimum Pattern Count

| Vertical | Min Distinct Meta Patterns |
|----------|--------------------------|
| Cleaning | 7 |
| Repair | 10 |
| Parts | 10 |

### Technique
Each meta should pull ONE specific data point from the city JSON and weave it in:
- Restaurant density: "Serving [City]'s 3,000+ commercial kitchens..."
- Fire marshal: "Stay compliant with [City Fire Marshal Office]..."
- Cuisine: "Hot chicken kitchens in [City] need quarterly cleanings..."
- Institution: "From [University] dining halls to [corridor] restaurants..."
- Problem: "Belt snaps on [corridor] are the #1 repair call..."

This makes each meta genuinely unique even if the sentence structure is similar.

---

## H1 DIVERSITY REQUIREMENTS

### Rules
- 40-70 characters
- ONE per page
- Contains primary keyword + city name
- Structurally diverse

### Minimum Pattern Count

| Vertical | Min Distinct H1 Patterns |
|----------|-------------------------|
| Cleaning | 4 |
| Repair | 6 |
| Parts | 6 |

---

## FAQ UNIQUENESS REQUIREMENTS

### Rules
- EVERY FAQ question must be unique across the entire site
- 3 city-specific FAQs come from the JSON (already unique)
- Add 1-2 service-generic FAQs per page, but rotate them — no two cities get the same generic FAQ
- Track all FAQ questions in a running list to prevent duplicates

### Generic FAQ Pool to Rotate (Cleaning)
1. How often should my hood be cleaned?
2. What does NFPA 96 require for hood cleaning?
3. Do you clean overnight to avoid disrupting business?
4. What's included in the compliance report?
5. Can you clean systems with no existing access panels?
6. Do you service food trucks?
7. What's the difference between monthly and quarterly cleaning?
8. How long does a typical hood cleaning take?
9. Do you handle grease trap cleaning too?
10. What happens if grease buildup causes a fire?

### Generic FAQ Pool to Rotate (Repair)
1. How fast can you respond to an emergency?
2. Do you carry common parts in stock?
3. Can you repair any brand of exhaust fan?
4. What if my fan needs full replacement instead of repair?
5. Do you provide warranties on repair work?
6. How do I know if my motor is failing?
7. What causes fan belts to snap?
8. Can you repair my make-up air unit?
9. Do you offer maintenance contracts?
10. What's the average cost of a fan motor replacement?

### Generic FAQ Pool to Rotate (Parts)
1. Do I need to know my exact fan model to order parts?
2. How fast can you get parts?
3. Do you install the parts you sell?
4. What warranty comes with purchased parts?
5. Can you source discontinued or hard-to-find parts?
6. Do you sell to other hood cleaning companies?
7. What's included in the free fitting consult?
8. Can you install a complete new exhaust system?
9. Is there a discount for buying parts and installation together?
10. Do you stock CaptiveAire / Loren Cook parts locally?

---

## CROSS-REFERENCE: CITY TIERS

Tier 1 cities get the most detailed content (300+ word intros, all available data points used).
Tier 2-3 cities get solid content (200+ word intros, key data points used).

From the JSON:
- **Tier 1:** Nashville, Clarksville, Murfreesboro, Franklin, Bowling Green, Hendersonville, Columbia, Shelbyville
- **Tier 2:** Antioch, Spring Hill, Smyrna, Gallatin, Lebanon, Brentwood, Mount Juliet, Hermitage, Madison, La Vergne, Springfield, Goodlettsville, Dickson
- **Tier 3:** Nolensville, Portland, White House, Fort Campbell, Lewisburg, Hartsville, Fairview, Thompsons Station
