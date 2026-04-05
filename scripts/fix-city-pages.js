const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');

const cityFixes = {
  'mount-juliet': {
    whoServe: 'Providence Marketplace restaurants, Lebanon Road sports bars, local pizza joints, fast-casual franchises, corporate chain dining, food trucks, hotel kitchens, and catering operations. If you cook commercially in Mount Juliet, we clean your hood system.',
    whoServeInst: 'Mount Juliet public schools, churches, assisted living facilities, corporate cafeterias, and medical offices. Large-scale systems with strict compliance requirements.',
    whyH3_1: 'Providence Marketplace: 16-Hour Runtimes',
    whyP_1: 'High-volume corporate kitchens in Providence push exhaust systems 16+ hours a day. That runtime accelerates grease buildup far beyond normal schedules and chews through factory fan belts. Most need quarterly or monthly cleaning — and many need <a href="/repair/mount-juliet-tn/" class="text-[#FF5E15] hover:underline">emergency fan repair</a> between cleanings.',
    whyH3_3: 'New Construction: TPO Roof Protection',
    whyP_3: 'Newer Mount Juliet developments use white TPO roofing that grease runoff will stain, degrade, and void the manufacturer warranty. Proper rooftop grease containment — which we inspect and service on every cleaning visit — prevents thousands of dollars in roof damage. Landlords in Providence have zero tolerance for this.',
    compP1: 'The <strong class="text-white">Fire Department of Mt. Juliet (FDMJ)</strong> closely monitors explosive growth areas, strictly enforcing NFPA 96 standards on all new builds and routine inspections. Inspectors check for bare-metal cleanliness, proper fire-rated access panels, functional hinge kits, and current service documentation.',
    compP2: '<strong class="text-white">West Wilson Utility District</strong> is incredibly strict regarding F.O.G. management to protect the infrastructure of the \'City Between the Lakes.\' Rooftop grease runoff carries severe penalties. Proper grease containment on your rooftop fans keeps you compliant.',
    repairWhoServe: 'Providence Marketplace restaurants running 16-hour shifts, Lebanon Road sports bars, fast-casual spots, corporate chain dining pushing through motors, food halls, hotel kitchens, and catering operations. Every exhaust fan fails eventually — we fix them all.',
    repairWhoServeInst: 'Mount Juliet public schools, churches, assisted living facilities, corporate cafeterias, and medical offices. Multi-fan systems with coordinated repair schedules and strict compliance requirements.',
  },
  'hermitage': {
    whoServe: 'Lebanon Pike franchises, Old Hickory Blvd restaurants, Percy Priest lakeside grills, local meat-and-threes, fast food chains, takeout operations, and casual dining spots. If you cook commercially in Hermitage, we clean your hood system.',
    whoServeInst: 'TriStar Summit Medical Center kitchen, Hermitage public schools, churches, assisted living facilities, and corporate cafeterias. Large-scale systems with strict Metro Nashville compliance requirements.',
    whyH3_1: 'Lebanon Pike: Aging Infrastructure',
    whyP_1: 'Many Hermitage restaurants operate with exhaust fans past their useful life, leading to severe vibrations, frequent belt snaps, and total motor failures. Aging systems need more frequent cleaning — and many need <a href="/repair/hermitage-tn/" class="text-[#FF5E15] hover:underline">emergency fan repair</a> between cleanings.',
    whyH3_3: 'Percy Priest Area: Newer Construction',
    whyP_3: 'Newer Hermitage outparcels use TPO roofing that grease runoff will stain, degrade, and void the manufacturer warranty. Proper rooftop grease containment — which we inspect and service on every cleaning visit — prevents thousands of dollars in roof damage.',
    compP1: 'The <strong class="text-white">Metro Nashville Fire Marshal\'s Office</strong> holds aging Hermitage infrastructure to modern NFPA 96 standards, frequently citing restaurants for missing hinge kits or inaccessible ductwork. Inspectors check for bare-metal cleanliness, proper fire-rated access panels, and current service documentation.',
    compP2: '<strong class="text-white">Metro Water Services (MWS)</strong> rigorously enforces F.O.G. regulations to protect nearby Percy Priest Lake and the broader municipal water system. Proper grease containment on your rooftop fans keeps you compliant on both fire and environmental codes.',
    repairWhoServe: 'Lebanon Pike franchises running through aging motors, Old Hickory Blvd restaurants, Percy Priest lakeside grills, local meat-and-threes, fast food chains, and casual dining. Every exhaust fan fails eventually — we fix them all.',
    repairWhoServeInst: 'TriStar Summit Medical Center, Hermitage public schools, churches, assisted living facilities, and corporate cafeterias. Multi-fan systems with coordinated repair schedules and strict Metro Nashville compliance requirements.',
  },
  'madison': {
    whoServe: 'Gallatin Pike taquerias, Rivergate Mall restaurants, soul food spots, classic diners, fast food chains, and diverse international cuisine. If you cook commercially in Madison, we clean your hood system.',
    whoServeInst: 'Madison public schools, churches, assisted living facilities, corporate cafeterias, and institutional kitchens. Large-scale systems with strict Metro Nashville compliance requirements.',
    whyH3_1: 'Gallatin Pike: Concept Turnover',
    whyP_1: 'Frequent concept turnover in older Madison buildings leads to massive compliance issues. New high-heat cooking styles overwhelm existing exhaust systems, accelerating grease buildup. These kitchens need aggressive, frequent cleaning — and many need <a href="/repair/madison-tn/" class="text-[#FF5E15] hover:underline">emergency fan repair</a> as aging motors fail under the new load.',
    whyH3_3: 'Rivergate Area: TPO Roof Protection',
    whyP_3: 'Newer Madison construction near Rivergate uses TPO roofing that grease runoff will stain, degrade, and void the manufacturer warranty. Proper rooftop grease containment — which we inspect and service on every cleaning visit — prevents thousands of dollars in roof damage.',
    compP1: 'The <strong class="text-white">Metro Nashville Fire Marshal\'s Office</strong> heavily targets the older Gallatin Pike corridor because restaurant spaces change concepts frequently, often without properly updating their ventilation or fire suppression systems. Inspectors check for bare-metal cleanliness, proper fire-rated access panels, and current service documentation.',
    compP2: '<strong class="text-white">Metro Water Services (MWS)</strong> monitors F.O.G. levels aggressively, making rooftop containment and grease trap compliance a major priority. Proper grease containment on your rooftop fans keeps you compliant on both fire and environmental codes.',
    repairWhoServe: 'Gallatin Pike taquerias with high-heat cooking overwhelming motors, Rivergate Mall restaurants, soul food spots, classic diners burning through components, fast food chains, and diverse international cuisine. Every exhaust fan fails eventually — we fix them all.',
    repairWhoServeInst: 'Madison public schools, churches, assisted living facilities, corporate cafeterias, and institutional kitchens. Multi-fan systems with coordinated repair schedules and strict Metro Nashville compliance requirements.',
  },
  'la-vergne': {
    whoServe: 'Murfreesboro Road fast food, Interchange City industrial cafeterias, taquerias, quick-service lunch spots, and high-volume Hispanic cuisine. If you cook commercially in La Vergne, we clean your hood system.',
    whoServeInst: 'Industrial park commissaries, La Vergne public schools, churches, assisted living facilities, and institutional kitchens. Large-scale systems with strict compliance requirements.',
    whyH3_1: 'Interchange City: Industrial Lunch Rush',
    whyP_1: 'Restaurants serving the massive logistics workforce at Interchange City run their fryers and grills non-stop. This constant, high-heat operation rapidly produces grease buildup that demands aggressive cleaning — and many need <a href="/repair/la-vergne-tn/" class="text-[#FF5E15] hover:underline">emergency fan repair</a> as motors burn out under the load.',
    whyH3_3: 'Murfreesboro Road: Older Roof Protection',
    whyP_3: 'Many La Vergne commercial buildings lack proper grease containment, allowing runoff to damage older commercial roofs. Proper rooftop grease containment — which we inspect and service on every cleaning visit — prevents costly roof repairs and keeps you compliant with La Vergne Public Works regulations.',
    compP1: 'The <strong class="text-white">La Vergne Fire Department</strong> strictly enforces NFPA 96 standards, heavily targeting the densely packed Murfreesboro Road corridor. Inspectors check for bare-metal cleanliness, proper fire-rated access panels, functional hinge kits, and current service documentation.',
    compP2: '<strong class="text-white">La Vergne Public Works</strong> actively monitors the municipal sewer system for F.O.G. violations, emphasizing the need for leak-free rooftop grease containment. Proper grease containment on your rooftop fans keeps you compliant on both fire and environmental codes.',
    repairWhoServe: 'Murfreesboro Road fast food running non-stop lunch shifts, Interchange City industrial cafeterias, taquerias with high-heat griddles, and quick-service spots. Every exhaust fan fails eventually — we fix them all.',
    repairWhoServeInst: 'Industrial park commissaries, La Vergne public schools, churches, assisted living facilities, and institutional kitchens. Multi-fan systems with coordinated repair schedules and strict compliance requirements.',
  }
};

