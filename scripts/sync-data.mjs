import fs from "node:fs/promises";
import * as cheerio from "cheerio";

const peopleHtml = await fs.readFile("personnel-monitoring.html", "utf8");
const match = peopleHtml.match(/const people=(\[.*?\]);let country=/s);
if (!match) throw new Error("Unable to extract personnel data");
const people = JSON.parse(match[1]);

const reportHtml = await fs.readFile("legacy/w35-36.html", "utf8");
const $ = cheerio.load(reportHtml);
const summary = $(".ov-list li").map((_, el) => $(el).text().replace(/\s+/g, " ").trim()).get();
const report = { issue: "W35-36", period: "2026-08-24—2026-09-04", generated: "2026-09-06", summary, countries: {} };
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

const sources = [
  {handle:"mociraq2023",name:"伊拉克通信部",owner:"Mustafa Sanad",country:"伊拉克",posts14d:10,tier:"T1",status:"正常"},
  {handle:"iraqcmc",name:"伊拉克通信与媒体委员会",owner:"Baligh Abu Kalal",country:"伊拉克",posts14d:16,tier:"T1",status:"正常"},
  {handle:"iqmofa",name:"伊拉克外交部",owner:"Fuad Hussein",country:"伊拉克",posts14d:22,tier:"T1",status:"正常"},
  {handle:"MODiraq",name:"伊拉克国防部",owner:"机构账号",country:"伊拉克",posts14d:21,tier:"T2",status:"正常"},
  {handle:"moiiraqi",name:"伊拉克内政部",owner:"机构账号",country:"伊拉克",posts14d:98,tier:"T2",status:"正常"},
  {handle:"moheiq",name:"伊拉克高等教育与科研部",owner:"机构账号",country:"伊拉克",posts14d:18,tier:"T2",status:"正常"}
];

await fs.mkdir("data", { recursive: true });
await fs.writeFile("data/people.json", JSON.stringify(people, null, 2));
await fs.writeFile("data/report.json", JSON.stringify(report, null, 2));
await fs.writeFile("data/sources.json", JSON.stringify(sources, null, 2));
console.log(`Synced ${people.length} people, ${summary.length} summary items and ${sources.length} Telegram sources.`);
