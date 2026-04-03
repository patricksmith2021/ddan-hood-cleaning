# CLAUDE.md — DDAN Hood Cleaning and Repair (WordPress → Astro Migration)

**Last Updated:** March 30, 2026

---

## THIS IS A MIGRATION — NOT A GREENFIELD BUILD

You are rebuilding an existing WordPress/Elementor site as a custom Astro + Tailwind site. The goal is a **1:1 visual and content match** of the original, with our standard agency infrastructure underneath (schema, lead router, semantic HTML, performance).

**Do NOT redesign anything. Do NOT rewrite any copy. Do NOT reorganize page structure.** Match the original exactly, then we make improvements later.

---

## REQUIRED READING — DO THIS FIRST

Before writing ANY code, read these files and list what you learned:

### Source Material (your primary reference)
- `../../website reference/Downloaded Pages/` — 9 saved HTML pages with full CSS/JS/images
- `../../website reference/Page Screenshots/` — full-page screenshots of every page
- `../../ddan-raw-photos-bulk/` — all real photos from the business
- `../../DDAN logo files/` — logo files in multiple formats

### Agency Master Guidelines
Location: `../../Master Guidelines/`

**Read these skills (they auto-load but study them):**
- `skills/frontend-design/SKILL.md` — Anti-generic design principles
- `skills/seo/SKILL.md` — Schema, meta, titles, sitemaps
- `skills/content-formatting/SKILL.md` — Scannability, formatting
- `skills/forms/SKILL.md` — Form fields, spam prevention, mobile UX
- `skills/ux/SKILL.md` — CTA placement, mobile-first, speed
- `skills/images/SKILL.md` — Image optimization, naming, alt text
- `skills/semantic-html/SKILL.md` — Landmarks, ARIA, accessibility
- `skills/astro/SKILL.md` — Framework config, components, Tailwind
- `skills/copy-standards/SKILL.md` — Banned phrases, footer credit

### Agency Tools
- Image generation: `../../Agency Tools/generate-media.mjs`
- Real photos: `../../ddan-raw-photos-bulk/`
- Logo files: `../../DDAN logo files/`

---

## PROJECT OVERVIEW

DDAN Hood Cleaning and Repair is a commercial kitchen exhaust system company based in Mt. Juliet, TN. They provide hood cleaning, repair, installation, grease containment, parts sales, and fire suppression systems across Middle Tennessee. Established 2007, 18+ years experience, 24/7 emergency service, NFPA 96 compliant.

**Domain:** ddanhoodcleaning.com (set via SITE_URL env var — NEVER hardcoded)
**Staging URL:** ddan-hood-cleaning.pages.dev (default when SITE_URL is not set)
**Stack:** Astro 4.x + Tailwind CSS + Cloudflare Pages
**Lead Router:** Pages Function at `/functions/intake.js`

---

## GIT & DEPLOYMENT

- **Production branch: `main`** — NEVER use `master`
- Deployment: GitHub → Cloudflare Pages via Connect to Git (automatic on push to `main`)
- After every push: verify Cloudflare dashboard shows **Production** deploy (not Preview)
- NEVER hardcode the production domain — all references use `Astro.site` or `import.meta.env.SITE`

---

## BUSINESS FACTS — SINGLE SOURCE OF TRUTH

All business data lives in `src/data/business.json`. NEVER hardcode these values in components.

