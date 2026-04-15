import type { APIRoute } from 'astro';

const site = 'https://ddanhoodservices.com';

const pages: string[] = [
  // Core pages
  '/',
  '/about-ddan-hood-cleaning-and-repair/',
  '/contact/',
  '/verified-reviews/',
  '/gallery/',
  '/news/',
  '/nfpa-code-96-standards/',
  '/kitchen-exhaust-faq/',
  '/how-your-kitchen-ventilation-system-works/',
  '/privacy-policy/',
  '/sitemap/',
  '/kitchen-exhaust-services-overview/',

  // Service hubs
  '/cleaning/',
  '/fan-repair/',
  '/parts-installation/',

  // Standalone service detail pages
  '/grease-containment/',
  '/exhaust-fan-hinge-kit-installation/',
  '/exhaust-fan-belt-motor-repair/',
  '/access-panel-installation/',
  '/restaurant-fire-suppression-systems/',

  // Locations
  '/locations/',

  // LLM bot pages
  '/who-is-ddan-hood-cleaning-and-repair/',
  '/what-services-does-ddan-provide/',
  '/where-does-ddan-serve-clients/',
  '/is-ddan-hood-cleaning-and-repair-nfpa-96-compliant/',
  '/how-does-ddan-hood-cleaning-and-repair-work/',

  // Cleaning city pages (14)
  '/cleaning/nashville-tn/',
  '/cleaning/murfreesboro-tn/',
  '/cleaning/antioch-tn/',
  '/cleaning/hendersonville-tn/',
  '/cleaning/spring-hill-tn/',
  '/cleaning/smyrna-tn/',
  '/cleaning/gallatin-tn/',
  '/cleaning/lebanon-tn/',
  '/cleaning/goodlettsville-tn/',
  '/cleaning/brentwood-tn/',
  '/cleaning/mount-juliet-tn/',
  '/cleaning/hermitage-tn/',
  '/cleaning/madison-tn/',
  '/cleaning/la-vergne-tn/',

  // Repair city pages (27)
  '/fan-repair/nashville-tn/',
  '/fan-repair/murfreesboro-tn/',
  '/fan-repair/antioch-tn/',
  '/fan-repair/hendersonville-tn/',
  '/fan-repair/spring-hill-tn/',
  '/fan-repair/smyrna-tn/',
  '/fan-repair/gallatin-tn/',
  '/fan-repair/lebanon-tn/',
  '/fan-repair/goodlettsville-tn/',
  '/fan-repair/brentwood-tn/',
  '/fan-repair/mount-juliet-tn/',
  '/fan-repair/hermitage-tn/',
  '/fan-repair/madison-tn/',
  '/fan-repair/la-vergne-tn/',
  '/fan-repair/clarksville-tn/',
  '/fan-repair/franklin-tn/',
  '/fan-repair/columbia-tn/',
  '/fan-repair/shelbyville-tn/',
  '/fan-repair/springfield-tn/',
  '/fan-repair/dickson-tn/',
  '/fan-repair/nolensville-tn/',
  '/fan-repair/portland-tn/',
  '/fan-repair/white-house-tn/',
  '/fan-repair/lewisburg-tn/',
  '/fan-repair/hartsville-tn/',
  '/fan-repair/fairview-tn/',
  '/fan-repair/thompsons-station-tn/',

  // Parts-Installation city pages (27)
  '/parts-installation/nashville-tn/',
  '/parts-installation/murfreesboro-tn/',
  '/parts-installation/antioch-tn/',
  '/parts-installation/hendersonville-tn/',
  '/parts-installation/spring-hill-tn/',
  '/parts-installation/smyrna-tn/',
  '/parts-installation/gallatin-tn/',
  '/parts-installation/lebanon-tn/',
  '/parts-installation/goodlettsville-tn/',
  '/parts-installation/brentwood-tn/',
  '/parts-installation/mount-juliet-tn/',
  '/parts-installation/hermitage-tn/',
  '/parts-installation/madison-tn/',
  '/parts-installation/la-vergne-tn/',
  '/parts-installation/clarksville-tn/',
  '/parts-installation/franklin-tn/',
  '/parts-installation/columbia-tn/',
  '/parts-installation/shelbyville-tn/',
  '/parts-installation/springfield-tn/',
  '/parts-installation/dickson-tn/',
  '/parts-installation/nolensville-tn/',
  '/parts-installation/portland-tn/',
  '/parts-installation/white-house-tn/',
  '/parts-installation/lewisburg-tn/',
  '/parts-installation/hartsville-tn/',
  '/parts-installation/fairview-tn/',
  '/parts-installation/thompsons-station-tn/',

  // Installation hub
  '/fan-hood-installation/',

  // Installation city pages (27)
  '/fan-hood-installation/nashville-tn/',
  '/fan-hood-installation/murfreesboro-tn/',
  '/fan-hood-installation/antioch-tn/',
  '/fan-hood-installation/hendersonville-tn/',
  '/fan-hood-installation/spring-hill-tn/',
  '/fan-hood-installation/smyrna-tn/',
  '/fan-hood-installation/gallatin-tn/',
  '/fan-hood-installation/lebanon-tn/',
  '/fan-hood-installation/goodlettsville-tn/',
  '/fan-hood-installation/brentwood-tn/',
  '/fan-hood-installation/mount-juliet-tn/',
  '/fan-hood-installation/hermitage-tn/',
  '/fan-hood-installation/madison-tn/',
  '/fan-hood-installation/la-vergne-tn/',
  '/fan-hood-installation/clarksville-tn/',
  '/fan-hood-installation/franklin-tn/',
  '/fan-hood-installation/columbia-tn/',
  '/fan-hood-installation/shelbyville-tn/',
  '/fan-hood-installation/springfield-tn/',
  '/fan-hood-installation/dickson-tn/',
  '/fan-hood-installation/nolensville-tn/',
  '/fan-hood-installation/portland-tn/',
  '/fan-hood-installation/white-house-tn/',
  '/fan-hood-installation/lewisburg-tn/',
  '/fan-hood-installation/hartsville-tn/',
  '/fan-hood-installation/fairview-tn/',
  '/fan-hood-installation/thompsons-station-tn/',
];

export const GET: APIRoute = () => {
  const today = new Date().toISOString().split('T')[0];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${site}${page}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page === '/' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${page === '/' ? '1.0' : page.split('/').filter(Boolean).length === 1 ? '0.8' : '0.6'}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
