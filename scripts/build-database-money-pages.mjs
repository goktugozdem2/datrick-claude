import { writeFile } from "node:fs/promises";

const pages = [
  {
    slug: "managed-database-operations",
    title: "Managed DBA Services | Datrick",
    description: "Managed DBA services for controlled database operations, recovery readiness, performance, incidents, and accountable production ownership.",
    h1: "Managed DBA services for production systems.",
    eyebrow: "Managed database operations",
    lede: "Reduce operating uncertainty without adding another coordination layer. Datrick provides remote DBA services and DBA as a service with named ownership, written controls, and a clear production boundary.",
    serviceName: "Managed DBA Services",
    serviceDescription: "Managed database operations covering production ownership, monitoring response, recovery readiness, performance, maintenance, access, change control, and operational reporting.",
    audience: "US-based IT service firms and vertical SaaS companies with 50 to 500 employees",
    problemHeading: "Production database risk is usually an ownership problem first.",
    problem: [
      "A database can be online and still be poorly controlled. Alerts may exist without an accountable response path. Backups may complete without current restore evidence. Performance problems may be addressed repeatedly without a durable record of causes, decisions, and results.",
      "This pattern is common when a vertical SaaS company has outgrown person-dependent operations or when an IT service firm needs a specialist delivery layer behind its own client relationship. The buyer does not need more activity. The buyer needs clear responsibility for the operating system around the database.",
      "Datrick leads the operating model. Scope begins with the estate, business commitments, current controls, authority, and material risks. The result is a bounded managed DBA service, not an open-ended pool of tasks.",
    ],
    covers: [
      ["Operating baseline", "Database inventory, business criticality, ownership, dependencies, authorized access, known risks, and current service commitments."],
      ["Monitoring and incidents", "Signal coverage, alert ownership, severity, diagnostic evidence, escalation, stakeholder updates, and incident follow-through."],
      ["Backup and recovery", "Backup scope, retention, failure handling, restore procedures, recovery dependencies, drill evidence, and unresolved recovery risk."],
      ["Performance and capacity", "Workload baselines, query and wait analysis, blocking, maintenance, growth, resource pressure, and an owned improvement backlog."],
      ["Change and access", "Production authority, privileged access paths, approvals, validation, rollback criteria, audit evidence, and access review."],
      ["Operational reporting", "A concise record of incidents, changes, risks, completed work, open decisions, and the next operating priorities."],
    ],
    process: [
      ["1. Establish the boundary", "Datrick maps the estate, decision rights, service hours, escalation paths, application boundaries, and evidence that can be trusted."],
      ["2. Stabilize material risk", "Recovery, access, monitoring, capacity, and active incident gaps are ordered by business consequence. Datrick owns the operating backlog."],
      ["3. Run the cadence", "Routine checks, maintenance, incident response, controlled changes, reporting, and risk review follow one documented operating rhythm."],
      ["4. Improve with evidence", "Recurring failures and performance constraints become owned problems with baselines, decisions, validation, and documented outcomes."],
    ],
    ownership: "Datrick owns database-operating analysis, prioritization, runbooks, technical recommendations, and work inside the agreed authority. The client retains business priorities, application decisions, production approvals outside the delegated boundary, and access governance. For partner delivery, the IT service firm retains its end-client relationship and client-facing commitments.",
    sla: "Service levels define coverage windows, severity, acknowledgement, escalation, update cadence, and restoration or workaround objectives. They are written against the estate and authority available. [NEEDS INPUT: approved managed DBA SLA examples and exclusions.]",
    links: [
      ["Compare the cost model", "in-house-dba-vs-managed"],
      ["Review DBA service pricing", "outsourced-dba-services-pricing"],
      ["Use the database handover checklist", "resource-database-handover.html"],
      ["Scope a database migration", "database-migration-services"],
    ],
    faqs: [
      ["What are managed DBA services?", "Managed DBA services place defined database operating responsibilities with an external specialist. The boundary can include monitoring response, incidents, backups, recovery readiness, performance, maintenance, access, changes, documentation, and reporting. Authority and exclusions are written before operations begin."],
      ["How are remote DBA services different from staff augmentation?", "Remote DBA services are organized around an operating outcome and an accountable service boundary. Datrick leads the database process, maintains the backlog and evidence, and reports decisions and risk. The engagement is not an unstructured allocation of individual tasks."],
      ["What does DBA as a service include?", "DBA as a service can include a controlled baseline, routine operations, incident response, performance and capacity work, recovery verification, change support, documentation, and governance. The exact scope depends on the database estate and business commitments."],
      ["Can Datrick work behind an IT service firm?", "Yes. The IT service firm can retain the end-client relationship, commercial control, and client-facing commitments. Datrick operates within the agreed communication, authority, evidence, and escalation model."],
      ["Which databases can be included?", "The scope can be built around PostgreSQL and other business-critical relational platforms. Platform coverage is confirmed against versions, hosting, extensions, tooling, access, and operational requirements. [NEEDS INPUT: approved platform coverage list.]"],
    ],
  },
  {
    slug: "postgresql-consulting",
    title: "PostgreSQL Consulting Services | Datrick",
    description: "PostgreSQL consulting services for production performance, reliability, recovery, migrations, upgrades, and accountable operating decisions.",
    h1: "PostgreSQL consulting services.",
    eyebrow: "PostgreSQL consulting",
    lede: "Make the next production decision from evidence. A senior Postgres consultant leads performance, reliability, recovery, migration, upgrade, and operating work through a defined technical boundary.",
    serviceName: "PostgreSQL Consulting Services",
    serviceDescription: "Senior-led PostgreSQL consulting for production performance, reliability, recovery, migrations, upgrades, architecture, and operations.",
    audience: "US-based IT service firms and vertical SaaS companies with business-critical PostgreSQL systems",
    problemHeading: "PostgreSQL problems cross application, infrastructure, and operating boundaries.",
    problem: [
      "A slow query may be a data-model issue, an execution-plan change, a connection pattern, storage pressure, or a workload that no longer fits the architecture. A failed upgrade may expose extension, driver, replication, or release-control gaps. Treating each symptom as an isolated ticket produces motion without control.",
      "Vertical SaaS leaders usually need a decision that protects reliability and product delivery. IT service firms need a specialist who can work inside their delivery model, preserve the end-client boundary, and explain tradeoffs without creating another unmanaged dependency.",
      "Datrick leads the investigation from evidence to decision. The work is framed around the production outcome, the authority available, and the application context. Recommendations include validation and rollback criteria so the client can act with a controlled risk position.",
    ],
    covers: [
      ["Performance diagnosis", "Query plans, statistics, waits, locks, indexes, memory, I/O, connection behavior, workload shape, and application interaction."],
      ["Reliability and recovery", "Replication, failover assumptions, backup design, restore evidence, recovery timing, monitoring, and incident readiness."],
      ["Architecture review", "Data model, topology, extensions, connection pooling, workload isolation, scaling constraints, and operational complexity."],
      ["Upgrades and changes", "Version and extension compatibility, rehearsal, cutover, validation, rollback, release ownership, and post-change evidence."],
      ["Migration support", "Source assessment, PostgreSQL target design, conversion risks, data validation, cutover, rollback, and stabilization."],
      ["Operating model", "Ownership, runbooks, recurring maintenance, access, change control, escalation, reporting, and improvement priorities."],
    ],
    process: [
      ["1. Frame the production decision", "Datrick defines the business effect, systems involved, current evidence, constraints, authority, and the decision that must be made."],
      ["2. Reproduce and baseline", "The investigation establishes current behavior and separates database evidence from application, platform, and workload assumptions."],
      ["3. Test the smallest responsible change", "Recommendations are validated against representative conditions with success measures, risk controls, and rollback criteria."],
      ["4. Transfer the operating result", "The final record explains what changed, why it changed, how it was verified, what remains open, and who owns the next decision."],
    ],
    ownership: "Datrick owns the PostgreSQL investigation, technical plan, evidence standard, database changes inside the agreed boundary, and the decision record. The client retains product priorities, application releases, infrastructure authority outside scope, security approvals, and business acceptance. Partner engagements preserve the prime provider's client relationship.",
    sla: "Urgent and planned work use different response and change controls. The written scope defines coverage, severity, response, communication, access prerequisites, and the boundary between database work and application ownership. [NEEDS INPUT: approved PostgreSQL consulting SLA examples.]",
    links: [
      ["Review PostgreSQL backup verification", "postgresql-backup-verification-restore-drill"],
      ["Plan a database migration", "database-migration-services"],
      ["Review managed database operations", "managed-database-operations"],
      ["Review DBA service pricing", "outsourced-dba-services-pricing"],
    ],
    faqs: [
      ["What do PostgreSQL consulting services cover?", "The engagement can cover performance, architecture, reliability, backups, recovery, replication, upgrades, migrations, extensions, connection management, incidents, security boundaries, and the operating model. Scope is tied to the production decision, not a generic checklist."],
      ["When should a company use a Postgres consultant?", "Use a Postgres consultant when a material database decision exceeds current evidence or ownership. Common triggers include recurring performance failure, an upgrade or migration, weak recovery evidence, scaling constraints, a production incident, or loss of a key system owner."],
      ["Can PostgreSQL consulting become ongoing support?", "Yes. A focused investigation can establish the baseline and operating boundary for managed database operations. Ongoing work is scoped separately with written responsibilities, service levels, exclusions, and authority."],
      ["Does Datrick support PostgreSQL migrations?", "Yes. Datrick can lead PostgreSQL target design, source assessment, conversion risk, data validation, cutover, rollback, and stabilization for approved source platforms. The Oracle and SQL Server migration pages describe the platform-specific paths."],
      ["Can the work be delivered under an IT service firm's model?", "Yes. Datrick can provide specialist PostgreSQL delivery while the IT service firm retains the end-client relationship and commercial control. Communication and approval paths are defined with the prime provider."],
    ],
  },
  {
    slug: "database-migration-services",
    title: "Database Migration Services | Datrick",
    description: "Database migration services with source assessment, target design, rehearsal, data validation, cutover, rollback, and stabilization ownership.",
    h1: "Database migration services.",
    eyebrow: "Database migration",
    lede: "Move the database without turning cutover into a business experiment. Datrick leads assessment, target design, rehearsal, validation, rollback, and production stabilization.",
    serviceName: "Database Migration Services",
    serviceDescription: "Database migration services covering source assessment, target architecture, conversion, rehearsal, data validation, cutover, rollback, and production stabilization.",
    audience: "US-based IT service firms and vertical SaaS companies planning business-critical database migrations",
    problemHeading: "The difficult part of a migration is proving that the business can operate afterward.",
    problem: [
      "Moving schemas and rows is only part of a database migration. Applications depend on data types, transaction behavior, identity rules, stored logic, jobs, reports, integrations, drivers, security, and operational procedures. A technically complete copy can still fail the business at cutover.",
      "The risk increases when ownership is split across product, infrastructure, data, vendors, and a prime IT service firm. Each team may complete its own checklist while no one owns the end-to-end acceptance case. That gap appears late, when rollback time is limited and business deadlines are fixed.",
      "Datrick leads one migration control model. The plan connects source evidence, target design, conversion decisions, application validation, data reconciliation, cutover authority, rollback triggers, and stabilization ownership.",
    ],
    covers: [
      ["Source assessment", "Versions, objects, data, workload, integrations, jobs, security, dependencies, operational commitments, and unsupported assumptions."],
      ["Target design", "Platform configuration, data model decisions, availability, recovery, performance, access, observability, and operating ownership."],
      ["Conversion backlog", "Schemas, data types, procedural code, queries, drivers, jobs, reports, integrations, and items that require redesign."],
      ["Rehearsal", "Repeatable migration runs, timing, automation, defect handling, cutover sequence, communication, and evidence collection."],
      ["Validation and rollback", "Row and value reconciliation, business checks, performance baselines, acceptance owners, rollback triggers, and restoration path."],
      ["Stabilization", "Post-cutover monitoring, incident ownership, tuning, defect triage, documentation, and transfer into steady operations."],
    ],
    process: [
      ["1. Build the migration fact base", "Datrick inventories the source, dependencies, business deadlines, target constraints, and evidence gaps before committing to a cutover path."],
      ["2. Design and convert", "Target decisions and conversion work are tracked with explicit owners, acceptance conditions, and impact on applications and operations."],
      ["3. Rehearse the whole event", "Migration, validation, communications, business acceptance, and rollback are rehearsed as one production event, not separate team exercises."],
      ["4. Cut over and stabilize", "Datrick leads the technical sequence, evidence checkpoints, issue triage, and transition into a documented operating state."],
    ],
    ownership: "Datrick owns the migration plan, database conversion boundary, rehearsal control, reconciliation framework, technical cutover sequence, and stabilization backlog. The client retains business acceptance, application releases, user communication, security approval, and final go or no-go authority unless explicitly delegated.",
    sla: "The engagement defines decision deadlines, defect severity, rehearsal exit criteria, cutover communications, escalation, rollback authority, and stabilization coverage. [NEEDS INPUT: approved migration SLA and stabilization examples.]",
    links: [
      ["Review the migration support playbook", "resource-migration-support-playbook.html"],
      ["Review Oracle to PostgreSQL migration", "oracle-to-postgresql-migration"],
      ["Review SQL Server to PostgreSQL migration", "sql-server-to-postgresql-migration"],
      ["Review DBA service pricing", "outsourced-dba-services-pricing"],
    ],
    faqs: [
      ["What is included in database migration services?", "A controlled migration can include source assessment, target design, object and data conversion, application dependency mapping, rehearsal, reconciliation, performance validation, cutover, rollback planning, stabilization, and operating handover."],
      ["How does Datrick reduce database migration risk?", "Datrick makes evidence and authority explicit. The migration uses repeatable rehearsals, owned conversion decisions, business validation, measured cutover timing, rollback triggers, and a stabilization plan tied to production behavior."],
      ["Can Datrick support a migration led by an IT service firm?", "Yes. Datrick can own the specialist database work inside the prime provider's delivery model. The IT service firm retains its end-client relationship, commitments, and client-facing approvals."],
      ["How is data validated after migration?", "Validation combines structural checks, row and value reconciliation, representative business queries, application behavior, performance baselines, and named acceptance owners. The required evidence is defined before cutover."],
      ["What happens after database cutover?", "Stabilization covers monitoring, issue triage, performance, missed dependencies, operational documentation, and transfer into steady ownership. The exit criteria are written before the production event."],
    ],
  },
  {
    slug: "oracle-to-postgresql-migration",
    title: "Oracle to PostgreSQL Migration | Datrick",
    description: "Oracle to PostgreSQL migration with compatibility assessment, redesign decisions, rehearsal, validation, cutover, rollback, and stabilization.",
    h1: "Oracle to PostgreSQL migration services.",
    eyebrow: "Oracle to PostgreSQL",
    lede: "Reduce license and platform dependency without importing hidden Oracle behavior into production. Datrick leads compatibility, redesign, validation, cutover, and stabilization.",
    serviceName: "Oracle to PostgreSQL Migration",
    serviceDescription: "Oracle to PostgreSQL migration covering compatibility assessment, schema and code conversion, redesign, data validation, rehearsal, cutover, rollback, and stabilization.",
    audience: "US-based IT service firms and vertical SaaS companies moving business-critical Oracle workloads to PostgreSQL",
    problemHeading: "Oracle behavior is embedded in more places than the schema.",
    problem: [
      "The visible migration inventory may include tables, indexes, views, and packages. The real dependency surface can also include PL/SQL behavior, sequences, synonyms, materialized views, scheduler jobs, database links, transaction assumptions, drivers, monitoring, backup procedures, and operational knowledge.",
      "Automatic conversion can accelerate discovery, but it does not decide which Oracle patterns should be preserved, replaced, or removed. A literal conversion may create a PostgreSQL system that is difficult to operate and still behaves differently under the application workload.",
      "Datrick leads the migration as a sequence of explicit compatibility and redesign decisions. Each decision carries an owner, test evidence, production impact, and rollback implication. That keeps platform change connected to business acceptance.",
    ],
    covers: [
      ["Compatibility inventory", "Oracle versions, schemas, data types, PL/SQL, packages, jobs, links, features, drivers, integrations, and operating dependencies."],
      ["Target PostgreSQL design", "Topology, extensions, data types, schemas, security, availability, recovery, monitoring, maintenance, and ownership."],
      ["Code and query conversion", "Procedural logic, functions, packages, SQL behavior, optimizer assumptions, application queries, and items that need redesign."],
      ["Data movement", "Initial load, change capture or outage approach, large-object handling, sequence state, reconciliation, encryption, and repeatability."],
      ["Application validation", "Driver behavior, transactions, error handling, concurrency, performance, reports, jobs, and representative business workflows."],
      ["Cutover and stabilization", "Freeze rules, final sync, checkpoints, acceptance, rollback triggers, monitoring, triage, and PostgreSQL operating handover."],
    ],
    process: [
      ["1. Classify Oracle dependencies", "Datrick separates direct conversion, controlled adaptation, redesign, retirement, and unresolved items across database and application boundaries."],
      ["2. Build the PostgreSQL target", "The target is designed for PostgreSQL operation, not as an imitation of the source. Recovery, observability, access, and maintenance are included."],
      ["3. Rehearse with business evidence", "Conversion and data movement are repeated while application flows, data reconciliation, performance, and cutover timing are verified."],
      ["4. Control production transition", "Datrick leads checkpoints, technical decisions, rollback assessment, defect triage, and the move into stable PostgreSQL ownership."],
    ],
    ownership: "Datrick owns database compatibility analysis, PostgreSQL target decisions, conversion planning, technical rehearsal, reconciliation design, cutover sequence, and stabilization backlog. The client owns application priorities, business acceptance, licensing decisions, security approval, and final production authority unless delegated in writing.",
    sla: "The plan defines conversion defect severity, decision turnaround, rehearsal gates, cutover communication, escalation, rollback authority, and stabilization coverage. [NEEDS INPUT: approved Oracle migration tooling, version coverage, and SLA examples.]",
    links: [
      ["Review the broader migration service", "database-migration-services"],
      ["Review PostgreSQL consulting", "postgresql-consulting"],
      ["Use the migration support playbook", "resource-migration-support-playbook.html"],
      ["Review DBA service pricing", "outsourced-dba-services-pricing"],
    ],
    faqs: [
      ["What is included in an Oracle to PostgreSQL migration?", "The scope can include compatibility assessment, PostgreSQL target design, schema and data conversion, PL/SQL and query work, application validation, rehearsal, reconciliation, cutover, rollback planning, stabilization, and operating handover."],
      ["Can all PL/SQL be converted automatically?", "Conversion tools can help classify and translate code, but production suitability still requires review. Packages, transaction behavior, dynamic SQL, exception handling, performance assumptions, and Oracle-specific features may require adaptation or redesign."],
      ["How is Oracle and PostgreSQL data reconciled?", "The plan defines structural, row-count, value-level, aggregate, and business-rule checks according to data criticality. Reconciliation evidence is produced during rehearsal and repeated at cutover."],
      ["How is downtime decided?", "Downtime depends on data volume, change rate, movement approach, application release design, validation time, and rollback requirements. Datrick measures these factors during rehearsal instead of promising an unsupported window."],
      ["Who operates PostgreSQL after cutover?", "The target operating owner is named before production transition. Datrick can provide a controlled handover or a separately scoped managed database operations program."],
    ],
  },
  {
    slug: "sql-server-to-postgresql-migration",
    title: "SQL Server to PostgreSQL Migration | Datrick",
    description: "SQL Server to PostgreSQL migration with compatibility assessment, conversion, rehearsal, validation, cutover, rollback, and stabilization.",
    h1: "SQL Server to PostgreSQL migration services.",
    eyebrow: "SQL Server to PostgreSQL",
    lede: "Change the database platform without losing application behavior, data trust, or operating control. Datrick leads compatibility, conversion, validation, cutover, and stabilization.",
    serviceName: "SQL Server to PostgreSQL Migration",
    serviceDescription: "SQL Server to PostgreSQL migration covering compatibility assessment, schema and code conversion, data validation, rehearsal, cutover, rollback, and stabilization.",
    audience: "US-based IT service firms and vertical SaaS companies moving business-critical SQL Server workloads to PostgreSQL",
    problemHeading: "SQL Server dependencies extend beyond T-SQL objects.",
    problem: [
      "A SQL Server estate may rely on stored procedures, SQL Agent jobs, linked servers, identity behavior, collations, data types, reporting extracts, integration packages, drivers, Windows authentication, backup routines, and operational habits that do not transfer directly to PostgreSQL.",
      "A conversion report identifies syntax gaps. It does not prove that concurrency, transactions, errors, time zones, case behavior, reporting, jobs, and business workflows will behave correctly. Those differences require decisions across database and application ownership, with named acceptance evidence for each material behavior.",
      "Datrick leads one migration backlog across schema, code, data, application, and operations. Each material difference is classified, assigned, tested, and connected to cutover and rollback evidence.",
    ],
    covers: [
      ["Compatibility assessment", "SQL Server versions, schemas, T-SQL, jobs, linked resources, data types, collations, drivers, integrations, security, and operations."],
      ["PostgreSQL target design", "Topology, schemas, extensions, identity strategy, access, availability, recovery, monitoring, maintenance, and ownership."],
      ["T-SQL and workload conversion", "Procedures, functions, triggers, queries, error handling, temporary objects, transaction behavior, and application patterns."],
      ["Data and job migration", "Repeatable load, change handling, identity state, reconciliation, schedules, external dependencies, and failure behavior."],
      ["Application and BI validation", "Drivers, ORM behavior, concurrency, reporting, exports, integrations, representative workflows, and performance baselines."],
      ["Cutover and operation", "Freeze, final movement, evidence gates, acceptance, rollback triggers, stabilization, runbooks, and PostgreSQL support ownership."],
    ],
    process: [
      ["1. Map SQL Server behavior", "Datrick inventories technical objects and the application and operating behavior that depends on them."],
      ["2. Decide conversion versus redesign", "Each difference is classified by business effect, implementation path, test requirement, and impact on PostgreSQL operation."],
      ["3. Rehearse the production event", "Data movement, application release, job activation, reconciliation, performance checks, acceptance, and rollback are timed together."],
      ["4. Stabilize PostgreSQL ownership", "Datrick leads issue triage, production evidence, performance follow-up, runbooks, and closure of the migration backlog."],
    ],
    ownership: "Datrick owns database assessment, PostgreSQL target decisions, conversion planning, technical rehearsal, reconciliation design, cutover control, and stabilization backlog. The client retains application release ownership, business validation, platform approvals, user communication, and final production authority unless delegated.",
    sla: "The migration scope defines defect severity, decision timing, rehearsal gates, cutover communication, escalation, rollback authority, and stabilization coverage. [NEEDS INPUT: approved SQL Server version, tooling, and SLA examples.]",
    links: [
      ["Review the broader migration service", "database-migration-services"],
      ["Review PostgreSQL consulting", "postgresql-consulting"],
      ["Use the migration support playbook", "resource-migration-support-playbook.html"],
      ["Review DBA service pricing", "outsourced-dba-services-pricing"],
    ],
    faqs: [
      ["What is included in a SQL Server to PostgreSQL migration?", "The scope can include compatibility assessment, PostgreSQL target design, schema, T-SQL and data conversion, job and integration work, application validation, rehearsal, reconciliation, cutover, rollback planning, stabilization, and handover."],
      ["Which SQL Server features need special review?", "Stored procedures, SQL Agent jobs, linked servers, identity behavior, collations, data types, temporary objects, error handling, authentication, reporting dependencies, and SQL Server-specific performance patterns commonly require explicit decisions."],
      ["How are T-SQL procedures migrated?", "Procedures are classified for direct translation, adaptation, application relocation, redesign, or retirement. The decision depends on behavior, coupling, performance, maintainability, and the target operating model."],
      ["How is data accuracy proven?", "Reconciliation combines structural checks, counts, value comparisons, aggregates, business rules, and representative application results. Required evidence and acceptance owners are defined before production cutover."],
      ["Can Datrick operate PostgreSQL after migration?", "Yes. Stabilization can transition into a separately scoped PostgreSQL consulting or managed database operations engagement with written authority, service levels, and exclusions."],
    ],
  },
  {
    slug: "in-house-dba-vs-managed",
    title: "In-House DBA vs Managed DBA | Datrick",
    description: "Compare in-house DBA and managed database operations using ownership, coverage, risk, operating fit, and a transparent cost model.",
    h1: "In-house DBA vs managed database operations.",
    eyebrow: "DBA operating model comparison",
    lede: "Choose the model that keeps production responsibility clear. Compare in-house DBA ownership with managed DBA services using coverage, control, concentration risk, and full annual cost.",
    serviceName: "Managed Database Operations Comparison",
    serviceDescription: "Decision support for comparing an in-house DBA operating model with managed database operations based on ownership, coverage, risk, and full cost.",
    audience: "Directors of Technology and CTOs at US-based IT service firms and vertical SaaS companies",
    problemHeading: "The choice is not internal versus external. It is whether the operating model can carry the risk.",
    problem: [
      "A capable internal DBA can hold deep product and system context. That can be the right model when the workload is stable, the role is broad enough to justify dedicated ownership, and coverage, review, and continuity are already solved. The weak point is concentration. Critical knowledge and response authority can accumulate around one person.",
      "Managed database operations can provide a documented process, broader operating coverage, and a clear escalation model. It is the stronger fit when an IT service firm needs specialist delivery behind its client relationship or when a vertical SaaS company needs dependable database ownership without creating a single-person operating dependency.",
      "The decision should compare the complete operating system. Title and monthly fee are incomplete measures. Coverage, absence, review, tools, management time, escalation, documentation, and the cost of unresolved risk belong in the same model.",
    ],
    covers: [
      ["Accountability", "Who owns incidents, recovery evidence, performance, maintenance, access, changes, documentation, and the unresolved risk backlog?"],
      ["Coverage", "How are planned work, urgent response, absence, competing priorities, and escalation handled without losing system context?"],
      ["Control", "Which production decisions can the operator make, which require approval, and how are changes, evidence, and rollback governed?"],
      ["Continuity", "Can another qualified operator understand the estate, access it safely, follow current runbooks, and carry an incident without one key person?"],
      ["Operating fit", "Does the business need embedded product context, a defined specialist service, partner delivery, or a deliberate hybrid model?"],
      ["Full cost", "What is the annual cost after compensation or service fees, burden, tools, management, coverage, transition, and outside-scope work?"],
    ],
    process: [
      ["1. Define required responsibility", "List the operating outcomes, service hours, authority, platforms, business commitments, and risk that the model must carry."],
      ["2. Price the complete model", "Compare annual internal cost and annual managed cost with the same inclusions. Keep incident loss separate unless approved evidence exists."],
      ["3. Test continuity and control", "Review absence, escalation, access, review, documentation, application boundaries, and the ability to replace or transition the operating owner."],
      ["4. Choose a model and exit path", "Document the chosen boundary, success measures, exclusions, governance, and how ownership can change without losing control."],
    ],
    ownership: "An internal model places day-to-day database responsibility inside the company, but management still owns coverage, review, succession, tooling, and escalation. A managed model places defined operating responsibility with Datrick while the client retains business priorities, application decisions, security governance, and production authority outside the delegated boundary.",
    sla: "A managed comparison is incomplete without written service levels. Coverage, severity, acknowledgement, escalation, update cadence, authority, and exclusions must be priced as part of the model. [NEEDS INPUT: approved managed DBA SLA and commercial assumptions.]",
    costMath: true,
    links: [
      ["Review managed DBA services", "managed-database-operations"],
      ["Review DBA service pricing", "outsourced-dba-services-pricing"],
      ["Use the database handover checklist", "resource-database-handover.html"],
      ["Review the managed DBA case study", "case-study-managed-database-operations"],
    ],
    faqs: [
      ["Is an in-house DBA or managed DBA better?", "Neither model is universally better. Internal ownership fits sustained demand for embedded context when coverage, review, and continuity are solved. Managed operations fit a defined specialist boundary, partner delivery, variable demand, or a need to reduce single-person dependency."],
      ["How should in-house DBA cost be calculated?", "Use annual cash compensation plus employer burden, benefits, recruiting and transition, tools, management time, coverage for absence, and specialist escalation. Use company-approved assumptions and keep one-time and recurring costs separate."],
      ["How should managed DBA cost be calculated?", "Use the recurring program fee plus transition, approved outside-scope work, client-side management time, and any tools excluded from the service. Confirm coverage and authority so the comparison is like for like."],
      ["Can a company use a hybrid DBA model?", "Yes. A hybrid model can keep product-specific ownership inside the company while Datrick owns defined operations, recovery, performance, escalation, or specialist review. The boundary must prevent duplicated or missing responsibility."],
      ["What should be verified before changing DBA models?", "Verify access, inventory, runbooks, monitoring, backups, restore evidence, incidents, changes, dependencies, recurring work, open risks, and acceptance ownership. The database handover checklist provides the control points."],
    ],
  },
];

