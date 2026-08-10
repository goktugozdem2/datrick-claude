window.va = window.va || function () {
  (window.vaq = window.vaq || []).push(arguments);
};

const gaMeasurementId = "G-M39SJX3ENW";
const linkedinPartnerId = "10587385";
const analyticsConsentKey = "datrickAnalyticsConsent";
const analyticsHost =
  window.location.hostname === "datrick.com" ||
  window.location.hostname === "www.datrick.com" ||
  window.location.hostname.endsWith(".vercel.app");

window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function () {
  window.dataLayer.push(arguments);
};

window.gtag("consent", "default", {
  ad_storage: "denied",
  analytics_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  wait_for_update: 500,
});

let analyticsConsent = "unset";

try {
  analyticsConsent = localStorage.getItem(analyticsConsentKey) || "unset";
} catch {
  analyticsConsent = "unset";
}

const updateGoogleConsent = (granted) => {
  window.gtag("consent", "update", {
    analytics_storage: granted ? "granted" : "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
};

const loadGoogleAnalytics = () => {
  if (!analyticsHost || analyticsConsent !== "granted") {
    return;
  }

  updateGoogleConsent(true);

  if (document.querySelector(`script[data-ga-measurement="${gaMeasurementId}"]`)) {
    return;
  }

  const googleAnalytics = document.createElement("script");
  googleAnalytics.async = true;
  googleAnalytics.src = `https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`;
  googleAnalytics.dataset.gaMeasurement = gaMeasurementId;
  document.head.appendChild(googleAnalytics);

  window.gtag("js", new Date());
  window.gtag("config", gaMeasurementId, {
    anonymize_ip: true,
  });
};

const loadLinkedInInsightTag = () => {
  if (!analyticsHost || analyticsConsent !== "granted") {
    return;
  }

  if (document.querySelector(`script[data-linkedin-partner-id="${linkedinPartnerId}"]`)) {
    return;
  }

  window._linkedin_partner_id = linkedinPartnerId;
  window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];

  if (!window._linkedin_data_partner_ids.includes(linkedinPartnerId)) {
    window._linkedin_data_partner_ids.push(linkedinPartnerId);
  }

  if (!window.lintrk) {
    window.lintrk = function (action, data) {
      window.lintrk.q.push([action, data]);
    };
    window.lintrk.q = [];
  }

  const linkedInInsight = document.createElement("script");
  linkedInInsight.async = true;
  linkedInInsight.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
  linkedInInsight.dataset.linkedinPartnerId = linkedinPartnerId;
  document.head.appendChild(linkedInInsight);
};

if (analyticsHost && !document.querySelector('script[src="/_vercel/insights/script.js"]')) {
  const vercelAnalytics = document.createElement("script");
  vercelAnalytics.defer = true;
  vercelAnalytics.src = "/_vercel/insights/script.js";
  document.head.appendChild(vercelAnalytics);
}

if (analyticsConsent === "granted") {
  loadGoogleAnalytics();
  loadLinkedInInsightTag();
}

const googleEventNames = {
  "Commercial Landing Viewed": "commercial_landing_view",
  "Assessment Started": "assessment_start",
  "Assessment Completed": "assessment_complete",
  "Content Viewed": "content_view",
  "Content Engaged": "content_engaged",
  "Funnel Step Clicked": "funnel_step_click",
  "Form Started": "form_start",
  "Form Submitted": "form_submit",
  "Inquiry Submitted": "generate_lead",
  "Lead Filtered": "lead_filtered",
  "Form Validation Error": "form_validation_error",
  "Contact Method Clicked": "contact_method_click",
  "Conversation CTA Clicked": "conversation_cta_click",
  "Offer CTA Clicked": "offer_cta_click",
  "CTA Clicked": "cta_click",
};

const analyticsDimensionAllowlist = new Set([
  "assessment_id",
  "assessment_level",
  "assessment_score",
  "campaign",
  "commercial_cluster",
  "content",
  "content_engagement_type",
  "content_group",
  "content_id",
  "content_type",
  "context",
  "conversion_page",
  "cta_name",
  "engagement_type",
  "entry_offer",
  "field_name",
  "field_type",
  "funnel_stage",
  "internal_source",
  "keyword",
  "landing_page",
  "lead_category",
  "lead_id",
  "location",
  "method",
  "next_stage",
  "offer",
  "page",
  "page_slug",
  "service",
  "source",
  "scroll_depth",
  "target",
  "traffic_type",
  "expected_investment",
]);

window.datrickEventLog = window.datrickEventLog || [];

const analyticsSafeData = (data = {}) => {
  return Object.fromEntries(Object.entries(data)
    .filter(([key]) => analyticsDimensionAllowlist.has(key))
    .map(([key, value]) => {
      if (typeof value === "number" || typeof value === "boolean") {
        return [key, value];
      }

      return [key, String(value || "").slice(0, 255)];
    }));
};

const trackGoogleAnalyticsEvent = (name, data) => {
  if (!analyticsHost || analyticsConsent !== "granted") {
    return;
  }

  const eventName = googleEventNames[name] || name.toLowerCase().replace(/[^a-z0-9]+/g, "_");
  const safeData = analyticsSafeData(data);

  loadGoogleAnalytics();
  window.gtag("event", eventName, safeData);
};

const trackAnalyticsEvent = (name, data) => {
  const eventName = googleEventNames[name] || name.toLowerCase().replace(/[^a-z0-9]+/g, "_");
  const safeData = analyticsSafeData(data);

  window.datrickEventLog.push({
    event: eventName,
    data: safeData,
    recorded_at: new Date().toISOString(),
  });

  if (!analyticsHost) {
    return;
  }

  window.va("event", { name, data: safeData });

  if (analyticsConsent === "granted") {
    loadGoogleAnalytics();
    window.gtag("event", eventName, safeData);
  }
};

const createConsentManager = () => {
  const footer = document.querySelector(".site-footer");
  const footerSettingsGroup = footer?.querySelector(".footer-links:last-child");
  const settingsButton = document.createElement("button");
  const banner = document.createElement("section");

  settingsButton.type = "button";
  settingsButton.className = "privacy-settings-button";
  settingsButton.textContent = "Cookie settings";

  banner.className = "consent-banner";
  banner.setAttribute("role", "dialog");
  banner.setAttribute("aria-labelledby", "consent-title");
  banner.setAttribute("aria-describedby", "consent-description");
  banner.hidden = analyticsConsent !== "unset";
  banner.innerHTML = `
    <div class="consent-copy">
      <strong id="consent-title">Your analytics choice</strong>
      <p id="consent-description">Google Analytics and the LinkedIn Insight Tag stay off unless you accept. Vercel analytics is cookie-free. <a href="privacy.html">Privacy policy</a></p>
    </div>
    <div class="consent-actions">
      <button class="consent-button consent-reject" type="button" data-consent="denied">Reject non-essential</button>
      <button class="consent-button consent-accept" type="button" data-consent="granted">Accept analytics</button>
    </div>
  `;

  const saveConsent = (value) => {
    analyticsConsent = value;

    try {
      localStorage.setItem(analyticsConsentKey, value);
    } catch {
      // The choice still applies to the current page when storage is unavailable.
    }

    if (value === "granted") {
      loadGoogleAnalytics();
      loadLinkedInInsightTag();
      document.dispatchEvent(new CustomEvent("datrick:analytics-consent-granted"));
    } else {
      updateGoogleConsent(false);
    }

    banner.hidden = true;
    settingsButton.focus();
  };

  banner.querySelectorAll("[data-consent]").forEach((button) => {
    button.addEventListener("click", () => saveConsent(button.dataset.consent));
  });

  settingsButton.addEventListener("click", () => {
    banner.hidden = false;
    banner.querySelector("[data-consent]")?.focus();
  });

  if (footerSettingsGroup) {
    footerSettingsGroup.appendChild(settingsButton);
  } else if (footer) {
    footer.appendChild(settingsButton);
  } else {
    document.body.appendChild(settingsButton);
  }

  document.body.appendChild(banner);
};

createConsentManager();

const attributionKeys = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "gbraid",
  "wbraid",
  "msclkid",
];
const searchParams = new URLSearchParams(window.location.search);
const currentAttribution = Object.fromEntries(
  attributionKeys.map((key) => [key, (searchParams.get(key) || "").slice(0, 255)]),
);
const hasCampaignAttribution = attributionKeys.some((key) => currentAttribution[key]);
const hasPaidClickAttribution = ["gclid", "gbraid", "wbraid", "msclkid"].some((key) => currentAttribution[key]);
const internalCampaign = ["website", "organic_content"].includes(currentAttribution.utm_medium);
currentAttribution.landing_page = window.location.pathname;
currentAttribution.first_seen_at = new Date().toISOString();
currentAttribution.click_captured_at = hasPaidClickAttribution ? currentAttribution.first_seen_at : "";

