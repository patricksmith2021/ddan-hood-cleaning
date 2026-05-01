/**
 * diversify-h2s.mjs
 * Distributes 5-variant H2 headings across fan-hood-installation (27 pages)
 * and 4-variant H2 headings across targeted fan-repair pages.
 *
 * Run: node scripts/diversify-h2s.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');

// ── Utility ───────────────────────────────────────────────────────────────────

/** Convert a filename slug to a display city name */
function slugToCity(slug) {
  // Remove trailing -tn or -ky and split on hyphens
  const base = slug.replace(/-(tn|ky)$/, '');
  return base
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/** Read, replace, write a file */
function replaceInFile(filePath, oldText, newText) {
  const content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes(oldText)) {
    console.warn(`  [SKIP] "${oldText}" not found in ${path.basename(filePath)}`);
    return false;
  }
  const updated = content.replace(oldText, newText);
  fs.writeFileSync(filePath, updated, 'utf8');
  return true;
}

// ── FAN-HOOD-INSTALLATION: 4 positions × 5 variants ──────────────────────────

const installationDir = path.join(PROJECT_ROOT, 'src/pages/fan-hood-installation');

// Sorted list of city page files (alphabetical = deterministic index)
const installationFiles = fs
  .readdirSync(installationDir)
  .filter(f => f.endsWith('.astro') && f !== 'index.astro')
  .sort();

console.log(`\n=== fan-hood-installation: ${installationFiles.length} pages ===\n`);

// Position A variants — "Complete Installation Services for {City} Kitchens"
const posA = [
  city => `Complete Installation Services for ${city} Kitchens`,
  city => `Full Kitchen Exhaust Installation in ${city}`,
  city => `${city}'s Complete Hood and Fan Installation Team`,
  city => `Exhaust System Installation Built for ${city} Kitchens`,
  city => `End-to-End Kitchen Ventilation Installation in ${city}`,
];

// Position B variants — "Make-Up Air Unit Installation for {City} Kitchens"
const posB = [
  city => `Make-Up Air Unit Installation for ${city} Kitchens`,
  city => `MUA Unit Supply and Installation in ${city}`,
  city => `${city} Make-Up Air Solutions for Commercial Kitchens`,
  city => `Balanced Ventilation: Make-Up Air Installation in ${city}`,
  city => `Heated and Unheated MUA Units for ${city} Restaurants`,
];

// Position C variants — "Supporting Installation Services in {City}"
const posC = [
  city => `Supporting Installation Services in ${city}`,
  city => `Complete Compliance Installations for ${city} Kitchens`,
  city => `Additional Kitchen Exhaust Services in ${city}`,
  city => `Code-Required Installation Add-Ons in ${city}`,
  city => `Full-Scope Exhaust Compliance in ${city}`,
];

// Position D variants — "Who We Serve in {City}"
const posD = [
  city => `Who We Serve in ${city}`,
  city => `Which ${city} Businesses We Serve`,
  city => `${city} Kitchens That Call DDAN`,
  city => `Commercial Kitchens We Service in ${city}`,
  city => `Every Kitchen Type in ${city}`,
];

installationFiles.forEach((filename, idx) => {
  const filePath = path.join(installationDir, filename);
  const slug = filename.replace('.astro', '');
  const city = slugToCity(slug);
  const variantIdx = idx % 5;

  console.log(`[${idx}] ${filename} → city="${city}" variant=${variantIdx}`);

  // Position A
  const oldA = `Complete Installation Services for ${city} Kitchens`;
  const newA = posA[variantIdx](city);
  if (oldA !== newA) {
    const ok = replaceInFile(filePath, oldA, newA);
    if (ok) console.log(`  A: "${oldA}" → "${newA}"`);
  } else {
    console.log(`  A: keeping variant 0 (no change needed)`);
  }

  // Position B
  const oldB = `Make-Up Air Unit Installation for ${city} Kitchens`;
  const newB = posB[variantIdx](city);
  if (oldB !== newB) {
    const ok = replaceInFile(filePath, oldB, newB);
    if (ok) console.log(`  B: "${oldB}" → "${newB}"`);
  } else {
    console.log(`  B: keeping variant 0 (no change needed)`);
  }

  // Position C
  const oldC = `Supporting Installation Services in ${city}`;
  const newC = posC[variantIdx](city);
  if (oldC !== newC) {
    const ok = replaceInFile(filePath, oldC, newC);
    if (ok) console.log(`  C: "${oldC}" → "${newC}"`);
  } else {
    console.log(`  C: keeping variant 0 (no change needed)`);
  }

  // Position D
  const oldD = `Who We Serve in ${city}`;
  const newD = posD[variantIdx](city);
  if (oldD !== newD) {
    const ok = replaceInFile(filePath, oldD, newD);
    if (ok) console.log(`  D: "${oldD}" → "${newD}"`);
  } else {
    console.log(`  D: keeping variant 0 (no change needed)`);
  }
});

