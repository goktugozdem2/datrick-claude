import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const reportPath = path.join(root, "seo-audit", "internal-link-authority-20260728.md");
const commercialTargets = [
  "/ai-readiness-assessment-model-selection",
  "/ai-workflows.html",
  "/anthropic.html",
  "/white-label-ai-agent-operations-managed-support-for-msps",
  "/data-operations.html",
  "/emergency-dba-support.html",
  "/microsoft-fabric-managed-services-support-operations",
  "/power-bi-managed-services-support",
  "/etlelt-pricing-guide",
];

function stripMarkup(value = "") {
  return value
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function canonicalPath(html, file) {
  const canonical = html.match(/<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i)?.[1]
    ?? html.match(/<link\b[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["'][^>]*>/i)?.[1];
  if (canonical) return new URL(canonical).pathname;
  return file === "index.html" ? "/" : `/${file}`;
}

function normalizeTarget(href, sourcePath) {
  if (!href || /^(?:mailto:|tel:|javascript:)/i.test(href)) return null;
  const url = new URL(href, `https://datrick.com${sourcePath}`);
  if (url.hostname !== "datrick.com" && url.hostname !== "www.datrick.com") return null;
  return url.pathname === "/index.html" ? "/" : url.pathname;
}

function extractLinks(html, sourcePath) {
  const mainHtml = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? "";
  const mainAnchors = new Set(
    [...mainHtml.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)]
      .map((match) => {
        const target = normalizeTarget(match[1], sourcePath);
        return target ? `${target}\t${stripMarkup(match[2])}` : null;
      })
      .filter(Boolean),
  );

  return [...html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)]
    .map((match) => {
      const target = normalizeTarget(match[1], sourcePath);
      if (!target) return null;
      const anchor = stripMarkup(match[2]);
      return {
        target,
        anchor,
        contextual: mainAnchors.has(`${target}\t${anchor}`),
      };
    })
    .filter(Boolean);
}

const files = (await readdir(root, { withFileTypes: true }))
  .filter((entry) => entry.isFile() && entry.name.endsWith(".html") && !entry.name.startsWith("linkedin-"))
  .map((entry) => entry.name)
  .sort();

const pages = [];
for (const file of files) {
  const html = await readFile(path.join(root, file), "utf8");
  const sourcePath = canonicalPath(html, file);
  pages.push({ file, sourcePath, links: extractLinks(html, sourcePath) });
}

const inbound = new Map();
for (const page of pages) {
  for (const link of page.links) {
    const record = inbound.get(link.target) ?? { sources: new Set(), contextualSources: new Set(), anchors: new Map() };
    record.sources.add(page.sourcePath);
    if (link.contextual) record.contextualSources.add(page.sourcePath);
    const anchorSources = record.anchors.get(link.anchor) ?? new Set();
    anchorSources.add(page.sourcePath);
    record.anchors.set(link.anchor, anchorSources);
    inbound.set(link.target, record);
  }
}

const rows = commercialTargets.map((target) => {
  const record = inbound.get(target) ?? { sources: new Set(), contextualSources: new Set(), anchors: new Map() };
  const topAnchors = [...record.anchors.entries()]
    .sort((left, right) => right[1].size - left[1].size)
    .slice(0, 3)
    .map(([anchor, sources]) => `${anchor || "(image/empty)"} (${sources.size})`)
    .join("; ");
  return {
    target,
    sources: record.sources.size,
    contextualSources: record.contextualSources.size,
    contextualSourceList: [...record.contextualSources].sort(),
    topAnchors,
  };
});

const weakTargets = rows.filter((row) => row.contextualSources < 4);
const report = `# Internal Link Authority Audit

Generated: ${new Date().toISOString()}

This report counts unique source pages, not repeated links. "Contextual" means the link appears inside the page's \`<main>\` content rather than only in global navigation or the footer.

## Commercial targets

| Target | Unique source pages | Contextual source pages | Most common anchors |
| --- | ---: | ---: | --- |
${rows.map((row) => `| \`${row.target}\` | ${row.sources} | ${row.contextualSources} | ${row.topAnchors || "-"} |`).join("\n")}

## Review queue

Commercial targets with fewer than four contextual source pages:

${weakTargets.length
    ? weakTargets
      .map((row) => `- \`${row.target}\`: ${row.contextualSources} contextual sources${row.contextualSourceList.length ? ` (${row.contextualSourceList.map((source) => `\`${source}\``).join(", ")})` : ""}`)
      .join("\n")
    : "- None"}

Do not add sitewide links to raise these counts. Add a link only where the source page serves the same buyer decision or operational problem.
`;

await mkdir(path.dirname(reportPath), { recursive: true });
await writeFile(reportPath, report);
console.log(`Wrote ${path.relative(root, reportPath)}`);