try {
  const referrerUrl = document.referrer ? new URL(document.referrer) : null;
  const internalReferrer = referrerUrl?.hostname === window.location.hostname;
  currentAttribution.referrer = internalReferrer ? "" : referrerUrl?.hostname || "";
} catch {
  currentAttribution.referrer = "";
}

let storedFirstTouch = {};
let storedLastTouch = {};
let storedInternalPath = {};

try {
  storedFirstTouch = JSON.parse(sessionStorage.getItem("datrickFirstTouch")) || {};
  storedLastTouch = JSON.parse(sessionStorage.getItem("datrickLastTouch")) || {};
  storedInternalPath = JSON.parse(sessionStorage.getItem("datrickInternalPath")) || {};
} catch {
  storedFirstTouch = {};
  storedLastTouch = {};
  storedInternalPath = {};
}

const firstTouchAttribution = Object.keys(storedFirstTouch).length
  ? storedFirstTouch
  : {
      ...currentAttribution,
      ...(internalCampaign ? {
        utm_source: "",
        utm_medium: "",
        utm_campaign: "",
        utm_content: "",
        utm_term: "",
      } : {}),
    };
const lastTouchAttribution = hasCampaignAttribution && !internalCampaign
  ? currentAttribution
  : Object.keys(storedLastTouch).length
    ? storedLastTouch
    : firstTouchAttribution;
const internalPathAttribution = internalCampaign
  ? {
      source: currentAttribution.utm_source,
      campaign: currentAttribution.utm_campaign,
      content: currentAttribution.utm_content,
    }
  : storedInternalPath;
const paidClickKeys = ["gclid", "gbraid", "wbraid", "msclkid"];
const lastTouchHasPaidClick = paidClickKeys.some((key) => lastTouchAttribution[key]);
const sessionAttribution = {
  ...firstTouchAttribution,
  gclid: lastTouchAttribution.gclid || firstTouchAttribution.gclid || "",
  gbraid: lastTouchAttribution.gbraid || firstTouchAttribution.gbraid || "",
  wbraid: lastTouchAttribution.wbraid || firstTouchAttribution.wbraid || "",
  msclkid: lastTouchAttribution.msclkid || firstTouchAttribution.msclkid || "",
  last_utm_source: lastTouchAttribution.utm_source || "",
  last_utm_medium: lastTouchAttribution.utm_medium || "",
  last_utm_campaign: lastTouchAttribution.utm_campaign || "",
  last_utm_content: lastTouchAttribution.utm_content || "",
  last_utm_term: lastTouchAttribution.utm_term || "",
  internal_source: internalPathAttribution.source || "",
  internal_campaign: internalPathAttribution.campaign || "",
  internal_content: internalPathAttribution.content || "",
  click_captured_at: lastTouchHasPaidClick
    ? lastTouchAttribution.click_captured_at || ""
    : firstTouchAttribution.click_captured_at || "",
};

try {
  sessionStorage.setItem("datrickFirstTouch", JSON.stringify(firstTouchAttribution));
  sessionStorage.setItem("datrickLastTouch", JSON.stringify(lastTouchAttribution));
  sessionStorage.setItem("datrickInternalPath", JSON.stringify(internalPathAttribution));
  sessionStorage.setItem("datrickAttribution", JSON.stringify(sessionAttribution));
} catch {
  // The current page attribution can still populate a form without storage.
}

const readAttribution = () => {
  return sessionAttribution;
};

const attributionEventData = (attribution) => {
  const body = document.body;
  const testTraffic = searchParams.get("datrick_test") === "1"
    || attribution.utm_source === "codex_controlled_test"
    || attribution.utm_source === "qa"
    || window.location.hostname === "localhost"
    || window.location.hostname === "127.0.0.1"
    || Boolean(navigator.webdriver);

  return {
    source: attribution.utm_source || attribution.referrer || "direct",
    internal_source: attribution.internal_source || "",
    campaign: attribution.utm_campaign || "",
    keyword: attribution.utm_term || "",
    landing_page: attribution.landing_page || window.location.pathname,
    conversion_page: window.location.pathname,
    commercial_cluster: body?.dataset.commercialCluster || "",
    content_type: body?.dataset.contentType || (body?.classList.contains("article-page") ? "resource" : "page"),
    page_slug: window.location.pathname.replace(/^\/+|\.html$/g, "") || "home",
    traffic_type: testTraffic ? "internal" : "external",
  };
};

const commercialLanding = document.body?.dataset.commercialLanding;

if (commercialLanding === "true") {
  const eventAttribution = attributionEventData(readAttribution());

  trackAnalyticsEvent("Commercial Landing Viewed", {
    ...eventAttribution,
    page: window.location.pathname,
  });
}

const contentId = document.body.dataset.contentId || "";
const contentGroup = document.body.dataset.contentGroup || "";

if (contentId) {
  const contentEventData = {
    ...attributionEventData(readAttribution()),
    page: window.location.pathname,
    content_id: contentId,
    content_group: contentGroup,
    funnel_stage: document.body.dataset.funnelStage || "awareness",
  };
  let contentEngaged = false;

  const trackContentEngagement = (engagementType) => {
    if (contentEngaged) {
      return;
    }

    contentEngaged = true;
    window.removeEventListener("scroll", checkContentScrollDepth);
    const engagementData = {
      ...contentEventData,
      funnel_stage: "consideration",
      content_engagement_type: engagementType,
      scroll_depth: engagementType === "scroll_50" ? 50 : 0,
    };

    if (analyticsConsent !== "granted") {
      document.addEventListener(
        "datrick:analytics-consent-granted",
        () => trackGoogleAnalyticsEvent("Content Engaged", engagementData),
        { once: true },
      );
    }

    trackAnalyticsEvent("Content Engaged", engagementData);
  };

  const checkContentScrollDepth = () => {
    const scrollableHeight = Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);

    if (scrollableHeight > 0 && window.scrollY / scrollableHeight >= 0.5) {
      trackContentEngagement("scroll_50");
    }
  };

  if (analyticsConsent !== "granted") {
    document.addEventListener(
      "datrick:analytics-consent-granted",
      () => trackGoogleAnalyticsEvent("Content Viewed", contentEventData),
      { once: true },
    );
  }

  trackAnalyticsEvent("Content Viewed", contentEventData);
  window.addEventListener("scroll", checkContentScrollDepth, { passive: true });
  window.setTimeout(() => trackContentEngagement("time_60s"), 60000);
}

