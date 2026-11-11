// Writes static HTML for the routes marked `prerender` in src/constants/seo.ts.
// Runs after `vite build` and `vite build --ssr`; see the "build" script in package.json.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const ssrEntry = join(root, "dist-ssr", "entry-server.js");

const { render, routeMeta, SITE_URL } = await import(new URL(`file:///${ssrEntry.replace(/\\/g, "/")}`).href);

const template = readFileSync(join(dist, "index.html"), "utf8");

const escapeAttr = (value) => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const escapeText = (value) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;");

const replaceOnce = (html, pattern, replacement) => {
  if (!pattern.test(html)) throw new Error(`prerender: pattern not found in index.html: ${pattern}`);
  return html.replace(pattern, replacement);
};

const withMeta = (html, path, meta) => {
  const url = `${SITE_URL}${path === "/" ? "/" : path}`;
  html = replaceOnce(html, /<title>[^<]*<\/title>/, `<title>${escapeText(meta.title)}</title>`);
  html = replaceOnce(html, /(<meta name="description" content=")[^"]*(")/, `$1${escapeAttr(meta.description)}$2`);
  html = replaceOnce(html, /(<meta name="robots" content=")[^"]*(")/, `$1${meta.indexable ? "index, follow" : "noindex, follow"}$2`);
  html = replaceOnce(html, /(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`);
  html = replaceOnce(html, /(<meta property="og:title" content=")[^"]*(")/, `$1${escapeAttr(meta.title)}$2`);
  html = replaceOnce(html, /(<meta property="og:description" content=")[^"]*(")/, `$1${escapeAttr(meta.description)}$2`);
  html = replaceOnce(html, /(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`);
  return html;
};

// Client-only shell for routes that are not prerendered (and unknown URLs), so the browser
// never hydrates the home page's markup against a different route.
writeFileSync(join(dist, "app-shell.html"), withMeta(template, "/", { ...routeMeta["/"], indexable: false }));

for (const [path, meta] of Object.entries(routeMeta)) {
  if (!meta.prerender) continue;
  const appHtml = render(path);
  if (!appHtml) throw new Error(`prerender: empty render for ${path}`);
  const html = replaceOnce(withMeta(template, path, meta), /<div id="root"><\/div>/, `<div id="root">${appHtml}</div>`);
  const file = path === "/" ? join(dist, "index.html") : join(dist, path.slice(1), "index.html");
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  console.log(`prerendered ${path} (${(html.length / 1024).toFixed(1)} kB)`);
}

rmSync(join(root, "dist-ssr"), { recursive: true, force: true });
