import fs from "node:fs";

const telegramFeed = JSON.parse(fs.readFileSync("data/telegram-feed.json", "utf8"));
const socialSignals = JSON.parse(fs.readFileSync("data/social-signals.json", "utf8"));
const arabicPattern = /[\u0600-\u06ff]/;

function validateBilingualItem(item, fields, label) {
  for (const field of fields) {
    if (!item[field] || typeof item[field] !== "string") {
      throw new Error(`${label} is missing ${field}: ${item.id}`);
    }
    if (arabicPattern.test(item[field])) {
      throw new Error(`${label} contains Arabic text in ${field}: ${item.id}`);
    }
  }
}

for (const item of telegramFeed.items) {
  validateBilingualItem(item, ["title", "summary", "titleEn", "summaryEn"], "Public Telegram item");
  if (item.translationStatus !== "双语已完成") {
    throw new Error(`Public Telegram item is not bilingual-gated: ${item.id}`);
  }
}

for (const item of socialSignals) {
  validateBilingualItem(item, ["title", "summary", "impact", "titleEn", "summaryEn", "impactEn"], "Reviewed social signal");
}

if (telegramFeed.messageCount !== telegramFeed.items.length) {
  throw new Error("Public Telegram message count does not match translated items");
}

console.log(`Public language validation passed: ${telegramFeed.items.length + socialSignals.length} bilingual social signals, no Arabic text.`);
