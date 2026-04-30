# DDAN Hood Services — Session Resume Document
## Updated: April 15, 2026 | For: Next Chat Session Continuation

---

## WHO YOU ARE
- Patrick Smith, agency owner at Nashville Business Foundry
- Direct communicator, no fluff, wants to be told when he's wrong
- GitHub: patricksmith2021
- Desktop: C:\Users\patri\OneDrive\Desktop
- Project path: C:\Users\patri\OneDrive\Desktop\Agency\Projects\DDAN Hood Cleaning and Repair\ddan-hood-cleaning

## YOUR ROLE (Vibe Coach)
- Senior web dev strategist for Nashville Business Foundry
- Strategy, quality control, CLAUDE.md generation, guideline maintenance
- You do NOT write code — you generate prompts for Claude Code
- PowerShell syntax for all commands
- All prompts go into Claude Code terminal

---

## PROJECT IDENTITY
- **Client:** DDAN Hood Services (formerly DDAN Hood Cleaning and Repair)
- **Phone:** (615) 881-6968 | **Email:** service@ddanhoodservices.com
- **Address:** 2914 Melbourne Terrace, Mt. Juliet, TN 37122 (schema only — NEVER show publicly)
- **Founded:** 2007 | 24/7 Emergency | NFPA 96 Compliant | Licensed, Bonded, Insured
- **Identity:** Christian, family-owned | Bilingual (Se Habla Español)
- **Production Domain:** ddanhoodservices.com (LIVE on Cloudflare) ← MIGRATED from ddanhoodcleaning.com
- **Old Domain:** ddanhoodcleaning.com — 301 redirected to ddanhoodservices.com (entire domain)
- **GitHub:** patricksmith2021/ddan-hood-cleaning
- **Tech Stack:** Astro + Tailwind CSS + Cloudflare Pages + Cloudflare Pages Functions

---

## DOMAIN MIGRATION (Completed)
- Migrated from ddanhoodcleaning.com → ddanhoodservices.com
- Old domain 301 redirects to new domain (done externally)
- All codebase references updated: site config, email, schema, OG tags, canonical, sitemap, robots.txt, llms.txt
- Turnstile reconfigured for new domain
- Environment variables re-entered in new Cloudflare Pages project

---

## SITE ARCHITECTURE — 4 VERTICALS + PARTS STORE

### Vertical 1: Cleaning (14-city service area)
- Hub: /cleaning/
- City pages: /cleaning/[city-slug]/ (14 cities)
- Cities: Nashville, Murfreesboro, Antioch, Hendersonville, Spring Hill, Smyrna, Gallatin, Lebanon, Goodlettsville, Brentwood, Mount Juliet, Hermitage, Madison, La Vergne

### Vertical 2: Fan Repair (29-city service area) ← URL RESTRUCTURED
- Hub: /fan-repair/
- City pages: /fan-repair/[city-slug]/ (29 cities)
- **OLD URLs:** /repair/[city-slug]/ — 301 redirects in _redirects file
- All H1s must include "Fan Repair" with "Restaurant" or "Commercial Kitchen"
- All 14 cleaning cities PLUS: Clarksville, Franklin, Bowling Green KY, Columbia, Shelbyville, Springfield, Dickson, Nolensville, Portland, White House, Fort Campbell KY, Lewisburg, Hartsville, Fairview, Thompsons Station

### Vertical 3: Parts & Installation (29-city service area + product catalog)
- Hub: /parts-installation/
- City pages: /parts-installation/[city-slug]/ (29 cities)
- NOT e-commerce — lead-gen catalog. "Call for Free Fitting Consult to Verify Fit & Need"
- Fans are 90% of the business — front and center on every page
- 28 product cards across 7 categories (see PRODUCT CATALOG below)

