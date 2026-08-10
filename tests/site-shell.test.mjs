import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const htmlFiles = fs.readdirSync(root).filter((file) => file.endsWith(".html"));
const trackingScript = fs.readFileSync(path.join(root, "script.js"), "utf8");
const navFingerprints = new Set();
let shellPages = 0;

assert.match(trackingScript, /const eventAttribution = attributionEventData\(readAttribution\(\)\);/, "CTA and contact tracking must retain first-touch attribution");
assert.match(trackingScript, /trackAnalyticsEvent\("Contact Method Clicked", \{\s+\.\.\.eventAttribution,/, "Contact-method events must include attribution");

for (const file of htmlFiles) {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  const nav = html.match(/<nav class="nav"[\s\S]*?<\/nav>/)?.[0];

  assert.doesNotMatch(html, /tracking\.js/, `${file} must not request the retired tracking bundle`);

  if (!nav) {
    continue;
  }

  shellPages += 1;
  navFingerprints.add(nav
    .replace(/<a class="nav-mobile-cta"[^>]*>[\s\S]*?<\/a>/, '<a class="nav-mobile-cta">Conversion action</a>')
    .replace(/\s+/g, " ")
    .trim());
  assert.match(nav, /data-shell-version="2026-07-17"/, `${file} must use the canonical shell`);
  assert.match(nav, /class="nav-mobile-cta"/, `${file} must retain a mobile conversion action`);
  assert.equal((nav.match(/class="nav-trigger"/g) || []).length, 3, `${file} must have three concise dropdowns`);
  assert.match(nav, /href="ai-readiness-assessment-model-selection">AI Readiness &amp; Model Selection<\/a>/, `${file} must expose the AI assessment offer in Services`);
  assert.doesNotMatch(nav, />Contact<\/a>/, `${file} must not duplicate Contact beside the header CTA`);
  assert.match(html, /<footer[\s\S]*?href="ai-readiness-assessment-model-selection">AI Readiness &amp; Model Selection<\/a>[\s\S]*?<\/footer>/, `${file} footer must expose the AI assessment offer`);

  const skipTarget = html.match(/class="skip-link" href="#([^"]+)"/)?.[1];
  assert.ok(skipTarget, `${file} must include a skip link`);
  assert.match(html, new RegExp(`<main\\b[^>]*\\bid="${skipTarget}"[^>]*\\btabindex="-1"`), `${file} skip link target must be focusable`);
}

const shellExclusions = new Set(["thank-you.html", "white-label-data-operations.html"]);
assert.equal(shellPages, htmlFiles.length - shellExclusions.size, "Every standard page should use the shared shell");
assert.equal(navFingerprints.size, 1, "Primary navigation must not drift between pages");

const commercialPages = [
  "partners.html",
  "data-operations.html",
  "ai-workflows.html",
  "ai-model-training.html",
  "ai-readiness-assessment-model-selection.html",
  "anthropic.html",
  "database-health-assessment.html",
  "migration-risk-assessment.html",
  "claude-team-enablement.html",
];

for (const file of commercialPages) {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  assert.match(html, /<body class="[^"]*commercial-detail-page[^"]*"[^>]*>/, `${file} must use commercial spacing`);
  assert.ok((html.match(/data-section-label=/g) || []).length >= 5, `${file} must expose major page landmarks`);
}

const anthropic = fs.readFileSync(path.join(root, "anthropic.html"), "utf8");
assert.equal((anthropic.match(/<section class="cta-band"/g) || []).length, 1, "Claude page must have one final conversion section");

const assessment = fs.readFileSync(path.join(root, "ai-readiness-assessment-model-selection.html"), "utf8");
assert.match(assessment, /<link rel="canonical" href="https:\/\/datrick\.com\/ai-readiness-assessment-model-selection">/, "AI assessment page must use the clean canonical URL");
assert.match(assessment, /How do I choose an AI readiness assessment provider\?/, "AI assessment page must answer provider-selection intent");
assert.match(assessment, /Should a business buy an AI readiness tool or commission an assessment\?/, "AI assessment page must distinguish tools from accountable assessment services");
assert.match(assessment, /AI readiness assessment provider selection criteria/, "AI assessment page must expose measurable provider-selection criteria");
assert.equal((assessment.match(/<h1>/g) || []).length, 1, "AI assessment page must have one H1");
assert.equal((assessment.match(/<section class="cta-band"/g) || []).length, 1, "AI assessment page must have one final conversion section");
assert.equal((assessment.match(/<details><summary>/g) || []).length, 10, "AI assessment page must expose ten visible FAQs");
assert.match(assessment, /service=AI%20value%2C%20model%20selection%2C%20and%20integration%20assessment/, "AI assessment CTA must prefill the existing qualification form");

const assessmentJson = assessment.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
assert.ok(assessmentJson, "AI assessment page must include JSON-LD");
const assessmentGraph = JSON.parse(assessmentJson)["@graph"];
assert.ok(assessmentGraph.some((item) => item["@type"] === "Service"), "AI assessment JSON-LD must describe the service");
assert.ok(assessmentGraph.some((item) => item["@type"] === "BreadcrumbList"), "AI assessment JSON-LD must include breadcrumbs");
assert.equal(assessmentGraph.find((item) => item["@type"] === "FAQPage")?.mainEntity.length, 10, "AI assessment JSON-LD must match the ten visible FAQs");

const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
const sonnetMigration = fs.readFileSync(path.join(root, "claude-sonnet-5-migration-guide.html"), "utf8");
assert.match(sonnetMigration, /<title>Claude Sonnet 5 Migration Guide: API Setup &amp; Breaking Changes<\/title>/, "Sonnet 5 migration guide must match API setup and breaking-change intent");
assert.match(sonnetMigration, /Is temperature deprecated in Claude Sonnet 5\?/, "Sonnet 5 migration guide must answer deprecated-temperature intent");
assert.match(sonnetMigration, /"@type":"Article"/, "Sonnet 5 migration guide must expose Article structured data");
assert.match(sonnetMigration, /"dateModified":"2026-07-28"/, "Sonnet 5 migration guide must expose the latest update date");
assert.match(sitemap, /https:\/\/datrick\.com\/claude-sonnet-5-migration-guide<\/loc><lastmod>2026-07-28<\/lastmod>/, "Sitemap must expose the updated Sonnet 5 migration guide");

const whiteLabelAiMsp = fs.readFileSync(path.join(root, "white-label-ai-agent-operations-managed-support-for-msps.html"), "utf8");
assert.match(whiteLabelAiMsp, /Resell white-label AI agent operations to your MSP customers under your brand\./, "White-label AI page must address MSP reseller intent in the H1");
assert.match(whiteLabelAiMsp, /Can an MSP resell this white-label AI agent operations service to customers\?/, "White-label AI page must answer the reseller query without presenting the managed service as software");
assert.ok(JSON.parse(whiteLabelAiMsp.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1])["@graph"].some((item) => item["@type"] === "BreadcrumbList"), "White-label AI page must expose its partner-service hierarchy");
assert.match(sitemap, /https:\/\/datrick\.com\/white-label-ai-agent-operations-managed-support-for-msps<\/loc><lastmod>2026-07-28<\/lastmod>/, "Sitemap must expose the updated white-label AI MSP page");

