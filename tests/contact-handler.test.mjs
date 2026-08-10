import assert from "node:assert/strict";
import {
  classifyAcquisitionChannel,
  classifyLead,
  confirmationUrl,
  handleContact,
  inquiryPayload,
  inquiryRecipient,
  inquirySubject,
  inquiryText,
  isAiInquiry,
  scoreInquiry,
} from "../api/contact.js";

const incompleteForm = new FormData();
incompleteForm.set("name", "Test inquiry");

const emptyBodyResponse = await handleContact(new Request("https://datrick.com/api/contact", {
  method: "POST",
}));

assert.equal(emptyBodyResponse.status, 400);
assert.equal(await emptyBodyResponse.text(), "Missing required field: name.");

const invalidResponse = await handleContact(new Request("https://datrick.com/api/contact", {
  method: "POST",
  body: incompleteForm,
}));

assert.equal(invalidResponse.status, 400);
assert.equal(await invalidResponse.text(), "Missing required field: work email.");

const whitespaceForm = new FormData();
whitespaceForm.set("name", "   ");
whitespaceForm.set("email", "buyer@example.com");
whitespaceForm.set("buyer_type", "CTO / technical leader");
whitespaceForm.set("service", "Database operations");
whitespaceForm.set("urgency", "Within 30 days");
whitespaceForm.set("expected_investment", "Focused assessment or pilot");
whitespaceForm.set("message", "\n\t");

const whitespaceResponse = await handleContact(new Request("https://datrick.com/api/contact", {
  method: "POST",
  body: whitespaceForm,
}));

assert.equal(whitespaceResponse.status, 400);
assert.equal(await whitespaceResponse.text(), "Missing required field: name.");

const requiredBase = {
  name: "Qualified buyer",
  email: "buyer@example.com",
  buyer_type: "CTO / technical leader",
  service: "Database operations",
  urgency: "Within 30 days",
  expected_investment: "Focused assessment or pilot",
  message: "We need a controlled database operating model.",
};

for (const [field, expected] of [["email", "work email"], ["message", "situation"]]) {
  const form = new FormData();
  for (const [key, value] of Object.entries(requiredBase)) form.set(key, value);
  form.set(field, "   ");
  const response = await handleContact(new Request("https://datrick.com/api/contact", { method: "POST", body: form }));
  assert.equal(response.status, 400);
  assert.equal(await response.text(), `Missing required field: ${expected}.`);
}

const noInvestmentForm = new FormData();
noInvestmentForm.set("name", "Qualified buyer");
noInvestmentForm.set("email", "buyer@example.com");
noInvestmentForm.set("buyer_type", "CTO / technical leader");
noInvestmentForm.set("service", "AI workflow automation");
noInvestmentForm.set("urgency", "Within 30 days");
noInvestmentForm.set("message", "We need to scope a production workflow and its operating controls.");

const noInvestmentResponse = await handleContact(new Request("https://datrick.com/api/contact", {
  method: "POST",
  body: noInvestmentForm,
}));

assert.equal(noInvestmentResponse.status, 400);
assert.equal(await noInvestmentResponse.text(), "Missing required field: preferred starting point.");

const botForm = new FormData();
botForm.set("_honey", "automated submission");

const botResponse = await handleContact(new Request("https://datrick.com/api/contact", {
  method: "POST",
  body: botForm,
}));

assert.equal(botResponse.status, 303);
assert.equal(botResponse.headers.get("location"), "https://datrick.com/thank-you.html?lead_category=filtered");

const aiForm = new FormData();
aiForm.set("service", "AI value, model selection, and integration assessment");

assert.equal(inquiryRecipient(aiForm), "ai@datrick.com");
assert.equal(isAiInquiry({ service: "AI workflow automation" }), true);
assert.equal(isAiInquiry({ service: "Database operations" }), false);

const dataForm = new FormData();
dataForm.set("service", "Database operations");

assert.equal(inquiryRecipient(dataForm), "info@datrick.com");

const attributedOfferForm = new FormData();
attributedOfferForm.set("entry_offer", "managed_ai_operations");
attributedOfferForm.set("service", "AI workflow automation");
assert.match(inquiryText(attributedOfferForm), /Entry offer: managed_ai_operations/);

const vendorForm = new FormData();
vendorForm.set("service", "AI value, model selection, and integration assessment");
vendorForm.set("urgency", "Immediately / this week");
vendorForm.set("buyer_type", "IT service firm / agency");
vendorForm.set("company", "Vendor Co");
vendorForm.set("message", "We help businesses with web design. I took a quick look at your website and found opportunities to improve it. Book a call at https://calendar.vendor.example/");

