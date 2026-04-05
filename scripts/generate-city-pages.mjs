/**
 * Generate city pages for cleaning, repair, and parts-installation verticals
 * by adapting the Nashville template with city-specific content.
 *
 * Usage: node scripts/generate-city-pages.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PAGES = path.join(ROOT, 'src', 'pages');

// City configurations
const cities = {
  murfreesboro: {
    name: 'Murfreesboro', state: 'TN', slug: 'murfreesboro-tn',
    verticals: ['cleaning', 'repair', 'parts-installation'],
    titlePattern: (service) => `${service} in Murfreesboro, TN | DDAN`,
    neighbors: {
      cleaning: [
        { name: 'Smyrna', href: '/cleaning/smyrna-tn/' },
        { name: 'La Vergne', href: '/cleaning/la-vergne-tn/' },
        { name: 'Shelbyville', href: '/cleaning/shelbyville-tn/' },
      ],
      repair: [
        { name: 'Smyrna', href: '/repair/smyrna-tn/' },
        { name: 'La Vergne', href: '/repair/la-vergne-tn/' },
        { name: 'Shelbyville', href: '/repair/shelbyville-tn/' },
      ],
      'parts-installation': [
        { name: 'Smyrna', href: '/parts-installation/smyrna-tn/' },
        { name: 'La Vergne', href: '/parts-installation/la-vergne-tn/' },
        { name: 'Shelbyville', href: '/parts-installation/shelbyville-tn/' },
      ],
    },
    fireMarshal: 'Murfreesboro Fire Rescue Department (MFRD)',
    fogProgram: 'Murfreesboro Water Resources Department',
    localLandmarks: 'MTSU campus, The Avenue, Medical Center Parkway corridor',
    whoWeServe: {
      restaurants: 'MTSU campus sports bars, wing restaurants along The Avenue, Medical Center Parkway fast-casual chains, downtown square cafes, BBQ joints, food trucks, hotel kitchens, and catering operations. If you cook commercially in Murfreesboro, we handle your exhaust system.',
      institutions: 'Middle Tennessee State University dining halls, Murfreesboro Medical Clinic, area churches, schools, assisted living facilities, corporate cafeterias, and county government facilities. Large-scale systems with strict compliance requirements.',
    },
    whyCity: {
      heading1: 'MTSU: High-Volume Sports Bar District',
      text1: 'The massive MTSU student population fuels a thriving sports bar and wing restaurant district. These kitchens run fryers constantly during game days and school sessions, producing extreme grease loads that overwhelm standard cleaning schedules. Most MTSU-area restaurants need quarterly or monthly cleaning to stay compliant with MFRD inspectors.',
      heading2: 'The Avenue: TPO Roof Protection',
      text2: 'The Avenue and newer Medical Center Parkway developments use expensive white TPO roofing that grease runoff will stain, degrade, and void the manufacturer warranty. Proper rooftop grease containment — which we inspect and service on every visit — prevents thousands of dollars in roof damage.',
      heading3: 'Rutherford County Growth',
      text3: 'Murfreesboro is one of the fastest-growing cities in Tennessee. New restaurants open monthly, and each one needs NFPA 96 compliant exhaust systems from day one. MFRD\'s Community Risk Reduction Division uses modern tracking systems and aggressively pursues violations — proactive maintenance is essential.',
    },
    complianceText: `The <strong class="text-white">Murfreesboro Fire Rescue Department (MFRD)</strong> enforces NFPA 96 with a highly proactive approach. Their Community Risk Reduction Division uses modern tracking systems to monitor business compliance and aggressively pursues violations. Inspectors check for bare-metal cleanliness, proper fire-rated access panels, functional hinge kits on upblast fans, current service tags, and documented cleaning history.`,
    complianceText2: `<strong class="text-white">Murfreesboro Water Resources Department</strong> operates a very strict Fats, Oils, and Grease (FOG) program. Rooftop grease leaks that reach storm drains trigger severe municipal fines. Proper grease containment on your rooftop fans keeps you compliant on both fire and environmental codes.`,
    serviceArea: 'We serve all of Murfreesboro and Rutherford County — downtown square, The Avenue, Medical Center Parkway, MTSU campus area, and every neighborhood in between.',
    faqs: {
      cleaning: [
        { q: 'What happens if Murfreesboro Fire Rescue finds my hood non-compliant?', a: "MFRD's Community Risk Reduction Division can issue citations, mandate immediate remediation, or in severe cases, temporarily shut down cooking operations until a certified NFPA 96 cleaning is completed and documented." },
        { q: 'How often should Murfreesboro sports bars have their hoods cleaned?', a: 'High-volume sports bars and wing restaurants near MTSU typically require monthly cleaning due to continuous deep-frying. Standard restaurants need quarterly service. The schedule depends on cooking volume and grease accumulation rate per NFPA 96 Table 11.4.' },
        { q: 'Can heavy grease damage my TPO roof at The Avenue?', a: 'Yes. Newer Murfreesboro developments use white TPO roofing that grease runoff will stain and degrade, voiding manufacturer warranties. Proper rooftop grease containment prevents this damage entirely.' },
        { q: 'How long does a commercial hood cleaning take?', a: 'Most single-hood restaurant systems take 3-5 hours for a thorough bare-metal cleaning. Larger systems with multiple hoods or extensive ductwork can take 6-8 hours. We schedule overnight so your kitchen is ready by morning.' },
      ],
      repair: [
        { q: 'How fast can DDAN respond to an emergency fan failure in Murfreesboro?', a: 'For Murfreesboro locations, our emergency team typically arrives within 1-2 hours. We carry common motors, belts, and bearings on every truck for same-day repair.' },
        { q: 'What happens if Murfreesboro Fire Rescue finds my exhaust system non-compliant?', a: "MFRD's Community Risk Reduction Division can issue citations, mandate immediate remediation, or temporarily shut down cooking operations. A non-functional exhaust fan is an immediate code violation." },
        { q: 'Do you repair all brands of commercial exhaust fans?', a: 'Yes. We service CaptiveAire, Loren Cook, Canarm, NAKS, EconAir, Greenheck, Accurex, PennBarry, Dayton, Fantech, and all other commercial kitchen exhaust fan brands.' },
        { q: 'Can a vibrating exhaust fan be fixed or does it need replacement?', a: 'Most vibrating fans can be repaired. Severe vibration usually indicates an imbalanced impeller wheel due to grease buildup, a failing motor bearing, or an uneven belt. We diagnose the root cause and fix it on-site.' },
      ],
      'parts-installation': [
        { q: 'What happens if Murfreesboro Fire Rescue finds my hood non-compliant?', a: "MFRD's Community Risk Reduction Division can issue citations, mandate immediate remediation, or temporarily shut down cooking operations. Every part we install — from hinge kits to access panels to grease containment — is NFPA 96 compliant and documented with photos." },
        { q: 'Can heavy grease damage my TPO roof at The Avenue?', a: 'Yes. Newer Murfreesboro developments use white TPO roofing that grease runoff will stain and degrade. Our rooftop grease containment systems — boxes, trays, and absorbent pads — prevent grease from reaching your membrane.' },
        { q: 'Why do I need an access panel installed in my kitchen ductwork?', a: 'NFPA 96 code requires fire-rated access panels at every change of direction in your ductwork so technicians can clean the entire system to bare metal. Many older builds near the Murfreesboro square lack these, making them technically non-compliant.' },
        { q: 'How fast can you get parts to a Murfreesboro restaurant?', a: 'We stock common motors, belts, bearings, filters, hinge kits, and grease cups locally. For in-stock parts, same-day delivery is standard. Specialty items are typically next-day via our distributor network.' },
      ],
    },
  },
  clarksville: {
    name: 'Clarksville', state: 'TN', slug: 'clarksville-tn',
    verticals: ['repair', 'parts-installation'],
    titlePattern: (service) => `Clarksville ${service} | 24/7 | DDAN`,
    neighbors: {
      repair: [
        { name: 'Fort Campbell', href: '/repair/fort-campbell-ky/' },
        { name: 'Springfield', href: '/repair/springfield-tn/' },
      ],
      'parts-installation': [
        { name: 'Fort Campbell', href: '/parts-installation/fort-campbell-ky/' },
        { name: 'Springfield', href: '/parts-installation/springfield-tn/' },
      ],
    },
    fireMarshal: 'Clarksville Fire Rescue - Fire Prevention Bureau',
    fogProgram: 'Clarksville Gas & Water',
    localLandmarks: 'Fort Campbell, Austin Peay State University, Wilma Rudolph Blvd corridor',
    whoWeServe: {
      restaurants: 'Wilma Rudolph Blvd franchise chains, Fort Campbell Blvd fast-casual restaurants, APSU campus dining spots, downtown Clarksville eateries, sports bars, BBQ joints, and quick-service restaurants serving the military community. If you cook commercially in Clarksville, we handle your exhaust system.',
      institutions: 'Fort Campbell military dining facilities, Austin Peay State University dining halls, area churches, schools, hospitals, assisted living facilities, corporate cafeterias, and government facilities. Large-scale systems with strict compliance requirements.',
    },
    whyCity: {
      heading1: 'Fort Campbell: Non-Stop Military Demand',
      text1: 'The Fort Campbell military installation drives massive off-base dining demand. Restaurants along Fort Campbell Blvd and Wilma Rudolph Blvd serve hundreds of soldiers and families daily, pushing exhaust systems to their limits. This constant high-volume operation causes rapid belt wear and motor burnout — these corridors need proactive exhaust fan maintenance.',
      heading2: 'APSU Campus: College Town Volume',
      text2: 'Austin Peay State University adds another layer of high-volume dining demand. Campus-area restaurants and bars see concentrated peak-hour rushes during the school year that stress exhaust components. Move-in weeks and military deployment returns create demand spikes that push already-stressed systems past their breaking point.',
      heading3: 'Franchise Corridor Compliance',
      text3: 'The Wilma Rudolph Blvd corridor contains one of the densest franchise restaurant concentrations in Middle Tennessee. Clarksville Fire Rescue closely monitors these high-traffic establishments, and their strict enforcement of NFPA 96 means proactive access panel installation and regular bare-metal cleaning are essential.',
    },
    complianceText: `The <strong class="text-white">Clarksville Fire Rescue - Fire Prevention Bureau</strong> enforces NFPA 96 with strict attention to high-density franchise corridors. Inspectors check for bare-metal cleanliness, proper fire-rated access panels, functional hinge kits on upblast fans, fire suppression link replacements, and documented cleaning history. The high volume of quick-service restaurants along Wilma Rudolph Blvd faces particularly rigorous enforcement.`,
    complianceText2: `<strong class="text-white">Clarksville Gas & Water</strong> enforces strict grease trap and wastewater regulations, indirectly pushing restaurants to maintain pristine rooftop grease catchers to avoid overall F.O.G. violations. Grease leaving your property — whether through drains or rooftop exhaust — can result in significant fines.`,
    serviceArea: 'We serve all of Clarksville and Montgomery County — downtown, Wilma Rudolph Blvd, Fort Campbell Blvd, the APSU campus area, and every neighborhood in between.',
    faqs: {
      repair: [
        { q: 'How fast can DDAN respond to an emergency fan failure in Clarksville?', a: 'For Clarksville locations, our emergency team dispatches immediately with common motors, belts, and bearings stocked on every truck. We understand that military-town volume means zero tolerance for kitchen downtime.' },
        { q: 'Do you provide emergency exhaust fan repair near Fort Campbell?', a: `Yes. DDAN provides 24/7 emergency exhaust fan repair throughout Clarksville and the Fort Campbell area. When a fan dies during a dinner rush serving hundreds of soldiers and families, every minute counts.` },
        { q: 'What causes fan belts to snap so often on Wilma Rudolph Blvd?', a: 'The sheer volume of quick-service output along Wilma Rudolph Blvd puts extreme continuous load on fan belts. Constant start-stop cycling during shift-change rushes accelerates belt wear. Grease coating the pulleys reduces friction and generates heat. We recommend quarterly belt inspections for high-volume Clarksville restaurants.' },
        { q: 'What is the typical cost of an exhaust fan motor replacement?', a: 'Most common motor replacements range from $250 to $600 depending on horsepower, phase type, and motor enclosure. We provide upfront pricing after diagnosis — no surprises.' },
      ],
      'parts-installation': [
        { q: 'How often should Clarksville fast-food restaurants have their hoods cleaned?', a: 'High-volume quick-service restaurants and 24-hour diners along Wilma Rudolph Blvd typically require monthly cleaning. Every part we install — from hinge kits to access panels to grease containment — is NFPA 96 compliant and documented.' },
        { q: 'Do you provide emergency exhaust fan repair near Fort Campbell?', a: 'Yes. We offer 24/7 emergency repair services. We carry common motors, belts, and bearings for immediate replacement — military-town volume means zero tolerance for kitchen downtime.' },
        { q: 'Are rooftop grease pads required by Clarksville code?', a: 'Proper grease containment is required by NFPA 96 and enforced by Clarksville Fire Rescue and Clarksville Gas & Water F.O.G. initiatives. We install and maintain high-capacity rooftop grease containment systems.' },
        { q: 'How fast can you get parts to a Clarksville restaurant?', a: 'We stock common motors, belts, bearings, filters, hinge kits, and grease cups locally. For in-stock parts, same-day delivery is standard. Specialty items are typically next-day.' },
      ],
    },
  },
  franklin: {
    name: 'Franklin', state: 'TN', slug: 'franklin-tn',
    verticals: ['repair', 'parts-installation'],
    titlePattern: (service) => `${service} for Franklin Restaurants | DDAN`,
    neighbors: {
      repair: [
        { name: 'Brentwood', href: '/repair/brentwood-tn/' },
        { name: 'Thompsons Station', href: '/repair/thompsons-station-tn/' },
        { name: 'Nolensville', href: '/repair/nolensville-tn/' },
      ],
      'parts-installation': [
        { name: 'Brentwood', href: '/parts-installation/brentwood-tn/' },
        { name: 'Thompsons Station', href: '/parts-installation/thompsons-station-tn/' },
        { name: 'Nolensville', href: '/parts-installation/nolensville-tn/' },
      ],
    },
    fireMarshal: 'Franklin Fire Department (FFD) - Fire Prevention Division',
    fogProgram: 'City of Franklin Water Management',
    localLandmarks: 'historic downtown Main Street, CoolSprings Galleria, Maryland Farms',
    whoWeServe: {
      restaurants: 'Historic downtown Main Street fine dining, Cool Springs upscale steakhouses, The Factory at Franklin restaurants, CoolSprings Galleria food court, Maryland Farms corporate dining, artisan cafes, food halls, hotel kitchens, and catering operations. If you cook commercially in Franklin, we handle your exhaust system.',
      institutions: 'Williamson County schools, area churches, hospitals, assisted living facilities, corporate cafeterias in Maryland Farms and McEwen, and government facilities. Large-scale systems with strict compliance requirements.',
    },
    whyCity: {
      heading1: 'Historic Downtown: Zero-Tolerance Fire Code',
      text1: 'Downtown Franklin restaurants operate in preserved 19th-century attached brick buildings. The Franklin Fire Department enforces fire codes with zero tolerance because shared walls and 150-year-old architecture multiply fire risk. These kitchens require perfectly clean ductwork, properly installed access doors, and meticulously maintained fire suppression systems.',
      heading2: 'Cool Springs: Corporate Landlord Standards',
      text2: 'In the booming Cool Springs corridor, corporate landlords demand pristine rooftops. A failing grease containment system that stains a white TPO roof can result in massive lease penalties. Our rooftop grease containment systems — boxes, trays, and absorbent pads — prevent grease from ever reaching your roof surface.',
      heading3: 'Pre-Holiday Rush: Peak Season Preparation',
      text3: 'Franklin\'s fine-dining scene drives massive demand for preventative cleaning and belt replacements before the lucrative holiday dining season peaks in October and November. Proactive exhaust system maintenance prevents emergency shutdowns during your busiest revenue period.',
    },
    complianceText: `The <strong class="text-white">Franklin Fire Department (FFD) - Fire Prevention Division</strong> enforces NFPA 96 with extreme strictness, particularly in the historic downtown district due to the catastrophic risk of fire spreading through connected 150-year-old structures. Inspectors check for bare-metal cleanliness, proper fire-rated access panels, functional hinge kits on upblast fans, and documented cleaning history.`,
    complianceText2: `<strong class="text-white">City of Franklin Water Management</strong> strictly enforces F.O.G. regulations. Corporate property managers in Cool Springs also self-enforce zero-tolerance policies for grease roof damage. Proper grease containment on your rooftop fans keeps you compliant with both the city and your landlord.`,
    serviceArea: 'We serve all of Franklin and Williamson County — historic downtown, CoolSprings Galleria area, McEwen, Maryland Farms, and every neighborhood in between.',
    faqs: {
      repair: [
        { q: 'How fast can DDAN respond to an emergency fan failure in Franklin?', a: 'For Franklin locations, our emergency team typically arrives within 1-2 hours. We carry common motors, belts, and bearings on every truck for same-day repair.' },
        { q: 'Can you repair exhaust systems in historic downtown Franklin buildings?', a: 'Yes. Historic buildings often have complex, winding ductwork. Our technicians are experts at navigating non-standard configurations and installing fire-rated access panels for proper maintenance access.' },
        { q: 'My Cool Springs landlord requires proof of exhaust system maintenance. Can you provide this?', a: 'Absolutely. Corporate property managers in Franklin are strict about documentation. We provide detailed before-and-after photo reports and service records for every repair, proving compliance to your landlord.' },
        { q: 'What is the typical cost of an exhaust fan motor replacement?', a: 'Most common motor replacements range from $250 to $600 depending on horsepower, phase type, and motor enclosure. We provide upfront pricing after diagnosis — no surprises.' },
      ],
      'parts-installation': [
        { q: 'Can you install exhaust parts in historic downtown Franklin buildings?', a: 'Yes. Historic buildings often have complex, winding ductwork that requires custom access panel placement. Our technicians are experts at working in preserved structures without damaging aesthetic or structural integrity.' },
        { q: 'My Cool Springs landlord requires proof of rooftop grease containment. Can you provide this?', a: 'Absolutely. Corporate property managers in Franklin are notoriously strict about roof damage. We install high-capacity rooftop grease containment systems and provide detailed photo documentation after every service.' },
        { q: 'Do you repair fire suppression systems in Franklin?', a: 'Yes. Keeping your fire suppression links clean and your system fully operational is critical, especially under the Franklin Fire Department\'s strict inspections. We handle comprehensive repairs and NFPA 96 maintenance.' },
        { q: 'How fast can you get parts to a Franklin restaurant?', a: 'We stock common motors, belts, bearings, filters, hinge kits, and grease cups locally. For in-stock parts, same-day delivery is standard. Specialty items are typically next-day.' },
      ],
    },
  },
  'bowling-green': {
    name: 'Bowling Green', state: 'KY', slug: 'bowling-green-ky',
    verticals: ['repair', 'parts-installation'],
    titlePattern: (service) => `Bowling Green, KY ${service} | DDAN`,
    neighbors: {
      repair: [
        { name: 'Nashville', href: '/repair/nashville-tn/' },
        { name: 'Clarksville', href: '/repair/clarksville-tn/' },
      ],
      'parts-installation': [
        { name: 'Nashville', href: '/parts-installation/nashville-tn/' },
        { name: 'Clarksville', href: '/parts-installation/clarksville-tn/' },
      ],
    },
    fireMarshal: 'Bowling Green Fire Department & Kentucky State Fire Marshal',
    fogProgram: 'Bowling Green Municipal Utilities (BGMU)',
    localLandmarks: 'Western Kentucky University (WKU), Greenwood Mall, GM Corvette Assembly Plant',
    whoWeServe: {
      restaurants: 'WKU campus dining spots, Scottsville Road franchise chains, downtown Fountain Square cafes, BBQ restaurants, steakhouses, fast-casual chains near Greenwood Mall, sports bars, and quick-service restaurants. If you cook commercially in Bowling Green, we handle your exhaust system.',
      institutions: 'Western Kentucky University dining halls, GM Corvette Assembly Plant commissary, area medical centers, churches, schools, assisted living facilities, corporate cafeterias, and government facilities. Large-scale systems with strict compliance requirements.',
    },
    whyCity: {
      heading1: 'WKU: 16-Hour Dining Operations',
      text1: 'Western Kentucky University operates massive dining facilities that run 16+ hours a day. This extreme runtime accelerates exhaust fan wear dramatically — belts dry rot and snap, motors overheat, and bearings fail under the continuous load. University dining halls need proactive parts replacement and preventative maintenance to avoid mid-semester shutdowns.',
      heading2: 'Industrial Commissaries: Maximum Capacity',
      text2: 'Bowling Green\'s industrial sector — including the GM Corvette Assembly Plant — operates high-volume commissary kitchens that push exhaust systems to their absolute limits. These institutional kitchens require heavy-duty commercial parts and scheduled maintenance windows to keep feeding the workforce without interruption.',
      heading3: 'BBQ and Steakhouse Country',
      text3: 'Bowling Green\'s thriving BBQ and steakhouse scene produces severe grease loads from solid-fuel cooking and high-heat grilling. This heavy grease overwhelms cheap factory-installed grease boxes and saturates filters faster than standard schedules account for. Proper grease containment and frequent filter replacement are essential.',
    },
    complianceText: `The <strong class="text-white">Bowling Green Fire Department and Kentucky State Fire Marshal</strong> rigorously enforce NFPA 96 codes, particularly for large institutional kitchens (WKU) and industrial cafeterias where life safety codes are heavily monitored. Inspectors check for bare-metal cleanliness, functioning fire suppression links, properly installed hinge kits, and visible, up-to-date certification tags.`,
    complianceText2: `<strong class="text-white">Bowling Green Municipal Utilities (BGMU)</strong> monitors grease interceptors and wastewater heavily, indirectly enforcing better rooftop containment. Grease leaving your property can result in significant fines and operational restrictions.`,
    serviceArea: 'We serve all of Bowling Green and Warren County — downtown Fountain Square, Scottsville Road corridor, WKU campus area, Greenwood Mall vicinity, and every neighborhood in between.',
    faqs: {
      repair: [
        { q: 'How fast can DDAN respond to an emergency fan failure in Bowling Green?', a: 'We dispatch our emergency team immediately with common motors, belts, and bearings stocked on every truck. We carry a massive inventory of heavy-duty commercial fan parts to get your system running without missing a shift.' },
        { q: 'Do you service large institutional kitchens at WKU or local factories?', a: 'Yes. We specialize in high-capacity commercial and industrial kitchen exhaust systems. We can coordinate with your facilities managers for after-hours or shutdown-window repairs to minimize disruption.' },
        { q: 'How quickly can you replace a snapped fan belt in Bowling Green?', a: 'We offer 24/7 emergency service. We carry heavy-duty commercial fan belts and motors on every truck and can typically complete belt replacements within hours of your call.' },
        { q: 'What is the typical cost of an exhaust fan motor replacement?', a: 'Most common motor replacements range from $250 to $600 depending on horsepower, phase type, and motor enclosure. We provide upfront pricing after diagnosis — no surprises.' },
      ],
      'parts-installation': [
        { q: 'Do you service large institutional kitchens at WKU or local factories?', a: 'Yes. We specialize in high-capacity commercial and industrial kitchen exhaust systems. We coordinate with facilities managers for after-hours or shutdown-window installation to minimize disruption.' },
        { q: 'How quickly can you replace a snapped fan belt in Bowling Green?', a: 'We offer 24/7 emergency service and carry heavy-duty commercial fan belts and motors for immediate replacement. Most belt replacements are completed within hours of your call.' },
        { q: 'What is required to pass a Bowling Green Fire Department hood inspection?', a: 'Inspectors look for the system to be cleaned to bare metal, functioning fire suppression links, properly installed hinge kits on roof fans, and visible, up-to-date certification tags proving NFPA 96 compliance.' },
        { q: 'How fast can you get parts to a Bowling Green restaurant?', a: 'We stock common motors, belts, bearings, filters, hinge kits, and grease cups locally. For in-stock parts, same-day delivery is standard. Specialty items are typically next-day.' },
      ],
    },
  },
  hendersonville: {
    name: 'Hendersonville', state: 'TN', slug: 'hendersonville-tn',
    verticals: ['cleaning', 'repair', 'parts-installation'],
    titlePattern: (service) => `Hendersonville ${service} Experts | DDAN`,
    neighbors: {
      cleaning: [
        { name: 'Gallatin', href: '/cleaning/gallatin-tn/' },
        { name: 'Goodlettsville', href: '/cleaning/goodlettsville-tn/' },
      ],
      repair: [
        { name: 'Gallatin', href: '/repair/gallatin-tn/' },
        { name: 'Goodlettsville', href: '/repair/goodlettsville-tn/' },
      ],
      'parts-installation': [
        { name: 'Gallatin', href: '/parts-installation/gallatin-tn/' },
        { name: 'Goodlettsville', href: '/parts-installation/goodlettsville-tn/' },
      ],
    },
    fireMarshal: "Hendersonville Fire Department - Fire Marshal's Office",
    fogProgram: 'Hendersonville Utility District',
    localLandmarks: 'Streets of Indian Lake, Old Hickory Lake, Gallatin Road corridor',
    whoWeServe: {
      restaurants: 'Streets of Indian Lake dining establishments, Gallatin Road fast-casual chains, Old Hickory Lake waterfront grills and bars, downtown restaurants, sports bars, BBQ joints, food trucks, hotel kitchens, and catering operations. If you cook commercially in Hendersonville, we handle your exhaust system.',
      institutions: 'Hendersonville Medical Center, area churches, schools, assisted living facilities, corporate cafeterias, and government facilities. Large-scale systems with strict compliance requirements.',
    },
    whyCity: {
      heading1: 'Lakeside Dining: Humidity Accelerates Wear',
      text1: 'Hendersonville\'s proximity to Old Hickory Lake creates a unique environmental challenge. The combination of high-volume fryer grease and ambient humidity accelerates rusting and degradation of rooftop fan housings and hinges. Exhaust fan belts wear faster, and unprotected equipment corrodes in months instead of years. Lakeside restaurants need more frequent equipment inspections and proactive parts replacement.',
      heading2: 'Indian Lake: High-End Dining Standards',
      text2: 'The Streets of Indian Lake features upscale dining establishments that demand pristine ventilation systems. These restaurants require overnight service, zero disruption, and meticulous documentation for property management compliance. Grease containment must be flawless to protect modern roofing membranes.',
      heading3: 'Gallatin Road: Aging Infrastructure',
      text3: 'Older restaurants along Gallatin Road often have outdated, undersized fan motors that struggle to pull heavy grease air during peak summer volume. These aging systems need component upgrades — not just maintenance — to meet current NFPA 96 standards and pass Hendersonville Fire Department inspections.',
    },
    complianceText: `The <strong class="text-white">Hendersonville Fire Department - Fire Marshal's Office</strong> enforces NFPA 96 with strict annual inspections for established businesses along the main peninsula. Inspectors check for bare-metal cleanliness, proper fire-rated access panels, functional hinge kits on upblast fans, current service tags, and documented cleaning history.`,
    complianceText2: `The <strong class="text-white">Hendersonville Utility District</strong> is highly protective of local water quality due to proximity to Old Hickory Lake. Rooftop grease runoff is treated as a serious environmental violation. Proper grease containment on your rooftop fans keeps you compliant on both fire and environmental codes.`,
    serviceArea: 'We serve all of Hendersonville and Sumner County — Streets of Indian Lake, Gallatin Road, Old Hickory Lake waterfront, and every neighborhood in between.',
    faqs: {
      cleaning: [
        { q: 'Does my Hendersonville restaurant need a rooftop grease containment system?', a: 'Yes. Not only is it required by NFPA 96 fire codes, but the Hendersonville Utility District heavily penalizes F.O.G. runoff that reaches storm drains, especially near Old Hickory Lake. We install high-capacity systems to capture grease before it damages your roof or the environment.' },
        { q: 'Why is my upblast exhaust fan rattling so loudly?', a: 'Loud rattling usually means the fan blades are coated in hardened grease, throwing the impeller off balance, or the motor bearings are failing due to heavy use and lakeside humidity. We will scrape the blades down to bare metal and diagnose the motor immediately.' },
        { q: 'Are your technicians familiar with Hendersonville Fire Department codes?', a: "Absolutely. We ensure your entire kitchen exhaust system — from the hood to the rooftop fan — meets the strict NFPA 96 standards enforced by the Hendersonville Fire Marshal, keeping you compliant and avoiding costly operational shutdowns." },
        { q: 'How long does a commercial hood cleaning take?', a: 'Most single-hood restaurant systems take 3-5 hours for a thorough bare-metal cleaning. Larger systems with multiple hoods or extensive ductwork can take 6-8 hours. We schedule overnight so your kitchen is ready by morning.' },
      ],
      repair: [
        { q: 'How fast can DDAN respond to an emergency fan failure in Hendersonville?', a: 'For Hendersonville locations, our emergency team typically arrives within 1-2 hours. We carry common motors, belts, and bearings on every truck for same-day repair.' },
        { q: 'Does lakeside humidity affect my exhaust fan components?', a: 'Yes. The combination of heavy airborne grease and Old Hickory Lake humidity accelerates rusting and degradation of rooftop fan housings, hinges, and bearings. Lakeside restaurants need more frequent equipment inspections and proactive parts replacement.' },
        { q: 'Do you repair all brands of commercial exhaust fans?', a: 'Yes. We service CaptiveAire, Loren Cook, Canarm, NAKS, EconAir, Greenheck, Accurex, PennBarry, Dayton, Fantech, and all other commercial kitchen exhaust fan brands.' },
        { q: 'What is the typical cost of an exhaust fan motor replacement?', a: 'Most common motor replacements range from $250 to $600 depending on horsepower, phase type, and motor enclosure. We provide upfront pricing after diagnosis — no surprises.' },
      ],
      'parts-installation': [
        { q: 'Does my Hendersonville restaurant need a rooftop grease containment system?', a: 'Yes. NFPA 96 requires it, and the Hendersonville Utility District heavily penalizes F.O.G. runoff near Old Hickory Lake. We install high-capacity systems that capture grease before it damages your roof or the environment.' },
        { q: 'Does lakeside humidity affect my exhaust fan components?', a: 'Yes. Old Hickory Lake humidity accelerates rusting on rooftop fan housings, hinges, and bearings. We recommend marine-grade and galvanized components for lakeside installations and more frequent replacement schedules.' },
        { q: 'Are your technicians familiar with Hendersonville Fire Department codes?', a: "Absolutely. Every part we install meets NFPA 96 standards enforced by the Hendersonville Fire Marshal. We document everything with photos for your compliance files." },
        { q: 'How fast can you get parts to a Hendersonville restaurant?', a: 'We stock common motors, belts, bearings, filters, hinge kits, and grease cups locally. For in-stock parts, same-day delivery is standard. Specialty items are typically next-day.' },
      ],
    },
  },
  columbia: {
    name: 'Columbia', state: 'TN', slug: 'columbia-tn',
    verticals: ['repair', 'parts-installation'],
    titlePattern: (service) => `Columbia Muletown ${service} | DDAN`,
    neighbors: {
      repair: [
        { name: 'Spring Hill', href: '/repair/spring-hill-tn/' },
        { name: 'Lewisburg', href: '/repair/lewisburg-tn/' },
      ],
      'parts-installation': [
        { name: 'Spring Hill', href: '/parts-installation/spring-hill-tn/' },
        { name: 'Lewisburg', href: '/parts-installation/lewisburg-tn/' },
      ],
    },
    fireMarshal: 'Columbia Fire & Rescue',
    fogProgram: 'Columbia Wastewater Department',
    localLandmarks: 'historic Muletown square, Carmack Blvd, Maury Regional Medical Center',
    whoWeServe: {
      restaurants: 'Historic Muletown square restaurants, Carmack Blvd diners, US-31 corridor fast-casual chains, craft breweries near Riverwalk Park, BBQ joints, Southern comfort food restaurants, and catering operations. If you cook commercially in Columbia, we handle your exhaust system.',
      institutions: 'Maury Regional Medical Center, area churches, schools, assisted living facilities, growing industrial park cafeterias, and government facilities. Large-scale systems with strict compliance requirements.',
    },
    whyCity: {
      heading1: 'Historic Square: Concealed Ductwork Challenges',
      text1: 'Columbia\'s revitalized historic square features 150-year-old attached brick buildings with winding, non-standard grease ductwork hidden behind drop ceilings. These concealed systems often lack the access panels required for full bare-metal cleaning, creating a severe fire hazard. Columbia Fire & Rescue scrutinizes these connected buildings with zero tolerance for non-compliance.',
      heading2: 'Southern Comfort and BBQ: Heavy Grease',
      text2: 'Known as Muletown, Columbia\'s dining identity leans heavily into Southern comfort food, BBQ, and classic diners. High solid-fuel and fryer usage creates sticky, hardened grease that overwhelms standard rooftop catchers and requires aggressive, specialized cleaning to remove from ductwork and fan components.',
      heading3: 'Carmack Blvd: Aging Equipment',
      text3: 'Older diners and restaurants along Carmack Blvd frequently run upblast fans with failing bearings and snapped belts due to age and constant use. These systems need heavy-duty commercial replacement parts — not just patching — to meet current NFPA 96 standards and keep operating safely.',
    },
    complianceText: `<strong class="text-white">Columbia Fire & Rescue</strong> enforces NFPA 96 with strict attention to the downtown historic overlay, where connected buildings make grease fires exceptionally dangerous. Inspectors check for bare-metal cleanliness, proper fire-rated access panels in concealed ductwork, functional hinge kits, and documented cleaning history.`,
    complianceText2: `The <strong class="text-white">Columbia Wastewater Department</strong> aggressively monitors F.O.G. levels. Rooftop grease runoff that reaches the historic drainage systems is severely penalized. Proper grease containment on your rooftop fans keeps you compliant on both fire and environmental codes.`,
    serviceArea: 'We serve all of Columbia and Maury County — historic downtown square, Carmack Blvd, US-31 corridor, Maury Regional area, and every neighborhood in between.',
    faqs: {
      repair: [
        { q: 'How fast can DDAN respond to an emergency fan failure in Columbia?', a: 'For Columbia locations, our emergency team dispatches immediately with common motors, belts, and bearings stocked on every truck. We understand that every minute of kitchen downtime costs you revenue.' },
        { q: 'Can you repair exhaust systems in historic Columbia buildings?', a: 'Yes. Historic buildings on the Columbia square often have complex, concealed ductwork. Our technicians are experts at working in preserved structures and installing fire-rated access panels for proper maintenance access.' },
        { q: 'Do you repair broken restaurant exhaust fans in Columbia?', a: 'Absolutely. A broken exhaust fan means your kitchen fills with smoke and must shut down. We offer 24/7 emergency repair in Columbia, arriving with heavy-duty commercial belts, bearings, and motors needed to get you running immediately.' },
        { q: 'What is the typical cost of an exhaust fan motor replacement?', a: 'Most common motor replacements range from $250 to $600 depending on horsepower, phase type, and motor enclosure. We provide upfront pricing after diagnosis — no surprises.' },
      ],
      'parts-installation': [
        { q: 'Can you install parts in historic Columbia buildings?', a: 'Yes. Historic buildings on the Columbia square often have complex, concealed ductwork that requires strategic access panel placement. Our technicians are experts at working in preserved structures without damaging the building.' },
        { q: 'Do you repair broken restaurant exhaust fans in Columbia?', a: 'Absolutely. We offer 24/7 emergency repair in Columbia, arriving with heavy-duty commercial belts, bearings, and 3-phase motors needed to get you back up and running immediately.' },
        { q: 'Why do I need a rooftop grease containment system?', a: 'NFPA 96 code requires it, and the Columbia Wastewater Department strictly monitors F.O.G. to protect local infrastructure. We install multi-layer rooftop systems that capture grease before it damages your roof or washes into storm drains.' },
        { q: 'How fast can you get parts to a Columbia restaurant?', a: 'We stock common motors, belts, bearings, filters, hinge kits, and grease cups locally. For in-stock parts, same-day delivery is standard. Specialty items are typically next-day.' },
      ],
    },
  },
};

// Service names for titles
const serviceNames = {
  cleaning: 'Hood Cleaning',
  repair: 'Exhaust Fan Repair',
  'parts-installation': 'Parts & Installation',
};

const serviceSchemNames = {
  cleaning: 'Commercial Kitchen Hood Cleaning',
  repair: 'Commercial Kitchen Exhaust Fan Repair',
  'parts-installation': 'Commercial Kitchen Exhaust Parts and Installation',
};

const breadcrumbNames = {
  cleaning: 'Hood Cleaning',
  repair: 'Hood Repair',
  'parts-installation': 'Parts & Installation',
};

function generatePage(city, vertical) {
  const templatePath = path.join(PAGES, vertical, 'nashville-tn.astro');
  let template = fs.readFileSync(templatePath, 'utf-8');

  const c = cities[city];
  const cityState = `${c.name}, ${c.state}`;
  const faqs = c.faqs[vertical];

  // Determine title based on vertical
  let titleStr;
  if (vertical === 'cleaning') {
    titleStr = c.titlePattern('Hood Cleaning');
  } else if (vertical === 'repair') {
    titleStr = c.titlePattern('Exhaust Fan Repair');
  } else {
    titleStr = c.titlePattern('Parts & Installation');
  }

  // Build the description
  let descStr;
  if (vertical === 'cleaning') {
    descStr = `NFPA 96 certified hood cleaning for ${c.name} restaurants. Bare-metal clean, overnight service, photo documentation. Call (615) 881-6968.`;
  } else if (vertical === 'repair') {
    descStr = `24/7 emergency exhaust fan repair in ${c.name}. Same-day motor and belt replacement from local stock. All brands. Call (615) 881-6968.`;
  } else {
    descStr = `Restaurant exhaust fan parts and professional installation in ${c.name}. Same-day service, warrantied parts, free fitting consult. Call (615) 881-6968.`;
  }

  // Build FAQs block
  const faqsStr = faqs.map(f => {
    const escapedQ = f.q.replace(/'/g, "\\'");
    const escapedA = f.a.replace(/'/g, "\\'");
    return `  { q: '${escapedQ}', a: '${escapedA}' },`;
  }).join('\n');

  // Replace Nashville-specific FAQ block
  const faqRegex = /const faqs = \[[\s\S]*?\];\r?\n/;
  template = template.replace(faqRegex, `const faqs = [\n${faqsStr}\n];\n`);

  // Replace schema URL
  template = template.replace(
    new RegExp(`/${vertical}/nashville-tn/`, 'g'),
    `/${vertical}/${c.slug}/`
  );

  // Replace schema areaServed
  template = template.replace(
    /"areaServed":\s*\{\s*"@type":\s*"City",\s*"name":\s*"Nashville, TN"\s*\}/g,
    `"areaServed": { "@type": "City", "name": "${cityState}" }`
  );

  // Replace schema Service description
  if (vertical === 'cleaning') {
    template = template.replace(
      `"description": "NFPA 96 certified commercial kitchen hood cleaning for Nashville restaurants. Bare-metal clean with before-and-after photo documentation."`,
      `"description": "NFPA 96 certified commercial kitchen hood cleaning for ${c.name} restaurants. Bare-metal clean with before-and-after photo documentation."`
    );
  } else if (vertical === 'repair') {
    template = template.replace(
      `"description": "24/7 emergency exhaust fan motor and belt repair for Nashville commercial kitchens. Same-day service from local parts stock."`,
      `"description": "24/7 emergency exhaust fan motor and belt repair for ${c.name} commercial kitchens. Same-day service from local parts stock."`
    );
  } else {
    template = template.replace(
      `"description": "Same-day exhaust fan parts and professional installation for Nashville commercial kitchens. Motors, belts, filters, hinge kits, grease containment, and make-up air units."`,
      `"description": "Same-day exhaust fan parts and professional installation for ${c.name} commercial kitchens. Motors, belts, filters, hinge kits, grease containment, and make-up air units."`
    );
  }

  // Replace breadcrumb last item
  template = template.replace(
    `"name": "Nashville, TN"`,
    `"name": "${cityState}"`
  );

  // Replace title
  const titleRegex = /title="[^"]*"/;
  template = template.replace(titleRegex, `title="${titleStr}"`);

  // Replace description
  const descRegex = /description="[^"]*"/;
  template = template.replace(descRegex, `description="${descStr}"`);

  // Replace H1 city reference
  template = template.replace(
    /<span class="text-\[#FF5E15\]">Nashville, TN<\/span>/g,
    `<span class="text-[#FF5E15]">${cityState}</span>`
  );

  // Replace breadcrumb visible text
  template = template.replace(
    /<span class="text-gray-300">Nashville, TN<\/span>/g,
    `<span class="text-gray-300">${cityState}</span>`
  );

  // Replace "Nashville" in section headings (be careful — only in the template text, not links)
  // Replace "Nashville's" -> "City's"  and "Nashville " -> "City " in heading/paragraph text
  template = template.replace(/Nashville's Most Thorough Hood Cleaning Service/g, `${c.name}'s Most Thorough Hood Cleaning Service`);
  template = template.replace(/Nashville's Fastest Commercial Kitchen Repair Service/g, `${c.name}'s Fastest Commercial Kitchen Repair Service`);
  template = template.replace(/Nashville's Most Reliable Exhaust Fan Repair Team/g, `${c.name}'s Most Reliable Exhaust Fan Repair Team`);
  template = template.replace(/The Most Thorough Clean in Nashville/g, `The Most Thorough Clean in ${c.name}`);

  // Service section headings
  template = template.replace(/Complete Hood Cleaning Services in Nashville/g, `Complete Hood Cleaning Services in ${c.name}`);
  template = template.replace(/How Often Should Nashville Restaurants Clean Their Hoods\?/g, `How Often Should ${c.name} Restaurants Clean Their Hoods?`);
  template = template.replace(/Who We Serve in Nashville/g, `Who We Serve in ${c.name}`);
  template = template.replace(/Who We Repair For in Nashville/g, `Who We Repair For in ${c.name}`);
  template = template.replace(/Exhaust Fan Repairs for Nashville Restaurants/g, `Exhaust Fan Repairs for ${c.name} Restaurants`);
  template = template.replace(/Complete Exhaust System Repair in Nashville/g, `Complete Exhaust System Repair in ${c.name}`);

  // Parts page headings
  template = template.replace(/Restaurant Exhaust Fans for Nashville Kitchens/g, `Restaurant Exhaust Fans for ${c.name} Kitchens`);
  template = template.replace(/Nashville Exhaust Fan Replacement Parts — In Stock/g, `${c.name} Exhaust Fan Replacement Parts — In Stock`);
  template = template.replace(/Commercial Make-Up Air Units for Nashville Restaurants/g, `Commercial Make-Up Air Units for ${c.name} Restaurants`);
  template = template.replace(/Commercial Hood Filters and Baffles in Nashville/g, `Commercial Hood Filters and Baffles in ${c.name}`);
  template = template.replace(/Rooftop Grease Containment Systems for Nashville/g, `Rooftop Grease Containment Systems for ${c.name}`);
  template = template.replace(/Complete Hood Systems and Kitchen Accessories in Nashville/g, `Complete Hood Systems and Kitchen Accessories in ${c.name}`);
  template = template.replace(/Complete Restaurant Hood System Parts and Installation/g, `Complete Restaurant Hood System Parts and Installation`);

  // Bottom row headings — Why City + Compliance
  template = template.replace(/Why Nashville Restaurants Choose DDAN for Hood Cleaning/g, `Why ${c.name} Restaurants Choose DDAN for Hood Cleaning`);
  template = template.replace(/Why Nashville Restaurants Need Dedicated Exhaust Fan Repair/g, `Why ${c.name} Restaurants Need Dedicated Exhaust Fan Repair`);
  template = template.replace(/Why Nashville Restaurants Choose DDAN for Parts and Installation/g, `Why ${c.name} Restaurants Choose DDAN for Parts and Installation`);
  template = template.replace(/Nashville Commercial Kitchen Compliance and NFPA 96/g, `${c.name} Commercial Kitchen Compliance and NFPA 96`);
  template = template.replace(/Nashville Exhaust Repair Compliance/g, `${c.name} Exhaust Repair Compliance`);

  // Service area + FAQ headings
  template = template.replace(/Nashville Hood Cleaning Service Area/g, `${c.name} Hood Cleaning Service Area`);
  template = template.replace(/Nashville Exhaust Fan Repair Service Area/g, `${c.name} Exhaust Fan Repair Service Area`);
  template = template.replace(/Nashville Parts and Installation Service Area/g, `${c.name} Parts and Installation Service Area`);
  template = template.replace(/Frequently Asked Questions — Nashville Hood Cleaning/g, `Frequently Asked Questions — ${c.name} Hood Cleaning`);
  template = template.replace(/Frequently Asked Questions — Nashville Exhaust Fan Repair/g, `Frequently Asked Questions — ${c.name} Exhaust Fan Repair`);
  template = template.replace(/Frequently Asked Questions — Nashville Parts and Installation/g, `Frequently Asked Questions — ${c.name} Parts and Installation`);

  // Replace the "Why Nashville" content blocks (3 blocks of heading + text)
  // This is complex — we need to replace the specific content sections
  // For cleaning template: Broadway, Hot Chicken, The Gulch
  // For repair template: Broadway, Hot Chicken, CMA Fest
  // For parts template: Broadway & Downtown, Hot Chicken Joints, The Gulch & Midtown

  // Replace heading1
  if (vertical === 'cleaning') {
    template = template.replace(
      /<h3 class="font-heading text-white text-lg font-semibold mb-2">Broadway: 18-Hour Runtimes<\/h3>\s*<p class="text-\[#D4D4D4\]">[\s\S]*?<\/p>/,
      `<h3 class="font-heading text-white text-lg font-semibold mb-2">${c.whyCity.heading1}</h3>\n              <p class="text-[#D4D4D4]">${c.whyCity.text1}</p>`
    );
    template = template.replace(
      /<h3 class="font-heading text-white text-lg font-semibold mb-2">Hot Chicken: Extreme Grease Loads<\/h3>\s*<p class="text-\[#D4D4D4\]">[\s\S]*?<\/p>/,
      `<h3 class="font-heading text-white text-lg font-semibold mb-2">${c.whyCity.heading2}</h3>\n              <p class="text-[#D4D4D4]">${c.whyCity.text2}</p>`
    );
    template = template.replace(
      /<h3 class="font-heading text-white text-lg font-semibold mb-2">The Gulch and Midtown: TPO Roof Protection<\/h3>\s*<p class="text-\[#D4D4D4\]">[\s\S]*?<\/p>/,
      `<h3 class="font-heading text-white text-lg font-semibold mb-2">${c.whyCity.heading3}</h3>\n              <p class="text-[#D4D4D4]">${c.whyCity.text3}</p>`
    );
  } else if (vertical === 'repair') {
    template = template.replace(
      /<h3 class="font-heading text-white text-lg font-semibold mb-2">Broadway: 18-Hour Motor Punishment<\/h3>\s*<p class="text-\[#D4D4D4\]">[\s\S]*?<\/p>/,
      `<h3 class="font-heading text-white text-lg font-semibold mb-2">${c.whyCity.heading1}</h3>\n              <p class="text-[#D4D4D4]">${c.whyCity.text1}</p>`
    );
    template = template.replace(
      /<h3 class="font-heading text-white text-lg font-semibold mb-2">Hot Chicken: Grease That Kills Components<\/h3>\s*<p class="text-\[#D4D4D4\]">[\s\S]*?<\/p>/,
      `<h3 class="font-heading text-white text-lg font-semibold mb-2">${c.whyCity.heading2}</h3>\n              <p class="text-[#D4D4D4]">${c.whyCity.text2}</p>`
    );
    template = template.replace(
      /<h3 class="font-heading text-white text-lg font-semibold mb-2">CMA Fest and Peak Season Failures<\/h3>\s*<p class="text-\[#D4D4D4\]">[\s\S]*?<\/p>/,
      `<h3 class="font-heading text-white text-lg font-semibold mb-2">${c.whyCity.heading3}</h3>\n              <p class="text-[#D4D4D4]">${c.whyCity.text3}</p>`
    );
  } else {
    // parts-installation
    template = template.replace(
      /<h3 class="font-heading text-white text-lg font-semibold mb-2">Broadway & Downtown: Motor Burnout<\/h3>\s*<p class="text-\[#D4D4D4\]">[\s\S]*?<\/p>/,
      `<h3 class="font-heading text-white text-lg font-semibold mb-2">${c.whyCity.heading1}</h3>\n              <p class="text-[#D4D4D4]">${c.whyCity.text1}</p>`
    );
    template = template.replace(
      /<h3 class="font-heading text-white text-lg font-semibold mb-2">Hot Chicken Joints: Filter Saturation<\/h3>\s*<p class="text-\[#D4D4D4\]">[\s\S]*?<\/p>/,
      `<h3 class="font-heading text-white text-lg font-semibold mb-2">${c.whyCity.heading2}</h3>\n              <p class="text-[#D4D4D4]">${c.whyCity.text2}</p>`
    );
    template = template.replace(
      /<h3 class="font-heading text-white text-lg font-semibold mb-2">The Gulch & Midtown: TPO Roof Damage<\/h3>\s*<p class="text-\[#D4D4D4\]">[\s\S]*?<\/p>/,
      `<h3 class="font-heading text-white text-lg font-semibold mb-2">${c.whyCity.heading3}</h3>\n              <p class="text-[#D4D4D4]">${c.whyCity.text3}</p>`
    );
  }

  // Replace compliance text blocks
  // Find and replace the compliance paragraph blocks
  template = template.replace(
    /The <strong class="text-white">Metro Nashville Fire Marshal<\/strong> enforces[\s\S]*?(?=<\/p>)/,
    c.complianceText
  );
  template = template.replace(
    /<strong class="text-white">Metro Water Services \(MWS\)<\/strong> enforces[\s\S]*?(?=<\/p>)/,
    c.complianceText2
  );

  // Replace service area text
  template = template.replace(
    /We serve all of Metro Nashville and Davidson County[\s\S]*?in between\./,
    c.serviceArea
  );
  template = template.replace(
    /We provide 24\/7 exhaust fan repair across all of Metro Nashville and Davidson County[\s\S]*?in between\./,
    c.serviceArea
  );
  template = template.replace(
    /We serve Nashville and all surrounding communities\. Same-day parts available for most locations\./,
    `We serve ${c.name} and all surrounding communities. Same-day parts available for most locations.`
  );

  // Replace "Who We Serve" content
  template = template.replace(
    /Broadway honky-tonks, Gulch fine dining[\s\S]*?we clean your hood system\./,
    c.whoWeServe.restaurants
  );
  template = template.replace(
    /Broadway honky-tonks running 18-hour shifts[\s\S]*?we fix them all\./,
    c.whoWeServe.restaurants
  );
  template = template.replace(
    /Your fan is down, your kitchen is closed[\s\S]*?often same day\./,
    c.whoWeServe.restaurants
  );
  template = template.replace(
    /Vanderbilt and Belmont dining halls[\s\S]*?strict compliance requirements\./g,
    c.whoWeServe.institutions
  );
  template = template.replace(
    /Need parts for your cleaning clients\?[\s\S]*?we handle sourcing\./,
    c.whoWeServe.institutions
  );

  // Replace Also serving nearby links
  const neighborLinks = (c.neighbors[vertical] || []).map((n, i, arr) => {
    const comma = i < arr.length - 1 ? ',' : '';
    const and = i === arr.length - 1 && arr.length > 1 ? ' and' : '';
    return `${and}\n              <a href="${n.href}" class="text-[#FF5E15] underline hover:text-white transition-all duration-300">${n.name}</a>${comma}`;
  }).join('');

  // Replace the neighbor city links block
  template = template.replace(
    /Also serving nearby:<\/span>\s*\n[\s\S]*?(?=\n\s*<\/p>\s*\n\s*<\/div>\s*\n\s*<div class="(?:rounded-xl overflow-hidden|mt-6 rounded-xl|space-y-3))/,
    `Also serving nearby:</span>${neighborLinks}\n            `
  );

  // Replace the "Also in Nashville" cross-links
  const otherVerticals = ['cleaning', 'repair', 'parts-installation'].filter(v => v !== vertical);
  const crossLinkHtml = otherVerticals.map(v => {
    const label = v === 'cleaning' ? 'Hood Cleaning' : v === 'repair' ? 'Exhaust Fan Repair' : 'Parts & Installation';
    return `<a href="/${v}/${c.slug}/" class="text-[#FF5E15] underline hover:text-white transition-all duration-300">${label}</a>`;
  }).join(' &middot;\n              ');

  template = template.replace(
    /Also in Nashville:<\/span>[\s\S]*?(?=\n\s*<\/p>\s*\n\s*<p class="text-\[#D4D4D4\] font-body text-base">\s*\n\s*<span class="text-\[#FF5E15\] font-semibold">Also serving)/,
    `Also in ${c.name}:</span>\n              ${crossLinkHtml}\n            `
  );

  // Replace Nashville in the truck section paragraph text
  template = template.replace(
    /to keep your Nashville kitchen running and compliant/,
    `to keep your ${c.name} kitchen running and compliant`
  );
  template = template.replace(
    /to keep your kitchen safe and compliant/,
    `to keep your kitchen safe and compliant`
  );

  // Replace DDAN Difference section Nashville-specific text
  if (vertical === 'repair') {
    template = template.replace(
      /When your fan dies at 11 PM on a Saturday during CMA Fest[\s\S]*?before your next shift\./,
      `When your fan dies at 11 PM on a Saturday during the dinner rush, you need a team that shows up — not an answering service. We carry the parts, know the rooftops, and fix it before your next shift.`
    );
  }

  // Replace Nashville-specific card text where it mentions Nashville specifically
  template = template.replace(/Nashville TN/g, `${c.name} ${c.state}`);
  template = template.replace(/Nashville, TN/g, `${cityState}`);

  // Replace remaining "Nashville" in alt text and descriptive text (not in links to Nashville pages)
  // Be careful not to replace links like /cleaning/nashville-tn/
  template = template.replace(/alt="([^"]*?)Nashville([^"]*?)"/g, `alt="$1${c.name}$2"`);

  // Replace service card descriptive text mentioning Nashville
  template = template.replace(/Nashville's 18-hour kitchens and high-volume Nashville restaurants/g, `${c.name}'s high-volume restaurants`);
  template = template.replace(/on Broadway's 18-hour kitchens and high-volume Nashville restaurants/g, `at ${c.name}'s busiest restaurants`);
  template = template.replace(/Nashville's high-volume fryers/g, `${c.name}'s high-volume fryers`);
  template = template.replace(/Nashville kitchens need more frequent belt service/g, `${c.name} kitchens need more frequent belt service`);
  template = template.replace(/for Nashville kitchens/g, `for ${c.name} kitchens`);
  template = template.replace(/Nashville restaurant/g, `${c.name} restaurant`);
  template = template.replace(/Nashville metro/g, `${c.name} metro`);

  // Replace the service area city grid in parts-installation
  if (vertical === 'parts-installation') {
    // The Nashville template has a specific list of cities - replace with relevant ones
    const nearbyGrid = c.neighbors[vertical].map(n =>
      `              { name: '${n.name}', href: '${n.href}' },`
    ).join('\n');

    // Don't replace the city grid - it stays as the regional network showing nearby cities
  }

  // Replace map embed (use a generic one or city-specific)
  const mapEmbeds = {
    murfreesboro: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d103198.45!2d-86.44!3d35.84!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x886445b3e5b7f15d%3A0x6a7a22e73ae3a189!2sMurfreesboro%2C%20TN!5e0!3m2!1sen!2sus!4v1',
    clarksville: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d103198.45!2d-87.36!3d36.53!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x886493a0e0a4f17d%3A0x7fa77cff3d1ef13e!2sClarksville%2C%20TN!5e0!3m2!1sen!2sus!4v1',
    franklin: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d103198.45!2d-86.87!3d35.93!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x886462b93e5b3d73%3A0xa9b13debb0b0fcf1!2sFranklin%2C%20TN!5e0!3m2!1sen!2sus!4v1',
    'bowling-green': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d103198.45!2d-86.44!3d36.99!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x886572f5e097d3c5%3A0x8503ccb0cc429e3a!2sBowling%20Green%2C%20KY!5e0!3m2!1sen!2sus!4v1',
    hendersonville: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d103198.45!2d-86.62!3d36.30!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88644c37fb769db5%3A0x1e3a5c2d1e0ca7c5!2sHendersonville%2C%20TN!5e0!3m2!1sen!2sus!4v1',
    columbia: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d103198.45!2d-87.04!3d35.62!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88637c6f7f0d9edd%3A0x7c2bfcae8ae5006a!2sColumbia%2C%20TN!5e0!3m2!1sen!2sus!4v1',
  };

  template = template.replace(
    /https:\/\/www\.google\.com\/maps\/embed\?pb=!1m18!1m12!1m3!1d206252\.72681578025!2d-86\.9081726!3d36\.1744653[\s\S]*?!4v1/g,
    mapEmbeds[city] || mapEmbeds.murfreesboro
  );

  // Fix remaining Nashville references in static card descriptions
  template = template.replace(/in every Nashville commercial kitchen/g, `in every ${c.name} commercial kitchen`);
  template = template.replace(/Serving Nashville's 3,000\+ commercial kitchens/g, `Serving ${c.name}'s commercial kitchens`);
  template = template.replace(/Systems for every Nashville building type/g, `Systems for every ${c.name} building type`);
  template = template.replace(/NASHVILLE'S #1 EXHAUST FAN REPAIR SERVICE/g, `${c.name.toUpperCase()}'S #1 EXHAUST FAN REPAIR SERVICE`);

  return template;
}

// Generate all pages
let count = 0;
for (const [cityKey, cityData] of Object.entries(cities)) {
  for (const vertical of cityData.verticals) {
    const outputPath = path.join(PAGES, vertical, `${cityData.slug}.astro`);
    console.log(`Generating: ${vertical}/${cityData.slug}.astro`);
    const content = generatePage(cityKey, vertical);
    fs.writeFileSync(outputPath, content, 'utf-8');
    count++;
  }
}

console.log(`\nDone! Generated ${count} pages.`);
