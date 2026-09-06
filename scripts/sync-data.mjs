import fs from "node:fs/promises";
import * as cheerio from "cheerio";

const peopleHtml = await fs.readFile("personnel-monitoring.html", "utf8");
const match = peopleHtml.match(/const people=(\[.*?\]);let country=/s);
if (!match) throw new Error("Unable to extract personnel data");
const people = JSON.parse(match[1]);
const peopleSocialOverrides = JSON.parse(await fs.readFile("config/people-social-overrides.json", "utf8"));
for (const override of peopleSocialOverrides) {
  const person = people.find((candidate) => candidate.country === override.country && candidate.name === override.name);
  if (person) Object.assign(person, override, { verified: new Date().toISOString().slice(0, 10) });
}

const reportFiles = (await fs.readdir("legacy"))
  .filter((name) => /^w\d+-\d+\.html$/i.test(name))
  .sort((a, b) => {
    const aw = a.match(/\d+/g).map(Number);
    const bw = b.match(/\d+/g).map(Number);
    return bw[0] - aw[0] || bw[1] - aw[1];
  });
if (!reportFiles.length) throw new Error("No briefing found in legacy/");
const latestReport = reportFiles[0];
const reportHtml = await fs.readFile(`legacy/${latestReport}`, "utf8");
const $ = cheerio.load(reportHtml);
const summary = $(".ov-list li").map((_, el) => $(el).text().replace(/\s+/g, " ").trim()).get();
const issue = latestReport.replace(/\.html$/i, "").toUpperCase();
const generatedMatch = $(".top-meta").first().text().match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
const generated = generatedMatch
  ? `${generatedMatch[1]}-${generatedMatch[2].padStart(2, "0")}-${generatedMatch[3].padStart(2, "0")}`
  : new Date().toISOString().slice(0, 10);
const period = $(".retro-date").first().text().replace(/\s+/g, " ").trim() || "最近完整14天";
const report = { issue, period, generated, sourceFile: latestReport, summary, countries: {}, stats: {} };
for (const [code, name] of [["iq","伊拉克"],["jo","约旦"],["lb","黎巴嫩"]]) {
  const root = $(`#tab-${code}`);
  const sections = [];
  root.find(".channels > .ch-card").each((_, card) => {
    const category = $(card).find(":scope > .ch-head .ch-lbl").first().text().trim();
    const items = [];
    $(card).find(":scope > .ch-body > .ni").each((_, item) => {
      const title = $(item).find(".ni-title").first().text().replace(/\s+/g, " ").trim();
      if (!title) return;
      items.push({
        title,
        date: $(item).find(".ni-date").first().text().trim(),
        badge: $(item).find(".vbadge,.sbadge,.unverified").first().text().trim(),
        text: $(item).find(".ni-text").first().text().replace(/\s+/g, " ").trim(),
        opportunity: $(item).find(".opp-box").first().text().replace(/\s+/g, " ").trim(),
        links: $(item).find(".ni-src a").map((_, a) => ({ label: $(a).text().replace(/^→\s*/, "").trim(), url: $(a).attr("href") })).get()
      });
    });
    if (items.length) sections.push({ category, items });
  });
  report.countries[code] = { name, sections };
}
const kpis = Object.fromEntries($(".kpi").map((_, card) => [[$(card).find(".kpi-lbl").text().trim(), Number($(card).find(".kpi-val").text().trim())]]).get());
const countryCounts = Object.fromEntries(Object.keys(report.countries).map((code) => {
  const stated = $(`#tab-${code} .flag-badge`).first().text().match(/(\d+)\s*条新闻/);
  return [code, stated ? Number(stated[1]) : 0];
}));
const allItems = Object.values(report.countries).flatMap((country) => country.sections.flatMap((section) => section.items));
report.stats = {
  news: kpis["本期新闻"] || allItems.length,
  opportunities: kpis["商机信号"] || allItems.filter((item) => item.opportunity).length,
  telegram: allItems.filter((item) => item.badge.includes("Telegram") || item.links.some((link) => link.url?.includes("t.me/"))).length,
  countryCounts
};

const sources = JSON.parse(await fs.readFile("config/sources.json", "utf8"));
const socialSignals = JSON.parse(await fs.readFile("config/social-signals.json", "utf8"));

await fs.mkdir("data", { recursive: true });
await fs.writeFile("data/people.json", JSON.stringify(people, null, 2));
await fs.writeFile("data/report.json", JSON.stringify(report, null, 2));
await fs.writeFile("data/sources.json", JSON.stringify(sources, null, 2));
await fs.writeFile("data/social-signals.json", JSON.stringify(socialSignals, null, 2));

const archiveFiles = (await fs.readdir("public/archive"))
  .filter((name) => /^w\d+-\d+(?:-v\d+)?\.html$/i.test(name) && !/-v\d+\.html$/i.test(name))
  .sort((a, b) => {
    const aw = a.match(/\d+/g).map(Number);
    const bw = b.match(/\d+/g).map(Number);
    return bw[0] - aw[0] || bw[1] - aw[1];
  });
const archive = [];
for (const file of archiveFiles) {
  const html = await fs.readFile(`public/archive/${file}`, "utf8");
  const page = cheerio.load(html);
  const date = page(".top-meta").first().text().match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
  archive.push({
    week: file.replace(/\.html$/i, "").toUpperCase().replace("-", "—"),
    date: date ? `${date[1]}-${date[2].padStart(2, "0")}-${date[3].padStart(2, "0")}` : page(".retro-date").first().text().trim() || "历史期",
    file,
    current: file === latestReport
  });
}
await fs.writeFile("data/archive.json", JSON.stringify(archive, null, 2));
console.log(`Synced ${people.length} people, ${report.stats.news} news items, ${socialSignals.length} social signals, ${archive.length} archives and ${sources.length} multi-platform sources from ${latestReport}.`);