const aiInquiryServices = new Set([
  "AI value, model selection, and integration assessment",
  "Partner AI delivery under your brand",
  "AI project handover or rescue",
  "AI workflow automation",
  "AI model training or evaluation",
  "Claude Code enablement / tooling assessment",
  "Claude certification preparation / bootcamp",
]);
const isAiInquiryService = (service) => aiInquiryServices.has(service || "");
const contactForm = document.querySelector(".contact-form");

if (contactForm) {
  const attribution = readAttribution();
  const preferredFollowUp = contactForm.elements.namedItem("preferred_follow_up");
  const name = contactForm.elements.namedItem("name");
  const email = contactForm.elements.namedItem("email");
  const phone = contactForm.elements.namedItem("phone");
  const phoneLabel = contactForm.querySelector('label[for="phone"]');
  const phoneRow = phone?.closest(".form-row");
  const buyerType = contactForm.elements.namedItem("buyer_type");
  const service = contactForm.elements.namedItem("service");
  const urgency = contactForm.elements.namedItem("urgency");
  const engagementType = contactForm.elements.namedItem("engagement_type");
  const expectedInvestment = contactForm.elements.namedItem("expected_investment");
  const entryOffer = contactForm.elements.namedItem("entry_offer");
  const message = contactForm.elements.namedItem("message");
  const leadId = contactForm.elements.namedItem("lead_id");
  const trafficType = contactForm.elements.namedItem("traffic_type");
  const gaClientId = contactForm.elements.namedItem("ga_client_id");
  const assessmentId = contactForm.elements.namedItem("assessment_id");
  const assessmentScore = contactForm.elements.namedItem("assessment_score");
  const assessmentLevel = contactForm.elements.namedItem("assessment_level");
  const assessmentAnswers = contactForm.elements.namedItem("assessment_answers");
  const formStatus = contactForm.querySelector(".form-status");
  const submitButton = contactForm.querySelector('[type="submit"]');
  const submitLabel = submitButton?.textContent || "Send inquiry";

  const requestedBuyerType = (searchParams.get("buyer_type") || "").slice(0, 255);
  const requestedService = (searchParams.get("service") || "").slice(0, 255);
  const requestedUrgency = (searchParams.get("urgency") || "").slice(0, 255);
  const requestedEngagementType = (searchParams.get("engagement_type") || "").slice(0, 255);
  const requestedExpectedInvestment = (searchParams.get("expected_investment") || "").slice(0, 255);
  const requestedEntryOffer = (searchParams.get("offer") || "").slice(0, 255);
  const certificationTrack = (searchParams.get("certification_track") || "").slice(0, 255);
  const readinessScore = (searchParams.get("readiness_score") || "").slice(0, 20);
  const requestedAssessmentId = (searchParams.get("assessment_id") || "").slice(0, 80);
  const requestedAssessmentScore = (searchParams.get("assessment_score") || "").slice(0, 20);
  const requestedAssessmentLevel = (searchParams.get("assessment_level") || "").slice(0, 80);
  const requestedAssessmentAnswers = (searchParams.get("assessment_answers") || "").slice(0, 1000);

  if (leadId && !leadId.value) {
    leadId.value = typeof crypto?.randomUUID === "function"
      ? crypto.randomUUID()
      : `lead-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }

  const eventAttribution = attributionEventData(attribution);

  if (trafficType) {
    trafficType.value = eventAttribution.traffic_type;
  }

  if (assessmentId) {
    assessmentId.value = requestedAssessmentId;
  }

  if (assessmentScore) {
    assessmentScore.value = requestedAssessmentScore;
  }

  if (assessmentLevel) {
    assessmentLevel.value = requestedAssessmentLevel;
  }

  if (assessmentAnswers) {
    assessmentAnswers.value = requestedAssessmentAnswers;
  }

  const syncGaClientId = () => {
    if (!gaClientId || analyticsConsent !== "granted") {
      return;
    }

    const gaCookie = document.cookie.split("; ").find((item) => item.startsWith("_ga="));
    const cookieParts = gaCookie?.split("=")[1]?.split(".") || [];

    gaClientId.value = cookieParts.length >= 2 ? cookieParts.slice(-2).join(".") : "";
  };

  syncGaClientId();
  document.addEventListener("datrick:analytics-consent-granted", syncGaClientId);

  const selectMatchingOption = (select, value) => {
    if (!select || !value) {
      return false;
    }

    const hasOption = [...select.options].some((option) => option.value === value);

    if (hasOption) {
      select.value = value;
    }

    return hasOption;
  };

  const buyerTypeMatched = selectMatchingOption(buyerType, requestedBuyerType);
  const serviceMatched = selectMatchingOption(service, requestedService);
  selectMatchingOption(urgency, requestedUrgency);
  const engagementMatched = selectMatchingOption(engagementType, requestedEngagementType);
  const investmentMatched = selectMatchingOption(expectedInvestment, requestedExpectedInvestment);

  if (entryOffer) {
    entryOffer.value = requestedEntryOffer;
  }

  const guidedScope = requestedEntryOffer
    && buyerTypeMatched
    && serviceMatched
    && engagementMatched
    && investmentMatched;

  if (guidedScope) {
    const formIntro = contactForm.querySelector(".form-intro");
    const routeSummary = document.createElement("div");
    const summaryCopy = document.createElement("div");
    const summaryTitle = document.createElement("strong");
    const summaryDetail = document.createElement("span");
    const editScope = document.createElement("button");
    const scopedFields = [buyerType, service, engagementType, expectedInvestment].filter(Boolean);

    routeSummary.className = "form-route-summary";
    routeSummary.setAttribute("role", "note");
    summaryTitle.textContent = requestedAssessmentId ? "Assessment result attached" : "Service route selected";
    summaryDetail.textContent = [
      requestedService,
      requestedAssessmentLevel && requestedAssessmentScore
        ? `${requestedAssessmentLevel} · ${requestedAssessmentScore}/100`
        : requestedEngagementType,
    ].filter(Boolean).join(" — ");
    editScope.type = "button";
    editScope.className = "form-route-edit";
    editScope.textContent = "Change scope";
    summaryCopy.append(summaryTitle, summaryDetail);
    routeSummary.append(summaryCopy, editScope);
    formIntro?.insertAdjacentElement("afterend", routeSummary);

    scopedFields.forEach((field) => {
      const row = field.closest(".form-row");

      if (row) {
        row.hidden = true;
      }
    });

    editScope.addEventListener("click", () => {
      scopedFields.forEach((field) => {
        const row = field.closest(".form-row");

        if (row) {
          row.hidden = false;
        }
      });
      routeSummary.hidden = true;
      service?.focus();
    });

    if (message && requestedAssessmentId) {
      message.placeholder = "Add the context behind this result: what is at risk, what has been tried, and the decision timeline.";
    }
  }

  if (requestedService === "Claude certification preparation / bootcamp") {
    if (!requestedEngagementType) {
      selectMatchingOption(engagementType, "Team bootcamp / enablement");
    }

    const context = [
      certificationTrack ? `Certification track: ${certificationTrack}.` : "",
      readinessScore ? `Readiness checklist score: ${readinessScore}.` : "",
      "Please recommend the appropriate preparation format, cohort structure, and next steps.",
    ].filter(Boolean).join("\n");

    if (message && !message.value) {
      message.value = context;
    }
  }

  const updatePhoneRequirement = () => {
    const phoneRequired = preferredFollowUp?.value === "WhatsApp" || preferredFollowUp?.value === "Phone call";

    phone?.toggleAttribute("required", phoneRequired);

    if (phone) {
      phone.disabled = !phoneRequired;
      phone.setAttribute("aria-required", phoneRequired.toString());

      if (!phoneRequired) {
        phone.removeAttribute("aria-invalid");
      }
    }

    if (phoneRow) {
      phoneRow.hidden = !phoneRequired;
    }

    if (phoneLabel) {
      phoneLabel.textContent = preferredFollowUp?.value === "WhatsApp"
        ? "WhatsApp number"
        : "Phone number";
    }
  };

  preferredFollowUp?.addEventListener("change", updatePhoneRequirement);
  updatePhoneRequirement();

  const updateFormStatus = (messageText, state = "") => {
    if (!formStatus) {
      return;
    }

    formStatus.textContent = messageText;

    if (state) {
      formStatus.dataset.state = state;
    } else {
      delete formStatus.dataset.state;
    }
  };

  contactForm.addEventListener("invalid", (event) => {
    const field = event.target;
    const firstInvalidField = contactForm.querySelector('[aria-invalid="true"]');

    field.setAttribute("aria-invalid", "true");

    if (!firstInvalidField || firstInvalidField === field) {
      const fieldLabel = field.labels?.[0]?.textContent.trim() || "Required field";
      updateFormStatus(`Check ${fieldLabel}. ${field.validationMessage}`, "error");

      if (!firstInvalidField) {
        const eventAttribution = attributionEventData(attribution);

        trackAnalyticsEvent("Form Validation Error", {
          ...eventAttribution,
          page: eventAttribution.landing_page,
          field_name: field.name || field.id || "unknown",
          field_type: field.type || field.tagName.toLowerCase(),
          service: service?.value || "not_selected",
        });
      }
    }
  }, true);

  const clearResolvedError = (event) => {
    const field = event.target;

    if (!(field instanceof HTMLInputElement || field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement)) {
      return;
    }

    if (["name", "email", "message"].includes(field.name) && field.value.trim()) {
      field.setCustomValidity("");
    }

    if (field.validity.valid) {
      field.removeAttribute("aria-invalid");
    }

    if (!contactForm.querySelector('[aria-invalid="true"]')) {
      updateFormStatus("");
    }
  };

  contactForm.addEventListener("input", clearResolvedError);
  contactForm.addEventListener("change", clearResolvedError);

  [
    ...attributionKeys,
    "landing_page",
    "referrer",
    "last_utm_source",
    "last_utm_medium",
    "last_utm_campaign",
    "last_utm_content",
    "last_utm_term",
    "internal_source",
    "internal_campaign",
    "internal_content",
    "click_captured_at",
  ].forEach((key) => {
    const input = contactForm.elements.namedItem(key);

    if (input) {
      input.value = attribution[key] || "";
    }
  });

  contactForm.addEventListener("focusin", () => {
    const eventAttribution = attributionEventData(attribution);

    trackAnalyticsEvent("Form Started", {
      ...eventAttribution,
      page: eventAttribution.landing_page,
      service: service?.value || "not_selected",
      engagement_type: engagementType?.value || "not_selected",
      expected_investment: expectedInvestment?.value || "not_selected",
      entry_offer: entryOffer?.value || "none",
    });
  }, { once: true });

  contactForm.addEventListener("submit", (event) => {
    const requiredTextFields = [
      [name, "Enter your name."],
      [email, "Enter your work email."],
      [message, "Describe the situation."],
    ];

    for (const [field, validationMessage] of requiredTextFields) {
      if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement)) {
        continue;
      }

      field.setCustomValidity(field.value.trim() ? "" : validationMessage);
    }

    if (!contactForm.checkValidity()) {
      event.preventDefault();
      contactForm.reportValidity();
      return;
    }

    syncGaClientId();
    const eventAttribution = attributionEventData(attribution);
    const urgency = contactForm.elements.namedItem("urgency");
    const pendingInquiry = {
      service: service?.value || "not_selected",
      urgency: urgency?.value || "not_selected",
      engagement_type: engagementType?.value || "not_selected",
      expected_investment: expectedInvestment?.value || "not_selected",
      entry_offer: entryOffer?.value || "none",
      lead_id: leadId?.value || "unassigned",
      lead_category: eventAttribution.traffic_type === "internal" ? "test" : "pending",
      assessment_id: assessmentId?.value || "",
      assessment_score: assessmentScore?.value || "",
      assessment_level: assessmentLevel?.value || "",
      ...eventAttribution,
    };

    trackAnalyticsEvent("Form Submitted", {
      ...pendingInquiry,
      page: window.location.pathname,
    });

    try {
      sessionStorage.setItem("datrickInquiryPending", JSON.stringify(pendingInquiry));
    } catch {
      // The form still works when browser storage is unavailable.
    }

    contactForm.setAttribute("aria-busy", "true");
    updateFormStatus("Sending your inquiry. Please wait.", "pending");

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.classList.add("is-loading");
      submitButton.textContent = "Sending inquiry…";
    }
  });

  window.addEventListener("pageshow", () => {
    contactForm.removeAttribute("aria-busy");

    if (submitButton) {
      submitButton.disabled = false;
      submitButton.classList.remove("is-loading");
      submitButton.textContent = submitLabel;
    }
  });
}

if (window.location.pathname.endsWith("/thank-you.html")) {
  try {
    const confirmationParams = new URLSearchParams(window.location.search);
    const confirmedCategory = confirmationParams.get("lead_category") || "";
    const confirmedLeadId = confirmationParams.get("lead_id") || "";
    const pendingValue = sessionStorage.getItem("datrickInquiryPending");
    const pendingInquiry = pendingValue
      ? pendingValue === "1" ? {} : JSON.parse(pendingValue)
      : {};
    const confirmationHeading = document.querySelector(".thank-you-copy h1");
    const confirmationLede = document.querySelector(".thank-you-copy .hero-lede");
    const confirmationTitle = document.querySelector("[data-confirmation-title]");
    const confirmationCopy = document.querySelector("[data-confirmation-copy]");
    const confirmationResource = document.querySelector("[data-confirmation-resource]");
    const urgentContact = document.querySelector(".urgent-contact");

    if (confirmedCategory === "test") {
      if (confirmationHeading) confirmationHeading.textContent = "Controlled test recorded. No email was sent.";
      if (confirmationLede) confirmationLede.textContent = "The test path was classified separately from commercial leads and stopped before email delivery.";
      if (confirmationTitle) confirmationTitle.textContent = "Verification complete";
      if (confirmationCopy) confirmationCopy.textContent = "Use the local event log and lifecycle record to verify attribution. This submission must not appear in qualified pipeline.";
      if (urgentContact) urgentContact.hidden = true;
    } else if (confirmedCategory === "vendor" || confirmedCategory === "filtered") {
      if (confirmationHeading) confirmationHeading.textContent = "Thank you. The submission was recorded.";
      if (confirmationLede) confirmationLede.textContent = "Datrick reviews website submissions according to their stated purpose and relevance.";
      if (confirmationTitle) confirmationTitle.textContent = "No follow-up is guaranteed";
      if (confirmationCopy) confirmationCopy.textContent = "Commercial inquiries receive priority. Unsolicited service offers may not receive a response.";
      if (urgentContact) urgentContact.hidden = true;
    }

    if (pendingValue) {
      sessionStorage.removeItem("datrickInquiryPending");
      const urgentWhatsApp = document.querySelector("[data-urgent-whatsapp]");

      if (confirmedCategory === "commercial" && isAiInquiryService(pendingInquiry.service)) {
        const heading = document.querySelector(".thank-you-copy h1");
        const lede = document.querySelector(".thank-you-copy .hero-lede");
        const urgentEmail = document.querySelector(".urgent-contact a");

        if (heading) {
          heading.textContent = "Thank you. Your AI assessment inquiry is with a senior lead.";
        }

        if (lede) {
          lede.textContent = "We will review the business decision, workflow evidence, model fit, and delivery constraints, then reply within one business day with a scoping recommendation or focused questions.";
        }

        if (urgentEmail) {
          urgentEmail.href = "mailto:ai@datrick.com";
          urgentEmail.textContent = "ai@datrick.com";
        }
      }

      if (urgentWhatsApp && pendingInquiry.urgency === "Immediately / this week") {
        const topic = pendingInquiry.service && pendingInquiry.service !== "not_selected"
          ? pendingInquiry.service
          : "urgent support";
        const query = new URLSearchParams({
          context: "urgent-confirmation",
          topic,
        });

        urgentWhatsApp.href = `/api/whatsapp?${query.toString()}`;
        urgentWhatsApp.hidden = false;
      }

      const resourceByService = pendingInquiry.service === "Claude Code enablement / tooling assessment"
        ? { href: "resource-claude-code-enablement-guide.html", label: "Prepare with the Claude Code enablement guide" }
        : isAiInquiryService(pendingInquiry.service)
          ? { href: "ai-readiness-assessment-model-selection", label: "Review the AI assessment decision framework" }
        : pendingInquiry.service === "Migration support"
          ? { href: "resource-migration-support-playbook.html", label: "Prepare with the migration support playbook" }
          : ["Database operations", "Emergency DBA support", "Database handover recovery", "Dedicated data operations program"].includes(pendingInquiry.service)
            ? { href: "resource-database-handover.html", label: "Prepare with the database handover checklist" }
            : { href: "resources.html", label: "Use the resource library while we review" };

      if (confirmationTitle && pendingInquiry.assessment_id && confirmedCategory === "commercial") {
        confirmationTitle.textContent = `${pendingInquiry.assessment_level || "Assessment"} result attached`;
      }

      if (confirmationCopy && pendingInquiry.assessment_id && confirmedCategory === "commercial") {
        confirmationCopy.textContent = "A senior lead will review the result together with your written context. The score is directional; the recommendation depends on the underlying evidence and service boundary.";
      }

      if (confirmationResource && confirmedCategory === "commercial") {
        confirmationResource.href = resourceByService.href;
        confirmationResource.textContent = resourceByService.label;
      }
    }

    if (["commercial", "vendor", "test", "filtered"].includes(confirmedCategory)
        && (pendingValue || confirmedLeadId)) {
      const confirmationEvent = confirmedCategory === "commercial"
        ? "Inquiry Submitted"
        : "Lead Filtered";

      trackAnalyticsEvent(confirmationEvent, {
        lead_id: confirmedLeadId || pendingInquiry.lead_id || "unassigned",
        lead_category: confirmedCategory,
        traffic_type: pendingInquiry.traffic_type || (confirmedCategory === "test" ? "internal" : "external"),
        service: pendingInquiry.service || "unknown",
        source: pendingInquiry.source || "direct",
        internal_source: pendingInquiry.internal_source || "",
        campaign: pendingInquiry.campaign || "",
        keyword: pendingInquiry.keyword || "",
        landing_page: pendingInquiry.landing_page || "unknown",
        conversion_page: pendingInquiry.conversion_page || "/thank-you.html",
        engagement_type: pendingInquiry.engagement_type || "unknown",
        expected_investment: pendingInquiry.expected_investment || "unknown",
        entry_offer: pendingInquiry.entry_offer || "none",
        assessment_id: pendingInquiry.assessment_id || "",
        assessment_score: pendingInquiry.assessment_score || "",
        assessment_level: pendingInquiry.assessment_level || "",
      });
    }
  } catch {
    // Do not count direct visits when browser storage is unavailable.
  }
}

const createAssessmentId = (key) => {
  const suffix = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  return `${key}-${suffix}`.slice(0, 128);
};

document.querySelectorAll("[data-service-assessment]").forEach((assessmentForm) => {
  const assessmentKey = assessmentForm.dataset.assessmentKey || "service_readiness";
  const assessmentId = createAssessmentId(assessmentKey);
  const result = assessmentForm.querySelector("[data-assessment-result]");
  const resultScore = assessmentForm.querySelector("[data-assessment-result-score]");
  const resultLevel = assessmentForm.querySelector("[data-assessment-result-level]");
  const resultCopy = assessmentForm.querySelector("[data-assessment-result-copy]");
  const resultLink = assessmentForm.querySelector("[data-assessment-contact]");
  const progress = assessmentForm.querySelector("[data-assessment-progress]");
  const groups = [...new Set([...assessmentForm.querySelectorAll('input[type="radio"]')].map((input) => input.name))];
  const eventAttribution = () => attributionEventData(readAttribution());

  const updateProgress = () => {
    const answered = groups.filter((name) => assessmentForm.querySelector(`input[name="${name}"]:checked`)).length;

    if (progress) {
      progress.textContent = `${answered} of ${groups.length} answered`;
    }
  };

  assessmentForm.addEventListener("change", (event) => {
    if (!(event.target instanceof HTMLInputElement) || event.target.type !== "radio") {
      return;
    }

    updateProgress();

    if (!assessmentForm.dataset.assessmentStarted) {
      assessmentForm.dataset.assessmentStarted = "true";
      trackAnalyticsEvent("Assessment Started", {
        ...eventAttribution(),
        assessment_id: assessmentId,
        service: assessmentForm.dataset.contactService || assessmentKey,
        offer: assessmentForm.dataset.offer || assessmentKey,
      });
    }
  });

  assessmentForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const selected = groups.map((name) => assessmentForm.querySelector(`input[name="${name}"]:checked`));

    if (selected.some((input) => !input)) {
      assessmentForm.reportValidity();
      return;
    }

    const total = selected.reduce((sum, input) => sum + Number(input.value || 0), 0);
    const maximum = groups.length * 2;
    const score = maximum ? Math.round((total / maximum) * 100) : 0;
    const band = score >= 67 ? "high" : score >= 34 ? "mid" : "low";
    const level = assessmentForm.dataset[`${band}Label`] || (band === "high" ? "Ready to scope" : band === "mid" ? "Evidence gaps" : "High-priority gaps");
    const copy = assessmentForm.dataset[`${band}Copy`] || "Use the result to choose the next responsible step.";
    const answerSummary = selected.map((input) => `${input.name}=${input.value}`).join("|").slice(0, 1000);
    const params = new URLSearchParams({
      buyer_type: assessmentForm.dataset.buyerType || "CTO / technical leader",
      service: assessmentForm.dataset.contactService || "Not sure yet",
      urgency: assessmentForm.dataset.urgency || "Within 30 days",
      engagement_type: assessmentForm.dataset.engagementType || "Assessment / healthcheck",
      expected_investment: assessmentForm.dataset.expectedInvestment || "Focused assessment or pilot",
      offer: assessmentForm.dataset.offer || assessmentKey,
      assessment_id: assessmentId,
      assessment_score: String(score),
      assessment_level: level,
      assessment_answers: answerSummary,
      utm_source: assessmentForm.dataset.internalSource || assessmentKey,
      utm_medium: "website",
      utm_campaign: assessmentForm.dataset.internalCampaign || `${assessmentKey}_completion`,
      utm_content: "assessment_result",
    });

    if (resultScore) {
      resultScore.textContent = `${score}/100`;
    }

    if (resultLevel) {
      resultLevel.textContent = level;
    }

    if (resultCopy) {
      resultCopy.textContent = copy;
    }

    if (resultLink) {
      resultLink.href = `index.html?${params.toString()}#contact`;
    }

    if (result) {
      result.hidden = false;
      result.focus();
    }

    if (!assessmentForm.dataset.assessmentCompleted) {
      assessmentForm.dataset.assessmentCompleted = "true";
      trackAnalyticsEvent("Assessment Completed", {
        ...eventAttribution(),
        assessment_id: assessmentId,
        assessment_score: score,
        assessment_level: level,
        service: assessmentForm.dataset.contactService || assessmentKey,
        offer: assessmentForm.dataset.offer || assessmentKey,
      });
    }
  });

  updateProgress();
});