```json
{
  "name": "DDAN Hood Cleaning and Repair",
  "phone": "(615) 881-6968",
  "phoneRaw": "6158816968",
  "email": "service@ddanhoodcleaning.com",
  "address": {
    "street": "2914 Melbourne Terrace",
    "city": "Mt. Juliet",
    "state": "TN",
    "zip": "37122",
    "serviceArea": "Middle Tennessee",
    "suppressStreetAddress": true
  },
  "founded": 2007,
  "yearsExperience": "18+",
  "googleReviewCount": "42+",
  "googleReviewRating": "4.9",
  "googleReviewUrl": "https://maps.app.goo.gl/rACthq6ZGdbt1Zcg8",
  "googleMapsUrl": "https://maps.app.goo.gl/yjpmrjPSsJ3a9voQ7",
  "googleMapsEmbed": "<iframe src=\"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d412338.0839596535!2d-86.65677194999999!3d36.157032!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x82af1afeed7bbd2d%3A0xbd183359e04e6910!2sDDAN%20Hood%20Cleaning%20and%20Repair!5e0!3m2!1sen!2sus!4v1774910102054!5m2!1sen!2sus\" width=\"100%\" height=\"450\" style=\"border:0;\" allowfullscreen=\"\" loading=\"lazy\" referrerpolicy=\"no-referrer-when-downgrade\"></iframe>",
  "bilingual": true,
  "bilingualNote": "Se Habla Espanol",
  "credentials": ["Licensed", "Bonded", "Insured"],
  "emergencyService": true,
  "compliance": "NFPA 96",
  "identity": "Christian, family-owned",
  "descriptions": {
    "short": "DDAN Hood Cleaning and Repair provides complete commercial kitchen exhaust system services throughout Mt. Juliet, Nashville, and surrounding areas. From hood cleaning and duct maintenance to equipment repair, new installations, fire suppression systems, rooftop grease containment, and replacement parts — we cover the full lifecycle of your kitchen exhaust system. (615) 881-6968",
    "long": "DDAN Hood Cleaning and Repair provides complete commercial kitchen exhaust system services throughout Mt. Juliet, Nashville, and surrounding areas. From hood cleaning and duct maintenance to equipment repair, new installations, fire suppression systems, rooftop grease containment, and replacement parts — we cover the full lifecycle of your kitchen exhaust system.\n\nDDAN Hood Cleaning and Repair\nMt. Juliet, TN 37122\n(615) 881-6968\n\nWhy Choose Us:\n1. 24 Hour Services\n2. Every job is fully documented with photos for your records and compliance needs.\n3. We service, repair, and maintain all components — not just clean — giving you complete system care.\n\nBased in Mt. Juliet, we serve Nashville and surrounding areas including Hendersonville, Goodlettsville, Lebanon, La Vergne, and Smyrna."
  },
  "socialLinks": {
    "facebook": "https://www.facebook.com/ddaservices",
    "yelp": "https://www.yelp.com/biz/ddan-hood-cleaning-and-repair-mt-juliet",
    "linkedin": "https://www.linkedin.com/company/ddan-hood-cleaning-and-repair",
    "youtube": "https://www.youtube.com/@DDANHoodCleaning",
    "instagram": "https://www.instagram.com/ddanhoodservices",
    "tiktok": "https://tiktok.com/@ddanhoodcleaningservices",
    "twitter": "https://x.com/DDANHoodService",
    "pinterest": "https://pinterest.com/ddanhoodcleaningservices",
    "linktree": "https://linktr.ee/ddanhoodservices",
    "soundcloud": "https://soundcloud.com/ddan-hood-services",
    "bingMaps": "https://www.bing.com/maps/search?mkt=en-us&ss=id.ypid%3AYN873x3551296652658480784&cp=36.200001%7E-86.510002&lvl=16&style=r",
    "appleMaps": "https://maps.apple.com/place?auid=15941710736212101169",
    "google": "https://maps.app.goo.gl/TZ6x7WT4vnuGGQxG6",
    "yellowPages": "https://www.yellowpages.com/mount-juliet-tn/mip/ddan-hood-cleaning-repair-579079180",
    "bbb": "https://www.bbb.org/us/tn/mt-juliet/profile/commercial-cleaning-services/ddan-hood-cleaning-and-repair-0573-37380240"
  }
}
```

**CRITICAL: The street address (2914 Melbourne Terrace) is in business.json for schema markup ONLY. It must NEVER appear visibly on any page.** Use it in LocalBusiness schema `address` field. Display only "Mt. Juliet, TN 37122" on the visible site.

---

## VISUAL IDENTITY — EXTRACT FROM SOURCE

**All design values below are extracted from the live site's CSS. Do NOT guess or override.**

