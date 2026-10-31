// Usage (from the folder that contains /fonts):  node make-fonts-json.js
// Scans ./fonts for font files and writes ./fonts/fonts.json for the Malayalam heading rotation.
const fs = require('fs'), path = require('path');
const dir = path.join(process.cwd(), 'fonts');
if (!fs.existsSync(dir)) { console.error('No ./fonts folder here. Run this from the site root.'); process.exit(1); }
const list = fs.readdirSync(dir)
  .filter(f => /\.(woff2|woff|ttf|otf)$/i.test(f) && !/^manjari/i.test(f)) // Manjari is always first already
  .sort()
  .map(f => ({ n: f.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').replace(/\s*(regular|normal)$/i, '').trim(), f: '/fonts/' + encodeURIComponent(f) }));
fs.writeFileSync(path.join(dir, 'fonts.json'), JSON.stringify(list, null, 2) + '\n');
console.log(list.length + ' font(s) written to fonts/fonts.json');
list.forEach(x => console.log('  ' + x.n + '  ->  ' + x.f));
