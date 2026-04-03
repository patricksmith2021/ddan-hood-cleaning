# DDAN Hood Cleaning — SEO Interlinking Map

## Purpose
This document defines exactly how every page on the site links to every other page. No random "see also" links. Every link is contextual, purposeful, and follows a defined pattern.

---

## LINK ARCHITECTURE OVERVIEW

```
                    HOMEPAGE (/)
                   /    |     \
                  /     |      \
           /cleaning/  /repair/  /parts/
           |           |          |
     14 city pages  29 city pages  29 city pages
           |           |          |
           +-----------+-----------+
           |  Cross-link within    |
           |  same city across     |
           |  all 3 verticals      |
           +-----------+-----------+
                  |
        5 standalone service
        detail pages (linked
        from relevant sections)
```

---

## LINK RULES BY PAGE TYPE

### 1. HOMEPAGE (/)

**Links OUT to:**
- /cleaning/ — from "Hood Cleaning" service card
- /repair/ — from "Hood Repair" service card
- /parts/ — from "Parts & Installation" service card
- /grease-containment/ — from service card
- /exhaust-fan-hinge-kit-installation/ — from service card
- /exhaust-fan-belt-motor-repair/ — from service card
- /access-panel-installation/ — from service card
- /restaurant-fire-suppression-systems/ — from service card
- /about-ddan-hood-cleaning-and-repair/ — from "Learn More About Us"
- /contact/ — from all CTA buttons
- /verified-reviews/ — from "See All Reviews"
- /gallery/ — from "See More" on gallery section

**Links IN from:**
- Every page (via header nav)
- Every page's breadcrumb

---

### 2. HUB PAGES (/cleaning/, /repair/, /parts/)

**Links OUT to:**

| From Hub | Links To | Context |
|----------|----------|---------|
| /cleaning/ | All 14 /cleaning/[city]/ pages | Service area city grid |
| /cleaning/ | /repair/ | "Need a repair? → Our repair services" |
| /cleaning/ | /parts/ | "Need parts? → Parts & installation" |
| /cleaning/ | /grease-containment/ | Inline mention in "What We Clean" |
| /cleaning/ | /exhaust-fan-hinge-kit-installation/ | Inline mention |
| /cleaning/ | /access-panel-installation/ | Inline mention |
| /cleaning/ | /nfpa-code-96-standards/ | "Learn about NFPA 96 requirements" |
| /cleaning/ | /contact/ | All CTAs |
| /repair/ | All 29 /repair/[city]/ pages | Service area city grid |
| /repair/ | /cleaning/ | "Prevent breakdowns → Regular cleaning" |
| /repair/ | /parts/ | "Need parts? → We stock common parts" |
| /repair/ | /exhaust-fan-belt-motor-repair/ | Inline link in belt/motor section |
| /repair/ | /exhaust-fan-hinge-kit-installation/ | Inline link |
| /repair/ | /restaurant-fire-suppression-systems/ | Inline link |
| /repair/ | /contact/ | All CTAs |
| /parts/ | All 29 /parts/[city]/ pages | Service area city grid |
| /parts/ | /repair/ | "Need it installed? We also do repairs" |
| /parts/ | /cleaning/ | "Keep your system running → Cleaning" |
| /parts/ | /exhaust-fan-hinge-kit-installation/ | Inline link in fan accessories |
| /parts/ | /exhaust-fan-belt-motor-repair/ | Inline link in replacement parts |
| /parts/ | /grease-containment/ | Inline link in containment section |
| /parts/ | /contact/ | All CTAs |

**Links IN from:**
- Homepage service cards
- All city pages in that vertical (breadcrumb + "back to hub" link)
- Cross-links from other hub pages
- Header nav

---

### 3. CITY PAGES (/cleaning/[city]/, /repair/[city]/, /parts/[city]/)

**This is where interlinking matters most.**

**Mandatory links OUT from every city page:**

| Link Type | Destination | Context/Anchor Text |
|-----------|-------------|-------------------|
| Breadcrumb | Hub page (/cleaning/, /repair/, /parts/) | Breadcrumb trail |
| Cross-vertical (same city) | Same city's other vertical pages | "Also in [City]: [Repair Services](/repair/[city]/) · [Parts & Installation](/parts/[city]/)" — placed in service area section |
| Neighboring cities (same vertical) | 2-3 closest cities in same vertical | "Also serving nearby [City2] and [City3]" — placed in service area section |
| Hub page | /cleaning/, /repair/, or /parts/ | "View all [service] locations" |
| Relevant detail pages | 1-3 standalone service pages | Contextual inline links (see below) |
| Contact | /contact/ | CTAs |
| NFPA 96 | /nfpa-code-96-standards/ | When compliance is mentioned |

