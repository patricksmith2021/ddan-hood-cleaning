/**
 * Generate 12 city pages (6 repair + 6 parts-installation)
 * Cities: White House, Fort Campbell (KY), Lewisburg, Hartsville, Fairview, Thompsons Station
 * Based on Nashville templates
 */
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const ROOT = join(import.meta.dirname, '..');
const DATA = JSON.parse(readFileSync(join(ROOT, 'src/data/ddan_cities_data.json'), 'utf8'));

const CITIES = [
  {
    key: 'white-house',
    name: 'White House',
    state: 'TN',
    slug: 'white-house-tn',
    repairTitle: 'White House Exhaust Fan Repair | DDAN',
    partsTitle: 'White House Kitchen Parts | DDAN',
    neighbors: ['Springfield', 'Portland', 'Goodlettsville'],
    neighborSlugs: { Springfield: 'springfield-tn', Portland: 'portland-tn', Goodlettsville: 'goodlettsville-tn' },
  },
  {
    key: 'fort-campbell',
    name: 'Fort Campbell',
    state: 'KY',
    slug: 'fort-campbell-ky',
    repairTitle: 'Fort Campbell KY Exhaust Fan Repair | DDAN',
    partsTitle: 'Fort Campbell KY Kitchen Parts | DDAN',
    neighbors: ['Clarksville'],
    neighborSlugs: { Clarksville: 'clarksville-tn' },
  },
  {
    key: 'lewisburg',
    name: 'Lewisburg',
    state: 'TN',
    slug: 'lewisburg-tn',
    repairTitle: 'Lewisburg Exhaust Fan Repair | DDAN',
    partsTitle: 'Lewisburg Kitchen Parts | DDAN',
    neighbors: ['Shelbyville', 'Columbia'],
    neighborSlugs: { Shelbyville: 'shelbyville-tn', Columbia: 'columbia-tn' },
  },
  {
    key: 'hartsville',
    name: 'Hartsville',
    state: 'TN',
    slug: 'hartsville-tn',
    repairTitle: 'Hartsville Kitchen Exhaust Repair | DDAN',
    partsTitle: 'Hartsville Kitchen Parts | DDAN',
    neighbors: ['Lebanon', 'Gallatin'],
    neighborSlugs: { Lebanon: 'lebanon-tn', Gallatin: 'gallatin-tn' },
  },
  {
    key: 'fairview',
    name: 'Fairview',
    state: 'TN',
    slug: 'fairview-tn',
    repairTitle: 'Fairview Exhaust Fan Repair | DDAN',
    partsTitle: 'Fairview Kitchen Parts | DDAN',
    neighbors: ['Dickson', 'Nashville'],
    neighborSlugs: { Dickson: 'dickson-tn', Nashville: 'nashville-tn' },
  },
  {
    key: 'thompsons-station',
    name: 'Thompsons Station',
    state: 'TN',
    slug: 'thompsons-station-tn',
    repairTitle: 'Thompsons Station Exhaust Repair | DDAN',
    partsTitle: 'Thompsons Station Kitchen Parts | DDAN',
    neighbors: ['Spring Hill', 'Franklin'],
    neighborSlugs: { 'Spring Hill': 'spring-hill-tn', Franklin: 'franklin-tn' },
  },
];