assert.equal(inquiryRecipient(vendorForm), "info@datrick.com");
assert.match(inquirySubject(vendorForm), /^\[VENDOR 0\]/);
assert.doesNotMatch(inquirySubject(vendorForm), /URGENT|AI /);

const coldAgencyPitch = {
  service: "AI workflow automation",
  urgency: "Immediately / this week",
  engagement_type: "Urgent support",
  expected_investment: "$30,000+ transformation or dedicated team",
  buyer_type: "CTO / technical leader",
  company: "Melotto Group",
  phone: "+1 555 0100",
  message: "I came across your company and wanted to connect. We can help improve your lead generation through SEO services and appointment setting. Schedule a call to learn more.",
};
const coldAgencyIntent = scoreInquiry(coldAgencyPitch);

assert.equal(coldAgencyIntent.level, "Vendor");
assert.equal(coldAgencyIntent.score, 0);
assert.ok(coldAgencyIntent.signals.includes("cold outreach language"));
assert.ok(coldAgencyIntent.signals.includes("promotional service offer"));

const legitimatePartnerNeed = scoreInquiry({
  service: "Partner AI delivery under your brand",
  urgency: "Within 30 days",
  engagement_type: "Ongoing operations program",
  expected_investment: "$15,000-$30,000 monthly program",
  buyer_type: "IT service firm / agency",
  company: "Qualified IT Partner",
  phone: "+1 555 0199",
  message: "We need help with an AI delivery program for our client and are looking for a delivery partner to work under our brand.",
});

assert.notEqual(legitimatePartnerNeed.level, "Vendor");
assert.ok(legitimatePartnerNeed.score >= 75);

assert.equal(classifyLead({ email: "qa@example.com", intent_level: "Hot" }), "test");
assert.equal(classifyLead({ traffic_type: "test", email: "buyer@company.com", intent_level: "Hot" }), "test");
assert.equal(classifyLead({ email: "buyer@company.com", intent_level: "Vendor" }), "vendor");
assert.equal(classifyLead({ email: "buyer@company.com", intent_level: "Hot" }), "commercial");
assert.equal(classifyAcquisitionChannel({ traffic_type: "test" }), "Internal");
assert.equal(classifyAcquisitionChannel({ gclid: "test-click-id" }), "Paid");
assert.equal(classifyAcquisitionChannel({ utm_medium: "organic" }), "Organic");
assert.equal(classifyAcquisitionChannel({ referrer: "www.google.com" }), "Organic");
assert.equal(classifyAcquisitionChannel({ utm_medium: "email" }), "Email");
assert.equal(classifyAcquisitionChannel({ referrer: "partner.example" }), "Referral");
assert.equal(
  confirmationUrl({ lead_category: "commercial", lead_id: "lead-123" }),
  "https://datrick.com/thank-you.html?lead_category=commercial&lead_id=lead-123",
);

const controlledTestForm = new FormData();
controlledTestForm.set("lead_id", "lead-controlled-qa");
controlledTestForm.set("traffic_type", "test");
controlledTestForm.set("name", "QA controlled test");
controlledTestForm.set("email", "qa@test.invalid");
controlledTestForm.set("buyer_type", "CTO / technical leader");
controlledTestForm.set("service", "Database operations");
controlledTestForm.set("urgency", "Within 30 days");
controlledTestForm.set("engagement_type", "Assessment / healthcheck");
controlledTestForm.set("expected_investment", "Focused assessment or pilot");
controlledTestForm.set("message", "Controlled validation of the revenue funnel. No human follow-up or email should be sent.");

const testPayload = inquiryPayload(controlledTestForm);
assert.equal(testPayload.lead_category, "test");
assert.equal(testPayload.lifecycle_status, "Test");

const assessedCommercialForm = new FormData();
for (const [key, value] of controlledTestForm.entries()) {
  assessedCommercialForm.set(key, value);
}
assessedCommercialForm.set("name", "Qualified buyer");
assessedCommercialForm.set("email", "buyer@company.com");
assessedCommercialForm.set("traffic_type", "external");
assessedCommercialForm.set("assessment_id", "database-health-123");
assessedCommercialForm.set("assessment_score", "40");
assessedCommercialForm.set("assessment_level", "Material evidence gaps");
const assessedPayload = inquiryPayload(assessedCommercialForm);
assert.equal(assessedPayload.lead_category, "commercial");
assert.match(assessedPayload.intent_signals, /assessment completed \+6/);

const controlledTestResponse = await handleContact(new Request("https://datrick.com/api/contact", {
  method: "POST",
  body: controlledTestForm,
}));

assert.equal(controlledTestResponse.status, 303);
assert.equal(
  controlledTestResponse.headers.get("location"),
  "https://datrick.com/thank-you.html?lead_category=test&lead_id=lead-controlled-qa",
);

console.log("contact-handler tests passed");