**Contextual inline links (vary by content):**

For CLEANING city pages — link to:
- /grease-containment/ — when mentioning rooftop grease
- /access-panel-installation/ — when mentioning duct access
- /exhaust-fan-hinge-kit-installation/ — when mentioning fan cleaning access
- /nfpa-code-96-standards/ — when mentioning compliance

For REPAIR city pages — link to:
- /exhaust-fan-belt-motor-repair/ — when mentioning belt/motor issues
- /exhaust-fan-hinge-kit-installation/ — when mentioning fan access
- /restaurant-fire-suppression-systems/ — when mentioning fire safety
- /parts/ — when mentioning parts availability

For PARTS city pages — link to:
- /exhaust-fan-belt-motor-repair/ — when mentioning motor replacement
- /exhaust-fan-hinge-kit-installation/ — when mentioning hinge kits
- /grease-containment/ — when mentioning containment products
- /repair/ — when mentioning installation services

**CRITICAL: Cross-vertical same-city links**

Every /cleaning/nashville-tn/ page MUST link to /repair/nashville-tn/ and /parts/nashville-tn/. This creates a tight local silo. Use a consistent section format:

```html
<!-- Placed in service area section of every city page -->
<div class="cross-vertical-links">
  <h3>All DDAN Services in [City]</h3>
  <a href="/cleaning/[slug]/">Hood Cleaning in [City]</a>
  <a href="/repair/[slug]/">Exhaust Fan Repair in [City]</a>
  <a href="/parts/[slug]/">Parts & Installation in [City]</a>
</div>
```

---

### 4. NEIGHBORING CITY LINKS

Each city page links to 2-3 geographically close cities in the SAME vertical. This creates a natural geographic web.

**Cleaning cities — neighbor map (14 cities):**
```
Nashville → Hermitage, Madison, Brentwood
Murfreesboro → Smyrna, La Vergne
Antioch → La Vergne, Smyrna, Nashville
Hendersonville → Gallatin, Goodlettsville, Nashville
Spring Hill → Brentwood
Smyrna → Murfreesboro, La Vergne
Gallatin → Hendersonville, Lebanon
Lebanon → Mount Juliet, Gallatin
Goodlettsville → Hendersonville, Madison, Nashville
Brentwood → Nashville, Spring Hill
Mount Juliet → Lebanon, Hermitage, Nashville
Hermitage → Mount Juliet, Nashville, Madison
Madison → Hendersonville, Goodlettsville, Nashville
La Vergne → Murfreesboro, Smyrna, Antioch
```

**Repair/Parts cities — neighbor map (29 cities):**
```
Nashville → Hermitage, Madison, Brentwood, Antioch
Clarksville → Fort Campbell, Springfield
Murfreesboro → Smyrna, La Vergne, Shelbyville
Antioch → La Vergne, Smyrna, Nashville
Franklin → Brentwood, Thompsons Station, Nolensville
Bowling Green → (standalone — link to Nashville, Clarksville)
Hendersonville → Gallatin, Goodlettsville
Spring Hill → Thompsons Station, Columbia
Smyrna → Murfreesboro, La Vergne
Gallatin → Hendersonville, Lebanon, Portland
Lebanon → Mount Juliet, Gallatin, Hartsville
Brentwood → Nashville, Franklin, Nolensville
Columbia → Spring Hill, Lewisburg
Mount Juliet → Lebanon, Hermitage
Hermitage → Mount Juliet, Nashville
Madison → Hendersonville, Goodlettsville
La Vergne → Murfreesboro, Smyrna, Antioch
Shelbyville → Murfreesboro, Lewisburg
Springfield → Goodlettsville, White House, Portland
Goodlettsville → Madison, Hendersonville, Springfield
Dickson → Fairview, Nashville
Nolensville → Franklin, Brentwood, Murfreesboro
Portland → Gallatin, White House
White House → Springfield, Portland, Goodlettsville
Fort Campbell → Clarksville
Lewisburg → Shelbyville, Columbia
Hartsville → Lebanon, Gallatin
Fairview → Dickson, Nashville
Thompsons Station → Spring Hill, Franklin
```