const proof = {
  years: "5+ years",
  monthly: "$20K+ monthly",
  description: "A confidential IT service firm relationship began with urgent DBA/NOC and migration work, then expanded into BI, reporting, analytics, and ongoing data operations. The IT service firm retained the client relationship.",
};

function escapeJson(value) {
  return JSON.stringify(value).replaceAll("<", "\\u003c");
}

function schema(page) {
  return escapeJson({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: page.serviceName,
        url: `https://datrick.com/${page.slug}`,
        description: page.serviceDescription,
        provider: { "@type": "Organization", name: "Datrick", url: "https://datrick.com/" },
        areaServed: "United States",
        audience: { "@type": "BusinessAudience", audienceType: page.audience },
      },
      {
        "@type": "FAQPage",
        mainEntity: page.faqs.map(([name, text]) => ({
          "@type": "Question",
          name,
          acceptedAnswer: { "@type": "Answer", text },
        })),
      },
    ],
  });
}

function header(page) {
  const intake = `index.html?service=Database%20operations&internal_source=${encodeURIComponent(page.slug)}#contact`;
  return `    <header class="site-header">
      <a class="brand" href="index.html" aria-label="Datrick home"><img class="brand-logo" src="assets/datrick-logo.png" alt="Datrick logo" width="122" height="115"><span>Datrick</span></a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-label="Open menu"><span></span><span></span><span></span></button>
      <nav class="nav" id="primary-navigation" aria-label="Primary navigation" data-shell-version="2026-07-17">
        <div class="nav-item has-dropdown">
          <button class="nav-trigger" type="button" aria-expanded="false" aria-haspopup="true" aria-controls="services-menu">Services</button>
          <div class="dropdown-menu" id="services-menu">
            <a href="partners.html">IT Service Firms</a>
            <a href="data-operations.html">Data Operations</a>
            <a href="ai-readiness-assessment-model-selection">AI Readiness &amp; Model Selection</a>
            <a href="ai-workflows.html">AI Workflow Automation</a>
            <a href="ai-model-training.html">AI Model Training &amp; Evaluation</a>
            <a href="anthropic.html">Claude Implementation</a>
          </div>
        </div>
        <a href="case-studies.html">Case Studies</a>
        <div class="nav-item has-dropdown">
          <button class="nav-trigger" type="button" aria-expanded="false" aria-haspopup="true" aria-controls="resources-menu">Resources</button>
          <div class="dropdown-menu" id="resources-menu">
            <a href="resources.html">All Resources</a>
            <a href="resource-production-ai-workflow.html">Production AI Workflow Guide</a>
            <a href="resource-database-handover.html">Database Handover Checklist</a>
            <a href="resource-bi-reporting-reliability-checklist.html">BI Reporting Checklist</a>
            <a href="claude-certifications">Claude Certification Guide</a>
          </div>
        </div>
        <div class="nav-item has-dropdown">
          <button class="nav-trigger" type="button" aria-expanded="false" aria-haspopup="true" aria-controls="company-menu">Company</button>
          <div class="dropdown-menu" id="company-menu">
            <a href="about.html">About</a>
            <a href="who-we-serve.html">Who We Serve</a>
            <a href="partner-brief.html">Partner Brief</a>
          </div>
        </div>
        <a class="nav-mobile-cta" href="index.html#contact">Submit the written intake</a>
      </nav>
      <a class="header-cta" href="${intake}">Submit the written intake</a>
    </header>`;
}

