import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const origin = "https://datrick.com";
const outputPath = resolve(process.argv[2] || "docs/site-audit-2026-08-10.md");
const legacyPaths = [
  "/blog",
  "/career",
  "/clients",
  "/contact",
  "/data-integration-and-interoperability",
  "/devops-engineers",
  "/dwh",
  "/etl",
  "/etl-with-python-and-java",
  "/real-time-vs-batch-etl",
  "/schedule",
  "/solutions",
  "/team",
  "/terms-of-use",
  "/database-administration-services",
];

function cell(value) {
  return String(value ?? "").replaceAll("|", "\\|").replaceAll("\n", " ");
}

function textMatch(html, expression) {
  return html.match(expression)?.[1]?.trim() || "";
}

function purposeFor(pathname, title) {
  const source = `${pathname} ${title}`.toLowerCase();

  if (pathname === "/") return "Primary commercial entry page";
  if (source.includes("case-stud")) return "Proof / case study";
  if (source.includes("pricing")) return "Commercial pricing guide";
  if (source.includes("certif") || source.includes("guide") || source.includes("checklist") || source.includes("resource")) return "Informational resource";
  if (source.includes("managed") || source.includes("consult") || source.includes("migration") || source.includes("support") || source.includes("assessment") || source.includes("operations")) return "Commercial service page";
  if (source.includes("about") || source.includes("who-we-serve") || source.includes("partner")) return "Company / audience page";
  if (source.includes("privacy") || source.includes("terms") || source.includes("thank-you")) return "Utility / policy page";
  return "Informational or commercial supporting page";
}

async function fetchPage(url) {
  try {
    const response = await fetch(url, {
      redirect: "follow",
      headers: { "user-agent": "Datrick site audit (repository QA)" },
    });
    const html = await response.text();
    const canonical = textMatch(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/i)
      || textMatch(html, /<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["'][^>]*>/i);
    const robots = textMatch(html, /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["'][^>]*>/i).toLowerCase();
    const title = textMatch(html, /<title>([^<]*)<\/title>/i);

    return {
      requestedUrl: url,
      finalUrl: response.url,
      status: response.status,
      canonical: canonical || "Missing",
      indexable: response.ok && !robots.includes("noindex") ? "Yes" : "No",
      purpose: purposeFor(new URL(response.url).pathname, title),
      title,
    };
  } catch (error) {
    return {
      requestedUrl: url,
      finalUrl: "Request failed",
      status: "ERR",
      canonical: "Unknown",
      indexable: "Unknown",
      purpose: `Crawl error: ${error.message}`,
      title: "",
    };
  }
}

async function fetchRedirect(url) {
  try {
    const response = await fetch(url, {
      redirect: "manual",
      headers: { "user-agent": "Datrick site audit (repository QA)" },
    });
    return {
      url,
      status: response.status,
      location: response.headers.get("location") || "",
    };
  } catch (error) {
    return { url, status: "ERR", location: error.message };
  }
}

async function inBatches(items, operation, size = 8) {
  const results = [];
  for (let index = 0; index < items.length; index += size) {
    results.push(...await Promise.all(items.slice(index, index + size).map(operation)));
  }
  return results;
}

const sitemapResponse = await fetch(`${origin}/sitemap.xml`);
if (!sitemapResponse.ok) throw new Error(`Sitemap returned ${sitemapResponse.status}`);
const sitemapXml = await sitemapResponse.text();
const sitemapUrls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const pages = await inBatches(sitemapUrls, fetchPage);
const wwwChecks = await inBatches(
  sitemapUrls.map((url) => url.replace("https://datrick.com", "https://www.datrick.com")),
  fetchRedirect,
);
const legacyChecks = await inBatches(legacyPaths.map((path) => `${origin}${path}`), fetchRedirect);
const legacyFinals = await inBatches(legacyPaths.map((path) => `${origin}${path}`), fetchPage);

const wwwFailures = wwwChecks.filter((check) => check.status !== 301 || !check.location.startsWith("https://datrick.com"));
const canonicalFailures = pages.filter((page) => page.canonical === "Missing" || !page.canonical.startsWith("https://datrick.com"));
const nonIndexable = pages.filter((page) => page.indexable !== "Yes");
const resolvingLegacy = legacyChecks
  .map((check, index) => ({ ...check, final: legacyFinals[index] }))
  .filter((check) => Number(check.final.status) < 400);

const lines = [
  "# Datrick live-site audit",
  "",
  `Crawled ${new Date().toISOString()} from the live sitemap and a fixed list of legacy WordPress-era routes. No production state was changed.`,
  "",
  "## Domain and legacy findings",
  "",
  `- Sitemap URLs crawled: ${pages.length}.`,
  `- www redirect failures: ${wwwFailures.length}.`,
  `- Missing or non-apex canonicals: ${canonicalFailures.length}.`,
  `- Non-indexable sitemap URLs: ${nonIndexable.length}.`,
  `- Legacy routes still resolving after redirects: ${resolvingLegacy.length}.`,
  "- Historical split: both apex and www have been addressable. The current Vercel configuration redirects www to apex. The repository change makes that rule explicit and keeps apex-only canonicals.",
  "",
  "## Sitemap crawl",
  "",
  "| URL | Status | Canonical | Indexable | Purpose |",
  "|---|---:|---|---|---|",
  ...pages.map((page) => `| ${cell(page.requestedUrl)} | ${cell(page.status)} | ${cell(page.canonical)} | ${cell(page.indexable)} | ${cell(page.purpose)} |`),
  "",
  "## Legacy route probes",
  "",
  "| URL | Status | Redirect target | Final status | Final URL | Still resolves? |",
  "|---|---:|---|---:|---|---|",
  ...legacyChecks.map((check, index) => {
    const final = legacyFinals[index];
    return `| ${cell(check.url)} | ${cell(check.status)} | ${cell(check.location || "None")} | ${cell(final.status)} | ${cell(final.finalUrl)} | ${Number(final.status) < 400 ? "Yes" : "No"} |`;
  }),
  "",
  "## www redirect exceptions",
  "",
  ...(wwwFailures.length
    ? ["| URL | Status | Location |", "|---|---:|---|", ...wwwFailures.map((check) => `| ${cell(check.url)} | ${cell(check.status)} | ${cell(check.location)} |`)]
    : ["All sitemap paths returned a 301 from www to the apex equivalent during this crawl."]),
  "",
];

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${lines.join("\n")}\n`, "utf8");
console.log(`Wrote ${outputPath}`);