### Vertical 4: Fan & Hood Installation (29-city service area) ← NEW VERTICAL, URL RESTRUCTURED
- Hub: /fan-hood-installation/
- City pages: /fan-hood-installation/[city-slug]/ (29 cities)
- **OLD URLs:** /installation/[city-slug]/ — 301 redirects in _redirects file
- All H1s must include "Fan and Hood Installation" with "Restaurant" or "Commercial Kitchen"
- 4 deep-dive sections per page: Exhaust Fan Installation, Complete System Installation, Make-Up Air Installation, Supporting Installations
- CTA: "Get a Free Installation Estimate" + phone
- Cross-links to /parts-installation/[city]/ for product details

### Kentucky Cities
- Bowling Green: slug = bowling-green-ky, state = KY
- Fort Campbell: slug = fort-campbell-ky, state = KY
- All others: TN

### Core Pages (keep as-is)
- Homepage: /
- About: /about-ddan-hood-cleaning-and-repair/
- Contact: /contact/
- Reviews: /verified-reviews/
- Gallery: /gallery/
- News: /news/
- NFPA Standards: /nfpa-code-96-standards/
- FAQ: /kitchen-exhaust-faq/
- How System Works: /how-your-kitchen-ventilation-system-works/
- Thank You: /thank-you/
- Privacy: /privacy-policy/
- Sitemap: /sitemap/
- Locations: /locations/
- 404: /404/

### Standalone Service Detail Pages (keep, no redirect)
- /grease-containment/
- /exhaust-fan-hinge-kit-installation/
- /exhaust-fan-belt-motor-repair/
- /access-panel-installation/
- /restaurant-fire-suppression-systems/

### LLM Bot Pages (keep)
- /who-is-ddan-hood-cleaning-and-repair/
- /what-services-does-ddan-provide/
- /where-does-ddan-serve-clients/
- /is-ddan-hood-cleaning-and-repair-nfpa-96-compliant/
- /how-does-ddan-hood-cleaning-and-repair-work/

### Redirects (in public/_redirects)
**Old domain service pages:**
- /kitchen-hood-cleaning-services/ → /cleaning/ (301)
- /commercial-hood-repair/ → /fan-repair/ (301)
- /kitchen-exhaust-installation-services/ → /parts-installation/ (301)
- /restaurant-exhaust-fan-parts/ → /parts-installation/ (301)
- /installation-and-parts/ → /parts-installation/ (301)
- /kitchen-exhaust-services-overview/ → / (301)

**Old location pages:**
- /locations/ → /cleaning/ (301)
- /locations/smyrna-tn/ → /cleaning/smyrna/ (301)
- /locations/murfreesboro-tn/ → /cleaning/murfreesboro/ (301)
- /locations/mt-juliet-tn/ → /cleaning/mount-juliet-tn/ (301)
- /locations/lebanon-tn/ → /cleaning/lebanon/ (301)
- /locations/la-vergne-tn/ → /cleaning/la-vergne/ (301)
- /locations/hendersonville-tn/ → /cleaning/hendersonville/ (301)
- /locations/goodlettsville-tn/ → /cleaning/goodlettsville/ (301)
- /locations/gallatin-tn/ → /cleaning/gallatin/ (301)
- /locations/brentwood-tn/ → /cleaning/brentwood/ (301)
- /locations/franklin-tn/ → /fan-repair/franklin/ (301)
- /locations/bellevue-tn/ → /cleaning/nashville/ (301)
- /locations/:city → /cleaning/ (301) — catch-all

**URL restructure redirects (60 total):**
- /repair/ → /fan-repair/ (301)
- /repair/[each-city]/ → /fan-repair/[each-city]/ (301) — 29 cities
- /installation/ → /fan-hood-installation/ (301)
- /installation/[each-city]/ → /fan-hood-installation/[each-city]/ (301) — 29 cities

