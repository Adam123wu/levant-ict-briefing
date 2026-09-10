"use client";

import type { ComponentProps } from "react";
import Link from "next/link";
import { Languages, Scale } from "lucide-react";
import { BriefingView } from "@/components/briefing-view";
import { SocialSignals } from "@/components/social-signals";
import { useLanguage } from "@/components/language-context";

type Props = {
  report: {
    issue: string;
    period: string;
    periodEn: string;
    sourceFile: string;
    stats: {news: number; opportunities: number};
    countries: ComponentProps<typeof BriefingView>["countries"];
  };
  signals: ComponentProps<typeof SocialSignals>["signals"];
  telegramFeed: ComponentProps<typeof SocialSignals>["telegramFeed"];
};

export function BriefingsPageContent({ report, signals, telegramFeed }: Props) {
  const { language, setLanguage } = useLanguage();
  const isEnglish = language === "en";

  return <>
    <div className="hero briefing-hero">
      <div>
        <div className="eyebrow">Biweekly Briefing · {report.issue.replace("-", "—")}</div>
        <h1>{isEnglish ? "ICT Biweekly Briefing" : "ICT 双周简报"}</h1>
        <p>{isEnglish
          ? `${report.periodEn} · ${report.stats.news} validated news items · ${report.stats.opportunities} opportunity signals`
          : `${report.period} · ${report.stats.news}条有效新闻 · ${report.stats.opportunities}个商机信号`}</p>
      </div>
      <div className="top-actions briefing-actions">
        <div className="language-toggle language-toggle-global" aria-label="Language / 语言">
          <Languages size={13}/>
          <button type="button" className={language === "zh" ? "active" : ""} aria-pressed={language === "zh"} onClick={() => setLanguage("zh")}>中文</button>
          <button type="button" className={language === "en" ? "active" : ""} aria-pressed={language === "en"} onClick={() => setLanguage("en")}>English</button>
        </div>
        <Link className="button" href="/compliance"><Scale size={14}/>{isEnglish ? "Compliance & business environment" : "合规与营商分析"}</Link>
        <a className="button secondary" href={`../archive/${report.sourceFile}`}>{isEnglish ? "Original long-form report" : "查看原版长报告"}</a>
      </div>
    </div>
    <SocialSignals signals={signals} telegramFeed={telegramFeed} language={language}/>
    <BriefingView countries={report.countries} language={language}/>
  </>;
}