const readinessChecklist = document.querySelector("[data-readiness-checklist]");

if (readinessChecklist) {
  const trackSelect = readinessChecklist.querySelector("[data-readiness-track]");
  const score = readinessChecklist.querySelector("[data-readiness-score]");
  const meter = readinessChecklist.querySelector("[data-readiness-meter]");
  const result = readinessChecklist.querySelector("[data-readiness-result]");
  const cta = readinessChecklist.querySelector("[data-readiness-cta]");
  const printButton = readinessChecklist.querySelector("[data-readiness-print]");

  result.setAttribute("aria-live", "polite");
  result.setAttribute("aria-atomic", "true");

  const updateReadiness = () => {
    const selectedTrack = trackSelect.value;

    readinessChecklist.querySelectorAll("[data-track-section]").forEach((section) => {
      section.hidden = section.dataset.trackSection !== selectedTrack;
    });

    const visibleItems = [...readinessChecklist.querySelectorAll("[data-readiness-item]")]
      .filter((item) => !item.closest("[data-track-section]")?.hidden);
    const completed = visibleItems.filter((item) => item.checked).length;
    const percentage = Math.round((completed / visibleItems.length) * 100);
    const scoreLabel = `${percentage}%`;

    score.textContent = scoreLabel;
    meter.style.width = scoreLabel;

    if (percentage < 50) {
      result.textContent = "Foundation gaps: build role fundamentals and practical evidence before exam-focused preparation.";
    } else if (percentage < 75) {
      result.textContent = "Developing readiness: use targeted training and labs to close the unchecked capabilities.";
    } else if (percentage < 90) {
      result.textContent = "Preparation-ready: focus the remaining study plan on the unchecked capabilities.";
    } else {
      result.textContent = "Strong self-assessed readiness: complete a final independent review before scheduling the exam.";
    }

    const query = new URLSearchParams({
      buyer_type: "Learning / enablement leader",
      service: "Claude certification preparation / bootcamp",
      engagement_type: "Team bootcamp / enablement",
      certification_track: selectedTrack,
      readiness_score: scoreLabel,
      utm_source: "readiness_checklist",
      utm_medium: "website",
      utm_campaign: "claude_certification_bootcamp",
      utm_content: "assessment_result",
    });

    cta.href = `index.html?${query.toString()}#contact`;
  };

  trackSelect.addEventListener("change", updateReadiness);
  readinessChecklist.addEventListener("change", (event) => {
    if (event.target.matches("[data-readiness-item]")) {
      updateReadiness();
    }
  });
  printButton.addEventListener("click", () => window.print());
  updateReadiness();
}