### Design DNA
Dark, industrial, compliance-driven. Black-and-orange color scheme. 80%+ dark backgrounds. Orange (#FF5E15) is the ONLY accent color — when everything is dark, the orange screams. Zero cool tones anywhere. No rounded corners, no pastel accents. Sharp and industrial.

### Design Tokens — Copy This File to `src/styles/design-tokens.css`

```css
:root {
  /* --- Colors --- */
  --color-primary:          #FF5E15;
  --color-primary-dark:     #E54F0D;
  --color-secondary:        #1A1A1A;
  --color-dark-base:        #111111;
  --color-light-base:       #FFFFFF;
  --color-body-text-dark:   #D4D4D4;
  --color-body-text-light:  #333333;
  --color-muted-text:       #999999;
  --color-surface-1:        #FFFFFF;
  --color-surface-2:        #1A1A1A;
  --color-surface-3:        #111111;
  --color-accent:           #FF5E15;
  --color-cta:              #FF5E15;
  --color-cta-secondary:    #000000;
  --color-border-accent:    #FF5E15;
  --color-border-subtle:    #333333;
  --color-star-rating:      #FFB800;
  --color-utility-bar:      #FF5E15;
  --color-hero-overlay:     rgba(255, 94, 21, 0.15);
  --color-hero-overlay-dark: rgba(17, 17, 17, 0.6);
  --color-check-icon:       #FF5E15;

  /* --- Typography --- */
  --font-display:           'Fira Sans Condensed', sans-serif;
  --font-heading:           'Poppins', sans-serif;
  --font-body:              'Heebo', sans-serif;

  --fs-hero-headline:       clamp(2rem, 5vw, 3rem);
  --fw-hero-headline:       700;
  --fs-section-headline:    clamp(1.5rem, 3vw, 2.25rem);
  --fw-section-headline:    600;
  --fs-sub-headline:        clamp(1.25rem, 2vw, 1.5rem);
  --fw-sub-headline:        600;
  --fs-body:                1rem;
  --fw-body:                400;
  --fs-nav:                 0.9375rem;
  --fw-nav:                 500;
  --fs-button:              0.9375rem;
  --fw-button:              600;
  --fs-utility:             0.8125rem;
  --fw-utility:             500;
  --fs-footer-heading:      1.125rem;
  --fw-footer-heading:      600;
  --fs-small:               0.875rem;

  --lh-body:                1.7;
  --lh-heading:             1.3;

  --tracking-normal:        0;
  --tracking-wide:          0.05em;
  --tracking-breadcrumb:    0.1em;

  /* --- Spacing --- */
  --max-content-width:      1200px;
  --section-padding-y:      4.5rem;
  --section-padding-y-sm:   3rem;
  --card-gap:               1.5rem;
  --component-padding:      1.5rem;
  --component-padding-lg:   2rem;
  --sidebar-width:          35%;
  --content-width:          65%;

  /* --- Border Radius --- */
  --radius-none:            0px;
  --radius-sm:              4px;
  --radius-md:              6px;
  --radius-lg:              8px;

  /* --- Shadows --- */
  --shadow-none:            none;
  --shadow-card:            none;
  /* Dark theme = no shadows needed. Borders and color blocks create hierarchy. */

  /* --- Buttons --- */
  --btn-padding:            0.75rem 1.75rem;
  --btn-radius:             4px;
  --btn-primary-bg:         var(--color-primary);
  --btn-primary-text:       #FFFFFF;
  --btn-primary-hover:      #E54F0D;
  --btn-secondary-bg:       #000000;
  --btn-secondary-text:     #FFFFFF;
  --btn-secondary-border:   none;
  --btn-ghost-bg:           transparent;
  --btn-ghost-text:         #FFFFFF;
  --btn-ghost-border:       2px solid #FFFFFF;
  --btn-icon:               icon-arrow-right;
  --btn-hover-effect:       shrink;

  /* --- Navigation --- */
  --nav-height:             60px;
  --nav-bg:                 #FFFFFF;
  --nav-text:               #333333;
  --nav-active:             #FF5E15;
  --utility-bar-height:     40px;
  --utility-bar-bg:         #FF5E15;
  --utility-bar-text:       #FFFFFF;
  --total-header-height:    100px;

  /* --- Hero --- */
  --hero-overlay:           linear-gradient(135deg, rgba(255,94,21,0.2) 0%, rgba(17,17,17,0.7) 70%);
  --hero-text:              #FFFFFF;
  --hero-accent-text:       #FF5E15;
  --hero-breadcrumb-text:   #FFFFFF;
  --hero-slideshow-speed:   3500ms;
  --hero-slide-transition:  fade 500ms;

  /* --- Forms (Sidebar) --- */
  --form-bg:                #1A1A1A;
  --form-heading-color:     #FF5E15;
  --form-field-bg:          #FFFFFF;
  --form-field-border:      1px solid #CCCCCC;
  --form-field-radius:      4px;
  --form-submit-bg:         #FF5E15;
  --form-submit-text:       #FFFFFF;
  --form-submit-radius:     4px;

  /* --- Service Page Layout --- */
  --service-content-bg:     #FFFFFF;
  --service-sidebar-bg:     #1A1A1A;
  --service-split:          65% 35%;

  /* --- Gallery --- */
  --gallery-columns:        4;
  --gallery-image-border:   3px solid #FF5E15;
  --gallery-gap:            12px;

  /* --- Footer --- */
  --footer-bg:              #111111;
  --footer-text:            #D4D4D4;
  --footer-heading:         #FF5E15;
  --footer-link:            #D4D4D4;
  --footer-link-hover:      #FF5E15;
  --footer-border-top:      none;

  /* --- Icons --- */
  --icon-check-color:       #FF5E15;
  --icon-pin-color:         #FF5E15;
  --icon-phone-color:       #FF5E15;

  /* --- Transitions --- */
  --transition-fast:        150ms ease;
  --transition-base:        250ms ease;
  --transition-slow:        400ms ease;

  /* --- Animations --- */
  --animation-scroll:       fadeInUp;
  --animation-hero-text:    typing 150ms per letter, 3000ms delay;
  --animation-btn-hover:    shrink;
}
```

### Typography Details

| Level | Font | Weight | Size | Color |
|-------|------|--------|------|-------|
| Hero headline | Fira Sans Condensed | 700-800 | ~40-48px | #FFFFFF (with #FF5E15 for key phrases) |
| Section headline | Poppins | 600-700 | ~28-36px | #FF5E15 on both dark and light |
| Sub-headline | Poppins | 600 | ~20-24px | #FFFFFF on dark / #333333 on light |
| Body text | Heebo | 400 | ~15-16px | #D4D4D4 on dark / #333333 on light |
| Nav links | Poppins | 500 | ~14-15px | #333333 (white nav bg) |
| Button text | Poppins | 600 | ~14-15px | #FFFFFF |
| Utility bar text | Poppins | 500 | ~13px | #FFFFFF on #FF5E15 |
| Form heading | Poppins | 700 | ~22-26px | #FF5E15 |
| Footer heading | Poppins | 600 | ~18-20px | #FF5E15 |
| Footer links | Heebo | 400 | ~14px | #D4D4D4 |
| Breadcrumb | Poppins | 400 | ~13px | #FFFFFF, uppercase, wide tracking |

### Button Styles

| | Primary | Secondary | Ghost |
|---|---|---|---|
| bg | #FF5E15 | #000000 | transparent |
| text | #FFFFFF | #FFFFFF | #FFFFFF |
| border | none | none | 2px solid #FFFFFF |
| radius | 4px | 4px | 4px |
| padding | 12px 28px | 12px 28px | 12px 28px |
| hover | Shrink animation + darken to #E54F0D | Shrink + opacity shift | Shrink |
| icon | Arrow-right prefix | — | — |

**Button hover "shrink" effect:** The button compresses slightly on hover (scale ~0.95). This is the Elementor shrink animation — replicate with `transform: scale(0.95)` on hover.

### Navigation

- **Utility bar:** #FF5E15 background, white text. Contains: "24HR Service" • "Cleaning & Repair" • "Est. 2007" badges + "SE HABLA ESPANOL!" bordered button + "Request Service Online" ghost CTA
- **Main nav:** #FFFFFF background. Logo left, nav links center, phone icon + "Call For Booking (615) 881-6968" right
- **Total header height:** ~100px (40px utility + 60px nav)
- **Active page:** Orange highlight/underline
- **Mobile:** Separate sticky element with hamburger + logo + phone icon

### Service Page Template (CRITICAL — every service page follows this)

1. Orange utility bar (sticky on mobile)
2. White nav bar with logo, links, phone
3. Hero banner — warm-tinted photo with diagonal gradient overlay (`linear-gradient(135deg, rgba(255,94,21,0.2) 0%, rgba(17,17,17,0.7) 70%)`), white headline, breadcrumb
4. Content area — **65/35 split:** left is white bg (#FFFFFF) with content, right is dark bg (#1A1A1A) sidebar with "Get Service Fast!" form + "Areas We Serve" city list
5. Inline CTA block — orange-bordered card with truck photo, phone number
6. More content sections — detailed service info with orange checkmark (✓) lists
7. Split text/image section — timeline, cost, availability info
8. Service area section — city icon cards in a grid
9. Full-width CTA band — dark bg with parallax photo, headline, phone, credentials
10. Dense footer

### Form (Sidebar — appears on every service page)

- Background: #1A1A1A
- Heading: "Get Service Fast!" — "Fast!" in orange
- Fields: white bg (#FFFFFF), 1px solid #CCCCCC border, 4px radius
- Field groups: "Your Info" (First, Last, Email, Phone) then "Business Info" (Name, Address, Service dropdown, multi-location radio)
- Submit: Full-width #FF5E15 button, "Request Callback ASAP"
- Below form: "Areas We Serve" list with pin icons and city names
- Position: Right sidebar, sticky-scroll on service pages

### Gallery

- 4-column masonry grid
- Orange borders (#FF5E15, 3px solid) on every image
- 12px gap
- Simple lightbox on click

### Footer

- Background: #111111
- Headings: #FF5E15 (Poppins 600)
- Links: #D4D4D4 → hover #FF5E15
- Logo, tagline, 10+ social platform icons
- Quick Links, Our Services, Contact Us columns
- BBB badge
- Payment method logos: Stripe, Visa, Amex, Venmo, Cash App, Discover, PayPal, Mastercard, Zelle
- Nashville Business Foundry credit at very bottom

### Trust & Social Proof

- Google/Facebook/Yelp logos with star ratings in hero area
- "Licensed, Bonded & Insured" in CTA bands
- "SE HABLA ESPANOL!" in utility bar (bordered button)
- BBB badge in footer
- Payment logos in footer
- WhatsApp chat widget (green bubble, bottom-right corner)

### Page-Specific Structure Notes

**Homepage:** Hero slideshow (4 images, 3.5s interval, fade transition) → Typing animated headline → Rating badges → "Keep Your Kitchen Running" split → "Why Choose DDAN" → Reviews carousel → 8-service card grid (2×4) → Areas We Serve → Before/After slider → Work gallery → Process steps → FAQ accordion → "Don't Wait" CTA with truck → Reviews → Dense footer

**About:** Hero → Split text/image (company history, Est. 2007, Christian family-run) → Second split with faith/values → "Is that you, ChatGPT?" AI bot link section → Footer

**NFPA 96:** Hero → Explainer → 6-card grid (Exhaust Hoods, Ductwork, Fans, Grease Containment, Fire Suppression, Cleaning & Maintenance) → "What Tennessee Kitchens Need to Know" 3-card → Split image/text "How DDAN Ensures Compliance" → CTA → Footer

**Contact:** Hero → 3 contact method cards (Phone, Email, Location) → Split map + form → Footer

**Gallery:** Hero → 4-column masonry grid with orange borders → Footer

**Reviews:** Hero → Google Reviews widget with "EXCELLENT" badge → Review cards → Footer

---

## ANIMATIONS & INTERACTIONS — MUST PRESERVE

These are the specific interactions that make the site feel polished. They are non-negotiable.

### 1. Scroll Reveal (every section)
- **Effect:** Sections fade in while sliding up slightly as they enter the viewport
- **Implementation:** Intersection Observer API. Each section starts at `opacity: 0; transform: translateY(30px)` and transitions to `opacity: 1; transform: translateY(0)` when it enters the viewport
- **Timing:** Staggered — elements within a section animate sequentially, not all at once
- **CSS transition:** ~0.6s ease-out

### 2. Truck "Drive In" CTA Section
- **Location:** The "Don't Wait Until You're Fined Or Shut Down!" CTA section
- **Effect:** The truck image slides in from the RIGHT side of the viewport, like it's driving into the frame
- **Trigger:** When the section scrolls into view
- **Implementation:** Truck starts at `transform: translateX(100%)` and animates to `translateX(0)`
- **Timing:** ~0.8-1s ease-out, triggers once
- **PRIORITY: This is the owner's favorite interaction. Get it right.**

### 3. Popup Form
- **Trigger:** "Request Service Online" buttons and "Get Service Today" buttons
- **Effect:** Modal overlay fades in, form pops in (scale from 0.9 to 1 + fade)
- **Background:** Black/near-black with orange accents
- **Fields:** First Name, Last Name, Phone, Business Name, Business Address, Service dropdown (Hood Cleaning, Filter Cleaning, Hood Repair, Grease Containment, New Installation, Looking for Parts, Other), Multiple locations? (Yes/No radio), Flat roof? (Yes/No radio)
- **Submit button:** "Request Callback ASAP" — full-width orange
- **Below form:** Google, Facebook, Yelp review badges with stars
- **Close:** Orange X button top-right

### 4. Before/After Comparison Slider
- **Location:** Homepage "See Our Work" section
- **Effect:** Two images stacked, with a draggable vertical divider. Drag left reveals more "after," drag right reveals more "before"
- **Implementation:** Use a lightweight comparison slider (CSS + JS, no heavy library). Reference the `onion.js` file from the source.
- **Image pairs from source:**
  - Pair 1: 484303716 (after) / 484228403 (before)
  - Pair 2: 494512892 (after) / 495006042 (before)
  - Pair 3: 3_After / 3_Before
  - Pair 4: 2_After / 2_Before

### 5. Card Hover Effects
- Service cards and other interactive cards change background color on hover
- Orange border appears/intensifies on hover
- Smooth transition (~0.3s)

### 6. Header Behavior
- Utility bar + nav bar both sticky
- Total height ~100px (40px utility + 60px nav)

### 7. Homepage Hero Slideshow
- **4 background images** rotating behind the hero text
- **Interval:** 3500ms between slides
- **Transition:** Fade (500ms crossfade)
- **Overlay:** Warm amber gradient (`linear-gradient(135deg, rgba(255,94,21,0.2) 0%, rgba(17,17,17,0.7) 70%)`)
- Source site uses Vegas.js for this — implement with CSS animations or a lightweight equivalent

### 8. Hero Typing Animation (Homepage)
- "Cleaning & Repair" text in the hero headline types out letter by letter
- ~150ms per letter
- ~3000ms delay before starting
- Implement with CSS `steps()` animation or JS interval

### 9. Button Shrink on Hover
- All CTA buttons compress slightly on hover: `transform: scale(0.95)`
- Combined with color darken (#FF5E15 → #E54F0D)
- Transition: 150ms ease

### 10. Parallax Background
- "Don't Wait" CTA section has subtle parallax on the background image
- Background moves slower than scroll (CSS `background-attachment: fixed` or JS parallax)

---

## TRUSTINDEX GOOGLE REVIEWS WIDGET

The site uses an embedded Trustindex widget to display Google reviews. **Keep this as an embed**, do not rebuild it as static content.

Extract the Trustindex embed code from the source HTML files. It appears twice on the homepage (this is a bug in the original — only include it once in the migration, in the reviews section near the bottom).

If the embed code references a Trustindex script URL, include it. The widget handles its own styling.

---

## URL STRUCTURE — EXACT MATCH

Preserve the exact WordPress URL structure. No changes.

```
/                                                    Homepage
/about-ddan-hood-cleaning-and-repair/                About
/kitchen-exhaust-services-overview/                  Services Overview
/kitchen-hood-cleaning-services/                     Hood Cleaning
/commercial-hood-repair/                             Hood Repair
/kitchen-exhaust-installation-services/              Kitchen Exhaust Installation
/installation-and-parts/                             Installation and Parts
/grease-containment/                                 Grease Containment
/restaurant-exhaust-fan-parts/                       Exhaust Fan Parts
/exhaust-fan-hinge-kit-installation/                 Hinge Kit Installation
/exhaust-fan-belt-motor-repair/                      Belt & Motor Repair
/access-panel-installation/                          Access Panel Installation
/restaurant-fire-suppression-systems/                Fire Suppression
/contact/                                            Contact
/verified-reviews/                                   Reviews
/gallery/                                            Gallery
/news/                                               News
/nfpa-code-96-standards/                             NFPA Standards
/kitchen-exhaust-faq/                                FAQ
/how-your-kitchen-ventilation-system-works/          How Your System Works
/who-is-ddan-hood-cleaning-and-repair/               LLM Bot Page
/what-services-does-ddan-provide/                    LLM Bot Page
/where-does-ddan-serve-clients/                      LLM Bot Page
/is-ddan-hood-cleaning-and-repair-nfpa-96-compliant/ LLM Bot Page
/how-does-ddan-hood-cleaning-and-repair-work/        LLM Bot Page
/locations/                                          Locations Hub
/locations/mt-juliet-tn/                             Location Page (FRESH BUILD)
/locations/nashville-tn/                             Location Page (FRESH BUILD)
/locations/goodlettsville-tn/                        Location Page (FRESH BUILD)
/locations/hendersonville-tn/                        Location Page (FRESH BUILD)
/locations/murfreesboro-tn/                          Location Page (FRESH BUILD)
/locations/franklin-tn/                              Location Page (FRESH BUILD)
/locations/smyrna-tn/                                Location Page (FRESH BUILD)
/locations/gallatin-tn/                              Location Page (FRESH BUILD)
/locations/bellevue-tn/                              Location Page (FRESH BUILD)
/locations/brentwood-tn/                             Location Page (FRESH BUILD)
/locations/la-vergne-tn/                             Location Page (FRESH BUILD)
/locations/lebanon-tn/                               Location Page (FRESH BUILD)
/thank-you/                                          Form Thank You
/privacy-policy/                                     Privacy Policy
/sitemap/                                            HTML Sitemap
```

**Total: ~41 pages** (26 migration + 12 fresh location pages + 3 utility)

**Note:** Location pages marked "FRESH BUILD" are built from scratch using our LOCATION_PAGE_FORMULA — they do not exist on the current WordPress site. Match the visual style of the rest of the site.

---

## SERVICES

| Service | Slug | Type |
|---------|------|------|
| Hood Cleaning | `kitchen-hood-cleaning-services` | Commercial |
| Hood Repair | `commercial-hood-repair` | Commercial |
| Kitchen Exhaust Installation | `kitchen-exhaust-installation-services` | Commercial |
| Installation and Parts | `installation-and-parts` | Commercial |
| Grease Containment | `grease-containment` | Commercial |
| Kitchen Exhaust Fan Parts | `restaurant-exhaust-fan-parts` | Commercial |
| Exhaust Fan Hinge Kit Installation | `exhaust-fan-hinge-kit-installation` | Commercial |
| Exhaust Fan Belt & Motor Repair | `exhaust-fan-belt-motor-repair` | Commercial |
| Access Panel Installation | `access-panel-installation` | Commercial |
| Restaurant Fire Suppression Systems | `restaurant-fire-suppression-systems` | Commercial |

---

## LOCATIONS (12 cities — FRESH BUILD pages)

| City | State | Slug |
|------|-------|------|
| Mt. Juliet | TN | mt-juliet-tn |
| Nashville | TN | nashville-tn |
| Goodlettsville | TN | goodlettsville-tn |
| Hendersonville | TN | hendersonville-tn |
| Murfreesboro | TN | murfreesboro-tn |
| Franklin | TN | franklin-tn |
| Smyrna | TN | smyrna-tn |
| Gallatin | TN | gallatin-tn |
| Bellevue | TN | bellevue-tn |
| Brentwood | TN | brentwood-tn |
| La Vergne | TN | la-vergne-tn |
| Lebanon | TN | lebanon-tn |

---

## KEYWORD REFERENCE (for Phase 3 location pages + Phase 5 SEO)

Use these to build discriminative phrase signatures for location pages and to verify keyword coverage during SEO hardening.

**Hood Cleaning:** hood cleaning, commercial kitchen hood cleaning, restaurant hood cleaning, exhaust hood cleaning service, vent hood cleaning service, NFPA 96 hood cleaning, certified hood cleaning company, kitchen exhaust cleaning services, grease hood cleaning, scheduled hood cleaning service, emergency hood cleaning, hood cleaning for health inspection compliance

**Hood Repair:** hood repair service, commercial kitchen hood repair, exhaust hood system repair, restaurant hood fan repair, grease hood system repair, NFPA 96 hood repair, kitchen hood motor repair, fire code compliant hood repair

**Installation:** kitchen ventilation system installation, commercial hood installation, restaurant exhaust system installation, NFPA 96 compliant ventilation install, commercial kitchen ventilation design, make-up air unit installation, duct and fan installation

**Grease Containment:** rooftop grease containment, grease containment systems for exhaust fans, grease box replacement, NFPA 96 rooftop grease solutions, grease trap for rooftop fan, grease pad replacement

**Parts:** commercial kitchen exhaust fan parts, restaurant exhaust parts, exhaust fan replacement parts, grease hood filter replacement, hood fan motor replacement, commercial fan belt parts, exhaust impeller replacement

**Hinge Kit:** exhaust fan hinge kit installation, rooftop exhaust fan hinge kit, NFPA 96 exhaust fan hinge kit, upblast fan hinge installation, restaurant fan cleaning access hinge

**Belt & Motor:** exhaust fan belt repair, exhaust fan motor repair, upblast fan motor replacement, belt-driven fan repair, kitchen exhaust motor service

**Access Panels:** grease duct access panel installation, NFPA 96 duct access panel install, kitchen exhaust access doors, fire-rated duct access doors

---

## SOURCE MATERIAL STRATEGY

### For pages WITH downloaded HTML (9 pages):
Read the HTML file in `../../website reference/Downloaded Pages/`. Extract:
- All text content (headlines, paragraphs, lists, CTAs)
- Section order and layout structure
- Images used (find matching files in the `_files/` subfolder or `../../ddan-raw-photos-bulk/`)
- Page-specific CSS from the corresponding `post-XXXX.css` file

### For pages WITHOUT downloaded HTML (~17 pages):
Fetch from the live site at `https://ddanhoodcleaning.com/[url]`. Extract the same elements. The live site will not change during this build.

### Downloaded Pages Mapping:
```
"Homepage - new.html"                  → /
"Hood Cleaning page.html"              → /kitchen-hood-cleaning-services/
"Hood repair page.html"                → /commercial-hood-repair/
"Hood installation page.html"          → /kitchen-exhaust-installation-services/
"Grease containment.html"             → /grease-containment/
"Hinge Kit Installation Page.html"     → /exhaust-fan-hinge-kit-installation/
"Fan and Belts Page.html"             → /exhaust-fan-belt-motor-repair/
"Access Panel Installation Page.html"  → /access-panel-installation/
"Exhaust Fan Parts.html"              → /restaurant-exhaust-fan-parts/
```

### For screenshots (visual verification):
Screenshots in `../../website reference/Page Screenshots/` are your visual truth. After building each page, compare your output against the screenshot. They show the exact layout, spacing, and visual treatment to match.

---

## FORM CONFIGURATION

The popup form submits to our lead router Pages Function.

```
Endpoint: /functions/intake
Method: POST
Headers:
  Content-Type: application/json

JSON Body:
{
  "source": "website",
  "firstName": "[First Name]",
  "lastName": "[Last Name]",
  "phone": "[Phone]",
  "businessName": "[Business Name]",
  "businessAddress": "[Business Address]",
  "service": "[selected service from dropdown]",
  "multipleLocations": "[yes/no]",
  "flatRoof": "[yes/no]",
  "page_url": "[window.location.href]",
  "website": "",              ← HONEYPOT (hidden field)
  "_loaded_at": [timestamp]   ← spam timing check
}
```

**Service dropdown options:** Hood Cleaning, Filter Cleaning, Hood Repair, Grease Containment, New Installation, Looking for Parts, Other

**Form appears in 3 places:**
1. Popup modal (triggered by "Request Service Online" and "Get Service Today" buttons)
2. Contact page (inline, not popup)
3. The popup also has the review badges (Google, Facebook, Yelp with stars) below the submit button

---

## IMAGE GENERATION

```
MANDATORY: Follow IMAGE-EXECUTION-CHECKLIST.md for any NEW images (location pages only).
Migration pages use the EXISTING images from the WordPress site.

For migration pages:
1. Extract images from downloaded HTML _files/ folders
2. Find matching originals in ../../ddan-raw-photos-bulk/
3. Optimize to WebP, hero <200KB, cards <100KB
4. Use semantic filenames matching the originals

For fresh location pages (Phase 2):
Script: ../../Agency Tools/generate-media.mjs
API Keys: ../../Agency Tools/.env

Commands:
- With reference: node "../../Agency Tools/generate-media.mjs" --model kontext --ref "[ref.jpg]" --prompt "[prompt]" --output [file].webp
- Without reference: node "../../Agency Tools/generate-media.mjs" --model ultra --prompt "[prompt]" --output [file].webp

Reference images: ../../ddan-raw-photos-bulk/ (100+ real job site photos available)
Always use --model kontext with these real photos as references.
Generate 3 options per image. Pick best. Optimize to WebP.
NEVER use CSS color backgrounds as image placeholders.
```

---

## FOOTER CREDIT — EXACT FORMAT

```html
Built with Love by <a href="https://nashvillebusinessfoundry.com" target="_blank" rel="noopener">Nashville Business Foundry</a>
```

ONLY "Nashville Business Foundry" is the link. "Built with Love by" is plain text. This is in ADDITION to the existing DDAN footer content — add it at the very bottom.

---

## SEO LAYER (added on top of migration)

Every page gets:
- Unique `<title>` tag (match original WordPress titles where possible)
- Unique `<meta name="description">` (match original where possible)
- Canonical URL via `Astro.site`
- ONE H1 per page (match original)
- Open Graph tags
- Schema markup:
  - Every page: LocalBusiness + BreadcrumbList
  - Service pages: + Service + FAQPage (where FAQ exists)
  - Location pages: + Service + FAQPage
- XML sitemap at /sitemap.xml (production domain)
- HTML sitemap at /sitemap/
- robots.txt allowing crawl of production domain
- Staging domain (`*.pages.dev`) gets `noindex` meta tag
- llms.txt file

---

## BUILD SEQUENCE

This is a migration build. The phases are different from a greenfield project.

### Phase 1: Foundation + Homepage
Scaffold Astro project, extract design system from source CSS, build homepage as 1:1 match. This establishes the visual language for everything else.

### Phase 2: All Remaining Migration Pages
Build all 25 remaining non-location pages from source material. Service pages, core pages, bot pages.

### Phase 3: Location Pages (FRESH BUILD)
Build 12 city pages from scratch using LOCATION_PAGE_FORMULA, matching the established design.

### Phase 4: Forms + Lead Router
Popup form, contact page form, lead router Pages Function, thank-you page.

### Phase 5: SEO + Polish + QA
Schema, sitemaps, meta tags, internal linking, image optimization, accessibility, performance, full QA.

See the stage prompts for full instructions per phase.

---

## END OF SESSION PROTOCOL

When I say "wrap up" or "save everything" or "end session":
1. Create a session log in /logs/
2. `git add -A`
3. `git commit -m "Session [date]: [summary]"`
4. `git push origin main`
→ Verify Cloudflare shows Production deploy.
Never skip this step.

---

## LESSONS LEARNED (from homepage build)

- astro check treats hints as errors — clean up ALL unused imports, add is:inline to external scripts
- Trustindex widgets are domain-locked — use static review cards on staging
- Before/after sliders: use clip-path:inset() approach in BeforeAfterSlider.astro component, never custom wrapper-width code
- font-display (Fira Sans Condensed) is hero-only — section headings use font-heading (Poppins)
- Mobile-first responsive: never use fixed rem/px without responsive overrides (text-xl md:text-3rem pattern)
- Use proven libraries for interactive components — don't reinvent sliders, lightboxes, carousels
- Preview page pattern: copy to /preview/, iterate there, merge when approved
- Black body background (#000000) prevents grey flash during scroll reveal animations
- Social icons: wireframe/outline style (transparent bg, orange border) looks more industrial than solid fills
- Footer: darker bg (#080808) with subtle grid texture overlay adds depth without being obvious
- Review count is 51 (updated from 42+), business is "#1 Rated Hood Company in Tennessee"

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
