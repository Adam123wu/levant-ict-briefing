"use client";

import { useState } from "react";
import { Badge, Card } from "@/components/ui";
import { ChevronDown, ExternalLink } from "lucide-react";

type Item = {
  title: string;
  titleEn: string;
  date: string;
  badge: string;
  text: string;
  textEn: string;
  opportunity: string;
  opportunityEn: string;
  links: {label: string; url: string}[];
};
type Country = {
  name: string;
  nameEn: string;
  flag: string;
  sections: {category: string; categoryEn: string; items: Item[]}[];
};

function englishBadge(badge: string) {
  if (!badge) return "";
  if (badge.includes("未核验")) return "Unverified";
  if (badge.includes("三源") || badge.includes("双源") || badge.includes("核验")) return "Cross-checked";
  if (badge.includes("官方")) return "Official source";
  return "Source verified";
}

export function BriefingView({ countries, language }: {countries: Record<string, Country>; language: "zh" | "en"}) {
  const [country, setCountry] = useState("iq");
  const [open, setOpen] = useState<Record<string, boolean>>({"0": true});
  const current = countries[country];
  const isEnglish = language === "en";

  return <>
    <div className="tabs">
      {Object.entries(countries).map(([key, item]) => <button key={key} data-country={key} aria-pressed={country === key} className={`tab ${country === key ? "active" : ""}`} onClick={() => { setCountry(key); setOpen({"0": true}); }}>
        {item.flag} {isEnglish ? item.nameEn : item.name}
      </button>)}
    </div>
    <div className="accordion" key={country}>
      {current.sections.map((section, index) => {
        const active = !!open[index];
        return <Card className="accordion-section" key={`${country}-${index}-${section.category}`}>
          <button className="accordion-trigger" onClick={() => setOpen((value) => ({...value, [index]: !value[index]}))}>
            <span className="accordion-title">{isEnglish ? section.categoryEn : section.category}</span>
            <span style={{display: "flex", alignItems: "center", gap: 8}}><Badge>{section.items.length} {isEnglish ? "items" : "条"}</Badge><ChevronDown size={15} style={{transform: active ? "rotate(180deg)" : "none", transition: ".18s"}}/></span>
          </button>
          {active && <div className="accordion-body">
            {section.items.map((item, itemIndex) => <article className="news-card" key={`${country}-${section.category}-${item.title}-${itemIndex}`}>
              <div className="feed-meta"><span>{item.date || (isEnglish ? "Current period" : "本期")}</span>{item.badge && <Badge tone="green">{isEnglish ? englishBadge(item.badge) : item.badge}</Badge>}</div>
              <h3 className="news-title">{isEnglish ? item.titleEn : item.title}</h3>
              <p className="news-text">{isEnglish ? item.textEn : item.text}</p>
              {item.links?.map((link) => <a className="feed-link" href={link.url} target="_blank" rel="noreferrer" key={link.url}>{isEnglish ? "Source" : link.label} <ExternalLink size={11} style={{display: "inline"}}/></a>)}
              {item.opportunity && <div className="opportunity">{isEnglish ? item.opportunityEn : item.opportunity}</div>}
            </article>)}
          </div>}
        </Card>;
      })}
    </div>
  </>;
}
