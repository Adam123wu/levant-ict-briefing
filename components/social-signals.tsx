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
  topicIds?: string[];
  topicLabels?: string[];
  topicLabelsEn?: string[];
  targetSections?: string[];
  targetSectionsEn?: string[];
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
  topicIds?: string[];
  topicLabels?: string[];
  topicLabelsEn?: string[];
  targetSections?: string[];
  targetSectionsEn?: string[];
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

type TopicRule = {label: string; labelEn: string; categories: string[]; keywords: string[]; countries?: string[]};

const topicRules: TopicRule[] = [
  { label: "部委与监管动态", labelEn: "Ministry and regulator updates", categories: ["通信部", "通信监管", "政府官员", "政府机构", "数字政府", "政府决策"], keywords: [] },
  { label: "政治与选举", labelEn: "Politics and elections", categories: [], keywords: ["election", "parliament", "coalition", "cabinet", "appointment", "vote", "选举", "议会", "组阁", "任命"] },
  { label: "运营商动态", labelEn: "Operator developments", categories: ["运营商", "国家固网"], keywords: ["zain", "asiacell", "korek", "orange jordan", "umniah", "touch", "alfa", "ogero", "operator", "运营商"] },
  { label: "ICT 竞对动态", labelEn: "ICT competitor intelligence", categories: [], keywords: ["ericsson", "nokia", "zte", "samsung networks", "oracle", "aws", "microsoft", "google cloud", "中兴", "爱立信", "诺基亚"] },
  { label: "外部干预与地缘政治", labelEn: "Foreign intervention and geopolitics", categories: [], keywords: ["united states", "u.s.", "embassy", "state department", "ofac", "sanction", "iran", "美国", "大使馆", "制裁", "伊朗"] },
  { label: "华为媒体与声量", labelEn: "Huawei media coverage and sentiment", categories: [], keywords: ["huawei", "华为"] },
  { label: "头部客户与商机", labelEn: "Key accounts and opportunities", categories: [], keywords: ["tender", "procurement", "contract", "investment", "budget", "project", "5g", "fiber", "data center", "cloud", "cybersecurity", "artificial intelligence", "采购", "招标", "合同", "投资", "项目", "数据中心", "云", "光纤"] },
  { label: "合规与营商", labelEn: "Compliance and business environment", categories: [], keywords: ["law", "regulation", "license", "court", "tax", "customs", "sanction", "compliance", "法律", "监管", "许可", "法院", "税务", "海关", "合规"] },
  { label: "伊拉克法律新闻解读", labelEn: "Iraq legal intelligence", countries: ["伊拉克"], categories: [], keywords: ["law", "court", "judgment", "decree", "official gazette", "draft law", "法律", "判决", "法令", "公报", "法律草案"] }
];

function topicsFor(item: UnifiedSignal, isEnglish: boolean) {
  const explicit = isEnglish ? item.topicLabelsEn : item.topicLabels;
  if (explicit?.length) return explicit;
  const haystack = `${item.title} ${item.titleEn} ${item.summary} ${item.summaryEn} ${item.account} ${item.accountEn}`.toLocaleLowerCase();
  return topicRules
    .filter((rule) => !rule.countries || rule.countries.includes(item.country))
    .filter((rule) => rule.categories.includes(item.category || "") || rule.keywords.some((keyword) => haystack.includes(keyword.toLocaleLowerCase())))
    .map((rule) => isEnglish ? rule.labelEn : rule.label);
}

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
    topics: "Topics",
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
    topics: "专题",
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
      {visible.map((item) => {
        const topics = topicsFor(item, isEnglish);
        return <Card className={`signal-card ${item.reviewed ? "reviewed" : "automatic"}`} key={item.id}>
        <div className="feed-meta">
          <span>{item.date}</span><span>·</span><span>{isEnglish ? item.countryEn : item.country}</span>
          {item.category && <><span>·</span><span>{isEnglish ? item.categoryEn : item.category}</span></>}
          {topics.length ? <>
            <span>·</span><span>{labels.topics}：{topics.slice(0, 2).join(" / ")}</span>
          </> : null}
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
      </Card>})}
    </div>
    {merged.length > 12 && <div className="signal-more"><button type="button" className="button secondary" onClick={() => setShowAll((value) => !value)}>{showAll ? labels.showLess : labels.showAll}</button></div>}
  </section>;
}
