"use client";

import { useMemo, useState } from "react";
import { ExternalLink, Radio, ShieldAlert } from "lucide-react";
import { Badge, Card } from "@/components/ui";

type Signal = {
  id: string;
  date: string;
  country: string;
  platform: string;
  account: string;
  accountEn: string;
  priority: string;
  title: string;
  titleEn: string;
  summary: string;
  summaryEn: string;
  impact: string;
  impactEn: string;
  url: string;
  sourceMessageIds?: string[];
};

type TelegramItem = {
  id: string;
  date: string;
  country: string;
  account: string;
  handle: string;
  category: string;
  tier: string;
  priority: string;
  title: string;
  titleEn: string;
  summary: string;
  summaryEn: string;
  views: number;
  forwards: number;
  url: string;
};

type TelegramFeedData = {
  generatedAt: string | null;
  windowDays: number;
  messageCount: number;
  items: TelegramItem[];
};

type UnifiedSignal = {
  id: string;
  date: string;
  country: string;
  countryEn: string;
  platform: string;
  account: string;
  accountEn: string;
  category?: string;
  categoryEn?: string;
  priority: string;
  title: string;
  titleEn: string;
  summary: string;
  summaryEn: string;
  impact?: string;
  impactEn?: string;
  url: string;
  reviewed: boolean;
  views?: number;
  forwards?: number;
};

const countryNames: Record<string, string> = { "伊拉克": "Iraq", "约旦": "Jordan", "黎巴嫩": "Lebanon" };
const categoryNames: Record<string, string> = {
  "通信部": "Ministry of Communications",
  "通信监管": "Telecom regulation",
  "政府官员": "Government official",
  "政府机构": "Government institution",
  "官方动态": "Official update"
};
const accountNames: Record<string, string> = {
  "伊拉克通信部": "Iraq Ministry of Communications",
  "伊拉克通信与媒体委员会 CMC": "Iraq Communications and Media Commission",
  "伊拉克外交部": "Iraq Ministry of Foreign Affairs",
  "伊拉克国防部": "Iraq Ministry of Defence",
  "伊拉克内政部": "Iraq Ministry of Interior",
  "伊拉克高等教育与科研部": "Iraq Ministry of Higher Education and Scientific Research"
};
const priorityOrder: Record<string, number> = { "最高": 3, "高": 2, "中": 1 };

function platformInEnglish(platform: string) {
  return platform.replace("官网", "Official website").replace("Telegram Public Web", "Telegram");
}

