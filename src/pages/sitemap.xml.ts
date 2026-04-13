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
  '/repair/',
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
  '/repair/nashville-tn/',
  '/repair/murfreesboro-tn/',
  '/repair/antioch-tn/',
  '/repair/hendersonville-tn/',
  '/repair/spring-hill-tn/',
  '/repair/smyrna-tn/',
  '/repair/gallatin-tn/',
  '/repair/lebanon-tn/',
  '/repair/goodlettsville-tn/',
  '/repair/brentwood-tn/',
  '/repair/mount-juliet-tn/',
  '/repair/hermitage-tn/',
  '/repair/madison-tn/',
  '/repair/la-vergne-tn/',
  '/repair/clarksville-tn/',
  '/repair/franklin-tn/',
  '/repair/columbia-tn/',
  '/repair/shelbyville-tn/',
  '/repair/springfield-tn/',
  '/repair/dickson-tn/',
  '/repair/nolensville-tn/',
  '/repair/portland-tn/',
  '/repair/white-house-tn/',
  '/repair/lewisburg-tn/',
  '/repair/hartsville-tn/',
  '/repair/fairview-tn/',
  '/repair/thompsons-station-tn/',

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
  '/installation/',

  // Installation city pages (27)
  '/installation/nashville-tn/',
  '/installation/murfreesboro-tn/',
  '/installation/antioch-tn/',
  '/installation/hendersonville-tn/',
  '/installation/spring-hill-tn/',
  '/installation/smyrna-tn/',
  '/installation/gallatin-tn/',
  '/installation/lebanon-tn/',
  '/installation/goodlettsville-tn/',
  '/installation/brentwood-tn/',
  '/installation/mount-juliet-tn/',
  '/installation/hermitage-tn/',
  '/installation/madison-tn/',
  '/installation/la-vergne-tn/',
  '/installation/clarksville-tn/',
  '/installation/franklin-tn/',
  '/installation/columbia-tn/',
  '/installation/shelbyville-tn/',
  '/installation/springfield-tn/',
  '/installation/dickson-tn/',
  '/installation/nolensville-tn/',
  '/installation/portland-tn/',
  '/installation/white-house-tn/',
  '/installation/lewisburg-tn/',
  '/installation/hartsville-tn/',
  '/installation/fairview-tn/',
  '/installation/thompsons-station-tn/',
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
