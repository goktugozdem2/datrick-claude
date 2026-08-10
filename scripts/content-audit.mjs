import { readFile, readdir, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const reportDir = path.join(root, "seo-audit");
const strategicPages = new Set([
  "partners.html",
  "under-your-brand-data-operations.html",
  "how-it-consulting-firms-add-ai-services.html",
  "case-study-five-year-it-service-delivery-partner.html",
  "ai-project-handover-and-rescue-guide.html",
  "technical-llm-evaluation-coding-sql.html",
  "coding-agent-evaluation-services.html",
  "managed-ai-model-evaluation-rfp.html",
  "resource-production-ai-workflow.html",
  "resource-database-handover.html",
  "resource-migration-support-playbook.html",
  "etlelt-pricing-guide.html",
]);

const utilityPages = new Set([
  "about.html",
  "index.html",
  "privacy.html",
  "terms.html",
  "thank-you.html",
  "resources.html",
  "who-we-serve.html",
  "partner-brief.html",
]);

const approvedIntentBoundaries = new Set([
  ["partners.html", "under-your-brand-data-operations.html"].sort().join("::"),
  ["partners.html", "white-label-ai-delivery-partner.html"].sort().join("::"),
  ["under-your-brand-data-operations.html", "white-label-ai-delivery-partner.html"].sort().join("::"),
]);

const stopWords = new Set([
  "about", "after", "again", "against", "also", "and", "are", "because", "been", "before",
  "being", "between", "both", "but", "can", "could", "does", "each", "for", "from", "have",
  "here", "into", "its", "more", "most", "not", "only", "other", "our", "over", "same", "should",
  "than", "that", "the", "their", "then", "there", "these", "they", "this", "through", "under",
  "use", "using", "was", "were", "what", "when", "where", "which", "while", "with", "without",
  "would", "your", "you", "data", "dattrick", "datrick", "operations", "production", "service",
  "services", "support", "workflow", "workflows", "managed", "assessment", "automation", "ai",
]);

function decodeEntities(value = "") {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function extract(html, expression) {
  return decodeEntities(html.match(expression)?.[1]?.trim() ?? "");
}

function visibleText(html) {
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? html;
  return decodeEntities(
    main
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
      .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#.-]+/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2 && !stopWords.has(token));
}

function termFrequency(tokens) {
  const counts = new Map();
  for (const token of tokens) counts.set(token, (counts.get(token) ?? 0) + 1);
  const total = Math.max(tokens.length, 1);
  return new Map([...counts].map(([token, count]) => [token, count / total]));
}

function cosine(left, right) {
  let dot = 0;
  let leftNorm = 0;
  let rightNorm = 0;
  for (const value of left.values()) leftNorm += value * value;
  for (const value of right.values()) rightNorm += value * value;
  for (const [token, value] of left) dot += value * (right.get(token) ?? 0);
  if (!leftNorm || !rightNorm) return 0;
  return dot / Math.sqrt(leftNorm * rightNorm);
}

function topicFor(file) {
  if (/microsoft-fabric-data-agent|microsoft-fabric-operations-agent/.test(file)) return "Microsoft Fabric agents";
  if (/microsoft-fabric|power-bi|fabric/.test(file)) return "Microsoft Fabric and Power BI";
  if (/database|dba|postgres|sql-server|mysql|oracle/.test(file)) return "Database operations";
  if (/claude|anthropic/.test(file)) return "Claude";
  if (/search|rag|vector|kendra|coveo|glean|dash|pinecone|weaviate|qdrant|milvus|pgvector/.test(file)) return "Enterprise search and RAG";
  if (/agent|agentic|copilot|joule|agentforce/.test(file)) return "AI agents";
  if (/partner|white-label|under-your-brand|consulting-firms/.test(file)) return "Partner delivery";
  if (/migration|handover|rescue/.test(file)) return "Handover and migration";
  return "Core and general";
}

function csvCell(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

const entries = await readdir(root, { withFileTypes: true });
const files = entries
  .filter((entry) => entry.isFile() && entry.name.endsWith(".html"))
  .map((entry) => entry.name)
  .filter((file) => !file.startsWith("linkedin-"))
  .sort();

const sitemap = await readFile(path.join(root, "sitemap.xml"), "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
const sitemapPaths = new Set(sitemapUrls.map((url) => new URL(url).pathname.replace(/^\//, "") || "index.html"));
const resourceIndex = await readFile(path.join(root, "resources.html"), "utf8");

const pages = [];
for (const file of files) {
  const html = await readFile(path.join(root, file), "utf8");
  const text = visibleText(html);
  const tokens = tokenize(text);
  const hrefs = [...html.matchAll(/href=["']([^"'#?]+(?:\.html)?)["']/gi)].map((match) => match[1]);
  const canonical = extract(html, /<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i)
    || extract(html, /<link\b[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["'][^>]*>/i);
  const description = extract(html, /<meta\b[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i)
    || extract(html, /<meta\b[^>]*content=["']([^"']*)["'][^>]*name=["']description["'][^>]*>/i);
  const title = extract(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
  const h1 = extract(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  const noindex = /<meta\b[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html);
  const redirect = /http-equiv=["']refresh["']/i.test(html) || /window\.location|location\.replace/i.test(html);
  const articlePage = /<body\b[^>]*class=["'][^"']*article-page/i.test(html)
    || /["']@type["']\s*:\s*["']Article["']/i.test(html);
  const inSitemap = sitemapPaths.has(file) || sitemapPaths.has(file.replace(/\.html$/, ""));
  const linkedFromResources = new RegExp(`href=["'](?:\.?\/)?${file.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:["'#?])`, "i").test(resourceIndex)
    || new RegExp(`href=["'](?:\.?\/)?${file.replace(/\.html$/, "")}(?:["'#?])`, "i").test(resourceIndex);
  const hasAuthor = /\b(author|reviewed|written by)\b/i.test(text) || /class=["'][^"']*article-review/i.test(html);
  const hasEvidence = /\b(case study|client|measured|benchmark|methodology|we tested|in our work|practice basis|delivery partner|years)\b/i.test(text);
  const hasPrimarySource = /href=["']https?:\/\/(?:www\.)?(?:anthropic\.com|platform\.claude\.com|docs\.anthropic\.com|learn\.microsoft\.com|docs\.aws\.amazon\.com|cloud\.google\.com|docs\.vercel\.com)\//i.test(html);
  const hasSchema = /application\/ld\+json/i.test(html);
  const ctaCount = (html.match(/#(?:contact|inquiry-form)|Describe the|Start a conversation/gi) ?? []).length;
  pages.push({
    file,
    topic: topicFor(file),
    title,
    description,
    h1,
    canonical,
    wordCount: tokens.length,
    internalLinks: hrefs.filter((href) => !/^(?:https?:|mailto:|tel:)/i.test(href)).length,
    hasAuthor,
    hasEvidence,
    hasPrimarySource,
    hasSchema,
    ctaCount,
    noindex,
    redirect,
    articlePage,
    inSitemap,
    linkedFromResources,
    tf: termFrequency(tokens),
  });
}

const similarities = [];
for (let leftIndex = 0; leftIndex < pages.length; leftIndex += 1) {
  for (let rightIndex = leftIndex + 1; rightIndex < pages.length; rightIndex += 1) {
    const left = pages[leftIndex];
    const right = pages[rightIndex];
    const pairKey = [left.file, right.file].sort().join("::");
    if (left.topic !== right.topic || left.noindex || right.noindex || left.redirect || right.redirect || approvedIntentBoundaries.has(pairKey)) continue;
    const score = cosine(left.tf, right.tf);
    if (score >= 0.72) similarities.push({ left: left.file, right: right.file, topic: left.topic, score });
  }
}
similarities.sort((a, b) => b.score - a.score);

const closest = new Map();
for (const pair of similarities) {
  if (!closest.has(pair.left)) closest.set(pair.left, { file: pair.right, score: pair.score });
  if (!closest.has(pair.right)) closest.set(pair.right, { file: pair.left, score: pair.score });
}

for (const page of pages) {
  const nearest = closest.get(page.file);
  const issues = [];
  if (!page.title) issues.push("missing title");
  if (!page.description) issues.push("missing meta description");
  if (!page.h1) issues.push("missing H1");
  if (!page.canonical) issues.push("missing canonical");
  if (page.wordCount < 500) issues.push("thin content");
  if (page.internalLinks < 3) issues.push("weak internal linking");
  if (page.articlePage && !page.hasAuthor && !utilityPages.has(page.file)) issues.push("no visible authorship");
  if (page.articlePage && !page.hasEvidence && !page.hasPrimarySource && !utilityPages.has(page.file)) issues.push("limited evidence or primary-source signals");
  if (page.inSitemap && page.noindex) issues.push("noindex URL in sitemap");
  if (page.inSitemap && page.redirect) issues.push("redirect URL in sitemap");
  if (page.articlePage && !page.linkedFromResources && !utilityPages.has(page.file) && !strategicPages.has(page.file)) issues.push("not linked from resource hub");
  if (nearest?.score >= 0.86) issues.push("very high same-topic similarity");
  else if (nearest?.score >= 0.78) issues.push("high same-topic similarity");

  let classification = "KEEP";
  if (page.noindex || page.redirect) classification = "EXCLUDED";
  else if (strategicPages.has(page.file)) classification = issues.length ? "IMPROVE PRIORITY" : "KEEP PRIORITY";
  else if (page.wordCount < 350) classification = "NOINDEX OR REDIRECT REVIEW";
  else if (nearest?.score >= 0.86) classification = "MERGE REVIEW";
  else if (issues.length >= 3) classification = "IMPROVE";
  else if (nearest?.score >= 0.78) classification = "CANNIBALIZATION REVIEW";

  Object.assign(page, {
    nearestPage: nearest?.file ?? "",
    similarity: nearest?.score ?? 0,
    issues,
    classification,
  });
}

const topicSummary = new Map();
for (const page of pages) {
  const summary = topicSummary.get(page.topic) ?? { pages: 0, merge: 0, improve: 0, priority: 0 };
  summary.pages += 1;
  if (page.classification === "MERGE REVIEW" || page.classification === "CANNIBALIZATION REVIEW") summary.merge += 1;
  if (page.classification.startsWith("IMPROVE")) summary.improve += 1;
  if (page.classification.includes("PRIORITY")) summary.priority += 1;
  topicSummary.set(page.topic, summary);
}

const counts = pages.reduce((result, page) => {
  result[page.classification] = (result[page.classification] ?? 0) + 1;
  return result;
}, {});

const csvHeaders = [
  "file", "topic", "classification", "word_count", "internal_links", "in_sitemap", "resource_hub_link",
  "canonical", "author_signal", "evidence_signal", "schema", "cta_count", "nearest_page", "similarity", "issues",
];
const csvRows = pages.map((page) => [
  page.file, page.topic, page.classification, page.wordCount, page.internalLinks, page.inSitemap,
  page.linkedFromResources, page.canonical, page.hasAuthor, page.hasEvidence, page.hasSchema, page.ctaCount,
  page.nearestPage, page.similarity.toFixed(3), page.issues.join("; "),
].map(csvCell).join(","));

const topPairs = similarities.slice(0, 50);
const report = `# Datrick Content Risk Audit

Generated: ${new Date().toISOString()}

## Executive Summary

- HTML pages audited: **${pages.length}**
- Sitemap URLs: **${sitemapUrls.length}**
- Indexable article pages absent from the resource hub: **${pages.filter((page) => page.articlePage && !page.noindex && !page.linkedFromResources && !utilityPages.has(page.file)).length}**
- Indexable article pages without visible authorship signals: **${pages.filter((page) => page.articlePage && !page.noindex && !page.hasAuthor && !utilityPages.has(page.file)).length}**
- Indexable article pages with limited evidence or primary-source signals: **${pages.filter((page) => page.articlePage && !page.noindex && !page.hasEvidence && !page.hasPrimarySource && !utilityPages.has(page.file)).length}**
- Same-topic pairs at or above 0.78 similarity: **${similarities.filter((pair) => pair.score >= 0.78).length}**
- Same-topic pairs at or above 0.86 similarity: **${similarities.filter((pair) => pair.score >= 0.86).length}**

## Classification Counts

${Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([name, count]) => `- ${name}: **${count}**`).join("\n")}

## Topic Risk

| Topic | Pages | Merge/cannibalization review | Improve | Priority |
|---|---:|---:|---:|---:|
${[...topicSummary.entries()].sort((a, b) => b[1].pages - a[1].pages).map(([topic, value]) => `| ${topic} | ${value.pages} | ${value.merge} | ${value.improve} | ${value.priority} |`).join("\n")}

## Highest Similarity Pairs

| Page A | Page B | Topic | Similarity |
|---|---|---|---:|
${topPairs.map((pair) => `| ${pair.left} | ${pair.right} | ${pair.topic} | ${pair.score.toFixed(3)} |`).join("\n")}

## Immediate Rules

1. Freeze net-new programmatic pages until Search Console data is available.
2. Do not bulk noindex or delete URLs based only on this report.
3. Review every pair above 0.86 for merge, differentiation, or canonical consolidation.
4. Add visible authorship, reviewer credentials, methodology, and first-hand evidence to priority pages.
5. Validate fast-changing product, model, certification, and pricing claims against primary sources.
6. Use Search Console at 7, 14, and 28 days to decide keep, improve, merge, redirect, or noindex.

## Files

- Full page classification: \`seo-audit/content-classification.csv\`
- High-similarity pairs: \`seo-audit/similarity-pairs.csv\`
`;

const pairCsv = ["page_a,page_b,topic,similarity", ...similarities.map((pair) => [pair.left, pair.right, pair.topic, pair.score.toFixed(3)].map(csvCell).join(","))].join("\n");

await mkdir(reportDir, { recursive: true });
await writeFile(path.join(reportDir, "content-classification.csv"), `${csvHeaders.join(",")}\n${csvRows.join("\n")}\n`);
await writeFile(path.join(reportDir, "similarity-pairs.csv"), `${pairCsv}\n`);
await writeFile(path.join(reportDir, "content-risk-audit.md"), report);

console.log(`Audited ${pages.length} pages.`);
console.log(`Wrote ${path.relative(root, reportDir)}/content-risk-audit.md`);
console.log(JSON.stringify(counts, null, 2));