export function SocialSignals({ signals, telegramFeed, language }: { signals: Signal[]; telegramFeed: TelegramFeedData; language: "zh" | "en" }) {
  const [showAll, setShowAll] = useState(false);

  const merged = useMemo(() => {
    const reviewedTelegramIds = new Set(signals.flatMap((signal) => signal.sourceMessageIds || []));
    const reviewedUrls = new Set(signals.map((signal) => signal.url));
    const reviewed: UnifiedSignal[] = signals.map((signal) => ({
      ...signal,
      countryEn: countryNames[signal.country] || signal.country,
      reviewed: true
    }));
    const automatic: UnifiedSignal[] = telegramFeed.items
      .filter((item) => !reviewedTelegramIds.has(item.id) && !reviewedUrls.has(item.url))
      .map((item) => ({
        ...item,
        countryEn: countryNames[item.country] || item.country,
        accountEn: accountNames[item.account] || item.account,
        categoryEn: categoryNames[item.category] || item.category,
        platform: "Telegram",
        reviewed: false
      }));
    return [...reviewed, ...automatic].sort((a, b) =>
      (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0)
      || b.date.localeCompare(a.date)
      || Number(b.reviewed) - Number(a.reviewed)
    );
  }, [signals, telegramFeed.items]);

  const isEnglish = language === "en";
  const visible = showAll ? merged : merged.slice(0, 12);
  const labels = isEnglish ? {
    title: "Priority social-media intelligence",
    subtitle: `Unified, deduplicated official updates from Telegram, X, Facebook and government websites · ${telegramFeed.windowDays}-day window`,
    count: `${merged.length} priority signals`,
    critical: "Critical",
    high: "High",
    medium: "Medium",
    reviewed: "Analyst reviewed",
    translated: "Translated · pending review",
    impact: "Business impact",
    pending: "Collected and translated automatically; pending cross-checking and business-impact assessment.",
    original: "Open official source",
    reads: "views",
    forwards: "forwards",
    showAll: `Show all ${merged.length}`,
    showLess: "Show top 12"
  } : {
    title: "重要社媒快讯",
    subtitle: `Telegram、X、Facebook 与政府官网统一聚合去重 · 最近 ${telegramFeed.windowDays} 天`,
    count: `${merged.length} 条重要信号`,
    critical: "最高",
    high: "高",
    medium: "中",
    reviewed: "已研判",
    translated: "已翻译 · 待研判",
    impact: "业务影响",
    pending: "已完成自动采集与中英翻译，正在等待交叉验证和商业影响研判。",
    original: "查看官方原文",
    reads: "阅读",
    forwards: "转发",
    showAll: `查看全部 ${merged.length} 条`,
    showLess: "仅显示前 12 条"
  };

  const priorityLabel = (priority: string) => priority === "最高" ? labels.critical : priority === "高" ? labels.high : labels.medium;

  return <section style={{ marginBottom: 18 }}>
    <div className="section-head signal-section-head" style={{ marginBottom: 10 }}>
      <div>
        <div className="section-title"><Radio size={14} style={{ display: "inline", marginRight: 6 }}/>{labels.title}</div>
        <div className="section-sub">{labels.subtitle}</div>
      </div>
      <div className="signal-head-actions">
        <Badge tone="green">{labels.count}</Badge>
      </div>
    </div>
    <div className="signal-grid">
      {visible.map((item) => <Card className={`signal-card ${item.reviewed ? "reviewed" : "automatic"}`} key={item.id}>
        <div className="feed-meta">
          <span>{item.date}</span><span>·</span><span>{isEnglish ? item.countryEn : item.country}</span>
          {item.category && <><span>·</span><span>{isEnglish ? item.categoryEn : item.category}</span></>}
          <Badge tone={item.priority === "最高" ? "red" : item.priority === "高" ? "default" : "green"}>{priorityLabel(item.priority)}</Badge>
          <Badge tone={item.reviewed ? "green" : "amber"}>{item.reviewed ? labels.reviewed : labels.translated}</Badge>
        </div>
        <h3 className="news-title">{isEnglish ? item.titleEn : item.title}</h3>
        <p className="news-text">{isEnglish ? item.summaryEn : item.summary}</p>
        <div className={item.reviewed ? "opportunity" : "signal-pending"}>
          <ShieldAlert size={13}/><span><strong>{labels.impact}: </strong>{item.reviewed ? (isEnglish ? item.impactEn : item.impact) : labels.pending}</span>
        </div>
        <div className="feed-meta" style={{ marginTop: 10 }}>
          <span>{isEnglish ? platformInEnglish(item.platform) : item.platform}</span><span>·</span><span>{isEnglish ? item.accountEn : item.account}</span>
          {item.views ? <span>{item.views.toLocaleString()} {labels.reads}</span> : null}
          {item.forwards ? <span>{item.forwards.toLocaleString()} {labels.forwards}</span> : null}
        </div>
        <a className="feed-link" href={item.url} target="_blank" rel="noreferrer">{labels.original} <ExternalLink size={11} style={{ display: "inline" }}/></a>
      </Card>)}
    </div>
    {merged.length > 12 && <div className="signal-more"><button type="button" className="button secondary" onClick={() => setShowAll((value) => !value)}>{showAll ? labels.showLess : labels.showAll}</button></div>}
  </section>;
}