function fixFile(filePath, citySlug, data, type) {
  if (!fs.existsSync(filePath)) { console.log('SKIP: ' + filePath); return; }
  let c = fs.readFileSync(filePath, 'utf8');

  // Fix "Who We Serve" restaurants
  const whoPattern = /Broadway honky-tonks.*?If you cook commercially in .*?, we clean your hood system\./s;
  const repairWhoPattern = /Broadway honky-tonks.*?Every exhaust fan fails eventually — we fix them all\./s;

  if (type === 'cleaning' && data.whoServe) {
    c = c.replace(whoPattern, data.whoServe);
  }
  if (type === 'repair' && data.repairWhoServe) {
    c = c.replace(repairWhoPattern, data.repairWhoServe);
  }

  // Fix "Who We Serve" institutions
  const instPattern = /Vanderbilt and Belmont dining halls.*?Large-scale systems with strict compliance requirements\./s;
  const repairInstPattern = /Vanderbilt and Belmont dining halls.*?strict compliance requirements\./s;

  if (type === 'cleaning' && data.whoServeInst) {
    c = c.replace(instPattern, data.whoServeInst);
  }
  if (type === 'repair' && data.repairWhoServeInst) {
    c = c.replace(repairInstPattern, data.repairWhoServeInst);
  }

  // Fix Why H3 #1 (Broadway -> city-specific)
  if (data.whyH3_1) {
    c = c.replace(/Broadway: 18-Hour Runtimes/, data.whyH3_1);
    c = c.replace(/Broadway & Downtown: Motor Burnout/, data.whyH3_1);
    c = c.replace(/Broadway: 18-Hour Motor Punishment/, data.whyH3_1);
  }
  if (data.whyP_1) {
    c = c.replace(/Lower Broadway honky-tonks push.*?cannot handle the load without maintenance\./s, data.whyP_1);
    c = c.replace(/Lower Broadway honky-tonks push.*?knows how to reach your rooftop in the dark\./s, data.whyP_1);
  }

  // Fix Why H3 #3 (The Gulch -> city-specific)
  if (data.whyH3_3) {
    c = c.replace(/The Gulch and Midtown: TPO Roof Protection/, data.whyH3_3);
    c = c.replace(/The Gulch & Midtown: TPO Roof Damage/, data.whyH3_3);
  }
  if (data.whyP_3) {
    // Match the paragraph that starts with "Newer CITY buildings" and ends differently depending on page type
    const tpoPatterns = [
      /Newer \w[\w\s]+ buildings use white TPO roofing.*?this is critical\./s,
      /Newer \w[\w\s]+ construction uses white TPO roofing.*?this is critical\./s,
    ];
    for (const pat of tpoPatterns) {
      if (pat.test(c)) { c = c.replace(pat, data.whyP_3); break; }
    }
  }

  // Fix compliance paragraphs in cleaning pages
  if (type === 'cleaning' && data.compP1) {
    // Replace garbled compliance P1
    c = c.replace(/The <strong class="text-white">.*?<\/strong> enforces NFPA 96 with strict compliance standards\. .*?<\/p>/s,
      data.compP1 + '</p>');
  }
  if (type === 'cleaning' && data.compP2) {
    // Replace garbled compliance P2
    const compP2Pat = /<strong class="text-white">.*?<\/strong> enforces Fats, Oils, and Grease \(FOG\) regulations targeting rooftop grease runoff.*?environmental codes\.<\/p>/s;
    if (compP2Pat.test(c)) {
      c = c.replace(compP2Pat, data.compP2 + '</p>');
    }
  }

  fs.writeFileSync(filePath, c, 'utf8');
  console.log('Fixed: ' + filePath);
}

for (const [citySlug, data] of Object.entries(cityFixes)) {
  fixFile(path.join(root, 'src/pages/cleaning', citySlug + '-tn.astro'), citySlug, data, 'cleaning');
  fixFile(path.join(root, 'src/pages/repair', citySlug + '-tn.astro'), citySlug, data, 'repair');
}

console.log('Done!');
