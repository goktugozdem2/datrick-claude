import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const htmlFiles = fs.readdirSync(root).filter((file) => file.endsWith(".html"));
const footerFingerprints = new Set();
let tableCount = 0;
let shellPageCount = 0;

for (const file of htmlFiles) {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  const footer = html.match(/<footer class="site-footer"[\s\S]*?<\/footer>/)?.[0];

  if (html.includes('<nav class="nav"')) {
    shellPageCount += 1;
    assert.match(html, /<body\b[^>]*class="[^"]*content-role-(?:core|data|ai|proof|partner)[^"]*"/, `${file} must declare a content color role`);
    assert.ok(footer, `${file} must include the canonical footer`);
    assert.match(footer, /data-shell-version="2026-07-17"/, `${file} footer must use the canonical shell version`);
    assert.equal((footer.match(/<details class="footer-links" open>/g) || []).length, 3, `${file} footer must use three accessible disclosure groups`);
    footerFingerprints.add(footer
      .replace(/<a href="index\.html#contact">[\s\S]*?<\/a>/, '<a href="index.html#contact">Conversion action</a>')
      .replace(/\s+/g, " ")
      .trim());
  }

  const tableRegions = [...html.matchAll(/<div class="article-table-wrap"([^>]*)>([\s\S]*?)<\/table>\s*<\/div>/g)];

  for (const [, attributes, tableBody] of tableRegions) {
    tableCount += 1;
    assert.match(attributes, /role="region"/, `${file} table region must expose its purpose`);
    assert.match(attributes, /aria-label="[^"]+"/, `${file} table region must have a label`);
    assert.match(attributes, /tabindex="0"/, `${file} table region must be keyboard scrollable`);
    assert.match(tableBody, /<caption class="sr-only">[^<]+<\/caption>/, `${file} table must have a screen-reader caption`);

    for (const heading of tableBody.match(/<th\b[^>]*>/g) || []) {
      assert.match(heading, /scope="(?:col|row)"/, `${file} table headers must declare scope`);
    }
  }
}

const shellExclusions = new Set(["thank-you.html", "white-label-data-operations.html"]);
assert.equal(shellPageCount, htmlFiles.length - shellExclusions.size, "Every standard page should use the shared shell");
assert.equal(footerFingerprints.size, 1, "Footer content and structure must not drift between pages");
assert.ok(tableCount >= 359, "Every data table should retain its accessible scroll region");

const home = fs.readFileSync(path.join(root, "index.html"), "utf8");
assert.match(home, /id="inquiry-form-status"[^>]*role="status"[^>]*aria-live="polite"/, "Inquiry form must announce validation and submission state");

const styles = fs.readFileSync(path.join(root, "styles.css"), "utf8");
assert.match(styles, /body\.content-role-ai/, "Color roles must be represented in the shared stylesheet");
assert.match(styles, /\.button:disabled/, "Shared buttons must include a disabled state");
assert.match(styles, /\.form-row \[aria-invalid="true"\]/, "Invalid fields must have a visible state");
assert.match(styles, /\.process \.context-note,[\s\S]*?color: var\(--text-on-dark-muted\)/, "Dark process notes must retain accessible contrast");
assert.match(styles, /scrollbar-width: thin/, "Horizontal regions must expose a scroll affordance");
assert.match(styles, /@media \(min-width: 641px\) and \(max-width: 980px\)/, "Tablet layout must have an explicit composition");

const clientScript = fs.readFileSync(path.join(root, "script.js"), "utf8");
assert.match(clientScript, /setAttribute\("aria-invalid", "true"\)/, "Form validation must expose invalid state to assistive technology");
assert.match(clientScript, /setAttribute\("aria-busy", "true"\)/, "Form submission must expose its pending state");
assert.match(clientScript, /\.service-grid, \.service-detail-grid, \.use-case-grid/, "Commercial mobile disclosures must cover the shared card families");

console.log("design-system accessibility tests passed");
