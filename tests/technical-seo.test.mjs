import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const htmlFiles = fs.readdirSync(root).filter((file) => file.endsWith(".html"));
const titles = new Map();
const canonicals = new Map();
const brokenLinks = [];
const markupIssues = [];

function add(map, key, file) {
  const files = map.get(key) ?? [];
  files.push(file);
  map.set(key, files);
}

function localTargetExists(href) {
  const clean = decodeURIComponent(href.split("#")[0].split("?")[0]).replace(/^\/+/, "");
  if (!clean) return true;

  const candidates = [
    clean,
    `${clean}.html`,
    path.join(clean, "index.html"),
    `${clean}.js`,
  ];
  return candidates.some((candidate) => fs.existsSync(path.join(root, candidate)));
}

for (const file of htmlFiles) {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  const isNoindex = /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(html);
  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1].replace(/\s+/g, " ").trim();
  const description = html.match(/<meta[^>]+name="description"[^>]+content="([^"]+)"/i)?.[1].trim();
  const canonical = html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i)?.[1].trim();
  const h1Count = (html.match(/<h1(?:\s|>)/gi) ?? []).length;

  if (!isNoindex) {
    if (!title) markupIssues.push(`${file}: missing title`);
    if (!description) markupIssues.push(`${file}: missing meta description`);
    if (!canonical) markupIssues.push(`${file}: missing canonical`);
    if (h1Count !== 1) markupIssues.push(`${file}: expected one H1, found ${h1Count}`);
  }

  if (title && !isNoindex) add(titles, title, file);
  if (canonical && !isNoindex) add(canonicals, canonical, file);

  for (const script of html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
    assert.doesNotThrow(
      () => JSON.parse(script[1]),
      `${file}: invalid JSON-LD`,
    );
  }

  for (const match of html.matchAll(/href="([^"]+)"/g)) {
    const href = match[1];
    if (/^(?:https?:|mailto:|tel:|javascript:|#)/i.test(href)) continue;
    if (!localTargetExists(href)) brokenLinks.push(`${file} -> ${href}`);
  }
}

const duplicateTitles = [...titles.entries()].filter(([, files]) => files.length > 1);
const duplicateCanonicals = [...canonicals.entries()].filter(([, files]) => files.length > 1);

assert.deepEqual(markupIssues, [], `Technical SEO markup issues:\n${markupIssues.join("\n")}`);
assert.deepEqual(brokenLinks, [], `Broken internal links:\n${brokenLinks.join("\n")}`);
assert.deepEqual(duplicateTitles, [], `Duplicate titles:\n${JSON.stringify(duplicateTitles, null, 2)}`);
assert.deepEqual(duplicateCanonicals, [], `Duplicate canonicals:\n${JSON.stringify(duplicateCanonicals, null, 2)}`);

const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
assert.equal(new Set(sitemapUrls).size, sitemapUrls.length, "Sitemap URLs must be unique");

const vercelIgnore = fs.readFileSync(path.join(root, ".vercelignore"), "utf8");
for (const internalPath of ["seo-audit/", "sales-funnel/", "docs/", "google-apps-script/", "scripts/", "tests/"]) {
  assert.match(
    vercelIgnore,
    new RegExp(`^${internalPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "m"),
    `${internalPath} must be excluded from production deployments`,
  );
}

const socialCard = path.join(root, "assets", "datrick-social-card.png");
assert.ok(fs.existsSync(socialCard), "Shared social card must exist");
assert.ok(fs.statSync(socialCard).size > 10_000, "Shared social card must contain rendered image data");

const styles = fs.readFileSync(path.join(root, "styles.css"), "utf8");
assert.doesNotMatch(styles, /fonts\.googleapis\.com/, "Production CSS must not block rendering on Google Fonts");
for (const font of [
  "ibm-plex-sans-latin.woff2",
  "ibm-plex-serif-600-latin.woff2",
  "ibm-plex-serif-700-latin.woff2",
  "ibm-plex-mono-500-latin.woff2",
  "ibm-plex-mono-600-latin.woff2",
]) {
  assert.ok(fs.existsSync(path.join(root, "assets", "fonts", font)), `Missing self-hosted font: ${font}`);
}

const vercel = fs.readFileSync(path.join(root, "vercel.json"), "utf8");
assert.match(vercel, /"source": "\/opengraph-image"[\s\S]*?"destination": "\/assets\/datrick-social-card\.png"/);
assert.match(vercel, /"source": "\/twitter-image"[\s\S]*?"destination": "\/assets\/datrick-social-card\.png"/);
assert.match(vercel, /"key": "Strict-Transport-Security"/);
assert.match(vercel, /"source": "\/assets\/\(\.\*\)"[\s\S]*?"key": "Cache-Control"/);
assert.match(vercel, /"source": "\/styles\.css"[\s\S]*?"key": "Cache-Control"/);
assert.match(vercel, /"source": "\/script\.js"[\s\S]*?"key": "Cache-Control"/);

for (const file of ["index.html", "about.html"]) {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  assert.match(html, /"@id": "https:\/\/datrick\.com\/#organization"/, `${file}: missing organization entity ID`);
  assert.match(html, /"foundingDate": "2022"/, `${file}: missing founding date`);
  assert.match(html, /"https:\/\/clutch\.co\/profile\/datrick"/, `${file}: missing published Clutch identity`);
}

for (const file of htmlFiles) {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  if (!/<meta property="og:image"/i.test(html)) continue;

  assert.match(
    html,
    /<meta property="og:image" content="https:\/\/datrick\.com\/assets\/datrick-social-card\.png">/,
    `${file}: must use the 1200x630 social card`,
  );
  assert.match(html, /<meta property="og:image:width" content="1200">/, `${file}: missing social image width`);
  assert.match(html, /<meta property="og:image:height" content="630">/, `${file}: missing social image height`);
  if (/<meta name="twitter:card"/i.test(html)) {
    assert.match(
      html,
      /<meta name="twitter:card" content="summary_large_image">/,
      `${file}: must request a large social card`,
    );
  }
}

console.log(`technical SEO tests passed (${htmlFiles.length} pages, ${sitemapUrls.length} sitemap URLs)`);
