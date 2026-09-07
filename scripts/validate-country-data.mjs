import fs from "node:fs";

const report = JSON.parse(fs.readFileSync("data/report.json", "utf8"));
const expected = { iq: ["伊拉克", "🇮🇶"], jo: ["约旦", "🇯🇴"], lb: ["黎巴嫩", "🇱🇧"] };
const titleSets = {};

for (const [code, [name, flag]] of Object.entries(expected)) {
  const country = report.countries[code];
  if (!country || country.name !== name || country.flag !== flag) throw new Error(`Invalid country metadata: ${code}`);
  if (!country.sections.length || country.sections.length > 11) throw new Error(`Invalid section boundary for ${code}: ${country.sections.length} sections`);
  const titles = country.sections.flatMap((section) => section.items.map((item) => item.title));
  if (!titles.length) throw new Error(`No news items for ${code}`);
  titleSets[code] = new Set(titles);
}

for (const [left, right] of [["iq", "jo"], ["iq", "lb"], ["jo", "lb"]]) {
  const duplicates = [...titleSets[left]].filter((title) => titleSets[right].has(title));
  if (duplicates.length) throw new Error(`Cross-country data leak ${left}/${right}: ${duplicates.join(" | ")}`);
}

console.log("Country panel validation passed: iq, jo and lb are isolated.");