const boxAiStudio = fs.readFileSync(path.join(root, "box-ai-studio-agents-production-support-managed-services.html"), "utf8");
const fabricManagedServices = fs.readFileSync(path.join(root, "microsoft-fabric-managed-services-support-operations.html"), "utf8");
const copilotStudioServices = fs.readFileSync(path.join(root, "microsoft-copilot-studio-managed-services-production-support.html"), "utf8");
const ticketTriage = fs.readFileSync(path.join(root, "ai-service-desk-ticket-triage-automation.html"), "utf8");
const fabricReadiness = fs.readFileSync(path.join(root, "ai-microsoft-fabric-readiness-assessment-adoption-roadmap.html"), "utf8");
const databaseFailover = fs.readFileSync(path.join(root, "ai-database-failover-readiness-disaster-recovery-drill-automation.html"), "utf8");
const backupValidation = fs.readFileSync(path.join(root, "ai-backup-restore-verification-automation.html"), "utf8");
const dropboxDash = fs.readFileSync(path.join(root, "dropbox-dash-enterprise-search-production-support-managed-services.html"), "utf8");
assert.ok(JSON.parse(fabricManagedServices.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1])["@graph"].some((item) => item["@type"] === "BreadcrumbList"), "Fabric managed services page must expose its data-service hierarchy");
assert.ok(JSON.parse(copilotStudioServices.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1])["@graph"].some((item) => item["@type"] === "BreadcrumbList"), "Copilot Studio page must expose its AI-workflow hierarchy");
assert.match(boxAiStudio, /What are Box AI Units\?/, "Box AI Studio page must answer AI Unit search intent");
assert.match(boxAiStudio, /What are Box AI Extract Agents\?/, "Box AI Studio page must answer Extract Agent search intent");
assert.match(sitemap, /https:\/\/datrick\.com\/box-ai-studio-agents-production-support-managed-services<\/loc><lastmod>2026-07-28<\/lastmod>/, "Sitemap must expose the updated Box AI Studio page");