**Other:**
- /parts/* → /parts-installation/:splat (301)
- /sitemap.xml → /sitemap-index.xml (301) — if astro sitemap was ever used

### Nav Structure
```
Home | About | NFPA Standards | Services ▼ | Service Areas ▼ | Contact

Services:
  Hood Cleaning → /cleaning/
  Fan Repair → /fan-repair/
  Parts & Installation → /parts-installation/
  Fan & Hood Installation → /fan-hood-installation/
  + 5 detail pages

Service Areas:
  Cleaning Areas (14 cities)
  Fan Repair Areas (29 cities)
  Parts & Installation Areas (29 cities)
  Fan & Hood Installation Areas (29 cities)
```

### Total: ~130 live pages + ~75 redirects

---

## PRODUCT CATALOG (28 products across 7 categories)

### Exhaust Fans (2)
1. Direct Drive Upblast Fans
2. Belt Drive Upblast Fans

### Fan Replacement Parts (9)
3. Motors (ODP and TEFC)
4. Fan Wheels and Blades
5. Belts and Drive Kits
6. Bearings
7. Roof Curbs
8. Hinge Kits
9. Speed Controllers and VFDs
10. Grease Cups and Fittings
11. Motor Covers and Guards

### Make-Up Air Units (3)
12. Gas-Fired Heated MUA
13. Untempered / Passive MUA
14. MUA Replacement Parts

### Filters & Baffles (3)
15. Stainless Steel Baffle Filters
16. Mesh Grease Filters
17. Charcoal / Carbon Filters

### Grease Containment (6)
18. Rooftop Grease Boxes
19. High-Volume Grease Boxes
20. Grease Containment Trays
21. Absorbent Pads and Pillows
22. Grease Duct Access Doors
23. Grease Gutters (360 Protection)

### Hood Systems & Accessories (5)
24. Complete Hood Systems
25. Fire Suppression Systems
26. Hood Lights
27. Exhaust Fan Interceptors
28. Splash Guards

---

## DESIGN SYSTEM (LOCKED)

```
Primary: #FF5E15 (orange) | Secondary: #1A1A1A | Body bg: #000000 (black)
Section alternating: #000000 and #111111
Cards: #1A1A1A bg, orange border, rounded-xl
Text on dark: #D4D4D4 (body), #FFFFFF (headings)
Stars: #FFB800
Fonts: Fira Sans Condensed (hero H1 only), Poppins (headings/UI), Heebo (body)
Buttons: #FF5E15 bg, hover translateY(-3px) scale(1.02) + orange glow shadow, active scale(0.97) snap-down 80ms
Secondary buttons: transparent bg, #FF5E15 border, hover fills orange + lifts
ALL backgrounds: BLACK — no grey, no white sections ever
Scroll reveal: content fades up on black background, background never changes
```

### Design Rules
- Hero sections: gradient + bg-image on OUTER section ONLY. No bg color on inner divs.
- All grids: use INLINE CSS `style="display: grid; grid-template-columns: repeat(N, 1fr); gap: 1.5rem;"` — Tailwind grid classes break in this codebase
- Mobile grid collapse: `@media (max-width: 768px) { [style*="grid-template-columns: repeat"] { grid-template-columns: 1fr !important; } }`
- Card images: 220px height, object-fit: cover, overflow hidden, border-radius top corners
- Card hover: translateY(-4px) with shadow, image scale(1.05)
- All transitions: 300ms ease (active state: 80ms)
- Before/after sliders: use img-comparison-slider library (CDN)
- Truck CTA: fadeInRight animation — must be fully visible on mobile (translate further left)
- Sticky nav: orange bar + black nav both stick on scroll, black nav shrinks (logo + phone hide, links stay centered)

---

## FORM SYSTEM

### Form Fields (current)
- First Name, Last Name
- Phone, Email
- Business Name
- Business Street Address, Business City (split — was single "Business Address")
- Service dropdown: Repair Services, Hood Cleaning, Installation Quote, Parts Order
- Parts dropdown (conditional — only shows when "Parts Order" selected, lists all 28 products grouped by category)
- Multiple Locations (Yes/No radio)
- Flat Roof (Yes/No radio, required)
- Comments (textarea)
- Turnstile widget (invisible)

### Notification Channels
1. **Team Email** — dark-mode optimized HTML, DDAN logo, orange header bar, all fields including conditional Part Needed row
2. **Customer Email** — confirmation (no "What Happens Next" section)
3. **Team SMS** — format:
```
🔥 New DDAN Inquiry!
Needs: [service][ — partNeeded if Parts Order]
Name: [name]
Address: [street], [city]
Phone: (XXX) XXX-XXXX
Flat Roof? [Yes/No]
[⚠️ Regarding Multiple Locations — only if Yes]

Contact this customer: (XXX) XXX-XXXX
```
4. **Customer SMS** — confirmation
5. **Google Sheets** — columns: Date | Time | Source | First Name | Last Name | Phone | Email | Business Name | Business Street Address | Business City | Service | Part Needed | Multiple Locations | Flat Roof | Comments | Page URL

### Lead Router Architecture
```
Website Forms → POST /api/intake → Pages Function
                                       │
                         ┌──────────────┼──────────────┐──────────────┐
                         ▼              ▼              ▼              ▼
                   SMTP2GO Email   Twilio SMS     Google Sheets   Customer SMS
                   (team + cust)   (team + cust)  (Website Leads)
```

### Environment Variables (Cloudflare Dashboard)
- SMTP2GO_API_KEY
- TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER
- GOOGLE_SHEET_ID, GOOGLE_SERVICE_ACCOUNT_JSON
- TURNSTILE_SECRET_KEY
- API_KEY

### Production Recipients
- Email: service@ddanhoodservices.com
- SMS: +16158816968

---

## COMPLETED WORK

### Original Build (Phases A-D) ✅
- All hub pages (4 verticals)
- 14 cleaning city pages
- 29 fan-repair city pages (formerly /repair/)
- 29 parts-installation city pages
- 29 fan-hood-installation city pages (NEW vertical)
- Content uniqueness rewrite across all city pages
- SEO hardening (sitemap, robots, schema on city pages, canonical, noindex staging)
- Lead router fully functional (all 4 channels)
- Forms wired with Turnstile

### Domain Migration ✅
- ddanhoodcleaning.com → ddanhoodservices.com
- All codebase references updated
- Old domain 301 redirects externally configured

### URL Restructure ✅ (or IN PROGRESS — verify)
- /repair/ → /fan-repair/ with 30 redirects
- /installation/ → /fan-hood-installation/ with 30 redirects
- All H1s updated with "Fan Repair" / "Fan and Hood Installation"
- Nav labels updated
- Schema, sitemap, cross-links all updated

### Design Improvements (this session)
- Sticky shrinking nav bar (orange stays, black shrinks)
- Button hover/active states upgraded (lift, glow, snap-down)
- Mobile nav overhaul (full-screen menu with city accordions)
- Thank You page redesign (animated checkmark, truck, resource cards)
- Contact page redesign (single hero, inline form, no Visit Us card)
- About page redesign (origin story, trust stats, values)
- Service page hero standardization (8 pages matching city page pattern)
- Truck CTA background swap (real DDAN work photo)
- Hero image standardization per vertical (cleaning, repair, parts, installation)
- Product image regeneration (28 products via FLUX kontext with reference photos)
- Form field updates (address split, service dropdown, conditional parts list)
- Email template dark mode redesign
- SMS format update

### Comprehensive Audit ✅
- 8 critical, 10 important, 6 minor issues identified
- Fix prompt written (5-batch master fix)
- Key issues: installation hub missing, PII console.logs, 27 pages missing schema, duplicate FAQs, image optimization needed

---

## KNOWN ISSUES / IN PROGRESS

- Repair pages: service card images are unconstrained/broken on all 29 pages (prompt written: PROMPT-REPAIR-CARDS-FIX.md)
- 5-batch audit fix prompt may not be fully executed yet — verify status
- Truck animation on mobile may still need fine-tuning
- 61 duplicate FAQ questions need deduplication
- 419 images missing width/height attributes
- 125 non-WebP images need conversion
- 51 images over 200KB need compression
- Form was throwing "Connection error" after field refactor — may need hotfix verification

---

## CRITICAL LESSONS LEARNED

### Design
- Hero sections: NO background color on inner divs. Only outer section gets gradient+image.
- Use INLINE CSS grids, not Tailwind grid classes (they break in this Astro setup)
- Card images MUST have height constraint + object-fit: cover — without this they expand to full intrinsic size
- Button interactions must be specified in CLAUDE.md from day one
- Sticky nav behavior must be defined in design system, not figured out later
- Mobile nav must be rebuilt AFTER all pages exist, not before

### Build Process
- One mega prompt touching 30+ files burns rate limits. Break into 3-5 file batches.
- Pre-assign title/H1 patterns to parallel agents to prevent convergence
- Nashville-as-template → replicate with unique content is the proven pattern
- "Design Lock" checkpoint between template approval and replication prevents inconsistency
- URL structure must be finalized BEFORE building pages — restructuring after is extremely disruptive

### SEO
- URLs must contain primary service keywords (e.g., "fan-repair" not just "repair")
- H1 patterns need 4-6+ variations per vertical to avoid keyword cannibalization
- FAQ questions must be globally unique — use shared tracker file
- Phone number format must be standardized: (615) 881-6968 everywhere (except tel: links)
- Meta descriptions: 150-160 chars, include phone number on city pages
- Schema on EVERY page, not just city pages
- OG tags in BaseLayout from the start
- Custom sitemap.xml endpoint — never use @astrojs/sitemap

### Lead Router
- Field name changes between form and function cause instant breakage
- Console.log in production leaks PII to browser — remove before launch
- Form inputs must be 16px+ to prevent iOS auto-zoom
- Always test form after any code change to form fields or function

### Domain Migration
- Environment variables do NOT carry over to new Cloudflare Pages project
- Turnstile must be reconfigured for new domain
- Every absolute URL in schema, OG tags, sitemap, robots.txt must be updated
- Redirect old domain at DNS level, not just in _redirects file

---

## KEY PROJECT FILES

### Project Configuration
- CLAUDE.md — build rules, design tokens, lessons learned
- CITY-PAGE-CONTENT-BRIEF.md — uniqueness requirements per city
- SEO-INTERLINKING-MAP.md — every link destination and context
- COMPREHENSIVE-SITE-AUDIT.md — full audit results from April 12

### Data
- src/data/ddan_cities_data.json — 29 cities with rich local data

### Components
- src/components/Header.astro — sticky nav, orange bar + black nav + mobile hamburger
- src/components/Footer.astro — 4-column industrial footer
- src/components/PopupForm.astro — lead capture form with Turnstile, conditional parts dropdown

### Layouts
- src/layouts/BaseLayout.astro — global layout with fonts, scroll reveal, meta, OG tags, skip-to-content

### Functions
- functions/api/intake.js — lead router (Turnstile + SMTP2GO + Twilio + Sheets)

### Images
- public/images/products/ — 28 product catalog photos (white bg, FLUX-generated)
- public/images/city/ — city-specific hero image copies per vertical
- public/images/homepage/ — DDAN work photos, truck, logos, OG image
- public/images/services/ — service-specific photos
- parts-store-reference-images-for-generation/ — VA-collected reference photos for FLUX

---

## CONVERSATION STYLE NOTES

- Patrick is direct. No fluff. No excessive affirmation.
- Tell him when he's wrong.
- Give him exact prompts in downloadable files — NOT inline in chat.
- When something breaks repeatedly, escalate the fix structurally instead of patching.
- Sales-first mindset for all page content.
- He gets frustrated when Claude Code ignores instructions — be explicit and specific.
- He prefers the preview page pattern — iterate safely, then merge.
- URL structure and keyword placement in URLs is a priority — finalize before building.
