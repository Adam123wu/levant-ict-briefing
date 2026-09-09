import fs from "node:fs/promises";

const file = "config/iraq-legal-news.json";
const legalNews = JSON.parse(await fs.readFile(file, "utf8"));
const requiredOfficialHosts = new Set([
  "www.moj.gov.iq",
  "iq.parliament.iq",
  "www.sjc.iq",
  "cmc.iq",
  "cbi.iq",
  "tax.mof.gov.iq",
  "investpromo.gov.iq"
]);

const fail = (message) => { throw new Error(`${file}: ${message}`); };
const validDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value || "") && !Number.isNaN(Date.parse(value));

if (legalNews.country !== "伊拉克") fail("country must be 伊拉克");
if (!validDate(legalNews.generated)) fail("generated must be YYYY-MM-DD");
if (!validDate(legalNews.refresh?.windowStart) || !validDate(legalNews.refresh?.windowEnd) || !validDate(legalNews.refresh?.lastRun)) fail("refresh dates must be YYYY-MM-DD");
if (!Array.isArray(legalNews.sources) || legalNews.sources.length < 6) fail("at least six official sources are required");
if (!Array.isArray(legalNews.items) || legalNews.items.length === 0) fail("at least one legal update is required");

const sourceIds = new Set();
for (const source of legalNews.sources) {
  if (!source.id || sourceIds.has(source.id)) fail(`duplicate or missing source id: ${source.id || "(missing)"}`);
  sourceIds.add(source.id);
  let parsed;
  try { parsed = new URL(source.url); } catch { fail(`invalid source URL for ${source.id}`); }
  if (parsed.protocol !== "https:" || !requiredOfficialHosts.has(parsed.hostname)) fail(`non-official source URL for ${source.id}: ${source.url}`);
  if (source.tier !== "T1") fail(`${source.id} must be classified as T1`);
}

const itemIds = new Set();
for (const item of legalNews.items) {
  if (!item.id || itemIds.has(item.id)) fail(`duplicate or missing item id: ${item.id || "(missing)"}`);
  itemIds.add(item.id);
  if (!sourceIds.has(item.sourceId)) fail(`${item.id} references unknown sourceId ${item.sourceId}`);
  if (!validDate(item.date)) fail(`${item.id} has invalid date`);
  for (const field of ["title", "status", "summary", "legalEffect", "businessImpact"]) {
    if (!item[field]) fail(`${item.id} is missing ${field}`);
  }
  if (!Array.isArray(item.actions) || item.actions.length < 2) fail(`${item.id} needs at least two actions`);
  let parsed;
  try { parsed = new URL(item.url); } catch { fail(`${item.id} has invalid URL`); }
  if (!requiredOfficialHosts.has(parsed.hostname)) fail(`${item.id} must link to an official source`);
}

console.log(`Validated ${legalNews.items.length} Iraq legal updates against ${legalNews.sources.length} official T1 sources.`);