function footer() {
  return `    <footer class="site-footer" aria-label="Site footer" data-shell-version="2026-07-17">
      <div class="footer-grid">
        <div class="footer-brand">
          <a class="brand" href="index.html" aria-label="Datrick home">
            <img class="brand-logo" src="assets/datrick-logo.png" alt="" width="122" height="115">
            <span>Datrick</span>
          </a>
          <p>Boutique data and AI consultancy for business-critical environments.</p>
          <span>&copy; <span id="year">2026</span> Datrick, Inc.</span>
        </div>
        <details class="footer-links" open>
          <summary>Services</summary>
          <a href="partners.html">IT Service Firms</a>
          <a href="data-operations.html">Data Operations</a>
          <a href="ai-readiness-assessment-model-selection">AI Readiness &amp; Model Selection</a>
          <a href="ai-workflows.html">AI Workflow Automation</a>
          <a href="ai-model-training.html">AI Model Training &amp; Evaluation</a>
          <a href="anthropic.html">Claude Implementation</a>
        </details>
        <details class="footer-links" open>
          <summary>Company</summary>
          <a href="case-studies.html">Case Studies</a>
          <a href="resources.html">Resources</a>
          <a href="who-we-serve.html">Who We Serve</a>
          <a href="about.html">About</a>
          <a href="index.html#contact">Submit the written intake</a>
        </details>
        <details class="footer-links" open>
          <summary>Legal</summary>
          <a href="privacy.html">Privacy</a>
          <a href="terms.html">Terms</a>
          <a href="mailto:info@datrick.com">info@datrick.com</a>
        </details>
      </div>
    </footer>`;
}