// ── FAN-REPAIR: 2 repeated H2s, each with 4 unique variants ─────────────────

const repairDir = path.join(PROJECT_ROOT, 'src/pages/fan-repair');

// "Fast Fan Diagnosis. Same-Day Repair." — 6 files, give each a different heading
const fastDiagFiles = [
  'brentwood-tn.astro',
  'franklin-tn.astro',
  'hermitage-tn.astro',
  'mount-juliet-tn.astro',
  'shelbyville-tn.astro',
  'white-house-tn.astro',
];

// 4 variants distributed across 6 files (0,1,2,3,0,1 — first two reuse but
// they're far apart geographically so it's acceptable)
const fastDiagVariants = [
  'Fast Fan Diagnosis. Same-Day Repair.',           // 0 — original kept for brentwood
  'Fan Down? We Diagnose and Fix It Today.',         // 1 — franklin
  'Dead Fan, Open Kitchen — We Fix It Fast.',        // 2 — hermitage
  'Exhaust Fan Stopped? On-Site Diagnosis Today.',   // 3 — mount-juliet
  'No Airflow? Fan Repair Starts With a Fast Diagnosis.', // 4 — shelbyville
  'Fan Failure Diagnosed and Repaired Same Day.',    // 5 — white-house
];

console.log(`\n=== fan-repair: Fast Fan Diagnosis group (${fastDiagFiles.length} files) ===\n`);

fastDiagFiles.forEach((filename, idx) => {
  const filePath = path.join(repairDir, filename);
  const oldText = 'Fast Fan Diagnosis. Same-Day Repair.';
  const newText = fastDiagVariants[idx];
  if (oldText !== newText) {
    const ok = replaceInFile(filePath, oldText, newText);
    if (ok) console.log(`  ${filename}: "${oldText}" → "${newText}"`);
  } else {
    console.log(`  ${filename}: keeping original (variant 0)`);
  }
});

// "Expert Repairs — Fans First" — 6 files
const expertFansFiles = [
  'antioch-tn.astro',
  'fairview-tn.astro',
  'hendersonville-tn.astro',
  'madison-tn.astro',
  'portland-tn.astro',
  'thompsons-station-tn.astro',
];

const expertFansVariants = [
  'Expert Repairs — Fans First',                          // 0 — antioch (keep original)
  'Fans Are 90% of Repairs — We Know Them Cold.',         // 1 — fairview
  'Every Repair Starts With the Fan. Every Time.',         // 2 — hendersonville
  'Fan-First Repair Philosophy — Verified by Results.',    // 3 — madison
  'Commercial Fans Repaired Right. No Guesswork.',         // 4 — portland
  'Exhaust Fan Expertise That Other Shops Don\'t Have.',   // 5 — thompsons-station
];

console.log(`\n=== fan-repair: Expert Repairs group (${expertFansFiles.length} files) ===\n`);

expertFansFiles.forEach((filename, idx) => {
  const filePath = path.join(repairDir, filename);
  const oldText = 'Expert Repairs — Fans First';
  const newText = expertFansVariants[idx];
  if (oldText !== newText) {
    const ok = replaceInFile(filePath, oldText, newText);
    if (ok) console.log(`  ${filename}: "${oldText}" → "${newText}"`);
  } else {
    console.log(`  ${filename}: keeping original (variant 0)`);
  }
});

console.log('\n✓ Done. Run: npm run build\n');
