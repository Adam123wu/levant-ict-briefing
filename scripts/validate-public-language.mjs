import fs from "node:fs";

const telegramFeed = JSON.parse(fs.readFileSync("data/telegram-feed.json", "utf8"));
const arabicPattern = /[\u0600-\u06ff]/;

for (const item of telegramFeed.items) {
  if (arabicPattern.test(item.title) || arabicPattern.test(item.summary)) {
    throw new Error(`Public Telegram item contains Arabic text: ${item.id}`);
  }
  if (item.language !== "中文" || item.translationStatus !== "已翻译") {
    throw new Error(`Public Telegram item is not translation-gated: ${item.id}`);
  }
}

if (telegramFeed.messageCount !== telegramFeed.items.length) {
  throw new Error("Public Telegram message count does not match translated items");
}

console.log(`Public language validation passed: ${telegramFeed.items.length} Chinese Telegram items, no Arabic text.`);
