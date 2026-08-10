const CONTACT_RECIPIENT = "info@datrick.com";
const AI_CONTACT_RECIPIENT = "ai@datrick.com";
const CONTACT_FROM = "Datrick <forms@datrick.com>";
const THANK_YOU_URL = "https://datrick.com/thank-you.html";
const AI_SERVICES = new Set([
  "AI value, model selection, and integration assessment",
  "Partner AI delivery under your brand",
  "AI project handover or rescue",
  "AI workflow automation",
  "AI model training or evaluation",
  "Claude Code enablement / tooling assessment",
  "Claude certification preparation / bootcamp",
]);

async function handleContact(request) {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204 });
  }

  if (request.method !== "POST") {
    return new Response("Method not allowed", {
      status: 405,
      headers: { allow: "POST" },
    });
  }

  let formData;

  try {
    formData = await request.formData();
  } catch {
    // Treat an unreadable or missing body as an empty submission so validation
    // returns a useful 400 response instead of allowing a delivery attempt or 500.
    formData = new FormData();
  }

  if (fieldValue(formData.get("_honey"))) {
    return Response.redirect(confirmationUrl({ lead_category: "filtered" }), 303);
  }

  const validationError = validateInquiry(formData);

  if (validationError) {
    return new Response(validationError, {
      status: 400,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  }

  const payload = inquiryPayload(formData);

  if (process.env.GOOGLE_APPS_SCRIPT_URL) {
    const saved = await saveWithGoogleAppsScript(formData);

    if (saved) {
      return Response.redirect(confirmationUrl(payload), 303);
    }
  }

  // Controlled QA traffic is never sent through an email delivery provider.
  if (payload.lead_category === "test") {
    return Response.redirect(confirmationUrl(payload), 303);
  }

  if (process.env.RESEND_API_KEY) {
    const delivered = await sendWithResend(formData);

    if (delivered) {
      return Response.redirect(confirmationUrl(payload), 303);
    }
  }

  return fallbackEmailResponse(formData);
}

async function saveWithGoogleAppsScript(formData) {
  const payload = inquiryPayload(formData);
  const messageWithAttribution = attributedMessage(payload);

  try {
    const response = await fetch(process.env.GOOGLE_APPS_SCRIPT_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        secret: process.env.GOOGLE_APPS_SCRIPT_SECRET || "",
        submitted_at: new Date().toISOString(),
        ...payload,
        message_original: payload.message,
        message: messageWithAttribution,
      }),
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json().catch(() => null);
    return data?.ok === true;
  } catch {
    return false;
  }
}

async function sendWithResend(formData) {
  const recipient = inquiryRecipient(formData);
  const subject = inquirySubject(formData);
  const email = fieldValue(formData.get("email"));
  const text = inquiryText(formData);
  const html = inquiryHtml(formData);

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM || CONTACT_FROM,
        to: [recipient],
        subject,
        html,
        text,
        reply_to: email || undefined,
      }),
    });

    return response.ok;
  } catch {
    return false;
  }
}