function costMath(page) {
  if (!page.costMath) return "";
  return `
      <section class="section packages" data-section-label="Cost math">
        <div class="section-heading"><p class="eyebrow">Cost math</p><h2>Compare complete annual cost, not one visible line item.</h2><p>Use approved company inputs. Do not mix recurring cost, transition cost, and unpriced incident risk.</p></div>
        <div class="article-table-wrap" role="region" aria-label="In-house DBA and managed DBA cost formulas" tabindex="0"><table class="article-table"><caption class="sr-only">In-house DBA and managed DBA annual cost formulas</caption><thead><tr><th scope="col">Model</th><th scope="col">Annual formula</th></tr></thead><tbody>
          <tr><td>In-house DBA</td><td>Base cash compensation + employer burden + benefits + recruiting and transition + tools + management time + absence coverage + specialist escalation</td></tr>
          <tr><td>Managed DBA</td><td>Monthly program fee × 12 + transition + approved outside-scope work + client management time + tools excluded from service</td></tr>
          <tr><td>Break-even monthly managed fee</td><td>Comparable annual in-house cost ÷ 12</td></tr>
          <tr><td>Three-year comparison</td><td>Year 1 transition and recurring cost + Year 2 recurring cost + Year 3 recurring cost, adjusted only with approved assumptions</td></tr>
        </tbody></table></div>
        <p class="evidence-note"><strong>Inputs required</strong>[NEEDS INPUT: approved internal compensation, burden, benefits, recruiting, tool, management, coverage, transition, and managed program assumptions.]</p>
        <p>Cost is only one decision axis. A lower visible amount can be the weaker model if authority is unclear, recovery is unverified, or one person remains the only credible escalation path. Compare the model that will actually operate, including review and continuity.</p>
      </section>`;
}