---

### 5. STANDALONE SERVICE DETAIL PAGES

These 5 pages sit outside the vertical structure but get linked TO from relevant sections:

| Page | Linked FROM |
|------|------------|
| /grease-containment/ | Cleaning hub, cleaning city pages, parts hub, parts city pages |
| /exhaust-fan-hinge-kit-installation/ | All hubs, cleaning city pages, repair city pages |
| /exhaust-fan-belt-motor-repair/ | Repair hub, repair city pages, parts hub |
| /access-panel-installation/ | Cleaning hub, cleaning city pages |
| /restaurant-fire-suppression-systems/ | Repair hub, repair city pages, parts hub |

**Links OUT from each detail page:**
- Back to all 3 hub pages
- To /contact/
- To relevant city pages (top 3-5 by population)

---

### 6. CORE PAGES

| Page | Linked FROM | Links TO |
|------|------------|----------|
| /about-ddan-hood-cleaning-and-repair/ | Homepage, footer | Homepage, /cleaning/, /repair/, /parts/, /contact/ |
| /nfpa-code-96-standards/ | Cleaning pages (all), footer | /cleaning/, /repair/, /contact/ |
| /kitchen-exhaust-faq/ | Footer, relevant pages | /cleaning/, /repair/, /parts/, relevant detail pages |
| /gallery/ | Homepage, footer | /cleaning/, /repair/, /contact/ |
| /verified-reviews/ | Homepage, footer | /contact/ |
| /news/ | Footer | Various (contextual) |
| /contact/ | Every CTA | Homepage |

---

## ANCHOR TEXT RULES

1. **Never use "click here" or "learn more" as anchor text** — always descriptive
2. **Vary anchor text** — don't use the same anchor for the same destination across all pages
3. **Include keyword in anchor** when natural — "hood cleaning in Nashville" not just "Nashville"
4. **Cross-vertical links use service + city** — "exhaust fan repair in Murfreesboro"
5. **Max 3-4 internal links per section** — don't stuff

### Anchor Text Variation Pool

For hub page links:
- "our hood cleaning services"
- "commercial kitchen cleaning"
- "view all cleaning locations"
- "hood cleaning across Middle Tennessee"

For city page links:
- "hood cleaning in [City]"
- "[City] exhaust system service"
- "serving [City] restaurants"
- "our [City] team"

For detail page links:
- "hinge kit installation"
- "belt and motor repair services"
- "rooftop grease containment"
- "fire suppression systems"

---

## SCHEMA REQUIREMENTS PER PAGE TYPE

| Page Type | Schema Types Required |
|-----------|---------------------|
| Hub pages | LocalBusiness + Service + BreadcrumbList + FAQPage |
| City pages | LocalBusiness + Service + BreadcrumbList + FAQPage + areaServed |
| Detail pages | LocalBusiness + Service + BreadcrumbList + FAQPage |
| Core pages | LocalBusiness + BreadcrumbList |
| Homepage | LocalBusiness + Organization + BreadcrumbList |

**LocalBusiness schema on every page must include:**
- name: "DDAN Hood Cleaning and Repair"
- telephone: "(615) 881-6968"
- email: "service@ddanhoodcleaning.com"
- areaServed: varies by page
- url: canonical URL
- NEVER include street address publicly (schema only: 2914 Melbourne Terrace)

---

## BREADCRUMB STRUCTURE

```
Homepage: Home
Hub: Home > Hood Cleaning
City: Home > Hood Cleaning > Nashville, TN
Detail: Home > Services > Grease Containment
Core: Home > About
```

---

## IMPLEMENTATION CHECKLIST

For every city page built, verify:

- [ ] Cross-vertical links present (same city, all 3 verticals)
- [ ] Neighboring city links present (2-3 nearest, same vertical)
- [ ] Hub page link present (breadcrumb + body)
- [ ] At least 2 contextual inline links to detail pages
- [ ] CTA links to /contact/ or triggers popup form
- [ ] Anchor text is descriptive (no "click here")
- [ ] Anchor text varies (not identical to other city pages)
- [ ] Schema includes correct areaServed
- [ ] Breadcrumb is correct
- [ ] No orphan links (every destination page exists)
