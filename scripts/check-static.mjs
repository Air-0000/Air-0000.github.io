import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('public');
const failures = [];
const pages = (await readdir(root)).filter(name => name.endsWith('.html'));
const html = new Map(await Promise.all(pages.map(async name => [name, await readFile(path.join(root, name), 'utf8')])));
const ids = new Map();
for (const [name, text] of html) {
  const values = [...text.matchAll(/\bid\s*=\s*["']([^"']+)["']/g)].map(match => match[1]);
  if (new Set(values).size !== values.length) failures.push(`${name}: duplicate element IDs`);
  ids.set(name, new Set(values));
}
for (const [name, text] of html) {
  for (const match of text.matchAll(/\b(?:href|src)\s*=\s*["']([^"']+)["']/g)) {
    const url = match[1].replaceAll('&amp;', '&');
    if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(url)) continue;
    const [pathname, fragment] = url.split('#');
    const clean = pathname.split('?')[0];
    const target = clean && clean !== '/' ? clean.replace(/^\//, '') : (url.startsWith('#') ? name : 'index.html');
    const absolute = path.resolve(root, target);
    if (!absolute.startsWith(root + path.sep)) { failures.push(`${name}: unsafe local path ${url}`); continue; }
    try {
      if (!(await stat(absolute)).isFile()) throw new Error('not a file');
      if (fragment && ids.has(target) && !ids.get(target).has(decodeURIComponent(fragment))) failures.push(`${name}: missing anchor ${url}`);
    } catch { failures.push(`${name}: missing resource ${url}`); }
  }
}
if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else console.log(`Checked ${pages.length} pages: resource paths, anchor targets and unique IDs passed.`);
