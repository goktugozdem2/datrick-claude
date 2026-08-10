import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const specs = [
  ["managed-database-operations", ["managed dba services", "remote dba services", "dba as a service"]],
  ["postgresql-consulting", ["postgresql consulting services", "postgres consultant"]],
  ["database-migration-services", ["database migration services"]],
  ["oracle-to-postgresql-migration", ["oracle to postgresql migration"]],
  ["sql-server-to-postgresql-migration", ["sql server to postgresql migration"]],
  ["in-house-dba-vs-managed", ["in-house dba", "managed"]],
];

function bodyWords(html) {
  const main = html.match(/<main[\s\S]*?<\/main>/i)?.[0] || "";
  const text = main.replace(/<[^>]+>/g, " ").replace(/&[^;]+;/g, " ");
  return text.match(/[A-Za-z0-9$+][A-Za-z0-9'’$+/-]*/g)?.length || 0;
}

for (const [slug, keywords] of specs) {
  const html = await readFile(new URL(`../${slug}.html`, import.meta.url), "utf8");
  const title = html.match(/<title>([^<]+)<\/title>/i)?.[1] || "";
  const description = html.match(/<meta name="description" content="([^"]+)"/i)?.[1] || "";
  const hero = html.match(/<section class="page-hero">[\s\S]*?<\/section>/i)?.[0].toLowerCase() || "";
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)].map((match) => JSON.parse(match[1]));
  const schemaTypes = schemas.flatMap((item) => item["@graph"] || [item]).map((item) => item["@type"]);
  const words = bodyWords(html);

  assert.ok(words >= 800 && words <= 1200, `${slug}: expected 800-1200 body words, found ${words}`);
  assert.ok(title.length < 60, `${slug}: title is ${title.length} characters`);
  assert.ok(description.length < 155, `${slug}: description is ${description.length} characters`);
  assert.match(html, new RegExp(`<link rel="canonical" href="https://datrick\\.com/${slug}">`));
  assert.match(html, new RegExp(`<meta property="og:url" content="https://datrick\\.com/${slug}">`));
  assert.ok(schemaTypes.includes("Service"), `${slug}: missing Service schema`);
  assert.ok(schemaTypes.includes("FAQPage"), `${slug}: missing FAQPage schema`);
  assert.ok((html.match(/<details>/g) || []).length >= 4, `${slug}: requires at least four visible FAQs`);
  assert.ok((html.match(/>Submit the written intake<\/a>/g) || []).length >= 2, `${slug}: missing top and bottom written-intake CTA`);
  assert.match(html, /href="case-study-managed-database-operations"/);
  assert.match(html, /href="outsourced-dba-services-pricing"/);
  assert.doesNotMatch(html, /\b(?:hire|hiring|freelancer|affordable|cheap)\b|hourly rates?|book a call|schedule an intro call|—/i, `${slug}: banned brand language`);
  assert.doesNotMatch(html, /calendly|calendar\.google|calendar link/i, `${slug}: calendar route is not permitted`);

  for (const keyword of keywords) assert.ok(hero.includes(keyword), `${slug}: '${keyword}' missing above the fold`);
}

const caseStudy = await readFile(new URL("../case-study-managed-database-operations.html", import.meta.url), "utf8");
assert.match(caseStudy, />5\+ years</);
assert.match(caseStudy, />\$20K\+</);
assert.match(caseStudy, />monthly delivery program</);
assert.match(caseStudy, /\[NEEDS INPUT: approved client description/);

const sitemap = await readFile(new URL("../sitemap.xml", import.meta.url), "utf8");
for (const [slug] of specs) assert.match(sitemap, new RegExp(`<loc>https://datrick\\.com/${slug}</loc>`));
assert.match(sitemap, /<loc>https:\/\/datrick\.com\/case-study-managed-database-operations<\/loc>/);

const vercel = JSON.parse(await readFile(new URL("../vercel.json", import.meta.url), "utf8"));
assert.ok(vercel.redirects.some((rule) => rule.source === "/:path*" && rule.has?.some((item) => item.type === "host" && item.value === "www.datrick.com") && rule.destination === "https://datrick.com/:path*" && rule.statusCode === 301));
assert.ok(vercel.redirects.some((rule) => rule.source === "/database-administration-services" && rule.destination === "/managed-database-operations" && rule.statusCode === 301));
for (const [slug] of specs) assert.ok(vercel.rewrites.some((rule) => rule.source === `/${slug}` && rule.destination === `/${slug}.html`), `${slug}: missing clean-route rewrite`);

const pricing = await readFile(new URL("../outsourced-dba-services-pricing.html", import.meta.url), "utf8");
for (const [slug] of specs) assert.match(pricing, new RegExp(`href="${slug}"`), `pricing guide must link to ${slug}`);
assert.doesNotMatch(pricing, /\b(?:hire|hiring|freelancer|affordable|cheap)\b|hourly rates?|book a call|schedule an intro call|—/i);

const guideLinks = [
  ["resource-database-handover.html", "managed-database-operations"],
  ["resource-migration-support-playbook.html", "database-migration-services"],
  ["postgresql-backup-verification-restore-drill.html", "postgresql-consulting"],
];
for (const [file, target] of guideLinks) {
  const html = await readFile(new URL(`../${file}`, import.meta.url), "utf8");
  assert.match(html, new RegExp(`href="${target}"`), `${file}: missing ${target} link`);
}

console.log("database money-page tests passed");