const claudeCostCalculator = document.querySelector("[data-claude-cost-calculator]");

if (claudeCostCalculator) {
  const requests = claudeCostCalculator.querySelector("[data-cost-requests]");
  const input = claudeCostCalculator.querySelector("[data-cost-input]");
  const output = claudeCostCalculator.querySelector("[data-cost-output]");
  const volume = claudeCostCalculator.querySelector("[data-cost-volume]");
  const breakdown = claudeCostCalculator.querySelector("[data-cost-breakdown]");
  const results = claudeCostCalculator.querySelector("[data-cost-results]");

  results.setAttribute("aria-live", "polite");
  results.setAttribute("aria-atomic", "true");
  const models = [
    { name: "Claude Fable 5", inputRate: 10, outputRate: 50, note: "Demanding reasoning and long-horizon agents" },
    { name: "Claude Opus 4.8", inputRate: 5, outputRate: 25, note: "Complex agentic coding and enterprise work" },
    { name: "Claude Sonnet 5", inputRate: 2, outputRate: 10, note: "Introductory pricing through August 31, 2026" },
    { name: "Claude Haiku 4.5", inputRate: 1, outputRate: 5, note: "Fast, high-volume, cost-sensitive work" },
  ];

  const numberValue = (field) => Math.max(0, Number(field.value) || 0);
  const formatMillions = (tokens) => `${(tokens / 1_000_000).toFixed(1)}M`;
  const formatMoney = (amount) => new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: amount < 100 ? 2 : 0,
  }).format(amount);

  const updateCostCalculator = () => {
    const monthlyRequests = numberValue(requests);
    const monthlyInput = monthlyRequests * numberValue(input);
    const monthlyOutput = monthlyRequests * numberValue(output);

    volume.textContent = `${formatMillions(monthlyInput + monthlyOutput)} tokens`;
    breakdown.textContent = `${formatMillions(monthlyInput)} input + ${formatMillions(monthlyOutput)} output tokens`;
    results.innerHTML = models.map((model) => {
      const inputCost = monthlyInput / 1_000_000 * model.inputRate;
      const outputCost = monthlyOutput / 1_000_000 * model.outputRate;
      return `<article class="calculator-result"><span>${model.name}</span><strong>${formatMoney(inputCost + outputCost)}</strong><p>${formatMoney(inputCost)} input + ${formatMoney(outputCost)} output per month.<br>${model.note}.</p></article>`;
    }).join("");
  };

  [requests, input, output].forEach((field) => field.addEventListener("input", updateCostCalculator));
  updateCostCalculator();
}