function buildRepairPage(city, data) {
  const { name, state, slug, repairTitle, neighbors, neighborSlugs } = city;
  const cityLabel = `${name}, ${state}`;
  const cs = data.contentSnippets;
  const comp = data.complianceAndAHJ;
  const ind = data.industrySpecific;
  const infra = data.commercialInfrastructure;

  // Build FAQs from city data
  const cityFaqs = cs.citySpecificFAQs || [];
  // Add generic FAQs
  const faqs = [
    ...cityFaqs.map(f => ({ q: f.question, a: f.answer })),
    { q: `Do you repair all brands of commercial exhaust fans in ${name}?`, a: 'Yes. We service CaptiveAire, Loren Cook, Canarm, NAKS, EconAir, Greenheck, Accurex, PennBarry, Dayton, Fantech, and all other commercial kitchen exhaust fan brands.' },
  ];

  // Build neighbor links for repair
  const neighborLinks = neighbors.map(n => {
    const nSlug = neighborSlugs[n];
    return `              <a href="/repair/${nSlug}/" class="text-[#FF5E15] underline hover:text-white transition-all duration-300">${n}</a>`;
  }).join(',\n');

  // Build neighbor links for also-in
  const alsoInLinks = `
              <a href="/cleaning/${slug}/" class="text-[#FF5E15] underline hover:text-white transition-all duration-300">Hood Cleaning</a> &middot;
              <a href="/parts-installation/${slug}/" class="text-[#FF5E15] underline hover:text-white transition-all duration-300">Parts & Installation</a>`;

  // Break common problems into 2-3 paragraphs for the detail section
  const problems = ind.commonProblems || '';
  const problemSentences = problems.split('. ').filter(Boolean);
  const half = Math.ceil(problemSentences.length / 2);
  const problem1 = problemSentences.slice(0, half).join('. ') + (problemSentences.length > half ? '.' : '');
  const problem2 = problemSentences.slice(half).join('. ') + '.';

  const faqsJs = JSON.stringify(faqs, null, 2)
    .replace(/"/g, "'")
    .replace(/\\'/g, "\\'");

  return `---
import BaseLayout from '../../layouts/BaseLayout.astro';
import business from '../../data/business.json';

const faqs = ${JSON.stringify(faqs, null, 2)};

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "name": business.name,
      "telephone": business.phone,
      "email": business.email,
      "url": \`\${import.meta.env.SITE || 'https://ddan-hood-cleaning.pages.dev'}/repair/${slug}/\`,
      "address": { "@type": "PostalAddress", "streetAddress": business.address.street, "addressLocality": business.address.city, "addressRegion": business.address.state, "postalCode": business.address.zip, "addressCountry": "US" },
      "areaServed": { "@type": "City", "name": "${cityLabel}" },
      "priceRange": "$$"
    },
    { "@type": "Service", "name": "Commercial Kitchen Exhaust Fan Repair", "provider": { "@type": "LocalBusiness", "name": business.name }, "areaServed": { "@type": "City", "name": "${cityLabel}" }, "description": "24/7 emergency exhaust fan motor and belt repair for ${name} commercial kitchens. Same-day service from local parts stock." },
    { "@type": "BreadcrumbList", "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": \`\${import.meta.env.SITE || 'https://ddan-hood-cleaning.pages.dev'}/\` },
      { "@type": "ListItem", "position": 2, "name": "Hood Repair", "item": \`\${import.meta.env.SITE || 'https://ddan-hood-cleaning.pages.dev'}/repair/\` },
      { "@type": "ListItem", "position": 3, "name": "${cityLabel}" }
    ]},
    { "@type": "FAQPage", "mainEntity": faqs.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } })) }
  ]
};
---

<BaseLayout
  title="${repairTitle}"
  description="24/7 emergency exhaust fan repair in ${name}. Same-day motor and belt replacement from local stock. All brands. Call (615) 881-6968."
>
  <script is:inline type="application/ld+json" set:html={JSON.stringify(schema)} />

  <!-- SECTION 1: HERO -->
  <section class="min-h-[400px] md:min-h-[550px] flex items-center justify-center" style="background: linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.3) 100%), url('/images/hero/rooftop-exhaust-fan.jpg') center/cover no-repeat;">
    <div class="max-w-4xl mx-auto px-6 py-20 text-center">
      <p class="text-[#FF5E15] font-heading font-bold text-xs md:text-sm tracking-widest uppercase mb-4">DDAN HOOD CLEANING AND REPAIR</p>
      <h1 class="font-display text-white text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">Emergency Exhaust Fan Repair in <span class="text-[#FF5E15]">${cityLabel}</span></h1>
      <p class="text-gray-200 font-body text-lg md:text-xl max-w-2xl mx-auto mb-6">${cs.heroParagraph.split('.').slice(0, 2).join('.') + '.'}</p>
      <p class="text-white font-heading font-bold text-base md:text-lg mb-2">24/7 Emergency Dispatch — Same-Day Motor and Belt Replacement</p>
      <div class="w-20 h-1 bg-[#FF5E15] mx-auto mt-3 mb-8"></div>
      <div class="flex flex-col sm:flex-row justify-center gap-4 mb-8">
        <a href={\`tel:\${business.phoneRaw}\`} class="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#FF5E15] text-white font-heading font-bold text-lg rounded-lg hover:scale-95 transition-all duration-300">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 512 512"><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/></svg>
          CALL NOW: {business.phone}
        </a>
        <button type="button" class="popup-trigger inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-[#FF5E15] text-[#FF5E15] font-heading font-bold text-lg rounded-lg hover:bg-[#FF5E15] hover:text-white hover:scale-95 transition-all duration-300">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          REQUEST EMERGENCY REPAIR
        </button>
      </div>
      <div class="flex justify-center items-center gap-6 mt-8">
        <div class="flex flex-col items-center gap-1">
          <img src="/images/homepage/google-white-logo-1024x337.png" alt="Google" class="h-5 md:h-7 object-contain opacity-90" loading="lazy" />
          <div class="flex gap-0.5">{Array(5).fill(0).map(() => <svg class="w-3 h-3 md:w-4 md:h-4 text-[#FF5E15] fill-current" viewBox="0 0 1000 1000"><path d="M450 75L338 312 88 350C46 354 25 417 58 450L238 633 196 896C188 942 238 975 275 954L500 837 725 954C767 975 813 942 804 896L763 633 942 450C975 417 954 358 913 350L663 312 550 75C529 33 471 33 450 75Z"/></svg>)}</div>
        </div>
        <div class="flex flex-col items-center gap-1">
          <img src="/images/homepage/facebook-logo-white-full-transparent-1024x341.png" alt="Facebook" class="h-5 md:h-7 object-contain opacity-90" loading="lazy" />
          <div class="flex gap-0.5">{Array(5).fill(0).map(() => <svg class="w-3 h-3 md:w-4 md:h-4 text-[#FF5E15] fill-current" viewBox="0 0 1000 1000"><path d="M450 75L338 312 88 350C46 354 25 417 58 450L238 633 196 896C188 942 238 975 275 954L500 837 725 954C767 975 813 942 804 896L763 633 942 450C975 417 954 358 913 350L663 312 550 75C529 33 471 33 450 75Z"/></svg>)}</div>
        </div>
        <div class="flex flex-col items-center gap-1">
          <img src="/images/homepage/YELP_BIG.D-5a67c069-1024x392.png" alt="Yelp" class="h-5 md:h-7 object-contain opacity-90" loading="lazy" />
          <div class="flex gap-0.5">{Array(5).fill(0).map(() => <svg class="w-3 h-3 md:w-4 md:h-4 text-[#FF5E15] fill-current" viewBox="0 0 1000 1000"><path d="M450 75L338 312 88 350C46 354 25 417 58 450L238 633 196 896C188 942 238 975 275 954L500 837 725 954C767 975 813 942 804 896L763 633 942 450C975 417 954 358 913 350L663 312 550 75C529 33 471 33 450 75Z"/></svg>)}</div>
        </div>
      </div>
    </div>
  </section>

  <!-- BREADCRUMB STRIP -->
  <div class="bg-[#0A0A0A] py-2 px-5">
    <div class="max-w-[1200px] mx-auto">
      <nav class="flex items-center gap-2 text-sm font-heading text-gray-400" aria-label="Breadcrumb">
        <a href="/" class="hover:text-[#FF5E15] transition-colors">Home</a>
        <span class="text-[#FF5E15]">/</span>
        <a href="/repair/" class="hover:text-[#FF5E15] transition-colors">Hood Repair</a>
        <span class="text-[#FF5E15]">/</span>
        <span class="text-gray-300">${cityLabel}</span>
      </nav>
    </div>
  </div>

  <!-- SECTION 2: CONSULT BAR + JUMP-NAV -->
  <section class="bg-[#111111] py-12 reveal">
    <div class="max-w-[1200px] mx-auto px-5">
      <!-- Consult Bar -->
      <div class="bg-[#1A1A1A] border-2 border-[#FF5E15] rounded-xl px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-4 reveal-child">
        <p class="text-white font-heading font-semibold text-lg text-center md:text-left">Kitchen shut down? Our emergency team is on call right now.</p>
        <div class="text-center whitespace-nowrap">
          <p class="text-[#FF5E15] font-heading font-bold text-sm">SAME-DAY REPAIR</p>
          <p class="text-[#FF5E15] font-heading font-bold text-xs">Average response under 2 hours</p>
        </div>
        <div class="text-center md:text-right">
          <a href={\`tel:\${business.phoneRaw}\`} class="block text-white font-heading font-bold text-2xl hover:text-[#FF5E15] transition-colors">{business.phone}</a>
        </div>
      </div>
      <!-- Category Heading -->
      <h2 class="font-heading text-white font-bold text-2xl text-center mt-8 mb-6 reveal-child">Expert Repairs — Fans First</h2>
      <!-- Jump-Nav Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <a href="#fan-motors" class="bg-[#1A1A1A] border border-[#FF5E15]/40 hover:border-[#FF5E15] rounded-xl p-4 text-center hover:-translate-y-1 transition-all duration-300 reveal-child">
          <svg class="w-8 h-8 text-[#FF5E15] mx-auto mb-2" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 3v9l6 3"/></svg>
          <span class="text-white font-heading font-semibold text-sm">Fan Motors</span>
        </a>
        <a href="#belts" class="bg-[#1A1A1A] border border-[#FF5E15]/40 hover:border-[#FF5E15] rounded-xl p-4 text-center hover:-translate-y-1 transition-all duration-300 reveal-child">
          <svg class="w-8 h-8 text-[#FF5E15] mx-auto mb-2" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>
          <span class="text-white font-heading font-semibold text-sm">Belts and Drives</span>
        </a>
        <a href="#complete-fans" class="bg-[#1A1A1A] border border-[#FF5E15]/40 hover:border-[#FF5E15] rounded-xl p-4 text-center hover:-translate-y-1 transition-all duration-300 reveal-child">
          <svg class="w-8 h-8 text-[#FF5E15] mx-auto mb-2" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M12 3v9M12 12l6 3M12 12L6 9"/><circle cx="12" cy="12" r="9"/></svg>
          <span class="text-white font-heading font-semibold text-sm">Complete Fans</span>
        </a>
        <a href="#system-repairs" class="bg-[#1A1A1A] border border-[#FF5E15]/40 hover:border-[#FF5E15] rounded-xl p-4 text-center hover:-translate-y-1 transition-all duration-300 reveal-child">
          <svg class="w-8 h-8 text-[#FF5E15] mx-auto mb-2" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/></svg>
          <span class="text-white font-heading font-semibold text-sm">System Repairs</span>
        </a>
      </div>
    </div>
  </section>

  <!-- SECTION 3: WHAT YOU GET — 4 CARDS -->
  <section class="bg-black py-16 px-5 reveal">
    <div class="max-w-[1200px] mx-auto">
      <h2 class="font-heading text-[#FF5E15] font-bold text-2xl md:text-3xl text-center mb-10 reveal-child">${name}'s Fastest Commercial Kitchen Repair Service</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-[#1A1A1A] border border-[#FF5E15]/40 rounded-xl p-6 text-center hover:-translate-y-1 transition-all duration-300 reveal-child">
          <svg class="w-8 h-8 text-[#FF5E15] mx-auto mb-3" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          <h3 class="text-white font-heading font-semibold text-base mb-2">Same-Day Repair</h3>
          <p class="text-gray-300 text-sm">Common motors and belts on every truck. Most repairs completed in a single visit — no waiting for parts.</p>
        </div>
        <div class="bg-[#1A1A1A] border border-[#FF5E15]/40 rounded-xl p-6 text-center hover:-translate-y-1 transition-all duration-300 reveal-child">
          <svg class="w-8 h-8 text-[#FF5E15] mx-auto mb-3" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <h3 class="text-white font-heading font-semibold text-base mb-2">Accurate Diagnosis</h3>
          <p class="text-gray-300 text-sm">We find the root cause — not just the symptom. Amp draws, bearing checks, belt tension, and airflow testing.</p>
        </div>
        <div class="bg-[#1A1A1A] border border-[#FF5E15]/40 rounded-xl p-6 text-center hover:-translate-y-1 transition-all duration-300 reveal-child">
          <svg class="w-8 h-8 text-[#FF5E15] mx-auto mb-3" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
          <h3 class="text-white font-heading font-semibold text-base mb-2">Warrantied Work</h3>
          <p class="text-gray-300 text-sm">Every repair backed by our workmanship warranty. OEM-spec parts with manufacturer warranty included.</p>
        </div>
        <div class="bg-[#1A1A1A] border border-[#FF5E15]/40 rounded-xl p-6 text-center hover:-translate-y-1 transition-all duration-300 reveal-child">
          <svg class="w-8 h-8 text-[#FF5E15] mx-auto mb-3" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><circle cx="12" cy="13" r="3"/></svg>
          <h3 class="text-white font-heading font-semibold text-base mb-2">Photo Documentation</h3>
          <p class="text-gray-300 text-sm">Before-and-after photos of every repair for your compliance records and fire marshal inspections.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- SECTION 4: DDAN DIFFERENCE — TRUCK -->
  <section class="py-12 md:py-16 lg:py-20 overflow-hidden reveal" style="background: linear-gradient(to right, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.85) 60%, rgba(0,0,0,0.7) 100%), url('/images/homepage/gallery-11.jpg') center/cover no-repeat;">
    <div class="max-w-[1280px] mx-auto px-5">
      <div class="flex flex-col lg:flex-row items-center gap-10">
        <div class="lg:w-[55%]">
          <span class="inline-block bg-[#FF5E15] text-white text-xs font-heading font-bold uppercase tracking-wide rounded-full px-4 py-1 reveal-child">DDAN DIFFERENCE</span>
          <h2 class="text-white font-heading font-bold text-2xl md:text-3xl mt-4 reveal-child">${name}'s Most Reliable Exhaust Fan Repair Team</h2>
          <p class="text-gray-300 text-base md:text-lg mt-4 reveal-child">${cs.whyThisCityNeeds.split('.').slice(0, 2).join('.') + '.'}</p>
          <ul class="space-y-3 mt-6">
            <li class="flex items-start gap-3 text-[#D4D4D4] reveal-child">
              <svg class="w-5 h-5 text-[#FF5E15] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
              <span>Common motors, belts, and bearings stocked on every truck</span>
            </li>
            <li class="flex items-start gap-3 text-[#D4D4D4] reveal-child">
              <svg class="w-5 h-5 text-[#FF5E15] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
              <span>24/7 emergency dispatch — nights, weekends, and holidays</span>
            </li>
            <li class="flex items-start gap-3 text-[#D4D4D4] reveal-child">
              <svg class="w-5 h-5 text-[#FF5E15] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
              <span>Before-and-after photo documentation for every repair</span>
            </li>
            <li class="flex items-start gap-3 text-[#D4D4D4] reveal-child">
              <svg class="w-5 h-5 text-[#FF5E15] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
              <span>Upfront pricing after diagnosis — no surprises, no hidden fees</span>
            </li>
          </ul>
          <button type="button" class="popup-trigger inline-flex items-center gap-2 px-8 py-4 bg-[#FF5E15] text-white font-heading font-bold rounded-lg hover:scale-95 transition-all duration-300 mt-6 reveal-child">
            Request Emergency Repair
          </button>
          <p class="text-gray-400 text-sm mt-3 reveal-child">
            Or call now: <a href={\`tel:\${business.phoneRaw}\`} class="text-[#FF5E15] hover:underline">{business.phone}</a>
          </p>
        </div>
        <div class="lg:w-[45%] flex justify-end">
          <img src="/images/truck.png" alt="DDAN Hood Cleaning and Repair truck" class="truck-drive-in max-w-full" loading="lazy" />
        </div>
      </div>
    </div>
  </section>

  <!-- SECTION 5: FAN REPAIRS — 6 CARDS -->
  <section id="fan-motors" class="bg-[#111111] py-16 px-5 reveal">
    <div class="max-w-[1200px] mx-auto">
      <h2 class="font-heading text-[#FF5E15] font-bold text-2xl md:text-3xl text-center mb-4 reveal-child">Exhaust Fan Repairs for ${name} Restaurants</h2>
      <div class="bg-[#FF5E15] text-white text-center text-sm md:text-base font-heading font-bold uppercase tracking-wide py-3 px-4 rounded-lg mb-10 reveal-child">${name.toUpperCase()}'S #1 EXHAUST FAN REPAIR SERVICE — ALL BRANDS, ALL SIZES</div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="belts">
        <!-- Card 1: Fan Motor Replacement -->
        <a href="/exhaust-fan-belt-motor-repair/" class="group block bg-[#1A1A1A] border border-[#FF5E15]/40 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-white hover:shadow-xl hover:shadow-orange-500/10 reveal-child">
          <div class="relative aspect-video bg-[#0A0A0A] rounded-t-xl overflow-hidden">
            <img src="/images/services/hood-repair-hero.jpg" alt="Fan motor replacement ${name} ${state} - DDAN Hood Repair" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
            <div class="absolute inset-0 flex flex-col items-center justify-end p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" style="background: linear-gradient(to top, rgba(255,94,21,0.95) 0%, rgba(255,94,21,0.8) 40%, rgba(0,0,0,0.6) 100%);">
              <svg class="w-8 h-8 text-white mb-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
              <span class="text-white font-heading font-bold text-lg">Learn More</span>
              <span class="text-white/80 text-xs uppercase tracking-widest mt-2">Belt & Motor Repair</span>
            </div>
          </div>
          <div class="p-5">
            <h3 class="text-[#FF5E15] font-heading font-semibold text-lg">Fan Motor Replacement</h3>
            <p class="text-[#D4D4D4] text-sm mt-2 font-body">Single-phase, 3-phase, and ECM motors matched to OEM specs. We stock common sizes for same-day replacement on high-volume ${name} restaurants.</p>
          </div>
        </a>
        <!-- Card 2: Fan Belt Replacement -->
        <a href="/exhaust-fan-belt-motor-repair/" class="group block bg-[#1A1A1A] border border-[#FF5E15]/40 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-white hover:shadow-xl hover:shadow-orange-500/10 reveal-child">
          <div class="relative aspect-video bg-[#0A0A0A] rounded-t-xl overflow-hidden">
            <img src="/images/services/commercial-hood-repair-split.jpeg" alt="Fan belt replacement ${name} ${state} - DDAN Hood Repair" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
            <div class="absolute inset-0 flex flex-col items-center justify-end p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" style="background: linear-gradient(to top, rgba(255,94,21,0.95) 0%, rgba(255,94,21,0.8) 40%, rgba(0,0,0,0.6) 100%);">
              <svg class="w-8 h-8 text-white mb-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
              <span class="text-white font-heading font-bold text-lg">Learn More</span>
              <span class="text-white/80 text-xs uppercase tracking-widest mt-2">Belt & Motor Repair</span>
            </div>
          </div>
          <div class="p-5">
            <h3 class="text-[#FF5E15] font-heading font-semibold text-lg">Fan Belt Replacement</h3>
            <p class="text-[#D4D4D4] text-sm mt-2 font-body">Worn, cracked, and snapped belts replaced on-site with proper tensioning. ${name} kitchens running extended hours need more frequent belt service.</p>
          </div>
        </a>
        <!-- Card 3: Fan Wheel and Blade Repair -->
        <div class="group bg-[#1A1A1A] border border-[#FF5E15]/40 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-white hover:shadow-xl hover:shadow-orange-500/10 reveal-child">
          <div class="relative aspect-video bg-[#0A0A0A] rounded-t-xl overflow-hidden">
            <img src="/images/services/kitchen-exhaust-installation.jpg" alt="Fan wheel and blade repair ${name} ${state} - DDAN Hood Repair" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
            <div class="absolute inset-0 flex flex-col items-center justify-end p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" style="background: linear-gradient(to top, rgba(255,94,21,0.95) 0%, rgba(255,94,21,0.8) 40%, rgba(0,0,0,0.6) 100%);">
              <svg class="w-8 h-8 text-white mb-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
              <span class="text-white font-heading font-bold text-lg">Call for Service</span>
              <span class="text-white text-sm mt-1">{business.phone}</span>
              <span class="text-white/80 text-xs uppercase tracking-widest mt-2">Tap to Call</span>
            </div>
          </div>
          <div class="p-5">
            <h3 class="text-[#FF5E15] font-heading font-semibold text-lg">Fan Wheel and Blade Repair</h3>
            <p class="text-[#D4D4D4] text-sm mt-2 font-body">Grease-caked impellers cleaned, rebalanced, or replaced. Uneven grease buildup from high-volume fryers creates vibration that destroys bearings in weeks.</p>
          </div>
        </div>
        <!-- Card 4: Bearing Replacement -->
        <div class="group bg-[#1A1A1A] border border-[#FF5E15]/40 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-white hover:shadow-xl hover:shadow-orange-500/10 reveal-child">
          <div class="relative aspect-video bg-[#0A0A0A] rounded-t-xl overflow-hidden">
            <img src="/images/services/hood-cleaning-hero.jpg" alt="Bearing replacement ${name} ${state} - DDAN Hood Repair" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
            <div class="absolute inset-0 flex flex-col items-center justify-end p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" style="background: linear-gradient(to top, rgba(255,94,21,0.95) 0%, rgba(255,94,21,0.8) 40%, rgba(0,0,0,0.6) 100%);">
              <svg class="w-8 h-8 text-white mb-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
              <span class="text-white font-heading font-bold text-lg">Call for Service</span>
              <span class="text-white text-sm mt-1">{business.phone}</span>
              <span class="text-white/80 text-xs uppercase tracking-widest mt-2">Tap to Call</span>
            </div>
          </div>
          <div class="p-5">
            <h3 class="text-[#FF5E15] font-heading font-semibold text-lg">Bearing Replacement</h3>
            <p class="text-[#D4D4D4] text-sm mt-2 font-body">Shaft bearings, pillow blocks, and sealed units. If your fan is grinding or squealing, bearing failure is imminent — call before the motor seizes completely.</p>
          </div>
        </div>
        <!-- Card 5: Complete Fan Replacement -->
        <a id="complete-fans" href="/parts-installation/${slug}/" class="group block bg-[#1A1A1A] border border-[#FF5E15]/40 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-white hover:shadow-xl hover:shadow-orange-500/10 reveal-child">
          <div class="relative aspect-video bg-[#0A0A0A] rounded-t-xl overflow-hidden">
            <img src="/images/hero/rooftop-exhaust-fan.jpg" alt="Complete fan replacement ${name} ${state} - DDAN Hood Repair" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
            <div class="absolute inset-0 flex flex-col items-center justify-end p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" style="background: linear-gradient(to top, rgba(255,94,21,0.95) 0%, rgba(255,94,21,0.8) 40%, rgba(0,0,0,0.6) 100%);">
              <svg class="w-8 h-8 text-white mb-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
              <span class="text-white font-heading font-bold text-lg">Learn More</span>
              <span class="text-white/80 text-xs uppercase tracking-widest mt-2">Parts & Installation</span>
            </div>
          </div>
          <div class="p-5">
            <h3 class="text-[#FF5E15] font-heading font-semibold text-lg">Complete Fan Replacement</h3>
            <p class="text-[#D4D4D4] text-sm mt-2 font-body">When repair costs exceed replacement value, we install new units sized and configured for your system. All major brands — CaptiveAire, Greenheck, Loren Cook, and more.</p>
          </div>
        </a>
        <!-- Card 6: Speed Controller and VFD Repair -->
        <div class="group bg-[#1A1A1A] border border-[#FF5E15]/40 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-white hover:shadow-xl hover:shadow-orange-500/10 reveal-child">
          <div class="relative aspect-video bg-[#0A0A0A] rounded-t-xl overflow-hidden">
            <img src="/images/services/rooftop-hinge-kit.jpg" alt="Speed controller and VFD repair ${name} ${state} - DDAN Hood Repair" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
            <div class="absolute inset-0 flex flex-col items-center justify-end p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" style="background: linear-gradient(to top, rgba(255,94,21,0.95) 0%, rgba(255,94,21,0.8) 40%, rgba(0,0,0,0.6) 100%);">
              <svg class="w-8 h-8 text-white mb-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
              <span class="text-white font-heading font-bold text-lg">Call for Service</span>
              <span class="text-white text-sm mt-1">{business.phone}</span>
              <span class="text-white/80 text-xs uppercase tracking-widest mt-2">Tap to Call</span>
            </div>
          </div>
          <div class="p-5">
            <h3 class="text-[#FF5E15] font-heading font-semibold text-lg">Speed Controller and VFD Repair</h3>
            <p class="text-[#D4D4D4] text-sm mt-2 font-body">Variable frequency drives that control fan speed. Faulty VFDs cause erratic fan operation, excessive energy use, and premature motor damage.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- SECTION 6: BEYOND FANS -->
  <section id="system-repairs" class="bg-black py-16 px-5 reveal">
    <div class="max-w-[1200px] mx-auto">
      <h2 class="font-heading text-[#FF5E15] font-bold text-2xl md:text-3xl text-center mb-10 reveal-child">Complete Exhaust System Repair in ${name}</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <a href="/access-panel-installation/" class="bg-[#1A1A1A] border border-[#333] hover:border-[#FF5E15] rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 reveal-child">
          <h3 class="font-heading text-white text-lg font-semibold mb-2">Ductwork Repair</h3>
          <p class="text-[#D4D4D4] font-body text-sm leading-relaxed">Disconnected joints, failed seams, and damaged sections repaired or replaced. Includes fire-rated access panel installation for future maintenance access.</p>
        </a>
        <div class="bg-[#1A1A1A] border border-[#333] hover:border-[#FF5E15] rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 reveal-child">
          <h3 class="font-heading text-white text-lg font-semibold mb-2">Hood Body Repair</h3>
          <p class="text-[#D4D4D4] font-body text-sm leading-relaxed">Structural damage to canopies, grease troughs, filters, and mounting hardware. We repair or replace damaged hood components to restore full system function.</p>
        </div>
        <a href="/restaurant-fire-suppression-systems/" class="bg-[#1A1A1A] border border-[#333] hover:border-[#FF5E15] rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 reveal-child">
          <h3 class="font-heading text-white text-lg font-semibold mb-2">Fire Suppression Repair</h3>
          <p class="text-[#D4D4D4] font-body text-sm leading-relaxed">Nozzle replacement, fusible link installation, tank recharge, and full system testing. Required for fire marshal compliance in every ${name} commercial kitchen.</p>
        </a>
        <div class="bg-[#1A1A1A] border border-[#333] hover:border-[#FF5E15] rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 reveal-child">
          <h3 class="font-heading text-white text-lg font-semibold mb-2">Make-Up Air Repair</h3>
          <p class="text-[#D4D4D4] font-body text-sm leading-relaxed">Make-up air units that supply replacement air to balance exhaust. When MUA fails, doors slam, gas appliances backdraft, and exhaust fans lose efficiency.</p>
        </div>
        <div class="bg-[#1A1A1A] border border-[#333] hover:border-[#FF5E15] rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 reveal-child">
          <h3 class="font-heading text-white text-lg font-semibold mb-2">Electrical Troubleshooting</h3>
          <p class="text-[#D4D4D4] font-body text-sm leading-relaxed">Tripped breakers, faulty contactors, damaged wiring, and control panel issues. We trace the entire electrical path from panel to fan to find the root cause.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- SECTION 7: BRANDS STRIP -->
  <section class="bg-[#111111] py-8 px-5 reveal">
    <div class="max-w-[1200px] mx-auto text-center">
      <p class="text-[#D4D4D4] font-heading text-base reveal-child">
        We repair all brands: <span class="text-white font-semibold">CaptiveAire</span> &middot; <span class="text-white font-semibold">Loren Cook</span> &middot; <span class="text-white font-semibold">Canarm</span> &middot; <span class="text-white font-semibold">NAKS</span> &middot; <span class="text-white font-semibold">EconAir</span> &middot; <span class="text-white font-semibold">Greenheck</span> &middot; <span class="text-white font-semibold">Accurex</span> &middot; <span class="text-white font-semibold">PennBarry</span> &middot; <span class="text-white font-semibold">Dayton</span> &middot; <span class="text-white font-semibold">Fantech</span>
      </p>
    </div>
  </section>

  <!-- SECTION 8: TRUST BANNER -->
  <section class="bg-[#111111] py-12 px-5 reveal" style="border-top: 2px solid rgba(255,94,21,0.3); border-bottom: 2px solid rgba(255,94,21,0.3);">
    <div class="max-w-3xl mx-auto text-center">
      <h2 class="text-[#FF5E15] font-heading font-bold text-2xl md:text-3xl mb-8 reveal-child">The #1 Rated Commercial Hood Company in Tennessee</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-[#1A1A1A] border border-[#FF5E15] rounded-xl p-6 text-center reveal-child">
          <span class="text-[#FF5E15] font-heading font-bold text-4xl">51+</span>
          <div class="text-[#FFB800] text-lg mt-1">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
          <span class="text-white text-sm">Google Reviews</span>
        </div>
        <div class="bg-[#1A1A1A] border border-[#FF5E15] rounded-xl p-6 text-center reveal-child">
          <span class="text-[#FF5E15] font-heading font-bold text-4xl">5.0</span>
          <div class="text-[#FFB800] text-lg mt-1">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
          <span class="text-white text-sm">Star Average</span>
        </div>
        <div class="bg-[#1A1A1A] border border-[#FF5E15] rounded-xl p-6 text-center reveal-child">
          <span class="text-[#FF5E15] font-heading font-bold text-4xl">20+</span>
          <div class="text-[#FFB800] text-lg mt-1">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
          <span class="text-white text-sm">Facebook Reviews</span>
        </div>
      </div>
      <p class="text-gray-300 text-sm mt-6 reveal-child">Trusted by restaurants, churches, schools, and institutions across Middle Tennessee since 2007.</p>
    </div>
  </section>

  <!-- SECTION 9: WHO WE REPAIR FOR -->
  <section class="bg-black py-16 px-5 reveal">
    <div class="max-w-[1280px] mx-auto">
      <h2 class="font-heading text-[#FF5E15] text-2xl md:text-3xl font-bold mb-10 text-center reveal-child">Who We Repair For in ${name}</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-[#1A1A1A] border border-[#333] rounded-2xl p-8 reveal-child">
          <div class="w-14 h-14 bg-[#FF5E15]/10 rounded-xl flex items-center justify-center mb-5">
            <svg class="w-7 h-7 text-[#FF5E15]" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
          </div>
          <h3 class="font-heading text-white text-xl font-bold mb-3">Restaurants and Commercial Kitchens</h3>
          <p class="text-[#D4D4D4] mb-4">${infra.cuisineImpact} Every exhaust fan fails eventually — we fix them all.</p>
          <a href={\`tel:\${business.phoneRaw}\`} class="text-[#FF5E15] font-heading font-semibold hover:underline">{business.phone} &rarr;</a>
        </div>
        <div class="bg-[#1A1A1A] border border-[#333] rounded-2xl p-8 reveal-child">
          <div class="w-14 h-14 bg-[#FF5E15]/10 rounded-xl flex items-center justify-center mb-5">
            <svg class="w-7 h-7 text-[#FF5E15]" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
          </div>
          <h3 class="font-heading text-white text-xl font-bold mb-3">Institutions and Facilities</h3>
          <p class="text-[#D4D4D4] mb-4">${infra.highVolumeInstitutions} Multi-fan systems with coordinated repair schedules and strict compliance requirements.</p>
          <a href={\`tel:\${business.phoneRaw}\`} class="text-[#FF5E15] font-heading font-semibold hover:underline">{business.phone} &rarr;</a>
        </div>
      </div>
    </div>
  </section>

  <!-- SECTION 10: BOTTOM ROW 1 — REPAIR + COMPLIANCE -->
  <section class="bg-[#111111] py-12 md:py-16 lg:py-20 reveal">
    <div class="max-w-[1280px] mx-auto px-5">
      <div class="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-8">
        <div class="reveal-child">
          <h2 class="font-heading text-[#FF5E15] text-2xl md:text-4xl font-bold mb-8">Why ${name} Restaurants Need Dedicated Exhaust Fan Repair</h2>
          <div class="space-y-6">
            <div>
              <h3 class="font-heading text-white text-lg font-semibold mb-2">Local Conditions That Destroy Equipment</h3>
              <p class="text-[#D4D4D4]">${cs.whyThisCityNeeds}</p>
            </div>
            <div>
              <h3 class="font-heading text-white text-lg font-semibold mb-2">Common Problems in ${name}</h3>
              <p class="text-[#D4D4D4]">${ind.commonProblems}</p>
            </div>
          </div>
        </div>
        <div class="reveal-child">
          <h2 class="font-heading text-[#FF5E15] text-2xl md:text-4xl font-bold mb-8">${name} Exhaust Repair Compliance</h2>
          <div class="space-y-5">
            <p class="text-[#D4D4D4]">The <strong class="text-white">${comp.fireMarshal}</strong> enforces ${comp.enforcementLevel} When the fan stops pulling air, grease-laden vapor accumulates in ductwork, creating the exact fire hazard NFPA 96 exists to prevent. Inspectors check fan operation, functional <a href="/exhaust-fan-hinge-kit-installation/" class="text-[#FF5E15] hover:underline">hinge kits</a>, access panels, and documented service history.</p>
            <p class="text-[#D4D4D4]">${comp.fogProgram} When fan bearings fail, housings vibrate loose, and grease escapes containment systems onto roof surfaces and into storm drains. Repairing fans and maintaining <a href="/grease-containment/" class="text-[#FF5E15] hover:underline">grease containment</a> are inseparable.</p>
            <p class="text-[#D4D4D4]">Read our complete guide to <a href="/nfpa-code-96-standards/" class="text-[#FF5E15] hover:underline">NFPA 96 compliance standards</a> to understand the full scope of what inspectors evaluate.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- SECTION 11: BOTTOM ROW 2 — SERVICE AREA + FAQ -->
  <section class="bg-black py-12 md:py-16 lg:py-20 reveal">
    <div class="max-w-[1280px] mx-auto px-5">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="reveal-child">
          <h2 class="font-heading text-[#FF5E15] text-2xl md:text-4xl font-bold mb-5">${name} Exhaust Fan Repair Service Area</h2>
          <p class="text-[#D4D4D4] text-lg mb-6 max-w-2xl">${cs.serviceAreaParagraph}</p>
          <div class="space-y-3 mb-6">
            <p class="text-[#D4D4D4] font-body text-base">
              <span class="text-[#FF5E15] font-semibold">Also in ${name}:</span>
${alsoInLinks}
            </p>
            <p class="text-[#D4D4D4] font-body text-base">
              <span class="text-[#FF5E15] font-semibold">Also serving nearby:</span>
${neighborLinks}
            </p>
          </div>
        </div>
        <div class="reveal-child">
          <h2 class="font-heading text-[#FF5E15] text-2xl md:text-4xl font-bold mb-10">Frequently Asked Questions — ${name} Exhaust Fan Repair</h2>
          <div class="space-y-4">
            {faqs.map(faq => (
              <details class="bg-[#1A1A1A] border border-[#333] rounded-xl overflow-hidden transition-all duration-300">
                <summary class="flex items-center justify-between cursor-pointer px-6 py-5 text-white font-heading font-semibold">
                  <span class="pr-4">{faq.q}</span>
                  <svg class="faq-icon w-5 h-5 text-[#FF5E15] flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"/></svg>
                </summary>
                <div class="px-6 pb-5">
                  <p class="text-[#D4D4D4]">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- SECTION 12: DON'T WAIT CTA -->
  <section class="relative overflow-hidden bg-black reveal" id="urgency-cta">
    <div class="absolute inset-0 bg-cover bg-center bg-no-repeat" style="background-image:url('/images/homepage/gallery-11.jpg')"></div>
    <div class="absolute inset-0" style="background:linear-gradient(180deg, #FF5E158F 0%, #000000 100%); opacity:0.78"></div>
    <div class="relative z-10 max-w-[1280px] mx-auto px-5 pt-20 pb-0 flex flex-col lg:flex-row items-end">
      <div class="lg:w-[66%] pb-12 flex flex-col gap-2.5">
        <h2 class="font-heading text-white text-xl md:text-[45px] font-semibold capitalize leading-[1.1] mb-2">Don't Wait Until You're <span class="text-white">Fined or Shut Down!</span></h2>
        <div class="w-16 h-0.5 bg-[#FF5E15] my-2"></div>
        <p class="text-[#E0E0E0] font-heading text-base mb-4">Whether you need an emergency motor replacement, a scheduled belt change, or a complete fan overhaul, <strong class="text-white">{business.name}</strong> is here to keep your ${name} kitchen running and compliant.</p>
        <a href={\`tel:\${business.phoneRaw}\`} class="flex items-center gap-3 mb-3">
          <span class="w-12 h-12 flex items-center justify-center bg-[#FF5E15] rounded-xl">
            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 512 512"><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/></svg>
          </span>
          <span class="text-white font-heading text-lg font-semibold hover:text-[#FF5E15] transition-all duration-300">Call Now: {business.phone}</span>
        </a>
        <button type="button" class="popup-trigger inline-flex items-center gap-2 w-fit px-7 py-3 bg-[#FF5E15] text-white font-heading text-lg font-medium rounded hover:bg-black transition-all duration-300">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          Request Service Online
        </button>
      </div>
      <div class="w-full lg:w-[60%] flex justify-center lg:justify-end items-end -mb-2.5">
        <img src="/images/truck.png" alt="DDAN Hood Cleaning truck" class="truck-drive-in max-w-full w-full md:w-auto" loading="lazy" />
      </div>
    </div>
  </section>

  <style>
    details summary::-webkit-details-marker { display: none; }
    details summary { list-style: none; }
    details[open] .faq-icon { transform: rotate(180deg); }
    details[open] { border-color: #FF5E15; }
    .faq-icon { transition: transform 0.2s ease; }
  </style>
</BaseLayout>`;
}

// Now the parts-installation builder reads the Nashville template structure
function buildPartsPage(city, data) {
  const { name, state, slug, partsTitle, neighbors, neighborSlugs } = city;
  const cityLabel = `${name}, ${state}`;
  const cs = data.contentSnippets;
  const comp = data.complianceAndAHJ;
  const ind = data.industrySpecific;
  const infra = data.commercialInfrastructure;

  const cityFaqs = cs.citySpecificFAQs || [];
  const faqs = [
    ...cityFaqs.map(f => ({ q: f.question, a: f.answer })),
    { q: `How fast can you get parts to a ${name} restaurant?`, a: 'We stock common motors, belts, bearings, filters, hinge kits, and grease cups locally. For in-stock parts, same-day delivery is standard. Specialty items are typically next-day via our distributor network.' },
  ];

  const neighborCityLinks = neighbors.map(n => {
    const nSlug = neighborSlugs[n];
    return `              { name: '${n}', href: '/parts-installation/${nSlug}/' },`;
  }).join('\n');

  return `---
import BaseLayout from '../../layouts/BaseLayout.astro';
import TruckCTA from '../../components/TruckCTA.astro';
import business from '../../data/business.json';


const faqs = ${JSON.stringify(faqs, null, 2)};

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "name": business.name,
      "telephone": business.phone,
      "email": business.email,
      "url": \`\${import.meta.env.SITE || 'https://ddan-hood-cleaning.pages.dev'}/parts-installation/${slug}/\`,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": business.address.street,
        "addressLocality": business.address.city,
        "addressRegion": business.address.state,
        "postalCode": business.address.zip,
        "addressCountry": "US"
      },
      "areaServed": {
        "@type": "City",
        "name": "${cityLabel}"
      },
      "priceRange": "$$"
    },
    {
      "@type": "Service",
      "name": "Commercial Kitchen Exhaust Parts and Installation",
      "provider": { "@type": "LocalBusiness", "name": business.name },
      "areaServed": { "@type": "City", "name": "${cityLabel}" },
      "description": "Same-day exhaust fan parts and professional installation for ${name} commercial kitchens. Motors, belts, filters, hinge kits, grease containment, and make-up air units."
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": \`\${import.meta.env.SITE || 'https://ddan-hood-cleaning.pages.dev'}/\` },
        { "@type": "ListItem", "position": 2, "name": "Parts & Installation", "item": \`\${import.meta.env.SITE || 'https://ddan-hood-cleaning.pages.dev'}/parts-installation/\` },
        { "@type": "ListItem", "position": 3, "name": "${cityLabel}" }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": faqs.map(f => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": { "@type": "Answer", "text": f.a }
      }))
    }
  ]
};
---

<BaseLayout
  title="${partsTitle}"
  description="Restaurant exhaust fan parts and professional installation in ${name}. Same-day service, warrantied parts, free fitting consult. Call (615) 881-6968."
  ogImage="/images/services/kitchen-exhaust-installation.jpg"
>
  <script is:inline type="application/ld+json" set:html={JSON.stringify(schema)} />

  <!-- HERO -->
  <section class="min-h-[400px] md:min-h-[550px] flex items-center justify-center" style="background: linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.3) 100%), url('/images/services/kitchen-exhaust-installation.jpg') center/cover no-repeat;">
    <div class="max-w-4xl mx-auto px-6 py-20 text-center">
      <p class="text-[#FF5E15] font-heading font-bold text-xs md:text-sm tracking-widest uppercase mb-4">DDAN Hood Cleaning and Repair</p>
      <h1 class="font-display text-white text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">Same-Day Exhaust Fan Parts and Installation in <span class="text-[#FF5E15]">${cityLabel}</span></h1>
      <p class="text-gray-200 font-body text-lg md:text-xl max-w-2xl mx-auto mb-6">${cs.heroParagraph.split('.').slice(0, 2).join('.') + '.'}</p>
      <p class="text-white font-heading font-bold text-base md:text-lg mb-2">Same-Day / Next-Day Warrantied Parts and Installation by a Licensed Professional</p>
      <div class="w-20 h-1 bg-[#FF5E15] mx-auto mt-3 mb-8"></div>
      <div class="flex flex-col sm:flex-row justify-center gap-4 mb-8">
        <a href={\`tel:\${business.phoneRaw}\`} class="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#FF5E15] text-white font-heading font-bold text-lg rounded-lg hover:scale-95 transition-all duration-300">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 512 512"><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/></svg>
          Free Fitting Consult: {business.phone}
        </a>
        <a href={\`tel:\${business.phoneRaw}\`} class="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-[#FF5E15] text-[#FF5E15] font-heading font-bold text-lg rounded-lg hover:bg-[#FF5E15] hover:text-white hover:scale-95 transition-all duration-300">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          EMERGENCY FAN REPLACEMENT
        </a>
      </div>
      <div class="flex justify-center items-center gap-6 mt-8">
        <div class="flex flex-col items-center gap-1">
          <img src="/images/homepage/google-white-logo-1024x337.png" alt="Google" class="h-5 md:h-7 object-contain opacity-90" loading="lazy" />
          <div class="flex gap-0.5">{Array(5).fill(0).map(() => <svg class="w-3 h-3 md:w-4 md:h-4 text-[#FF5E15] fill-current" viewBox="0 0 1000 1000"><path d="M450 75L338 312 88 350C46 354 25 417 58 450L238 633 196 896C188 942 238 975 275 954L500 837 725 954C767 975 813 942 804 896L763 633 942 450C975 417 954 358 913 350L663 312 550 75C529 33 471 33 450 75Z"/></svg>)}</div>
        </div>
        <div class="flex flex-col items-center gap-1">
          <img src="/images/homepage/facebook-logo-white-full-transparent-1024x341.png" alt="Facebook" class="h-5 md:h-7 object-contain opacity-90" loading="lazy" />
          <div class="flex gap-0.5">{Array(5).fill(0).map(() => <svg class="w-3 h-3 md:w-4 md:h-4 text-[#FF5E15] fill-current" viewBox="0 0 1000 1000"><path d="M450 75L338 312 88 350C46 354 25 417 58 450L238 633 196 896C188 942 238 975 275 954L500 837 725 954C767 975 813 942 804 896L763 633 942 450C975 417 954 358 913 350L663 312 550 75C529 33 471 33 450 75Z"/></svg>)}</div>
        </div>
        <div class="flex flex-col items-center gap-1">
          <img src="/images/homepage/YELP_BIG.D-5a67c069-1024x392.png" alt="Yelp" class="h-5 md:h-7 object-contain opacity-90" loading="lazy" />
          <div class="flex gap-0.5">{Array(5).fill(0).map(() => <svg class="w-3 h-3 md:w-4 md:h-4 text-[#FF5E15] fill-current" viewBox="0 0 1000 1000"><path d="M450 75L338 312 88 350C46 354 25 417 58 450L238 633 196 896C188 942 238 975 275 954L500 837 725 954C767 975 813 942 804 896L763 633 942 450C975 417 954 358 913 350L663 312 550 75C529 33 471 33 450 75Z"/></svg>)}</div>
        </div>
      </div>
    </div>
  </section>

  <!-- BREADCRUMB STRIP -->
  <div class="bg-[#0A0A0A] py-2 px-5">
    <div class="max-w-[1200px] mx-auto">
      <nav class="flex items-center gap-2 text-sm font-heading text-gray-400" aria-label="Breadcrumb">
        <a href="/" class="hover:text-[#FF5E15] transition-colors">Home</a>
        <span class="text-[#FF5E15]">/</span>
        <a href="/parts-installation/" class="hover:text-[#FF5E15] transition-colors">Parts & Installation</a>
        <span class="text-[#FF5E15]">/</span>
        <span class="text-gray-300">${cityLabel}</span>
      </nav>
    </div>
  </div>

  <!-- CONSULT BAR + JUMP-NAV GRID -->
  <section class="bg-[#111111] py-12 reveal">
    <div class="max-w-[1200px] mx-auto px-5">
      <h2 class="font-heading text-[#FF5E15] font-bold text-2xl text-center mb-8 reveal-child">Complete Restaurant Hood System Parts and Installation</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <a href="#exhaust-fans" class="bg-[#1A1A1A] border border-[#FF5E15]/40 hover:border-[#FF5E15] rounded-xl p-4 text-center hover:-translate-y-1 transition-all duration-300 reveal-child"><svg class="w-8 h-8 text-[#FF5E15] mx-auto mb-2" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 3v9l6 3M12 12L6 9"/></svg><span class="text-white font-heading font-semibold text-sm">Exhaust Fans</span></a>
        <a href="#fan-parts" class="bg-[#1A1A1A] border border-[#FF5E15]/40 hover:border-[#FF5E15] rounded-xl p-4 text-center hover:-translate-y-1 transition-all duration-300 reveal-child"><svg class="w-8 h-8 text-[#FF5E15] mx-auto mb-2" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 1v4m0 14v4m-7.07-15.07l2.83 2.83m8.48 8.48l2.83 2.83M1 12h4m14 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/></svg><span class="text-white font-heading font-semibold text-sm">Fan Parts</span></a>
        <a href="#make-up-air" class="bg-[#1A1A1A] border border-[#FF5E15]/40 hover:border-[#FF5E15] rounded-xl p-4 text-center hover:-translate-y-1 transition-all duration-300 reveal-child"><svg class="w-8 h-8 text-[#FF5E15] mx-auto mb-2" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M7 12h10M12 8v8"/></svg><span class="text-white font-heading font-semibold text-sm">Make-Up Air</span></a>
        <a href="#filters" class="bg-[#1A1A1A] border border-[#FF5E15]/40 hover:border-[#FF5E15] rounded-xl p-4 text-center hover:-translate-y-1 transition-all duration-300 reveal-child"><svg class="w-8 h-8 text-[#FF5E15] mx-auto mb-2" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></svg><span class="text-white font-heading font-semibold text-sm">Filters</span></a>
        <a href="#grease-containment" class="bg-[#1A1A1A] border border-[#FF5E15]/40 hover:border-[#FF5E15] rounded-xl p-4 text-center hover:-translate-y-1 transition-all duration-300 reveal-child"><svg class="w-8 h-8 text-[#FF5E15] mx-auto mb-2" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg><span class="text-white font-heading font-semibold text-sm">Grease Containment</span></a>
        <a href="#hood-systems" class="bg-[#1A1A1A] border border-[#FF5E15]/40 hover:border-[#FF5E15] rounded-xl p-4 text-center hover:-translate-y-1 transition-all duration-300 reveal-child"><svg class="w-8 h-8 text-[#FF5E15] mx-auto mb-2" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg><span class="text-white font-heading font-semibold text-sm">Hood Systems</span></a>
        <a href="#hood-systems" class="bg-[#1A1A1A] border border-[#FF5E15]/40 hover:border-[#FF5E15] rounded-xl p-4 text-center hover:-translate-y-1 transition-all duration-300 reveal-child"><svg class="w-8 h-8 text-[#FF5E15] mx-auto mb-2" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg><span class="text-white font-heading font-semibold text-sm">Accessories</span></a>
      </div>
      <div class="bg-[#1A1A1A] border-2 border-[#FF5E15] rounded-xl px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-4 mt-10 reveal-child">
        <p class="text-white font-heading font-semibold text-lg text-center md:text-left">Don't know what you need? Call for a FREE consult from a pro.</p>
        <div class="text-center whitespace-nowrap">
          <p class="text-[#FF5E15] font-heading font-bold text-sm">SAME DAY / NEXT DAY SERVICE</p>
          <p class="text-[#FF5E15] font-heading font-bold text-xs">24/7 Emergency Line Available</p>
        </div>
        <div class="text-center md:text-right">
          <a href={\`tel:\${business.phoneRaw}\`} class="block text-white font-heading font-bold text-2xl hover:text-[#FF5E15] transition-colors">{business.phone}</a>
        </div>
      </div>
    </div>
  </section>

  <!-- INSTALLATION UPSELL — TRUCK STYLE -->
  <section class="py-12 md:py-16 lg:py-20 overflow-hidden reveal" style="background: linear-gradient(to right, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.85) 60%, rgba(0,0,0,0.7) 100%), url('/images/homepage-hero/vent-hood-cleaning-service-nashville-tn-DDAN-Hood-Cleaning-and-Repair-615-881-6968.jpg') center/cover no-repeat;">
    <div class="max-w-[1280px] mx-auto px-5">
      <div class="flex flex-col lg:flex-row items-center gap-10">
        <div class="lg:w-[55%]">
          <span class="inline-block bg-[#FF5E15] text-white text-xs font-heading font-bold uppercase tracking-wide rounded-full px-4 py-1 reveal-child">DDAN Advantage</span>
          <h2 class="text-white font-heading font-bold text-2xl md:text-3xl mt-4 reveal-child">Order From Us — Get Discounted Professional Installation</h2>
          <p class="text-gray-300 text-base md:text-lg mt-4 reveal-child">When you order parts through DDAN, installation labor is discounted. We spec it, we source it, we install it — all under one warranty.</p>
          <ul class="space-y-3 mt-6">
            <li class="flex items-start gap-3 text-[#D4D4D4] reveal-child"><svg class="w-5 h-5 text-[#FF5E15] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg><span>Parts and labor under one warranty</span></li>
            <li class="flex items-start gap-3 text-[#D4D4D4] reveal-child"><svg class="w-5 h-5 text-[#FF5E15] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg><span>We verify fit before we order — no returns, no delays</span></li>
            <li class="flex items-start gap-3 text-[#D4D4D4] reveal-child"><svg class="w-5 h-5 text-[#FF5E15] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg><span>Same technician specs, sources, and installs your part</span></li>
            <li class="flex items-start gap-3 text-[#D4D4D4] reveal-child"><svg class="w-5 h-5 text-[#FF5E15] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg><span>Photo documentation for your compliance files</span></li>
          </ul>
          <button type="button" class="popup-trigger inline-flex items-center gap-2 px-8 py-4 bg-[#FF5E15] text-white font-heading font-bold rounded-lg hover:scale-95 transition-all duration-300 mt-6 reveal-child">
            Get a Parts and Install Quote
          </button>
          <p class="text-gray-400 text-sm mt-3 reveal-child">
            Or call now: <a href={\`tel:\${business.phoneRaw}\`} class="text-[#FF5E15] hover:underline">{business.phone}</a>
          </p>
        </div>
        <div class="lg:w-[45%] flex justify-end">
          <img src="/images/truck.png" alt="DDAN Hood Cleaning and Repair truck" class="truck-drive-in max-w-full" loading="lazy" />
        </div>
      </div>
    </div>
  </section>

  <!-- ==================== EXHAUST FANS ==================== -->
  <section id="exhaust-fans" class="bg-black py-16 px-5 reveal">
    <div class="max-w-[1200px] mx-auto">
      <h2 class="text-[#FF5E15] font-heading font-bold text-2xl md:text-3xl mb-2 reveal-child">Restaurant Exhaust Fans for ${name} Kitchens</h2>
      <p class="text-[#D4D4D4] font-body mb-6 reveal-child">The heart of your kitchen ventilation. We stock common sizes for same-day replacement.</p>
      <div class="bg-[#FF5E15] rounded-lg py-4 px-6 text-center mb-8 reveal-child">
        <p class="text-white font-heading font-bold text-lg md:text-xl uppercase tracking-widest">All Sizes — All Power Levels — Variable Speed and Standard</p>
        <p class="text-white/90 text-sm mt-1">From 400 CFM to 6,000+ CFM. If your restaurant uses it, we carry it.</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <a href="tel:6158816968" class="group block bg-[#1A1A1A] border border-[#FF5E15]/40 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-white hover:shadow-xl hover:shadow-orange-500/10 reveal-child">
          <div class="relative aspect-video bg-[#0A0A0A] rounded-t-xl overflow-hidden"><img src="/images/services/kitchen-exhaust-installation.jpg" alt="Direct drive upblast exhaust fan ${name} ${state} - DDAN Hood Cleaning" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" /><div class="absolute inset-0 flex flex-col items-center justify-end p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" style="background: linear-gradient(to top, rgba(255,94,21,0.95) 0%, rgba(255,94,21,0.8) 40%, rgba(0,0,0,0.6) 100%);"><svg class="w-8 h-8 text-white mb-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg><span class="text-white font-heading font-bold text-lg">Verify Fit and Specs</span><span class="text-white text-sm mt-1">(615) 881-6968</span><span class="text-white/80 text-xs uppercase tracking-widest mt-2">Tap to Call</span></div></div>
          <div class="p-5"><h3 class="text-[#FF5E15] font-heading font-semibold text-lg">Direct Drive Upblast Fans</h3><p class="text-[#D4D4D4] text-sm mt-2 font-body">The number one restaurant exhaust fan. Sealed motor compartment protects from heat, grease, and moisture. Low maintenance, high efficiency. All sizes from 400 CFM to 6,000+ CFM.</p></div>
        </a>
        <a href="tel:6158816968" class="group block bg-[#1A1A1A] border border-[#FF5E15]/40 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-white hover:shadow-xl hover:shadow-orange-500/10 reveal-child">
          <div class="relative aspect-video bg-[#0A0A0A] rounded-t-xl overflow-hidden"><img src="/images/services/commercial-hood-repair-split.jpeg" alt="Belt drive upblast exhaust fan ${name} ${state} - DDAN Hood Cleaning" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" /><div class="absolute inset-0 flex flex-col items-center justify-end p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" style="background: linear-gradient(to top, rgba(255,94,21,0.95) 0%, rgba(255,94,21,0.8) 40%, rgba(0,0,0,0.6) 100%);"><svg class="w-8 h-8 text-white mb-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg><span class="text-white font-heading font-bold text-lg">Verify Fit and Specs</span><span class="text-white text-sm mt-1">(615) 881-6968</span><span class="text-white/80 text-xs uppercase tracking-widest mt-2">Tap to Call</span></div></div>
          <div class="p-5"><h3 class="text-[#FF5E15] font-heading font-semibold text-lg">Belt Drive Upblast Fans</h3><p class="text-[#D4D4D4] text-sm mt-2 font-body">Quieter operation with adjustable speed via belt and pulley system. Cost-effective for moderate-volume kitchens. All belt sizes and motor configurations in stock.</p></div>
        </a>
      </div>
    </div>
  </section>

  <!-- ==================== FAN REPLACEMENT PARTS ==================== -->
  <section id="fan-parts" class="bg-[#111111] py-16 px-5 reveal">
    <div class="max-w-[1200px] mx-auto">
      <h2 class="text-[#FF5E15] font-heading font-bold text-2xl md:text-3xl mb-2 reveal-child">${name} Exhaust Fan Replacement Parts — In Stock</h2>
      <p class="text-[#D4D4D4] font-body mb-8 reveal-child">Common components stocked locally. Call to verify fit for your specific unit.</p>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        <a href="tel:6158816968" class="group block bg-[#1A1A1A] border border-[#FF5E15]/40 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-white reveal-child"><div class="relative aspect-square bg-white rounded-t-xl overflow-hidden"><img src="/images/products/fan-motor-odp.webp" alt="Commercial exhaust fan motor ODP TEFC ${name} - DDAN Hood Cleaning" class="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105" loading="lazy" /><div class="absolute inset-0 flex flex-col items-center justify-end p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" style="background: linear-gradient(to top, rgba(255,94,21,0.95) 0%, rgba(255,94,21,0.8) 40%, rgba(0,0,0,0.6) 100%);"><svg class="w-8 h-8 text-white mb-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg><span class="text-white font-heading font-bold text-lg">Verify Fit and Specs</span><span class="text-white text-sm mt-1">(615) 881-6968</span><span class="text-white/80 text-xs uppercase tracking-widest mt-2">Tap to Call</span></div></div><div class="p-5"><h3 class="text-[#FF5E15] font-heading font-semibold text-lg">Motors (ODP and TEFC)</h3><p class="text-[#D4D4D4] text-sm mt-2 font-body">Replacement motors for all fan types. Single and 3-phase. All horsepower ratings.</p></div></a>
        <a href="tel:6158816968" class="group block bg-[#1A1A1A] border border-[#FF5E15]/40 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-white reveal-child"><div class="relative aspect-square bg-white rounded-t-xl overflow-hidden"><img src="/images/products/fan-wheel-blades.webp" alt="Exhaust fan wheel blade assembly ${name} - DDAN Hood Cleaning" class="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105" loading="lazy" /><div class="absolute inset-0 flex flex-col items-center justify-end p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" style="background: linear-gradient(to top, rgba(255,94,21,0.95) 0%, rgba(255,94,21,0.8) 40%, rgba(0,0,0,0.6) 100%);"><svg class="w-8 h-8 text-white mb-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg><span class="text-white font-heading font-bold text-lg">Verify Fit and Specs</span><span class="text-white text-sm mt-1">(615) 881-6968</span><span class="text-white/80 text-xs uppercase tracking-widest mt-2">Tap to Call</span></div></div><div class="p-5"><h3 class="text-[#FF5E15] font-heading font-semibold text-lg">Fan Wheels and Blades</h3><p class="text-[#D4D4D4] text-sm mt-2 font-body">Impellers and blade assemblies. Precision balanced per AMCA standard.</p></div></a>
        <a href="tel:6158816968" class="group block bg-[#1A1A1A] border border-[#FF5E15]/40 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-white reveal-child"><div class="relative aspect-square bg-white rounded-t-xl overflow-hidden"><img src="/images/products/belt-drive-kit.webp" alt="Exhaust fan belt drive kit ${name} - DDAN Hood Cleaning" class="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105" loading="lazy" /><div class="absolute inset-0 flex flex-col items-center justify-end p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" style="background: linear-gradient(to top, rgba(255,94,21,0.95) 0%, rgba(255,94,21,0.8) 40%, rgba(0,0,0,0.6) 100%);"><svg class="w-8 h-8 text-white mb-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg><span class="text-white font-heading font-bold text-lg">Verify Fit and Specs</span><span class="text-white text-sm mt-1">(615) 881-6968</span><span class="text-white/80 text-xs uppercase tracking-widest mt-2">Tap to Call</span></div></div><div class="p-5"><h3 class="text-[#FF5E15] font-heading font-semibold text-lg">Belts and Drive Kits</h3><p class="text-[#D4D4D4] text-sm mt-2 font-body">V-belts, sheaves, pulleys, and tensioners. All common sizes in stock.</p></div></a>
        <a href="tel:6158816968" class="group block bg-[#1A1A1A] border border-[#FF5E15]/40 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-white reveal-child"><div class="relative aspect-square bg-white rounded-t-xl overflow-hidden"><img src="/images/products/bearing-pillow-block.webp" alt="Pillow block bearing for exhaust fan ${name} - DDAN Hood Cleaning" class="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105" loading="lazy" /><div class="absolute inset-0 flex flex-col items-center justify-end p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" style="background: linear-gradient(to top, rgba(255,94,21,0.95) 0%, rgba(255,94,21,0.8) 40%, rgba(0,0,0,0.6) 100%);"><svg class="w-8 h-8 text-white mb-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg><span class="text-white font-heading font-bold text-lg">Verify Fit and Specs</span><span class="text-white text-sm mt-1">(615) 881-6968</span><span class="text-white/80 text-xs uppercase tracking-widest mt-2">Tap to Call</span></div></div><div class="p-5"><h3 class="text-[#FF5E15] font-heading font-semibold text-lg">Bearings</h3><p class="text-[#D4D4D4] text-sm mt-2 font-body">Pillow block and flange bearings. Heavy-duty regreasable ball type.</p></div></a>
        <a href="tel:6158816968" class="group block bg-[#1A1A1A] border border-[#FF5E15]/40 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-white reveal-child"><div class="relative aspect-square bg-white rounded-t-xl overflow-hidden"><img src="/images/products/roof-curb-galvanized.webp" alt="Galvanized roof curb for exhaust fan ${name} - DDAN Hood Cleaning" class="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105" loading="lazy" /><div class="absolute inset-0 flex flex-col items-center justify-end p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" style="background: linear-gradient(to top, rgba(255,94,21,0.95) 0%, rgba(255,94,21,0.8) 40%, rgba(0,0,0,0.6) 100%);"><svg class="w-8 h-8 text-white mb-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg><span class="text-white font-heading font-bold text-lg">Verify Fit and Specs</span><span class="text-white text-sm mt-1">(615) 881-6968</span><span class="text-white/80 text-xs uppercase tracking-widest mt-2">Tap to Call</span></div></div><div class="p-5"><h3 class="text-[#FF5E15] font-heading font-semibold text-lg">Roof Curbs</h3><p class="text-[#D4D4D4] text-sm mt-2 font-body">Standard and custom curb adapters. Galvanized steel construction.</p></div></a>
        <a href="tel:6158816968" class="group block bg-[#1A1A1A] border border-[#FF5E15]/40 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-white reveal-child"><div class="relative aspect-square bg-white rounded-t-xl overflow-hidden"><img src="/images/products/hinge-kit.webp" alt="Exhaust fan hinge kit ${name} - DDAN Hood Cleaning" class="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105" loading="lazy" /><div class="absolute inset-0 flex flex-col items-center justify-end p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" style="background: linear-gradient(to top, rgba(255,94,21,0.95) 0%, rgba(255,94,21,0.8) 40%, rgba(0,0,0,0.6) 100%);"><svg class="w-8 h-8 text-white mb-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg><span class="text-white font-heading font-bold text-lg">Verify Fit and Specs</span><span class="text-white text-sm mt-1">(615) 881-6968</span><span class="text-white/80 text-xs uppercase tracking-widest mt-2">Tap to Call</span></div></div><div class="p-5"><h3 class="text-[#FF5E15] font-heading font-semibold text-lg">Hinge Kits</h3><p class="text-[#D4D4D4] text-sm mt-2 font-body">NFPA 96 compliant fan access kits. Required for safe cleaning access.</p></div></a>
        <a href="tel:6158816968" class="group block bg-[#1A1A1A] border border-[#FF5E15]/40 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-white reveal-child"><div class="relative aspect-square bg-white rounded-t-xl overflow-hidden"><img src="/images/products/speed-controller.webp" alt="Variable speed controller VFD exhaust fan ${name} - DDAN Hood Cleaning" class="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105" loading="lazy" /><div class="absolute inset-0 flex flex-col items-center justify-end p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" style="background: linear-gradient(to top, rgba(255,94,21,0.95) 0%, rgba(255,94,21,0.8) 40%, rgba(0,0,0,0.6) 100%);"><svg class="w-8 h-8 text-white mb-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg><span class="text-white font-heading font-bold text-lg">Verify Fit and Specs</span><span class="text-white text-sm mt-1">(615) 881-6968</span><span class="text-white/80 text-xs uppercase tracking-widest mt-2">Tap to Call</span></div></div><div class="p-5"><h3 class="text-[#FF5E15] font-heading font-semibold text-lg">Speed Controllers and VFDs</h3><p class="text-[#D4D4D4] text-sm mt-2 font-body">Variable frequency drives and manual speed controls for all fan types.</p></div></a>
        <a href="tel:6158816968" class="group block bg-[#1A1A1A] border border-[#FF5E15]/40 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-white reveal-child"><div class="relative aspect-square bg-white rounded-t-xl overflow-hidden"><img src="/images/products/grease-cup-drain.webp" alt="Grease cup drain fitting exhaust fan ${name} - DDAN Hood Cleaning" class="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105" loading="lazy" /><div class="absolute inset-0 flex flex-col items-center justify-end p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" style="background: linear-gradient(to top, rgba(255,94,21,0.95) 0%, rgba(255,94,21,0.8) 40%, rgba(0,0,0,0.6) 100%);"><svg class="w-8 h-8 text-white mb-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg><span class="text-white font-heading font-bold text-lg">Verify Fit and Specs</span><span class="text-white text-sm mt-1">(615) 881-6968</span><span class="text-white/80 text-xs uppercase tracking-widest mt-2">Tap to Call</span></div></div><div class="p-5"><h3 class="text-[#FF5E15] font-heading font-semibold text-lg">Grease Cups and Fittings</h3><p class="text-[#D4D4D4] text-sm mt-2 font-body">Drain cups, nipples, and adapters for exhaust fan bases.</p></div></a>
        <a href="tel:6158816968" class="group block bg-[#1A1A1A] border border-[#FF5E15]/40 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-white reveal-child"><div class="relative aspect-square bg-white rounded-t-xl overflow-hidden"><img src="/images/products/motor-cover.webp" alt="Exhaust fan motor cover weather guard ${name} - DDAN Hood Cleaning" class="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105" loading="lazy" /><div class="absolute inset-0 flex flex-col items-center justify-end p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" style="background: linear-gradient(to top, rgba(255,94,21,0.95) 0%, rgba(255,94,21,0.8) 40%, rgba(0,0,0,0.6) 100%);"><svg class="w-8 h-8 text-white mb-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg><span class="text-white font-heading font-bold text-lg">Verify Fit and Specs</span><span class="text-white text-sm mt-1">(615) 881-6968</span><span class="text-white/80 text-xs uppercase tracking-widest mt-2">Tap to Call</span></div></div><div class="p-5"><h3 class="text-[#FF5E15] font-heading font-semibold text-lg">Motor Covers and Guards</h3><p class="text-[#D4D4D4] text-sm mt-2 font-body">Weather shields and safety guards for rooftop fan motors.</p></div></a>
      </div>
    </div>
  </section>

  <!-- ==================== MAKE-UP AIR UNITS ==================== -->
  <section id="make-up-air" class="bg-black py-16 px-5 reveal">
    <div class="max-w-[1200px] mx-auto">
      <h2 class="text-[#FF5E15] font-heading font-bold text-2xl md:text-3xl mb-2 reveal-child">Commercial Make-Up Air Units for ${name} Restaurants</h2>
      <p class="text-[#D4D4D4] font-body mb-8 reveal-child">Your exhaust system cannot function without balanced airflow. We supply and install all MUA types.</p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a href="tel:6158816968" class="group block bg-[#1A1A1A] border border-[#FF5E15]/40 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-white reveal-child"><div class="relative aspect-square bg-white rounded-t-xl overflow-hidden"><img src="/images/products/mua-heated-gas.webp" alt="Gas fired heated make up air unit ${name} restaurant - DDAN Hood Cleaning" class="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105" loading="lazy" /><div class="absolute inset-0 flex flex-col items-center justify-end p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" style="background: linear-gradient(to top, rgba(255,94,21,0.95) 0%, rgba(255,94,21,0.8) 40%, rgba(0,0,0,0.6) 100%);"><svg class="w-8 h-8 text-white mb-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg><span class="text-white font-heading font-bold text-lg">Verify Fit and Specs</span><span class="text-white text-sm mt-1">(615) 881-6968</span><span class="text-white/80 text-xs uppercase tracking-widest mt-2">Tap to Call</span></div></div><div class="p-5"><h3 class="text-[#FF5E15] font-heading font-semibold text-lg">Gas-Fired Heated MUA</h3><p class="text-[#D4D4D4] text-sm mt-2 font-body">Required for ${state === 'KY' ? 'Kentucky' : 'Tennessee'} winters. Direct gas-fired heating prevents freezing drafts and dangerous negative pressure.</p></div></a>
        <a href="tel:6158816968" class="group block bg-[#1A1A1A] border border-[#FF5E15]/40 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-white reveal-child"><div class="relative aspect-square bg-white rounded-t-xl overflow-hidden"><img src="/images/products/mua-unheated.webp" alt="Unheated make up air unit ${name} commercial kitchen - DDAN Hood Cleaning" class="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105" loading="lazy" /><div class="absolute inset-0 flex flex-col items-center justify-end p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" style="background: linear-gradient(to top, rgba(255,94,21,0.95) 0%, rgba(255,94,21,0.8) 40%, rgba(0,0,0,0.6) 100%);"><svg class="w-8 h-8 text-white mb-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg><span class="text-white font-heading font-bold text-lg">Verify Fit and Specs</span><span class="text-white text-sm mt-1">(615) 881-6968</span><span class="text-white/80 text-xs uppercase tracking-widest mt-2">Tap to Call</span></div></div><div class="p-5"><h3 class="text-[#FF5E15] font-heading font-semibold text-lg">Untempered / Passive MUA</h3><p class="text-[#D4D4D4] text-sm mt-2 font-body">Budget fresh air supply for mild climates and supplemental use. Belt or direct drive options.</p></div></a>
        <a href="tel:6158816968" class="group block bg-[#1A1A1A] border border-[#FF5E15]/40 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-white reveal-child"><div class="relative aspect-square bg-white rounded-t-xl overflow-hidden"><img src="/images/products/mua-heated-cooled.webp" alt="Heated cooled make up air unit ${name} restaurant - DDAN Hood Cleaning" class="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105" loading="lazy" /><div class="absolute inset-0 flex flex-col items-center justify-end p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" style="background: linear-gradient(to top, rgba(255,94,21,0.95) 0%, rgba(255,94,21,0.8) 40%, rgba(0,0,0,0.6) 100%);"><svg class="w-8 h-8 text-white mb-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg><span class="text-white font-heading font-bold text-lg">Verify Fit and Specs</span><span class="text-white text-sm mt-1">(615) 881-6968</span><span class="text-white/80 text-xs uppercase tracking-widest mt-2">Tap to Call</span></div></div><div class="p-5"><h3 class="text-[#FF5E15] font-heading font-semibold text-lg">MUA Replacement Parts</h3><p class="text-[#D4D4D4] text-sm mt-2 font-body">Filters, dampers, motors, and control boards for existing MUA units. We service all major brands.</p></div></a>
      </div>
    </div>
  </section>

  <!-- ==================== FILTERS AND BAFFLES ==================== -->
  <section id="filters" class="bg-[#111111] py-16 px-5 reveal">
    <div class="max-w-[1200px] mx-auto">
      <h2 class="text-[#FF5E15] font-heading font-bold text-2xl md:text-3xl mb-2 reveal-child">Commercial Hood Filters and Baffles in ${name}</h2>
      <p class="text-[#D4D4D4] font-body mb-8 reveal-child">The first line of defense in your exhaust system. Wrong filter means failed inspection — call us to verify.</p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a href="tel:6158816968" class="group block bg-[#1A1A1A] border border-[#FF5E15]/40 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-white reveal-child"><div class="relative aspect-square bg-white rounded-t-xl overflow-hidden"><img src="/images/products/baffle-filter-stainless.webp" alt="Stainless steel baffle grease filter ${name} - DDAN Hood Cleaning" class="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105" loading="lazy" /><div class="absolute inset-0 flex flex-col items-center justify-end p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" style="background: linear-gradient(to top, rgba(255,94,21,0.95) 0%, rgba(255,94,21,0.8) 40%, rgba(0,0,0,0.6) 100%);"><svg class="w-8 h-8 text-white mb-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg><span class="text-white font-heading font-bold text-lg">Verify Fit and Specs</span><span class="text-white text-sm mt-1">(615) 881-6968</span><span class="text-white/80 text-xs uppercase tracking-widest mt-2">Tap to Call</span></div></div><div class="p-5"><h3 class="text-[#FF5E15] font-heading font-semibold text-lg">Stainless Steel Baffle Filters</h3><p class="text-[#D4D4D4] text-sm mt-2 font-body">Industry standard. Dishwasher safe. UL 1046 listed. Type 304 and 430 stainless. All standard sizes.</p></div></a>
        <a href="tel:6158816968" class="group block bg-[#1A1A1A] border border-[#FF5E15]/40 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-white reveal-child"><div class="relative aspect-square bg-white rounded-t-xl overflow-hidden"><img src="/images/products/mesh-grease-filter.webp" alt="Aluminum mesh grease filter ${name} commercial kitchen - DDAN Hood Cleaning" class="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105" loading="lazy" /><div class="absolute inset-0 flex flex-col items-center justify-end p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" style="background: linear-gradient(to top, rgba(255,94,21,0.95) 0%, rgba(255,94,21,0.8) 40%, rgba(0,0,0,0.6) 100%);"><svg class="w-8 h-8 text-white mb-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg><span class="text-white font-heading font-bold text-lg">Verify Fit and Specs</span><span class="text-white text-sm mt-1">(615) 881-6968</span><span class="text-white/80 text-xs uppercase tracking-widest mt-2">Tap to Call</span></div></div><div class="p-5"><h3 class="text-[#FF5E15] font-heading font-semibold text-lg">Mesh Grease Filters</h3><p class="text-[#D4D4D4] text-sm mt-2 font-body">Budget-friendly option. Aluminum mesh construction for light-duty cooking applications.</p></div></a>
        <a href="tel:6158816968" class="group block bg-[#1A1A1A] border border-[#FF5E15]/40 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-white reveal-child"><div class="relative aspect-square bg-white rounded-t-xl overflow-hidden"><img src="/images/products/charcoal-carbon-filter.webp" alt="Charcoal carbon odor filter ${name} restaurant hood - DDAN Hood Cleaning" class="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105" loading="lazy" /><div class="absolute inset-0 flex flex-col items-center justify-end p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" style="background: linear-gradient(to top, rgba(255,94,21,0.95) 0%, rgba(255,94,21,0.8) 40%, rgba(0,0,0,0.6) 100%);"><svg class="w-8 h-8 text-white mb-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg><span class="text-white font-heading font-bold text-lg">Verify Fit and Specs</span><span class="text-white text-sm mt-1">(615) 881-6968</span><span class="text-white/80 text-xs uppercase tracking-widest mt-2">Tap to Call</span></div></div><div class="p-5"><h3 class="text-[#FF5E15] font-heading font-semibold text-lg">Charcoal / Carbon Filters</h3><p class="text-[#D4D4D4] text-sm mt-2 font-body">Activated carbon for smoke and odor control in ventless hoods. Replace every 3 to 6 months.</p></div></a>
      </div>
    </div>
  </section>

  <!-- ==================== GREASE CONTAINMENT ==================== -->
  <section id="grease-containment" class="bg-black py-16 px-5 reveal">
    <div class="max-w-[1200px] mx-auto">
      <h2 class="text-[#FF5E15] font-heading font-bold text-2xl md:text-3xl mb-2 reveal-child">Rooftop Grease Containment Systems for ${name}</h2>
      <p class="text-[#D4D4D4] font-body mb-8 reveal-child">Protect your roof and stay compliant. Systems for every building type.</p>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        <a href="tel:6158816968" class="group block bg-[#1A1A1A] border border-[#FF5E15]/40 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-white reveal-child"><div class="relative aspect-square bg-white rounded-t-xl overflow-hidden"><img src="/images/products/grease-box-standard.webp" alt="Rooftop grease containment box ${name} - DDAN Hood Cleaning" class="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105" loading="lazy" /><div class="absolute inset-0 flex flex-col items-center justify-end p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" style="background: linear-gradient(to top, rgba(255,94,21,0.95) 0%, rgba(255,94,21,0.8) 40%, rgba(0,0,0,0.6) 100%);"><svg class="w-8 h-8 text-white mb-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg><span class="text-white font-heading font-bold text-lg">Verify Fit</span><span class="text-white text-sm mt-1">(615) 881-6968</span></div></div><div class="p-4"><h3 class="text-[#FF5E15] font-heading font-semibold text-base">Rooftop Grease Boxes</h3><p class="text-[#D4D4D4] text-xs mt-1 font-body">Enclosed containment around fan base. Galvanized steel. Pillows included.</p></div></a>
        <a href="tel:6158816968" class="group block bg-[#1A1A1A] border border-[#FF5E15]/40 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-white reveal-child"><div class="relative aspect-square bg-white rounded-t-xl overflow-hidden"><img src="/images/products/grease-box-xtreme.webp" alt="High volume grease containment box ${name} - DDAN Hood Cleaning" class="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105" loading="lazy" /><div class="absolute inset-0 flex flex-col items-center justify-end p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" style="background: linear-gradient(to top, rgba(255,94,21,0.95) 0%, rgba(255,94,21,0.8) 40%, rgba(0,0,0,0.6) 100%);"><svg class="w-8 h-8 text-white mb-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg><span class="text-white font-heading font-bold text-lg">Verify Fit</span><span class="text-white text-sm mt-1">(615) 881-6968</span></div></div><div class="p-4"><h3 class="text-[#FF5E15] font-heading font-semibold text-base">High-Volume Grease Boxes</h3><p class="text-[#D4D4D4] text-xs mt-1 font-body">Extra large for heavy grease operations. Holds 50+ pounds.</p></div></a>
        <a href="tel:6158816968" class="group block bg-[#1A1A1A] border border-[#FF5E15]/40 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-white reveal-child"><div class="relative aspect-square bg-white rounded-t-xl overflow-hidden"><img src="/images/products/grease-trap-drip-pan.webp" alt="Grease trap drip pan ${name} - DDAN Hood Cleaning" class="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105" loading="lazy" /><div class="absolute inset-0 flex flex-col items-center justify-end p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" style="background: linear-gradient(to top, rgba(255,94,21,0.95) 0%, rgba(255,94,21,0.8) 40%, rgba(0,0,0,0.6) 100%);"><svg class="w-8 h-8 text-white mb-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg><span class="text-white font-heading font-bold text-lg">Verify Fit</span><span class="text-white text-sm mt-1">(615) 881-6968</span></div></div><div class="p-4"><h3 class="text-[#FF5E15] font-heading font-semibold text-base">Grease Containment Trays</h3><p class="text-[#D4D4D4] text-xs mt-1 font-body">Catches grease at fan drainage. Galvanized and stainless options.</p></div></a>
        <a href="tel:6158816968" class="group block bg-[#1A1A1A] border border-[#FF5E15]/40 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-white reveal-child"><div class="relative aspect-square bg-white rounded-t-xl overflow-hidden"><img src="/images/products/grease-pillow-pad.webp" alt="Grease absorbent pillow pad ${name} - DDAN Hood Cleaning" class="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105" loading="lazy" /><div class="absolute inset-0 flex flex-col items-center justify-end p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" style="background: linear-gradient(to top, rgba(255,94,21,0.95) 0%, rgba(255,94,21,0.8) 40%, rgba(0,0,0,0.6) 100%);"><svg class="w-8 h-8 text-white mb-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg><span class="text-white font-heading font-bold text-lg">Verify Fit</span><span class="text-white text-sm mt-1">(615) 881-6968</span></div></div><div class="p-4"><h3 class="text-[#FF5E15] font-heading font-semibold text-base">Absorbent Pads and Pillows</h3><p class="text-[#D4D4D4] text-xs mt-1 font-body">Disposable grease pads. Absorbs oil, repels water. Replace monthly.</p></div></a>
        <a href="tel:6158816968" class="group block bg-[#1A1A1A] border border-[#FF5E15]/40 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-white reveal-child"><div class="relative aspect-square bg-white rounded-t-xl overflow-hidden"><img src="/images/products/duct-access-door.webp" alt="Grease duct access door panel ${name} - DDAN Hood Cleaning" class="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105" loading="lazy" /><div class="absolute inset-0 flex flex-col items-center justify-end p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" style="background: linear-gradient(to top, rgba(255,94,21,0.95) 0%, rgba(255,94,21,0.8) 40%, rgba(0,0,0,0.6) 100%);"><svg class="w-8 h-8 text-white mb-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg><span class="text-white font-heading font-bold text-lg">Verify Fit</span><span class="text-white text-sm mt-1">(615) 881-6968</span></div></div><div class="p-4"><h3 class="text-[#FF5E15] font-heading font-semibold text-base">Grease Duct Access Doors</h3><p class="text-[#D4D4D4] text-xs mt-1 font-body">NFPA 96 required for duct cleaning access. All sizes available.</p></div></a>
        <a href="tel:6158816968" class="group block bg-[#1A1A1A] border border-[#FF5E15]/40 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-white reveal-child"><div class="relative aspect-square bg-white rounded-t-xl overflow-hidden"><img src="/images/products/grease-gutter-360.webp" alt="360 degree grease gutter containment ${name} - DDAN Hood Cleaning" class="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105" loading="lazy" /><div class="absolute inset-0 flex flex-col items-center justify-end p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" style="background: linear-gradient(to top, rgba(255,94,21,0.95) 0%, rgba(255,94,21,0.8) 40%, rgba(0,0,0,0.6) 100%);"><svg class="w-8 h-8 text-white mb-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg><span class="text-white font-heading font-bold text-lg">Verify Fit</span><span class="text-white text-sm mt-1">(615) 881-6968</span></div></div><div class="p-4"><h3 class="text-[#FF5E15] font-heading font-semibold text-base">Grease Gutters (360 Protection)</h3><p class="text-[#D4D4D4] text-xs mt-1 font-body">Full perimeter wrap-around grease capture for high-volume operations.</p></div></a>
      </div>
    </div>
  </section>

  <!-- ==================== HOOD SYSTEMS ==================== -->
  <section id="hood-systems" class="bg-[#111111] py-16 px-5 reveal">
    <div class="max-w-[1200px] mx-auto">
      <h2 class="text-[#FF5E15] font-heading font-bold text-2xl md:text-3xl mb-2 reveal-child">Complete Hood Systems and Kitchen Accessories in ${name}</h2>
      <p class="text-[#D4D4D4] font-body mb-8 reveal-child">Turnkey systems, safety components, and professional-grade accessories.</p>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        <a href="tel:6158816968" class="group block bg-[#1A1A1A] border border-[#FF5E15]/40 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-white reveal-child"><div class="relative aspect-square bg-white rounded-t-xl overflow-hidden"><img src="/images/products/complete-hood-system.webp" alt="Complete commercial kitchen hood system ${name} - DDAN Hood Cleaning" class="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105" loading="lazy" /><div class="absolute inset-0 flex flex-col items-center justify-end p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" style="background: linear-gradient(to top, rgba(255,94,21,0.95) 0%, rgba(255,94,21,0.8) 40%, rgba(0,0,0,0.6) 100%);"><svg class="w-8 h-8 text-white mb-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg><span class="text-white font-heading font-bold text-lg">Verify Fit</span><span class="text-white text-sm mt-1">(615) 881-6968</span></div></div><div class="p-4"><h3 class="text-[#FF5E15] font-heading font-semibold text-base">Complete Hood Systems</h3><p class="text-[#D4D4D4] text-xs mt-1 font-body">Full stainless steel canopy hoods. Type I and Type II. Custom-sized.</p></div></a>
        <a href="tel:6158816968" class="group block bg-[#1A1A1A] border border-[#FF5E15]/40 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-white reveal-child"><div class="relative aspect-square bg-white rounded-t-xl overflow-hidden"><img src="/images/products/fire-suppression-system.webp" alt="Kitchen fire suppression system UL 300 ${name} - DDAN Hood Cleaning" class="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105" loading="lazy" /><div class="absolute inset-0 flex flex-col items-center justify-end p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" style="background: linear-gradient(to top, rgba(255,94,21,0.95) 0%, rgba(255,94,21,0.8) 40%, rgba(0,0,0,0.6) 100%);"><svg class="w-8 h-8 text-white mb-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg><span class="text-white font-heading font-bold text-lg">Verify Fit</span><span class="text-white text-sm mt-1">(615) 881-6968</span></div></div><div class="p-4"><h3 class="text-[#FF5E15] font-heading font-semibold text-base">Fire Suppression Systems</h3><p class="text-[#D4D4D4] text-xs mt-1 font-body">UL 300 wet chemical. Inspection, recharge, and full installation.</p></div></a>
        <a href="tel:6158816968" class="group block bg-[#1A1A1A] border border-[#FF5E15]/40 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-white reveal-child"><div class="relative aspect-square bg-white rounded-t-xl overflow-hidden"><img src="/images/products/hood-light-canopy.webp" alt="Commercial hood canopy light fixture ${name} - DDAN Hood Cleaning" class="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105" loading="lazy" /><div class="absolute inset-0 flex flex-col items-center justify-end p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" style="background: linear-gradient(to top, rgba(255,94,21,0.95) 0%, rgba(255,94,21,0.8) 40%, rgba(0,0,0,0.6) 100%);"><svg class="w-8 h-8 text-white mb-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg><span class="text-white font-heading font-bold text-lg">Verify Fit</span><span class="text-white text-sm mt-1">(615) 881-6968</span></div></div><div class="p-4"><h3 class="text-[#FF5E15] font-heading font-semibold text-base">Hood Lights</h3><p class="text-[#D4D4D4] text-xs mt-1 font-body">Recessed and surface-mount canopy lighting. Tempered glass globes.</p></div></a>
      </div>
    </div>
  </section>

  <!-- TRUST BANNER -->
  <section class="bg-[#111111] py-12 px-5 reveal" style="border-top: 2px solid rgba(255,94,21,0.3); border-bottom: 2px solid rgba(255,94,21,0.3);">
    <div class="max-w-3xl mx-auto text-center">
      <h2 class="text-[#FF5E15] font-heading font-bold text-2xl md:text-3xl mb-8 reveal-child">The #1 Rated Commercial Hood Company in Tennessee</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-[#1A1A1A] border border-[#FF5E15] rounded-xl p-6 text-center reveal-child"><span class="text-[#FF5E15] font-heading font-bold text-4xl">51+</span><div class="text-[#FFB800] text-lg mt-1">&#9733;&#9733;&#9733;&#9733;&#9733;</div><span class="text-white text-sm">Google Reviews</span></div>
        <div class="bg-[#1A1A1A] border border-[#FF5E15] rounded-xl p-6 text-center reveal-child"><span class="text-[#FF5E15] font-heading font-bold text-4xl">5.0</span><div class="text-[#FFB800] text-lg mt-1">&#9733;&#9733;&#9733;&#9733;&#9733;</div><span class="text-white text-sm">Star Average</span></div>
        <div class="bg-[#1A1A1A] border border-[#FF5E15] rounded-xl p-6 text-center reveal-child"><span class="text-[#FF5E15] font-heading font-bold text-4xl">20+</span><div class="text-[#FFB800] text-lg mt-1">&#9733;&#9733;&#9733;&#9733;&#9733;</div><span class="text-white text-sm">Facebook Reviews</span></div>
      </div>
      <p class="text-gray-300 text-sm mt-6 reveal-child">Trusted by restaurants, churches, schools, and institutions across Middle Tennessee since 2007.</p>
    </div>
  </section>

  <!-- TWO AUDIENCES -->
  <section class="bg-black py-12 md:py-16 lg:py-20 reveal">
    <div class="max-w-[1280px] mx-auto px-5">
      <h2 class="font-heading text-[#FF5E15] text-2xl md:text-4xl font-bold mb-10 text-center reveal-child">Who We Serve in ${name}</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-[#1A1A1A] border border-[#333] rounded-2xl p-8 reveal-child">
          <div class="w-14 h-14 bg-[#FF5E15]/10 rounded-xl flex items-center justify-center mb-5"><svg class="w-7 h-7 text-[#FF5E15]" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg></div>
          <h3 class="font-heading text-white text-xl font-bold mb-3">Restaurant Owners & Managers</h3>
          <p class="text-[#D4D4D4] mb-4">Your fan is down, your kitchen is closed, and your staff is standing around. We get that. Call us and we will get your part sourced and installed as fast as possible — often same day.</p>
          <a href={\`tel:\${business.phoneRaw}\`} class="text-[#FF5E15] font-heading font-semibold hover:underline">{business.phone} &rarr;</a>
        </div>
        <div class="bg-[#1A1A1A] border border-[#333] rounded-2xl p-8 reveal-child">
          <div class="w-14 h-14 bg-[#FF5E15]/10 rounded-xl flex items-center justify-center mb-5"><svg class="w-7 h-7 text-[#FF5E15]" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M11.42 15.17l-5.66-5.66a8 8 0 1111.31 0l-5.65 5.66zM12 12a3 3 0 100-6 3 3 0 000 6z"/><path d="M12 22c4-4 8-7.58 8-12a8 8 0 10-16 0c0 4.42 4 8 8 12z"/></svg></div>
          <h3 class="font-heading text-white text-xl font-bold mb-3">Hood Cleaning Companies</h3>
          <p class="text-[#D4D4D4] mb-4">Need parts for your cleaning clients? We supply hinge kits, access panels, grease cups, filters, and containment systems at contractor pricing. One call, we handle sourcing.</p>
          <a href={\`tel:\${business.phoneRaw}\`} class="text-[#FF5E15] font-heading font-semibold hover:underline">Contractor Line: {business.phone} &rarr;</a>
        </div>
      </div>
    </div>
  </section>

  <!-- BRANDS -->
  <section class="bg-[#111111] py-12 md:py-16 reveal">
    <div class="max-w-[1280px] mx-auto px-5 text-center">
      <h2 class="font-heading text-[#FF5E15] text-xl md:text-2xl font-bold mb-8 reveal-child">Brands We Source & Install</h2>
      <div class="flex flex-wrap justify-center gap-3 reveal-child">
        {['Captive-Aire', 'Greenheck', 'Loren Cook', 'Dayton', 'DERA', 'Fantech', 'CaptiveAire', 'Accurex', 'Streivor', 'Larkin', 'Ventmaster', 'Avtec'].map(brand => (
          <span class="bg-[#1A1A1A] border border-[#333] text-[#D4D4D4] font-heading text-sm px-5 py-2 rounded-full">{brand}</span>
        ))}
      </div>
    </div>
  </section>

  <!-- BOTTOM ROW 1: EQUIPMENT + COMPLIANCE -->
  <section class="bg-[#111111] py-12 md:py-16 lg:py-20 reveal">
    <div class="max-w-[1280px] mx-auto px-5">
      <div class="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-8">
        <div class="reveal-child">
          <h2 class="font-heading text-[#FF5E15] text-2xl md:text-4xl font-bold mb-8">Why ${name} Restaurants Choose DDAN for Parts and Installation</h2>
          <div class="space-y-6">
            <div>
              <h3 class="font-heading text-white text-lg font-semibold mb-2">Local Conditions That Destroy Equipment</h3>
              <p class="text-[#D4D4D4]">${cs.whyThisCityNeeds}</p>
            </div>
            <div>
              <h3 class="font-heading text-white text-lg font-semibold mb-2">Common Problems in ${name}</h3>
              <p class="text-[#D4D4D4]">${ind.commonProblems}</p>
            </div>
          </div>
        </div>
        <div class="reveal-child">
          <h2 class="font-heading text-[#FF5E15] text-2xl md:text-4xl font-bold mb-8">${name} Commercial Kitchen Compliance</h2>
          <div class="space-y-5">
            <p class="text-[#D4D4D4]">The <strong class="text-white">${comp.fireMarshal}</strong> enforces NFPA 96 for all commercial kitchen exhaust systems. Inspectors check for hinge kits on upblast fans, fire-rated access panels on ductwork, proper grease containment, and clean filters. Every part we install meets or exceeds these standards.</p>
            <p class="text-[#D4D4D4]">${comp.fogProgram} Proper grease containment on your rooftop exhaust fans keeps you compliant on both fire and environmental codes.</p>
            <p class="text-[#D4D4D4]">Every part we install is documented with photos and service records for your compliance files. Learn more about <a href="/nfpa-code-96-standards/" class="text-[#FF5E15] hover:underline">NFPA 96 standards and what they mean for your kitchen</a>.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- BOTTOM ROW 2: SERVICE AREA + FAQ -->
  <section class="bg-black py-12 md:py-16 lg:py-20 reveal">
    <div class="max-w-[1280px] mx-auto px-5">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="reveal-child">
          <h2 class="font-heading text-[#FF5E15] text-2xl md:text-4xl font-bold mb-5">${name} Parts and Installation Service Area</h2>
          <p class="text-[#D4D4D4] text-lg mb-8 max-w-2xl">${cs.serviceAreaParagraph}</p>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
${neighborCityLinks}
              { name: '${name}', href: '/repair/${slug}/' },
            ].map(city => (
              <a href={city.href} class="flex items-center gap-2 bg-[#1A1A1A] border border-[#333] hover:border-[#FF5E15] rounded-xl px-4 py-3 transition-all duration-300">
                <svg class="w-4 h-4 text-[#FF5E15] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/></svg>
                <span class="text-[#D4D4D4] font-heading text-sm">{city.name}</span>
              </a>
            ))}
          </div>
        </div>
        <div class="reveal-child">
          <h2 class="font-heading text-[#FF5E15] text-2xl md:text-4xl font-bold mb-10">Frequently Asked Questions — ${name} Parts and Installation</h2>
          <div class="space-y-4">
            {faqs.map(faq => (
              <details class="bg-[#1A1A1A] border border-[#333] rounded-xl overflow-hidden transition-all duration-300">
                <summary class="flex items-center justify-between cursor-pointer px-6 py-5 text-white font-heading font-semibold">
                  <span class="pr-4">{faq.q}</span>
                  <svg class="faq-icon w-5 h-5 text-[#FF5E15] flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"/></svg>
                </summary>
                <div class="px-6 pb-5">
                  <p class="text-[#D4D4D4]">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- DON'T WAIT CTA -->
  <TruckCTA />

  <style>
    details summary::-webkit-details-marker { display: none; }
    details summary { list-style: none; }
    details[open] .faq-icon { transform: rotate(180deg); }
    details[open] { border-color: #FF5E15; }
    .faq-icon { transition: transform 0.2s ease; }
  </style>
</BaseLayout>`;
}

// Generate all 12 files
let count = 0;
for (const city of CITIES) {
  const data = DATA[city.key];
  if (!data) {
    console.error(`No data found for key: ${city.key}`);
    continue;
  }

  // Repair page
  const repairPath = join(ROOT, 'src/pages/repair', `${city.slug}.astro`);
  writeFileSync(repairPath, buildRepairPage(city, data), 'utf8');
  console.log(`WROTE: ${repairPath}`);
  count++;

  // Parts-installation page
  const partsPath = join(ROOT, 'src/pages/parts-installation', `${city.slug}.astro`);
  writeFileSync(partsPath, buildPartsPage(city, data), 'utf8');
  console.log(`WROTE: ${partsPath}`);
  count++;
}

console.log(`\nDone! Generated ${count} files.`);