assert.match(fabricManagedServices, /<title>Microsoft Fabric Managed Services, Support, and Operations \| Datrick<\/title>/, "Fabric managed services page must match the commercial managed-service query");
assert.match(fabricManagedServices, /<h1>Microsoft Fabric managed services for accountable production support and operations\.<\/h1>/, "Fabric managed services H1 must state the offer directly");
assert.match(fabricManagedServices, /"@type": "Service"/, "Fabric managed services page must expose Service structured data");
assert.match(fabricManagedServices, /"dateModified": "2026-07-28"/, "Fabric managed services article must expose the latest update date");
assert.match(sitemap, /https:\/\/datrick\.com\/microsoft-fabric-managed-services-support-operations<\/loc><lastmod>2026-07-28<\/lastmod>/, "Sitemap must expose the updated Fabric managed services page");

assert.match(copilotStudioServices, /<title>Microsoft Copilot Studio Services: Implementation &amp; Support<\/title>/, "Copilot Studio page must match implementation and support service intent");
assert.match(copilotStudioServices, /<h1>Microsoft Copilot Studio services from implementation through production support\.<\/h1>/, "Copilot Studio H1 must state the complete service lifecycle");
assert.match(copilotStudioServices, /Do you provide Microsoft Copilot Studio implementation services\?/, "Copilot Studio page must answer the implementation-services query");
assert.match(sitemap, /https:\/\/datrick\.com\/microsoft-copilot-studio-managed-services-production-support<\/loc><lastmod>2026-07-28<\/lastmod>/, "Sitemap must expose the updated Copilot Studio services page");
assert.match(ticketTriage, /<title>Automated Ticket Triage for Service Desks \| Datrick<\/title>/, "Ticket triage page must match automated ticket triage search intent");
assert.match(ticketTriage, /<h1>Automated ticket triage for service desk and help desk queues\.<\/h1>/, "Ticket triage page must state the offer directly");
assert.match(ticketTriage, /How do you automate ticket triage in a help desk\?/, "Ticket triage page must answer help desk automation intent");
assert.match(ticketTriage, /"@type": "Service"/, "Ticket triage page must expose Service structured data");
assert.match(ticketTriage, /"dateModified": "2026-07-28"/, "Ticket triage article must expose the latest update date");
assert.match(sitemap, /https:\/\/datrick\.com\/ai-service-desk-ticket-triage-automation<\/loc><lastmod>2026-07-28<\/lastmod>/, "Sitemap must expose the updated ticket triage page");
assert.match(fabricReadiness, /<title>Microsoft Fabric Readiness Assessment &amp; Adoption Roadmap \| Datrick<\/title>/, "Fabric readiness page must match assessment and adoption roadmap intent");
assert.match(fabricReadiness, /<h1>Microsoft Fabric readiness assessment and 90-day adoption roadmap\.<\/h1>/, "Fabric readiness page must state the deliverable directly");
assert.match(fabricReadiness, /Does a Fabric adoption roadmap include Power BI workloads\?/, "Fabric readiness page must connect Power BI adoption intent");
assert.match(fabricReadiness, /"@type": "Service"/, "Fabric readiness page must expose Service structured data");
assert.match(fabricReadiness, /"dateModified": "2026-07-28"/, "Fabric readiness article must expose the latest update date");
assert.match(sitemap, /https:\/\/datrick\.com\/ai-microsoft-fabric-readiness-assessment-adoption-roadmap<\/loc><lastmod>2026-07-28<\/lastmod>/, "Sitemap must expose the updated Fabric readiness page");
assert.match(databaseFailover, /How do you test, version, and validate AI-automated disaster recovery runbooks\?/, "Database failover page must answer the observed runbook validation query");
assert.match(databaseFailover, /"@type": "Service"/, "Database failover page must expose Service structured data");
assert.match(databaseFailover, /"dateModified": "2026-07-28"/, "Database failover article must expose the latest update date");
assert.match(sitemap, /https:\/\/datrick\.com\/ai-database-failover-readiness-disaster-recovery-drill-automation<\/loc><lastmod>2026-07-28<\/lastmod>/, "Sitemap must expose the updated database failover page");
assert.match(backupValidation, /<title>Backup Validation &amp; Restore Verification Automation \| Datrick<\/title>/, "Backup verification page must match backup validation intent");
assert.match(backupValidation, /<h1>Automate backup validation and prove restores before an incident\.<\/h1>/, "Backup verification page must state the offer directly");
assert.match(backupValidation, /"@type": "Service"/, "Backup verification page must expose Service structured data");
assert.match(backupValidation, /"dateModified": "2026-07-28"/, "Backup verification article must expose the latest update date");
assert.match(sitemap, /https:\/\/datrick\.com\/ai-backup-restore-verification-automation<\/loc><lastmod>2026-07-28<\/lastmod>/, "Sitemap must expose the updated backup verification page");
assert.match(dropboxDash, /What should teams monitor in Dropbox Dash admin activity logs\?/, "Dropbox Dash page must answer admin activity log intent");
assert.match(dropboxDash, /How should Dropbox Dash service accounts and connector identities be governed\?/, "Dropbox Dash page must answer service identity intent without assuming support");
assert.match(dropboxDash, /Does Datrick replace Dropbox Dash for Business premium support\?/, "Dropbox Dash page must distinguish Datrick operations from vendor support");
assert.match(sitemap, /https:\/\/datrick\.com\/dropbox-dash-enterprise-search-production-support-managed-services<\/loc><lastmod>2026-08-03<\/lastmod>/, "Sitemap must expose the updated Dropbox Dash page");
const snowflakeCortex = fs.readFileSync(path.join(root, "snowflake-cortex-agents-managed-services-production-support.html"), "utf8");
assert.match(snowflakeCortex, /What does CORTEX_AGENT_USAGE_HISTORY show\?/, "Snowflake Cortex page must answer usage-history search intent");
assert.match(snowflakeCortex, /SNOWFLAKE_INTELLIGENCE_USAGE_HISTORY/, "Snowflake Cortex usage guidance must distinguish CoWork-originated requests");
assert.match(sitemap, /https:\/\/datrick\.com\/snowflake-cortex-agents-managed-services-production-support<\/loc><lastmod>2026-07-28<\/lastmod>/, "Sitemap must expose the updated Snowflake Cortex page");
const oracleAgentStudio = fs.readFileSync(path.join(root, "oracle-ai-agent-studio-managed-services-fusion-production-support.html"), "utf8");
assert.match(oracleAgentStudio, /How should an Oracle maintenance work order AI agent be operated in production\?/, "Oracle Agent Studio page must answer maintenance work order intent");
assert.match(oracleAgentStudio, /Maintenance Work Order Builder AI Agent/, "Oracle Agent Studio page must cite the official maintenance agent reference");
assert.match(sitemap, /https:\/\/datrick\.com\/oracle-ai-agent-studio-managed-services-fusion-production-support<\/loc><lastmod>2026-07-28<\/lastmod>/, "Sitemap must expose the updated Oracle Agent Studio page");
const biReliability = fs.readFileSync(path.join(root, "resource-bi-reporting-reliability-checklist.html"), "utf8");
assert.match(biReliability, /What evidence should a vendor provide for automated reporting and dashboard reliability\?/, "BI reliability checklist must answer vendor-evidence intent");
assert.match(biReliability, /"dateModified": "2026-07-28"/, "BI reliability checklist must expose the latest update date");
assert.match(sitemap, /https:\/\/datrick\.com\/resource-bi-reporting-reliability-checklist\.html<\/loc><lastmod>2026-07-28<\/lastmod>/, "Sitemap must expose the updated BI reliability checklist");
const emergencyDba = fs.readFileSync(path.join(root, "emergency-dba-support.html"), "utf8");
assert.match(emergencyDba, /<title>Urgent &amp; Emergency DBA Support \| Datrick<\/title>/, "Emergency DBA page must match emergency and urgent support search intent");
assert.match(emergencyDba, /<h1>Urgent DBA support when production database risk cannot wait\.<\/h1>/, "Emergency DBA page must state the urgent DBA offer in its H1");
assert.match(emergencyDba, /"dateModified": "2026-07-28"/, "Emergency DBA page must expose the latest update date");
assert.ok(JSON.parse(emergencyDba.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1])["@graph"].some((item) => item["@type"] === "BreadcrumbList"), "Emergency DBA page must expose its data-service hierarchy");
assert.match(sitemap, /https:\/\/datrick\.com\/emergency-dba-support\.html<\/loc><lastmod>2026-07-28<\/lastmod>/, "Sitemap must expose the updated emergency DBA page");
const productionAiWorkflow = fs.readFileSync(path.join(root, "resource-production-ai-workflow.html"), "utf8");
const powerBiManagedServices = fs.readFileSync(path.join(root, "power-bi-managed-services-support.html"), "utf8");
const whiteLabelPowerBi = fs.readFileSync(path.join(root, "white-label-power-bi-fabric-managed-support-services.html"), "utf8");
assert.match(powerBiManagedServices, /<title>Power BI Managed Services &amp; Support \| Datrick<\/title>/, "Power BI managed services page must target commercial service intent");
assert.match(powerBiManagedServices, /What do Power BI managed services include\?/, "Power BI managed services page must answer scope intent");
assert.match(powerBiManagedServices, /How much do Power BI managed services cost\?/, "Power BI managed services page must answer pricing intent");
assert.match(powerBiManagedServices, /Can Datrick take over Power BI after a developer leaves\?/, "Power BI managed services page must answer handover intent");
assert.match(sitemap, /https:\/\/datrick\.com\/power-bi-managed-services-support<\/loc><lastmod>2026-07-28<\/lastmod>/, "Sitemap must expose the Power BI managed services page");
assert.match(whiteLabelPowerBi, /href="power-bi-managed-services-support">Power BI managed services and support model<\/a>/, "White-label Power BI guidance must route direct buyers to the direct managed service");
const databaseHandover = fs.readFileSync(path.join(root, "resource-database-handover.html"), "utf8");
assert.match(databaseHandover, /href="postgresql-backup-verification-restore-drill"/, "Database handover guidance must route PostgreSQL buyers to the restore-verification runbook");
assert.match(sitemap, /https:\/\/datrick\.com\/resource-database-handover\.html<\/loc><lastmod>2026-07-28<\/lastmod>/, "Sitemap must expose the updated database handover guide");
const fabricOperationsAgent = fs.readFileSync(path.join(root, "microsoft-fabric-operations-agent-implementation-evaluation-services.html"), "utf8");
assert.match(fabricOperationsAgent, /<h1>Implement Microsoft Fabric Operations Agent as a governed, auditable control loop\.<\/h1>/, "Fabric Operations Agent page must state the searched product and implementation outcome in its H1");
assert.match(fabricOperationsAgent, /"reviewedBy": \{"@type": "Person", "name": "Can Goktug Ozdem"/, "Fabric Operations Agent page must expose technical review ownership");
assert.match(sitemap, /https:\/\/datrick\.com\/microsoft-fabric-operations-agent-implementation-evaluation-services<\/loc><lastmod>2026-07-28<\/lastmod>/, "Sitemap must expose the updated Fabric Operations Agent page");
assert.match(productionAiWorkflow, /<title>Production AI Workflow Guide 2026: Architecture &amp; Checklist<\/title>/, "Production AI workflow guide must match the primary search intent");
assert.match(productionAiWorkflow, /revision checkpoints/, "Production AI workflow guide must address quality-control checkpoint intent");
assert.match(productionAiWorkflow, /Should AI workflows include revision checkpoints for quality control\?/, "Production AI workflow guide must answer the checkpoint question visibly and in structured data");
assert.match(productionAiWorkflow, /"dateModified": "2026-07-28"/, "Production AI workflow structured data must expose the latest update date");
const openaiAgentsGuide = fs.readFileSync(path.join(root, "openai-agents-sdk-production-support-agentops.html"), "utf8");
assert.match(openaiAgentsGuide, /<title>OpenAI Agents SDK Production Support &amp; AgentOps \| Datrick<\/title>/, "OpenAI Agents SDK page must match production support buying intent");
assert.match(openaiAgentsGuide, /tracing, sessions, tools, MCP, handoffs, guardrails, incidents, releases, security and cost/, "OpenAI Agents SDK description must explain the production support scope");
assert.match(openaiAgentsGuide, /"@type": "Article"/, "OpenAI Agents SDK guide must expose Article structured data");
assert.match(openaiAgentsGuide, /"dateModified": "2026-08-03"/, "OpenAI Agents SDK guide must expose the latest update date");
assert.match(sitemap, /https:\/\/datrick\.com\/openai-agents-sdk-production-support-agentops<\/loc><lastmod>2026-08-03<\/lastmod>/, "Sitemap must expose the updated OpenAI Agents SDK guide");
const etlPricing = fs.readFileSync(path.join(root, "etlelt-pricing-guide.html"), "utf8");
assert.match(etlPricing, /<title>ETL Pricing Guide 2026: Costs, Models &amp; Tool Comparison<\/title>/, "ETL pricing guide title must match commercial comparison intent");
assert.match(etlPricing, /predictable ETL costs/, "ETL pricing guide description must address predictable-cost intent");
assert.match(etlPricing, /row-, connection- and usage-based pricing/, "ETL pricing guide description must distinguish the pricing models buyers compare");
assert.match(etlPricing, /"dateModified": "2026-07-28"/, "ETL pricing guide structured data must expose the latest update date");
assert.match(sitemap, /https:\/\/datrick\.com\/etlelt-pricing-guide<\/loc><lastmod>2026-07-28<\/lastmod>/, "Sitemap must expose the updated ETL pricing guide");
assert.match(sitemap, /https:\/\/datrick\.com\/ai-readiness-assessment-model-selection/, "Sitemap must include the AI assessment canonical URL");

const vercel = JSON.parse(fs.readFileSync(path.join(root, "vercel.json"), "utf8"));
assert.ok(vercel.redirects.some((rule) => rule.source === "/ai-readiness-assessment-model-selection.html" && rule.destination === "/ai-readiness-assessment-model-selection" && rule.statusCode === 301), "The .html assessment URL must redirect to its clean canonical URL");
assert.ok(vercel.rewrites.some((rule) => rule.source === "/ai-readiness-assessment-model-selection" && rule.destination === "/ai-readiness-assessment-model-selection.html"), "The clean assessment URL must resolve to the static page");
assert.ok(vercel.redirects.some((rule) => rule.source === "/favicon.ico" && rule.destination === "/assets/datrick-logo.png" && rule.statusCode === 301), "The conventional favicon URL must resolve without a crawl 404");
assert.ok(vercel.redirects.some((rule) => rule.source === "/blog" && rule.destination === "/resources.html" && rule.statusCode === 301), "The legacy blog root must preserve visitors");
assert.ok(vercel.redirects.some((rule) => rule.source === "/contact" && rule.destination === "/#contact" && rule.statusCode === 301), "The legacy contact path must reach the current inquiry section");
assert.ok(vercel.redirects.some((rule) => rule.source === "/etl-with-python-and-java/" && rule.destination === "/resources.html" && rule.statusCode === 301), "The crawled legacy ETL article must resolve to the resource library");
assert.ok(vercel.redirects.some((rule) => rule.source === "/real-time-vs-batch-etl/" && rule.destination === "/etlelt-pricing-guide" && rule.statusCode === 301), "The legacy ETL comparison must resolve to the current ETL guide");
assert.ok(vercel.redirects.some((rule) => rule.source === "/data-integration-and-interoperability" && rule.destination === "/data-operations.html" && rule.statusCode === 301), "The legacy data integration path must resolve to the current data operations service");

const dbaPricing = fs.readFileSync(path.join(root, "outsourced-dba-services-pricing.html"), "utf8");
assert.match(dbaPricing, /<link rel="canonical" href="https:\/\/datrick\.com\/outsourced-dba-services-pricing">/, "DBA pricing guide must use the clean canonical URL");
assert.equal((dbaPricing.match(/<h1>/g) || []).length, 1, "DBA pricing guide must have one H1");
assert.equal((dbaPricing.match(/<details><summary>/g) || []).length, 5, "DBA pricing guide must expose five visible FAQs");
const dbaPricingJson = dbaPricing.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
assert.equal(JSON.parse(dbaPricingJson)["@graph"].find((item) => item["@type"] === "FAQPage")?.mainEntity.length, 5, "DBA pricing JSON-LD must match the five visible FAQs");
assert.match(sitemap, /https:\/\/datrick\.com\/outsourced-dba-services-pricing/, "Sitemap must include the DBA pricing guide");
assert.ok(vercel.rewrites.some((rule) => rule.source === "/outsourced-dba-services-pricing" && rule.destination === "/outsourced-dba-services-pricing.html"), "The clean DBA pricing URL must resolve to the static page");

const aiPricing = fs.readFileSync(path.join(root, "ai-consulting-pricing-guide.html"), "utf8");
assert.match(aiPricing, /<link rel="canonical" href="https:\/\/datrick\.com\/ai-consulting-pricing-guide">/, "AI pricing guide must use the clean canonical URL");
assert.equal((aiPricing.match(/<h1>/g) || []).length, 1, "AI pricing guide must have one H1");
assert.equal((aiPricing.match(/<details><summary>/g) || []).length, 5, "AI pricing guide must expose five visible FAQs");
assert.match(aiPricing, /AI Consulting Pricing &amp; Implementation Cost Guide 2026/, "AI pricing guide must target the commercial search intent");
assert.match(aiPricing, /From \$15,000 per month/, "AI pricing guide must retain Datrick's public ongoing delivery floor");
const aiPricingJson = aiPricing.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
assert.equal(JSON.parse(aiPricingJson)["@graph"].find((item) => item["@type"] === "FAQPage")?.mainEntity.length, 5, "AI pricing JSON-LD must match the five visible FAQs");
assert.match(sitemap, /https:\/\/datrick\.com\/ai-consulting-pricing-guide/, "Sitemap must include the AI pricing guide");
assert.ok(vercel.redirects.some((rule) => rule.source === "/ai-consulting-pricing-guide.html" && rule.destination === "/ai-consulting-pricing-guide" && rule.statusCode === 301), "The .html AI pricing URL must redirect to its clean canonical URL");
assert.ok(vercel.rewrites.some((rule) => rule.source === "/ai-consulting-pricing-guide" && rule.destination === "/ai-consulting-pricing-guide.html"), "The clean AI pricing URL must resolve to the static page");

const aiRfp = fs.readFileSync(path.join(root, "ai-consulting-rfp-vendor-selection.html"), "utf8");
assert.match(aiRfp, /<link rel="canonical" href="https:\/\/datrick\.com\/ai-consulting-rfp-vendor-selection">/, "AI consulting RFP guide must use the clean canonical URL");
assert.equal((aiRfp.match(/<h1>/g) || []).length, 1, "AI consulting RFP guide must have one H1");
assert.equal((aiRfp.match(/<details><summary>/g) || []).length, 6, "AI consulting RFP guide must expose six visible FAQs");
assert.match(aiRfp, /AI Consulting RFP &amp; Vendor Selection Checklist 2026/, "AI consulting RFP guide must target vendor-selection search intent");
const aiRfpJson = aiRfp.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
assert.equal(JSON.parse(aiRfpJson)["@graph"].find((item) => item["@type"] === "FAQPage")?.mainEntity.length, 6, "AI consulting RFP JSON-LD must match the six visible FAQs");
assert.match(sitemap, /https:\/\/datrick\.com\/ai-consulting-rfp-vendor-selection/, "Sitemap must include the AI consulting RFP guide");
assert.ok(vercel.redirects.some((rule) => rule.source === "/ai-consulting-rfp-vendor-selection.html" && rule.destination === "/ai-consulting-rfp-vendor-selection" && rule.statusCode === 301), "The .html AI consulting RFP URL must redirect to its clean canonical URL");
assert.ok(vercel.rewrites.some((rule) => rule.source === "/ai-consulting-rfp-vendor-selection" && rule.destination === "/ai-consulting-rfp-vendor-selection.html"), "The clean AI consulting RFP URL must resolve to the static page");

const aiStages = fs.readFileSync(path.join(root, "ai-readiness-assessment-vs-poc-vs-pilot.html"), "utf8");
assert.match(aiStages, /<link rel="canonical" href="https:\/\/datrick\.com\/ai-readiness-assessment-vs-poc-vs-pilot">/, "AI stage comparison must use the clean canonical URL");
assert.equal((aiStages.match(/<h1>/g) || []).length, 1, "AI stage comparison must have one H1");
assert.equal((aiStages.match(/<details><summary>/g) || []).length, 5, "AI stage comparison must expose five visible FAQs");
assert.match(aiStages, /AI readiness assessment vs POC vs pilot/, "AI stage comparison must target the stage-selection search intent");
const aiStagesJson = aiStages.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
assert.equal(JSON.parse(aiStagesJson)["@graph"].find((item) => item["@type"] === "FAQPage")?.mainEntity.length, 5, "AI stage comparison JSON-LD must match the five visible FAQs");
assert.match(sitemap, /https:\/\/datrick\.com\/ai-readiness-assessment-vs-poc-vs-pilot/, "Sitemap must include the AI stage comparison");
assert.ok(vercel.redirects.some((rule) => rule.source === "/ai-readiness-assessment-vs-poc-vs-pilot.html" && rule.destination === "/ai-readiness-assessment-vs-poc-vs-pilot" && rule.statusCode === 301), "The .html AI stage URL must redirect to its clean canonical URL");
assert.ok(vercel.rewrites.some((rule) => rule.source === "/ai-readiness-assessment-vs-poc-vs-pilot" && rule.destination === "/ai-readiness-assessment-vs-poc-vs-pilot.html"), "The clean AI stage URL must resolve to the static page");

const styles = fs.readFileSync(path.join(root, "styles.css"), "utf8");
for (const token of [
  "--action-primary",
  "--content-data",
  "--content-ai",
  "--content-proof",
  "--surface-raised",
  "--text-on-dark-muted",
]) {
  assert.ok(styles.includes(token), `Color system must define ${token}`);
}
assert.match(styles, /\.page-section-nav\s*\{/, "Commercial section navigation must be styled");

const clientScript = fs.readFileSync(path.join(root, "script.js"), "utf8");
const aboutPage = fs.readFileSync(path.join(root, "about.html"), "utf8");
assert.match(clientScript, /enhanceCommercialPageNavigation/, "Commercial section navigation must be initialized");
assert.match(clientScript, /"Form Validation Error": "form_validation_error"/, "Form validation failures must use a stable GA4 event name");
assert.match(clientScript, /field_name: field\.name \|\| field\.id \|\| "unknown"/, "Form validation analytics must identify the invalid field without recording its value");
assert.match(aboutPage, /https:\/\/hevodata\.com\/learn\/author\/can-goktug-ozdem\//, "About structured data must connect the founder to the verified Hevo author profile");
assert.match(aboutPage, /Published data-model contributor at Syncari/, "About page must show a live attributed external technical publication");
assert.match(aboutPage, /"subjectOf":\s*\{[\s\S]*?"https:\/\/syncari\.com\/blog\/salesforce-data-model\/"/, "Founder schema must connect the live attributed Syncari publication");
assert.match(sitemap, /https:\/\/datrick\.com\/about\.html<\/loc><lastmod>2026-07-29<\/lastmod>/, "Sitemap must expose the updated About page");

console.log("site-shell tests passed");