const enhanceResourceArchives = () => {
  document.querySelectorAll(".resource-list").forEach((list, listIndex) => {
    const items = [...list.querySelectorAll(":scope > article")];

    if (items.length <= 12) {
      return;
    }

    const listId = list.id || `resource-library-list-${listIndex + 1}`;
    const controls = document.createElement("div");
    const footer = document.createElement("div");
    const emptyState = document.createElement("p");
    const searchId = `${listId}-search`;
    let expanded = false;

    list.id = listId;
    list.classList.add("resource-list-enhanced");
    controls.className = "resource-library-tools";
    controls.innerHTML = `
      <label class="resource-search" for="${searchId}">
        <span>Find a guide</span>
        <input id="${searchId}" type="search" autocomplete="off" placeholder="Search topics, platforms, or outcomes">
      </label>
      <p class="resource-result-count" aria-live="polite"></p>
    `;

    footer.className = "resource-library-footer";
    footer.innerHTML = `
      <button class="resource-library-toggle" type="button" aria-controls="${listId}" aria-expanded="false"></button>
    `;
    emptyState.className = "resource-empty-state";
    emptyState.textContent = "No guides match that search.";
    emptyState.hidden = true;

    list.before(controls);
    list.after(emptyState, footer);

    const input = controls.querySelector("input");
    const count = controls.querySelector(".resource-result-count");
    const toggle = footer.querySelector(".resource-library-toggle");
    const initialLimit = () => window.matchMedia("(max-width: 640px)").matches ? 8 : 12;

    const update = () => {
      const query = input.value.trim().toLocaleLowerCase();
      const matchingItems = items.filter((item) => item.textContent.toLocaleLowerCase().includes(query));
      const visibleLimit = initialLimit();

      items.forEach((item, index) => {
        const matches = !query || matchingItems.includes(item);
        const withinLimit = Boolean(query) || expanded || index < visibleLimit;
        item.hidden = !(matches && withinLimit);
      });

      if (query) {
        count.textContent = `${matchingItems.length} matching ${matchingItems.length === 1 ? "guide" : "guides"}`;
      } else if (expanded) {
        count.textContent = `Showing all ${items.length} guides`;
      } else {
        count.textContent = `Showing ${Math.min(visibleLimit, items.length)} of ${items.length} guides`;
      }

      emptyState.hidden = matchingItems.length !== 0;
      footer.hidden = Boolean(query);
      toggle.textContent = expanded ? "Show fewer guides" : `Show all ${items.length} guides`;
      toggle.setAttribute("aria-expanded", expanded.toString());
    };

    input.addEventListener("input", update);
    toggle.addEventListener("click", () => {
      expanded = !expanded;
      update();

      if (!expanded && controls.getBoundingClientRect().top < 0) {
        controls.scrollIntoView({ block: "start" });
      }
    });
    window.matchMedia("(max-width: 640px)").addEventListener("change", update);
    update();
  });
};

