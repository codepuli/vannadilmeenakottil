const { JSDOM } = require('jsdom'), fs = require('fs'), path = require('path');
const src = fs.readFileSync(process.argv[2], 'utf8'), out = process.argv[3];
const O = 'https://vannadil.payyanur.in', IMG = O + '/photos/vmk_social_preview.jpg';
const L = {
  ml: { url: O + '/', loc: 'ml_IN', alt: 'en_IN',
    title: 'പയ്യന്നൂർ വണ്ണാടിൽ മീനക്കൊട്ടിൽ തറവാട് കളിയാട്ടം 2026',
    desc: 'പയ്യന്നൂർ വണ്ണാടിൽ മീനക്കൊട്ടിൽ തറവാട് കളിയാട്ടത്തിന്റെ ഔദ്യോഗിക വിവരങ്ങളും സമയവിവരങ്ങളും.',
    kw: 'വണ്ണാടിൽ മീനക്കൊട്ടിൽ, പയ്യന്നൂർ, കളിയാട്ടം 2026, തെയ്യം, മടയിൽ ചാമുണ്ഡി, വിഷ്ണുമൂർത്തി, കാനക്കര ഭഗവതി, ഗുളികൻ, ശ്രീകണ്ഠൻ ദൈവം',
    place: 'വണ്ണാടിൽ മീനക്കൊട്ടിൽ തറവാട്', imgAlt: 'വണ്ണാടിൽ മീനക്കൊട്ടിൽ തറവാട്ടിലെ മടയിൽ ചാമുണ്ഡി തെയ്യം, പയ്യന്നൂർ' },
  en: { url: O + '/en/', loc: 'en_IN', alt: 'ml_IN',
    title: 'Payyanur Vannadil Meenakkottil Tharavadu Kaliyattam 2026',
    desc: 'Official schedule, updates, and details for the Payyanur Vannadil Meenakkottil Tharavadu Kaliyattam 2026.',
    kw: 'Vannadil Meenakkottil, Payyanur, Kaliyattam 2026, Theyyam, Madayil Chamundi, Vishnumoorthy, Kanakkara Bhagavathi, Gulikan, Sreekantan Daivam, Kannur, Kerala',
    place: 'Vannadil Meenakkottil Tharavadu', imgAlt: 'Madayil Chamundi Theyyam at Vannadil Meenakkottil Tharavadu, Payyanur' }
};
const e = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
async function build(lang) {
  const c = L[lang], html = src.replace(/<html lang="[^"]*"/, `<html lang="${lang}"`);
  const dom = new JSDOM(html, { runScripts: 'dangerously', beforeParse(w) { w.__PRERENDER = true; } });
  const D = dom.window.__DATA; if (!D) throw new Error('no data for ' + lang);
  const place = { '@type': 'Place', name: c.place, address: { '@type': 'PostalAddress', streetAddress: c.place, addressLocality: 'Payyanur', addressSubregion: 'Kannur', addressRegion: 'Kerala', addressCountry: 'IN' } };
  const org = { '@type': 'Organization', name: c.place, url: O + '/' };
  const day = d => d === '7' ? '2026-11-07' : '2026-11-08';
  const ev = { '@type': 'Event', '@id': c.url + '#event', name: c.title, description: c.desc, url: c.url, image: [IMG],
    startDate: '2026-11-07', endDate: '2026-11-08', eventStatus: 'https://schema.org/EventScheduled', eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    inLanguage: lang, location: place, organizer: org,
    subEvent: D.TY.map(x => ({ '@type': 'Event', name: x.n[lang], startDate: day(x.day), eventStatus: 'https://schema.org/EventScheduled', eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode', location: place })) };
  const ld = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'WebSite', '@id': O + '/#website', url: O + '/', name: L.en.title, inLanguage: ['ml', 'en'], publisher: org },
    { '@type': 'WebPage', '@id': c.url + '#page', url: c.url, name: c.title, description: c.desc, inLanguage: lang, isPartOf: { '@id': O + '/#website' }, primaryImageOfPage: IMG, about: { '@id': c.url + '#event' } },
    ev ] };
  const head = `<title>${e(c.title)}</title>
<meta name="description" content="${e(c.desc)}">
<meta name="keywords" content="${e(c.kw)}">
<meta name="author" content="Nikhil Narayanan">
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1">
<meta name="geo.region" content="IN-KL"><meta name="geo.placename" content="Payyanur">
<link rel="canonical" href="${c.url}">
<link rel="alternate" hreflang="ml" href="${O}/">
<link rel="alternate" hreflang="en" href="${O}/en/">
<link rel="alternate" hreflang="x-default" href="${O}/">
<link rel="icon" href="/photos/vmk.ico" sizes="any"><link rel="shortcut icon" href="/photos/vmk.ico">
<meta property="og:type" content="website"><meta property="og:site_name" content="${e(c.place)}">
<meta property="og:url" content="${c.url}"><meta property="og:locale" content="${c.loc}"><meta property="og:locale:alternate" content="${c.alt}">
<meta property="og:title" content="${e(c.title)}"><meta property="og:description" content="${e(c.desc)}">
<meta property="og:image" content="${IMG}"><meta property="og:image:alt" content="${e(c.imgAlt)}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${e(c.title)}">
<meta name="twitter:description" content="${e(c.desc)}"><meta name="twitter:image" content="${IMG}"><meta name="twitter:image:alt" content="${e(c.imgAlt)}">
<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`;
  const file = path.join(out, lang === 'ml' ? 'index.html' : 'en/index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, dom.serialize().replace('<!--SEO-->', () => head));
  return file;
}
(async () => {
  for (const l of ['ml', 'en']) console.log(await build(l));
  fs.writeFileSync(path.join(out, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${O}/sitemap.xml\n`);
  const u = (loc) => `  <url>\n    <loc>${loc}</loc>\n    <lastmod>2026-10-29</lastmod>\n    <xhtml:link rel="alternate" hreflang="ml" href="${O}/"/>\n    <xhtml:link rel="alternate" hreflang="en" href="${O}/en/"/>\n    <xhtml:link rel="alternate" hreflang="x-default" href="${O}/"/>\n  </url>`;
  fs.writeFileSync(path.join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${u(O + '/')}\n${u(O + '/en/')}\n</urlset>\n`);
})();