function renderPage(page) {
  const intake = `index.html?service=Database%20operations&internal_source=${encodeURIComponent(page.slug)}#contact`;
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${page.title}</title>
    <meta name="description" content="${page.description}">
    <link rel="canonical" href="https://datrick.com/${page.slug}">
    <meta property="og:title" content="${page.title}">
    <meta property="og:description" content="${page.description}">
    <meta property="og:url" content="https://datrick.com/${page.slug}">
    <meta property="og:type" content="website">
    <meta property="og:image" content="https://datrick.com/assets/datrick-social-card.png">
    <meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:type" content="image/png">
    <meta name="twitter:card" content="summary_large_image">
    <link rel="icon" href="assets/datrick-logo.png"><link rel="stylesheet" href="styles.css">
    <script type="application/ld+json">${schema(page)}</script>
  </head>
  <body class="commercial-detail-page content-role-data" data-commercial-landing="true" data-commercial-cluster="database_operations" data-content-type="commercial_landing">
    <a class="skip-link" href="#main-content">Skip to content</a>
${header(page)}
    <main id="main-content" tabindex="-1">
      <section class="page-hero">
        <div><p class="eyebrow">${page.eyebrow}</p><h1>${page.h1}</h1><p class="page-lede">${page.lede}</p><div class="hero-actions"><a class="button primary" data-cta-name="${page.slug}_hero_intake" data-funnel-stage="commercial_to_form" href="${intake}">Submit the written intake</a></div><p class="article-review">Written scope first. No calendar gate.</p></div>
      </section>

      <section class="section service-band" data-section-label="Problem">
        <div class="section-heading"><p class="eyebrow">Operating problem</p><h2>${page.problemHeading}</h2></div>
        <div class="article-body">${page.problem.map((paragraph) => `<p>${paragraph}</p>`).join("")}</div>
      </section>

      <section class="section packages" data-section-label="Coverage">
        <div class="section-heading"><p class="eyebrow">Engagement coverage</p><h2>What the engagement covers.</h2><p>The final boundary follows the estate and risk. These workstreams define the normal decision surface.</p></div>
        <div class="service-detail-grid two-up">${page.covers.map(([title, copy]) => `<article><span class="service-tag">Scope</span><h3>${title}</h3><p>${copy}</p></article>`).join("")}</div>
      </section>

      <section class="section process" data-section-label="Process">
        <div class="section-heading"><p class="eyebrow">Process and ownership</p><h2>How the engagement runs.</h2><p>Datrick leads the technical process, maintains the decision record, and makes unresolved risk visible.</p></div>
        <div class="service-detail-grid two-up">${page.process.map(([title, copy]) => `<article><h3>${title}</h3><p>${copy}</p></article>`).join("")}</div>
        <div class="article-body"><h3>Ownership boundary</h3><p>${page.ownership}</p><h3>Service levels</h3><p>${page.sla}</p></div>
      </section>${costMath(page)}

      <section class="section evidence-patterns" data-section-label="Proof">
        <div class="section-heading"><p class="eyebrow">Published proof</p><h2>Database work that expanded because the operating model held.</h2></div>
        <div class="evidence-pattern-grid"><article><span>Verified duration</span><h3>${proof.years}</h3><p>${proof.description}</p></article><article><span>Verified program value</span><h3>${proof.monthly}</h3><p>No client name, logo, system detail, or unsupported metric is added. Read the evidence boundary on the case study page.</p><a class="text-link" href="case-study-managed-database-operations">Review the managed DBA case study</a></article></div>
      </section>

      <section class="section service-band" data-section-label="Related decisions">
        <div class="section-heading"><p class="eyebrow">Related decisions</p><h2>Continue with the page that matches the operating question.</h2></div><div class="service-detail-grid two-up">${page.links.map(([label, href]) => `<article><h3><a href="${href}">${label}</a></h3><p>Use the linked detail to compare scope, evidence, cost, or transition requirements.</p></article>`).join("")}</div>
      </section>

      <section class="section faq-section" data-section-label="FAQ">
        <div class="section-heading"><p class="eyebrow">Frequently asked questions</p><h2>Questions buyers ask before written scoping.</h2></div><div class="faq-list">${page.faqs.map(([question, answer]) => `<details><summary>${question}</summary><p>${answer}</p></details>`).join("")}</div>
      </section>

      <section class="cta-band" aria-label="Written intake">
        <div><p class="eyebrow">Written intake</p><h2>Describe the database, business risk, current ownership, and required decision.</h2><p>Datrick reviews the situation and returns a direct scope recommendation or the questions required to qualify it.</p></div><a class="button dark-button" data-cta-name="${page.slug}_bottom_intake" data-funnel-stage="commercial_to_form" href="${intake}">Submit the written intake</a>
      </section>
    </main>
${footer()}
    <script src="script.js"></script>
  </body>
</html>
`;
}

function renderCaseStudy() {
  const title = "Managed DBA Operations Case Study | Datrick";
  const description = "How urgent DBA/NOC and migration work grew into a five-year, $20K+ monthly data operations relationship behind an IT service firm.";
  const caseSchema = escapeJson({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Managed DBA Operations Behind an IT Service Firm",
        description,
        url: "https://datrick.com/case-study-managed-database-operations",
        datePublished: "2026-08-10",
        dateModified: "2026-08-10",
        author: { "@type": "Organization", name: "Datrick", url: "https://datrick.com/" },
        publisher: { "@type": "Organization", name: "Datrick", url: "https://datrick.com/" },
      },
    ],
  });
  const page = { slug: "case-study-managed-database-operations" };
  return `<!doctype html>
<html lang="en">
  <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title><meta name="description" content="${description}"><link rel="canonical" href="https://datrick.com/case-study-managed-database-operations"><meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:url" content="https://datrick.com/case-study-managed-database-operations"><meta property="og:type" content="article"><meta property="og:image" content="https://datrick.com/assets/datrick-social-card.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:type" content="image/png"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="assets/datrick-logo.png"><link rel="stylesheet" href="styles.css"><script type="application/ld+json">${caseSchema}</script></head>
  <body class="article-page content-role-proof"><a class="skip-link" href="#main-content">Skip to content</a>
${header(page)}
    <main id="main-content" tabindex="-1">
      <section class="page-hero"><div><p class="eyebrow">Managed DBA case study</p><h1>Managed database operations behind an IT service firm.</h1><p class="page-lede">Urgent DBA/NOC and database migration work became a five-year, $20K+ monthly delivery relationship while the prime provider retained its client account.</p><div class="hero-actions"><a class="button primary" href="index.html?service=Database%20operations&internal_source=case-study-managed-database-operations#contact">Submit the written intake</a></div><p class="article-review">Anonymized evidence. No client name, logo, platform detail, or unverified result is disclosed.</p></div></section>
      <section class="section service-band"><article class="article-body"><div class="case-summary"><span class="service-tag">Verified evidence</span><dl class="outcome-metrics" aria-label="Verified managed database operations outcomes"><div><dt>5+ years</dt><dd>continuous partner relationship</dd></div><div><dt>$20K+</dt><dd>monthly delivery program</dd></div></dl><p class="evidence-note"><strong>Evidence boundary</strong>Datrick can verify the relationship duration, monthly program value, initial DBA/NOC and migration scope, later expansion into BI, reporting, analytics, and ongoing data operations, and the prime provider's continuing client ownership.</p></div>
        <h2>The situation</h2><p>An IT service firm needed dependable specialist capacity behind an existing client relationship. The early requirement included urgent DBA/NOC coverage and database migration work. The prime provider needed to protect its commercial position and client communication while adding technical depth.</p><p>The constraint was not simply delivery capacity. Database operations carried incident, recovery, performance, access, and change risk. The work had to fit the prime provider's commitments and escalation model without creating a separate client relationship or an ambiguous ownership layer.</p>
        <h2>The operating model</h2><p>Datrick worked inside the partner's delivery structure. The IT service firm retained the end-client relationship, commercial control, priorities, and client-facing approvals. Datrick provided accountable technical delivery within the agreed communication and escalation boundary.</p><p>The initial work established a repeatable pattern: define the technical boundary, make operating risk visible, document decisions, complete the work, and keep the prime provider in control of client commitments. Expansion followed delivered reliability. It did not begin as a claim about future breadth.</p>
        <h2>How the scope expanded</h2><p>Database and migration delivery created demand for adjacent work. The relationship grew to include BI, reporting, analytics, and ongoing data operations. Those additions stayed inside the partner model. The prime provider remained the client-facing owner while Datrick carried specialist execution and operating context.</p><p>The published evidence supports two numbers only: the relationship has continued for more than five years and the monthly delivery program exceeds $20,000. Datrick does not publish the partner name, end-client name, systems, rates, incident counts, availability results, or performance metrics without approved evidence.</p>
        <h2>What this case proves</h2><p>A boutique specialist can support an IT service firm without competing for the account. The engagement needs written authority, communication boundaries, documentation, escalation, and a delivery record that the prime provider can rely on.</p><p>It also shows why managed database operations should be framed as an operating model. The value is not a queue of disconnected database tasks. It is continuity across urgent work, migration, recurring operations, and adjacent data needs while ownership remains clear.</p>
        <h2>What remains confidential</h2><p>[NEEDS INPUT: approved client description, database platforms, migration scope, service levels, and any additional measured outcomes that may be published.] Until those inputs are approved, they are intentionally absent from this page.</p>
        <div class="case-inline-cta"><span>Related service</span><h3>Managed DBA services with written ownership.</h3><p>Review the operating boundary, process, proof, and FAQ.</p><a class="text-link" href="managed-database-operations">Review managed database operations</a></div>
      </article></section>
      <section class="cta-band" aria-label="Written intake"><div><p class="eyebrow">Written intake</p><h2>Describe the client boundary and database responsibility.</h2><p>Datrick reviews the operating need while the prime provider retains its client relationship.</p></div><a class="button dark-button" href="index.html?buyer_type=IT%20service%20firm%20%2F%20agency&service=Database%20operations&internal_source=case-study-managed-database-operations#contact">Submit the written intake</a></section>
    </main>
${footer()}
    <script src="script.js"></script></body></html>
`;
}

for (const page of pages) await writeFile(`${page.slug}.html`, renderPage(page), "utf8");
await writeFile("case-study-managed-database-operations.html", renderCaseStudy(), "utf8");
console.log(`Built ${pages.length} money pages and one case study.`);