enhanceResourceArchives();

const enhanceCommercialPageNavigation = () => {
  document.querySelectorAll(".commercial-detail-page main").forEach((main) => {
    if (main.querySelector(":scope > .page-section-nav")) {
      return;
    }

    const hero = main.querySelector(":scope > .page-hero");
    const sections = [...main.querySelectorAll(":scope > section[data-section-label]")];

    if (!hero || sections.length < 3) {
      return;
    }

    const nav = document.createElement("nav");
    const links = document.createElement("div");
    nav.className = "page-section-nav";
    nav.setAttribute("aria-label", "On this page");
    nav.innerHTML = "<strong>On this page</strong>";

    sections.forEach((section) => {
      const link = document.createElement("a");
      link.href = `#${section.id}`;
      link.textContent = section.dataset.sectionLabel;
      links.append(link);
    });

    nav.append(links);
    const scopeNavigation = hero.nextElementSibling?.classList.contains("service-scope-nav")
      ? hero.nextElementSibling
      : null;
    (scopeNavigation || hero).after(nav);

    const navLinks = [...links.querySelectorAll("a")];
    const setCurrent = (id) => {
      navLinks.forEach((link) => {
        if (link.hash === `#${id}`) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    };

    navLinks.forEach((link) => {
      link.addEventListener("click", () => setCurrent(link.hash.slice(1)));
    });

    if (window.location.hash && sections.some((section) => `#${section.id}` === window.location.hash)) {
      setCurrent(window.location.hash.slice(1));
    }

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

        if (visible) {
          setCurrent(visible.target.id);
        }
      }, { rootMargin: "-24% 0px -66%", threshold: 0 });

      sections.forEach((section) => observer.observe(section));
    }
  });
};

enhanceCommercialPageNavigation();

const enhanceCommercialCardDisclosures = () => {
  const mobileQuery = window.matchMedia("(max-width: 640px)");
  const disclosures = [];
  let disclosureId = 0;

  document.querySelectorAll(".commercial-detail-page").forEach((page) => {
    let hasExpandedCard = false;

    page.querySelectorAll(".service-grid, .service-detail-grid, .use-case-grid, .evidence-pattern-grid, .enablement-grid, .package-grid, .deliverable-grid, .decision-grid").forEach((grid) => {
      [...grid.querySelectorAll(":scope > article")].forEach((card, index) => {
        const title = card.querySelector(":scope > h3");

        if (!title || !title.nextSibling) {
          return;
        }

        const heading = document.createElement("div");
        const toggle = document.createElement("button");
        const detail = document.createElement("div");
        const id = `commercial-card-detail-${disclosureId += 1}`;
        let expanded = !hasExpandedCard;

        if (expanded) {
          hasExpandedCard = true;
        }

        heading.className = "commercial-card-heading";
        toggle.className = "commercial-disclosure-toggle";
        toggle.type = "button";
        toggle.title = `Show details for ${title.textContent.trim()}`;
        toggle.setAttribute("aria-controls", id);
        detail.className = "commercial-card-detail";
        detail.id = id;

        title.before(heading);
        heading.append(title, toggle);

        while (heading.nextSibling) {
          detail.append(heading.nextSibling);
        }

        card.append(detail);

        const sync = () => {
          const detailsVisible = !mobileQuery.matches || expanded;
          detail.hidden = !detailsVisible;
          toggle.setAttribute("aria-expanded", detailsVisible.toString());
          toggle.setAttribute("aria-label", `${detailsVisible ? "Hide" : "Show"} details for ${title.textContent.trim()}`);
          toggle.title = toggle.getAttribute("aria-label");
        };

        toggle.addEventListener("click", () => {
          expanded = !expanded;
          sync();
        });

        disclosures.push(sync);
        sync();
      });
    });
  });

  mobileQuery.addEventListener("change", () => disclosures.forEach((sync) => sync()));
};

enhanceCommercialCardDisclosures();

const enhanceFooterDisclosures = () => {
  const mobileQuery = window.matchMedia("(max-width: 640px)");
  const footerGroups = [...document.querySelectorAll(".site-footer details.footer-links")];

  if (!footerGroups.length) {
    return;
  }

  footerGroups.forEach((group) => {
    group.querySelector("summary")?.addEventListener("click", (event) => {
      if (!mobileQuery.matches) {
        event.preventDefault();
      }
    });
  });

  const sync = () => {
    footerGroups.forEach((group, index) => {
      group.open = mobileQuery.matches ? index === 0 : true;
    });
  };

  mobileQuery.addEventListener("change", sync);
  sync();
};