function fallbackEmailResponse(formData) {
  const recipient = inquiryRecipient(formData);
  const mailto = `mailto:${recipient}?subject=${encodeURIComponent(inquirySubject(formData))}&body=${encodeURIComponent(inquiryText(formData))}`;

  return new Response(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Send inquiry by email | Datrick</title>
    <meta http-equiv="refresh" content="0; url=${escapeHtml(mailto)}">
    <style>
      body { margin: 0; font-family: Arial, sans-serif; color: #172126; background: #f7faf8; }
      main { max-width: 680px; margin: 12vh auto; padding: 32px; background: #fff; border: 1px solid #dfe8e3; border-radius: 8px; }
      h1 { margin: 0 0 12px; font-size: 28px; line-height: 1.15; }
      p { font-size: 17px; line-height: 1.55; color: #4c5a55; }
      a.button { display: inline-block; margin-top: 12px; padding: 12px 16px; background: #172126; color: #fff; text-decoration: none; border-radius: 6px; font-weight: 700; }
      a.back { display: inline-block; margin-left: 12px; color: #116b76; }
    </style>
    <script>window.location.href = ${JSON.stringify(mailto)};</script>
  </head>
  <body>
    <main>
      <h1>Open your email app to send this inquiry.</h1>
      <p>Email delivery is being configured, so we prepared your inquiry as an email to Datrick.</p>
      <a class="button" href="${escapeHtml(mailto)}">Send inquiry by email</a>
      <a class="back" href="https://datrick.com/#contact">Back to form</a>
    </main>
  </body>
</html>`, {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

function inquiryPayload(formData) {
  const payload = {
    lead_id: identifierValue(formData.get("lead_id")),
    traffic_type: attributionValue(formData.get("traffic_type")),
    ga_client_id: identifierValue(formData.get("ga_client_id")),
    name: fieldValue(formData.get("name")),
    email: fieldValue(formData.get("email")),
    phone: fieldValue(formData.get("phone")),
    preferred_follow_up: fieldValue(formData.get("preferred_follow_up")),
    company: fieldValue(formData.get("company")),
    buyer_type: fieldValue(formData.get("buyer_type")),
    service: fieldValue(formData.get("service")),
    urgency: fieldValue(formData.get("urgency")),
    engagement_type: fieldValue(formData.get("engagement_type")),
    expected_investment: fieldValue(formData.get("expected_investment")),
    entry_offer: attributionValue(formData.get("entry_offer")),
    assessment_id: identifierValue(formData.get("assessment_id")),
    assessment_score: attributionValue(formData.get("assessment_score")),
    assessment_level: attributionValue(formData.get("assessment_level")),
    assessment_answers: fieldValue(formData.get("assessment_answers")).slice(0, 4000),
    message: fieldValue(formData.get("message")),
    utm_source: attributionValue(formData.get("utm_source")),
    utm_medium: attributionValue(formData.get("utm_medium")),
    utm_campaign: attributionValue(formData.get("utm_campaign")),
    utm_content: attributionValue(formData.get("utm_content")),
    utm_term: attributionValue(formData.get("utm_term")),
    last_utm_source: attributionValue(formData.get("last_utm_source")),
    last_utm_medium: attributionValue(formData.get("last_utm_medium")),
    last_utm_campaign: attributionValue(formData.get("last_utm_campaign")),
    last_utm_content: attributionValue(formData.get("last_utm_content")),
    last_utm_term: attributionValue(formData.get("last_utm_term")),
    internal_source: attributionValue(formData.get("internal_source")),
    internal_campaign: attributionValue(formData.get("internal_campaign")),
    internal_content: attributionValue(formData.get("internal_content")),
    gclid: identifierValue(formData.get("gclid")),
    gbraid: identifierValue(formData.get("gbraid")),
    wbraid: identifierValue(formData.get("wbraid")),
    msclkid: identifierValue(formData.get("msclkid")),
    click_captured_at: attributionValue(formData.get("click_captured_at")),
    landing_page: attributionValue(formData.get("landing_page")),
    referrer: attributionValue(formData.get("referrer")),
  };

  const intent = scoreInquiry(payload);
  const leadCategory = classifyLead({ ...payload, intent_level: intent.level });
  const acquisitionChannel = classifyAcquisitionChannel(payload);

  return {
    ...payload,
    commercial_route: commercialRoute(payload),
    intent_score: String(intent.score),
    intent_level: intent.level,
    intent_signals: intent.signals.join(", "),
    lead_category: leadCategory,
    lifecycle_status: leadCategory === "commercial" ? "New" : leadCategory === "vendor" ? "Vendor" : "Test",
    acquisition_channel: acquisitionChannel,
  };
}

function commercialRoute(payload) {
  const routeByOffer = {
    database_health_assessment: "/database-health-assessment",
    migration_risk_assessment: "/migration-risk-assessment",
    ai_readiness_assessment: "/ai-readiness-assessment-model-selection",
    claude_team_enablement: "/claude-team-enablement",
    emergency_dba_intake: "/emergency-dba-support.html",
  };

  return routeByOffer[payload?.entry_offer] || payload?.landing_page || "";
}

function validateInquiry(formData) {
  const payload = inquiryPayload(formData);
  const requiredFields = [
    ["name", payload.name],
    ["work email", payload.email],
    ["buyer type", payload.buyer_type],
    ["service", payload.service],
    ["urgency", payload.urgency],
    ["preferred starting point", payload.expected_investment],
    ["situation", payload.message],
  ];
  const missing = requiredFields.find(([, value]) => !value);

  if (missing) {
    return `Missing required field: ${missing[0]}.`;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    return "Enter a valid work email.";
  }

  const phoneFollowUp = payload.preferred_follow_up === "WhatsApp" || payload.preferred_follow_up === "Phone call";

  if (phoneFollowUp && !payload.phone) {
    return "Phone / WhatsApp is required for the selected follow-up method.";
  }

  return "";
}

function inquiryFields(formData) {
  const payload = inquiryPayload(formData);

  return [
    ...Object.entries({
      Name: payload.name,
      "Work email": payload.email,
      "Phone / WhatsApp": payload.phone,
      "Preferred follow-up": payload.preferred_follow_up,
      Company: payload.company,
      "Buyer type": payload.buyer_type,
      Service: payload.service,
      Urgency: payload.urgency,
      "Engagement type": payload.engagement_type,
      "Preferred starting point": payload.expected_investment,
      "Entry offer": payload.entry_offer,
      "Lead ID": payload.lead_id,
      "Lead category": payload.lead_category,
      "Lifecycle status": payload.lifecycle_status,
      "Acquisition channel": payload.acquisition_channel,
      "Commercial route": payload.commercial_route,
      "Assessment": payload.assessment_id,
      "Assessment score": payload.assessment_score,
      "Assessment level": payload.assessment_level,
      "Assessment answers": payload.assessment_answers,
      Situation: payload.message,
      "Intent score": payload.intent_score,
      "Intent level": payload.intent_level,
      "Intent signals": payload.intent_signals,
    }),
    ...attributionFields(payload),
  ];
}

function attributionFields(payload) {
  return [
    ["Traffic type", payload.traffic_type],
    ["GA client ID", payload.ga_client_id],
    ["Campaign source", payload.utm_source],
    ["Campaign medium", payload.utm_medium],
    ["Campaign", payload.utm_campaign],
    ["Campaign content", payload.utm_content],
    ["Campaign term", payload.utm_term],
    ["Last-touch source", payload.last_utm_source],
    ["Last-touch medium", payload.last_utm_medium],
    ["Last-touch campaign", payload.last_utm_campaign],
    ["Last-touch content", payload.last_utm_content],
    ["Last-touch term", payload.last_utm_term],
    ["Internal source", payload.internal_source],
    ["Internal campaign", payload.internal_campaign],
    ["Internal content", payload.internal_content],
    ["Google click ID", payload.gclid],
    ["Google braid ID", payload.gbraid || payload.wbraid],
    ["Microsoft click ID", payload.msclkid],
    ["Click captured at", payload.click_captured_at],
    ["Landing page", payload.landing_page],
    ["Referrer", payload.referrer],
  ].filter(([, value]) => value);
}

function attributedMessage(payload) {
  const fields = attributionFields(payload);

  if (!fields.length) {
    return payload.message;
  }

  return `${payload.message}\n\nCampaign attribution:\n${fields
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n")}`;
}

function inquirySubject(formData) {
  const payload = inquiryPayload(formData);
  const company = payload.company || "Unknown company";
  const filtered = payload.lead_category !== "commercial";
  const urgent = !filtered && (payload.urgency === "Immediately / this week" || payload.engagement_type === "Urgent support");
  const route = !filtered && isAiInquiry(payload) ? "AI " : "";
  const category = payload.lead_category === "test" ? "TEST " : "";

  return `${category}${urgent ? "URGENT " : ""}${route}[${payload.intent_level.toUpperCase()} ${payload.intent_score}] Datrick inquiry - ${company}`;
}

function inquiryRecipient(formData) {
  const payload = inquiryPayload(formData);

  if (payload.lead_category === "commercial" && isAiInquiry(payload)) {
    return process.env.AI_CONTACT_RECIPIENT || AI_CONTACT_RECIPIENT;
  }

  return process.env.CONTACT_RECIPIENT || CONTACT_RECIPIENT;
}

function isAiInquiry(payload) {
  return AI_SERVICES.has(fieldValue(payload?.service));
}

function inquiryText(formData) {
  return inquiryFields(formData)
    .map(([label, value]) => `${label}: ${fieldValue(value)}`)
    .join("\n");
}

function inquiryHtml(formData) {
  const rows = inquiryFields(formData)
    .map(([label, value]) => `<tr><th align="left" valign="top" style="padding:8px 12px;border-bottom:1px solid #dfe8e3;">${escapeHtml(label)}</th><td valign="top" style="padding:8px 12px;border-bottom:1px solid #dfe8e3;">${escapeHtml(fieldValue(value)).replace(/\n/g, "<br>")}</td></tr>`)
    .join("");

  return `<!doctype html>
<html>
  <body style="font-family:Arial,sans-serif;color:#172126;">
    <h1 style="font-size:20px;">New Datrick website inquiry</h1>
    <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #dfe8e3;">
      ${rows}
    </table>
  </body>
</html>`;
}

function fieldValue(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function attributionValue(value) {
  return fieldValue(value).slice(0, 255);
}

function identifierValue(value) {
  return fieldValue(value).slice(0, 128);
}

function classifyLead(payload) {
  const email = fieldValue(payload?.email).toLowerCase();
  const name = fieldValue(payload?.name).toLowerCase();
  const source = fieldValue(payload?.utm_source).toLowerCase();
  const trafficType = fieldValue(payload?.traffic_type).toLowerCase();
  const isTest = trafficType === "test"
    || source === "codex_controlled_test"
    || source === "qa"
    || /@(example\.(?:com|org|net)|test\.invalid)$/.test(email)
    || /^(?:qa|test)(?:\s|$|[-_])/i.test(name);

  if (isTest) {
    return "test";
  }

  if (fieldValue(payload?.intent_level) === "Vendor") {
    return "vendor";
  }

  return "commercial";
}

function classifyAcquisitionChannel(payload) {
  const trafficType = fieldValue(payload?.traffic_type).toLowerCase();
  const medium = fieldValue(payload?.utm_medium || payload?.last_utm_medium).toLowerCase();
  const referrer = fieldValue(payload?.referrer).toLowerCase();

  if (trafficType === "test" || trafficType === "internal") {
    return "Internal";
  }

  if (payload?.gclid || payload?.gbraid || payload?.wbraid || payload?.msclkid || /^(?:cpc|ppc|paid|paid_search|display)$/.test(medium)) {
    return "Paid";
  }

  if (medium === "organic" || /(?:google|bing|duckduckgo|yahoo)\./.test(referrer)) {
    return "Organic";
  }

  if (/email|newsletter/.test(medium)) {
    return "Email";
  }

  if (referrer || medium === "referral") {
    return "Referral";
  }

  return medium ? "Other" : "Direct";
}

function confirmationUrl(payload = {}) {
  const url = new URL(THANK_YOU_URL);
  url.searchParams.set("lead_category", payload.lead_category || "filtered");

  if (payload.lead_id) {
    url.searchParams.set("lead_id", identifierValue(payload.lead_id));
  }

  return url.toString();
}

function scoreInquiry(payload) {
  const vendorSignals = vendorSolicitationSignals(payload);

  if (vendorSignals.length) {
    return {
      score: 0,
      level: "Vendor",
      signals: vendorSignals,
    };
  }

  let score = 0;
  const signals = [];
  const addSignal = (points, label) => {
    if (points > 0) {
      score += points;
      signals.push(`${label} +${points}`);
    }
  };

  addSignal({
    "Immediately / this week": 30,
    "Within 30 days": 20,
    "This quarter": 10,
    "Exploring future delivery needs": 0,
  }[payload.urgency] || 0, "timing");

  addSignal({
    "Urgent support": 20,
    "Ongoing operations program": 18,
    "Fixed-scope project or pilot": 14,
    "Assessment / healthcheck": 10,
    "Team bootcamp / enablement": 10,
    "Not sure yet": 4,
  }[payload.engagement_type] || 0, "engagement");

  addSignal({
    "Transformation or dedicated team": 15,
    "Ongoing delivery program": 12,
    "Focused assessment or pilot": 8,
    "Not sure — recommend the right scope": 3,
    "$30,000+ transformation or dedicated team": 15,
    "$15,000-$30,000 monthly program": 12,
    "$7,500-$15,000 scoped engagement": 8,
    "Need a scoping recommendation": 3,
  }[payload.expected_investment] || 0, "investment fit");

  addSignal({
    "IT service firm / agency": 15,
    "CTO / technical leader": 15,
    "AI training or evaluation company": 12,
    "Learning / enablement leader": 10,
    "Founder / operator": 8,
    Other: 4,
  }[payload.buyer_type] || 0, "buyer fit");

  addSignal({
    "Emergency DBA support": 20,
    "Database handover recovery": 20,
    "Dedicated data operations program": 18,
    "Partner delivery under your brand": 18,
    "Partner AI delivery under your brand": 18,
    "AI project handover or rescue": 20,
    "Database operations": 16,
    "Migration support": 16,
    "Data platform or BI work": 14,
    "AI workflow automation": 12,
    "AI model training or evaluation": 12,
    "Claude Code enablement / tooling assessment": 12,
    "Claude certification preparation / bootcamp": 10,
  }[payload.service] || 0, "service intent");

  addSignal(payload.company ? 5 : 0, "company supplied");
  addSignal(payload.phone ? 4 : 0, "direct contact supplied");
  addSignal(payload.assessment_id ? 6 : 0, "assessment completed");
  addSignal(payload.message.length >= 120 ? 6 : payload.message.length >= 40 ? 3 : 0, "scoping detail");

  const boundedScore = Math.min(100, score);
  const level = boundedScore >= 75 ? "Hot" : boundedScore >= 50 ? "Warm" : "Early";

  return { score: boundedScore, level, signals };
}

function vendorSolicitationSignals(payload) {
  const message = fieldValue(payload?.message);
  const buyerNeed = /\b(?:we need|our client(?:'s|s')?\s+(?:needs|requires)|need help (?:with|to)|looking for (?:a|an) (?:delivery )?(?:partner|provider|consultant|team)|seeking (?:a|an) (?:partner|provider|consultant|team))\b/i.test(message);
  const sellerOffer = /\b(?:we|i)\s+(?:help|offer|provide|speciali[sz]e in|work with)\s+(?:[a-z0-9&-]+\s+){0,3}?(?:businesses|companies|teams|clients|organizations|organisations|partners|agencies|vendors|providers|consultancies)\b/i.test(message);
  const directOffer = /\b(?:(?:we|i)\s+(?:can|could|would (?:like|love) to|want to)\s+(?:help|offer|provide|support|handle|deliver)|our services? (?:include|cover|can help)|let us (?:help|handle|manage|show))\b/i.test(message);
  const unsolicitedReview = /\b(?:took|had)\s+(?:a\s+)?(?:quick\s+)?look at your (?:site|website)|\b(?:saw|noticed|found)\s+(?:a few|some)?\s*(?:opportunities|issues|problems)\s+(?:to|with|on|in)\b/i.test(message);
  const coldOutreach = /\b(?:reaching out|came across (?:datrick|your (?:company|business|website|site))|wanted to connect|following up on my (?:email|message)|improve (?:your|datrick(?:'s)?)|grow (?:your|datrick(?:'s)?))\b/i.test(message);
  const bookingCta = /\b(?:grab|book|schedule)\s+(?:a\s+)?(?:time|call|meeting|demo)\b|(?:calendly\.com|calendar\.[a-z]{2,})/i.test(message);
  const promotionalService = /\b(?:website redesign|web design|redesign(?:ing)?\s+(?:their\s+|your\s+)?websites?|seo services?|content (?:services?|marketing)|lead generation|appointment setting|digital marketing|social media marketing|paid ads?|ppc|link building|backlinks?|guest posts?|public relations|recruiting services?|staff augmentation|software development services?|app development services?|development outsourcing|(?:prospect|contact|email|lead|audience)\s+(?:list|database)|connect(?:ing)?\s+(?:(?:you|businesses|companies|teams|partners|agencies|vendors|providers)\s+)?with\s+(?:verified\s+)?(?:buyers|prospects|decision[- ]makers|(?:data(?:\s+and\s+integration)?|technology|integration|business)\s+leaders))\b/i.test(message);

  if (buyerNeed && !unsolicitedReview && !coldOutreach && !(directOffer && promotionalService)) {
    return [];
  }

  const matched = [
    sellerOffer ? "vendor service pitch" : "",
    directOffer ? "direct service offer" : "",
    unsolicitedReview ? "unsolicited site review" : "",
    coldOutreach ? "cold outreach language" : "",
    bookingCta ? "external booking CTA" : "",
    promotionalService ? "promotional service offer" : "",
  ].filter(Boolean);

  const isVendor = ((sellerOffer || directOffer) && (unsolicitedReview || coldOutreach || bookingCta || promotionalService))
    || (unsolicitedReview && bookingCta)
    || (coldOutreach && promotionalService)
    || matched.length >= 3;

  return isVendor ? matched : [];
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export default { fetch: handleContact };
export { classifyAcquisitionChannel, classifyLead, confirmationUrl, handleContact, inquiryPayload, inquiryRecipient, inquirySubject, inquiryText, isAiInquiry, scoreInquiry };