enhanceFooterDisclosures();

document.addEventListener("click", (event) => {
  const link = event.target.closest("a");

  if (!link) {
    return;
  }

  const rawHref = link.getAttribute("href") || "";
  const page = window.location.pathname;
  const eventAttribution = attributionEventData(readAttribution());
  const contactMethod = link.dataset.contactMethod
    || (rawHref.startsWith("mailto:")
    ? "email"
    : rawHref.startsWith("tel:")
      ? "phone"
      : rawHref.startsWith("/api/whatsapp")
        || rawHref.includes("wa.me/")
        || rawHref.includes("api.whatsapp.com")
        ? "whatsapp"
        : "");

  if (contactMethod) {
    trackAnalyticsEvent("Contact Method Clicked", {
      ...eventAttribution,
      method: contactMethod,
      page,
      context: link.dataset.contactContext || "page",
    });
    return;
  }

  let linkUrl;

  try {
    linkUrl = new URL(rawHref, window.location.href);
  } catch {
    return;
  }

  const conversationLink = link.textContent.trim() === "Start a conversation"
    || linkUrl.hash === "#contact"
    || linkUrl.hash === "#inquiry-form";

  if (link.dataset.funnelStage) {
    trackAnalyticsEvent("Funnel Step Clicked", {
      ...eventAttribution,
      page,
      content_id: document.body.dataset.contentId || "",
      content_group: document.body.dataset.contentGroup || "",
      cta_name: link.dataset.ctaName || link.textContent.trim().slice(0, 100),
      funnel_stage: link.dataset.funnelStage,
      next_stage: link.dataset.nextStage || "",
      target: `${linkUrl.pathname}${linkUrl.hash}`.slice(0, 255),
    });
  }

  if (link.dataset.offer) {
    trackAnalyticsEvent("Offer CTA Clicked", {
      ...eventAttribution,
      page,
      content_id: document.body.dataset.contentId || "",
      content_group: document.body.dataset.contentGroup || "",
      cta_name: link.dataset.ctaName || link.textContent.trim().slice(0, 100),
      offer: link.dataset.offer,
      funnel_stage: link.dataset.funnelStage || "commercial_offer",
      target: `${linkUrl.pathname}${linkUrl.hash}`.slice(0, 255),
      campaign: linkUrl.searchParams.get("utm_campaign") || "",
      content: linkUrl.searchParams.get("utm_content") || "",
    });
    return;
  }

  if (conversationLink) {
    const location = link.closest(".site-header")
      ? "header"
      : link.closest(".hero, .page-hero")
        ? "hero"
        : "page";

    trackAnalyticsEvent("Conversation CTA Clicked", {
      ...eventAttribution,
      location,
      page,
    });
    return;
  }

  const measurableCta = link.matches(".button, .header-cta")
    || link.closest(".article-next")
    || link.matches(".resource-list article > a")
    || link.closest(".service-card h3");

  if (measurableCta && linkUrl.hostname === window.location.hostname) {
    trackAnalyticsEvent("CTA Clicked", {
      ...eventAttribution,
      page,
      target: `${linkUrl.pathname}${linkUrl.hash}`.slice(0, 255),
    });
  }
});

const year = document.querySelector("#year");

if (year) {
  year.textContent = new Date().getFullYear().toString();
}

document.querySelectorAll(".site-header").forEach((header) => {
  const toggle = header.querySelector(".menu-toggle");
  const nav = header.querySelector(".nav");
  const navLinks = header.querySelectorAll(".nav a");
  const dropdowns = header.querySelectorAll(".has-dropdown");
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const normalizePage = (page) => (page || "index.html").replace(/\.html$/, "");

  const closeDropdowns = () => {
    dropdowns.forEach((dropdown) => {
      dropdown.classList.remove("dropdown-open");
      dropdown.querySelector(".nav-trigger")?.setAttribute("aria-expanded", "false");
    });
  };

  if (!toggle || !nav) {
    return;
  }

  if (!nav.id) {
    nav.id = "primary-navigation";
  }

  toggle.setAttribute("aria-controls", nav.id);

  const closeMenu = ({ returnFocus = false } = {}) => {
    const wasOpen = header.classList.contains("nav-open");

    header.classList.remove("nav-open");
    closeDropdowns();
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");

    if (returnFocus && wasOpen) {
      toggle.focus();
    }
  };

  navLinks.forEach((link) => {
    const linkUrl = new URL(link.getAttribute("href"), window.location.href);
    const linkPage = linkUrl.pathname.split("/").pop() || "index.html";
    const hashMatches = linkUrl.hash && linkUrl.hash === window.location.hash;
    const pageOnlyLink = !linkUrl.hash;

    if (normalizePage(linkPage) === normalizePage(currentPage) && (pageOnlyLink || hashMatches)) {
      link.setAttribute("aria-current", "page");
      link.closest(".has-dropdown")?.classList.add("current-section");
    }
  });

  if (!nav.querySelector('[aria-current="page"]')) {
    const servicePages = new Set([
      "partners",
      "under-your-brand-data-operations",
      "white-label-ai-delivery-partner",
      "data-operations",
      "emergency-dba-support",
      "database-handover-support",
      "ai-workflows",
      "ai-model-training",
      "ai-readiness-assessment-model-selection",
      "anthropic",
    ]);
    const companyPages = new Set(["about", "who-we-serve", "partner-brief", "privacy", "terms"]);
    const normalizedCurrentPage = normalizePage(currentPage);
    const sectionLabel = document.body.classList.contains("article-page")
      ? "Resources"
      : servicePages.has(normalizedCurrentPage)
        ? "Services"
        : companyPages.has(normalizedCurrentPage)
          ? "Company"
          : "";

    if (sectionLabel) {
      const sectionTrigger = [...header.querySelectorAll(".nav-trigger")]
        .find((trigger) => trigger.textContent.trim() === sectionLabel);

      sectionTrigger?.closest(".has-dropdown")?.classList.add("current-section");
    }
  }

  toggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", isOpen.toString());
    toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  dropdowns.forEach((dropdown) => {
    const trigger = dropdown.querySelector(".nav-trigger");

    if (!trigger) {
      return;
    }

    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      const isOpen = dropdown.classList.toggle("dropdown-open");
      trigger.setAttribute("aria-expanded", isOpen.toString());

      dropdowns.forEach((otherDropdown) => {
        if (otherDropdown === dropdown) {
          return;
        }

        otherDropdown.classList.remove("dropdown-open");
        otherDropdown.querySelector(".nav-trigger")?.setAttribute("aria-expanded", "false");
      });
    });
  });

  document.addEventListener("click", (event) => {
    if (!header.contains(event.target)) {
      closeMenu();
      return;
    }

    if (!event.target.closest(".has-dropdown")) {
      closeDropdowns();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    if (header.classList.contains("nav-open")) {
      closeMenu({ returnFocus: true });
      return;
    }

    const openTrigger = header.querySelector('.has-dropdown.dropdown-open .nav-trigger');
    closeDropdowns();
    openTrigger?.focus();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) {
      closeMenu();
    }
  });
});
