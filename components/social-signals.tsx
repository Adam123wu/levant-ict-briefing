import { Clock3, ExternalLink, MessageCircle, Radio, ShieldAlert } from "lucide-react";
import { Badge, Card } from "@/components/ui";

type Signal = {
  id: string;
  date: string;
  country: string;
  platform: string;
  account: string;
  priority: string;
  title: string;
  summary: string;
  impact: string;
  url: string;
};

export function SocialSignals({ signals }: { signals: Signal[] }) {
  return <section style={{ marginBottom: 18 }}>
    <div className="section-head" style={{ marginBottom: 10 }}>
      <div>
        <div className="section-title"><Radio size={14} style={{ display: "inline", marginRight: 6 }}/>重要社媒快讯</div>
        <div className="section-sub">政府官员、通信部与监管机构官方账号 · 重要内容自动进入简报</div>
      </div>
      <Badge tone="green">{signals.length} 条已核验</Badge>
    </div>
    <div className="signal-grid">
      {signals.map(signal => <Card className="signal-card" key={signal.id}>
        <div className="feed-meta">
          <span>{signal.date}</span><span>·</span><span>{signal.country}</span>
          <Badge tone={signal.priority === "最高" ? "red" : signal.priority === "高" ? "default" : "green"}>{signal.priority}优先级</Badge>
        </div>
        <h3 className="news-title">{signal.title}</h3>
        <p className="news-text">{signal.summary}</p>
        <div className="opportunity"><ShieldAlert size={13} style={{ display: "inline", marginRight: 5 }}/>业务影响：{signal.impact}</div>
        <div className="feed-meta" style={{ marginTop: 10 }}><span>{signal.platform}</span><span>·</span><span>{signal.account}</span></div>
        <a className="feed-link" href={signal.url} target="_blank" rel="noreferrer">查看官方原文 <ExternalLink size={11} style={{ display: "inline" }}/></a>
      </Card>)}
    </div>
  </section>;
}

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
  summary: string;
  views: number;
  forwards: number;
  url: string;
  language: "中文";
  translationStatus: "已翻译";
};

type TelegramFeedData = {
  generatedAt: string | null;
  windowDays: number;
  sourceCount: number;
  rawMessageCount: number;
  messageCount: number;
  untranslatedCount: number;
  items: TelegramItem[];
};

export function TelegramDigest({ feed }: { feed: TelegramFeedData }) {
  const important = feed.items.filter(item => item.priority === "最高" || item.priority === "高");
  const visible = (important.length ? important : feed.items).slice(0, 12);
  const updated = feed.generatedAt ? feed.generatedAt.slice(0, 10) : "等待首次授权采集";

  return <section style={{ marginBottom: 18 }}>
    <div className="section-head" style={{ marginBottom: 10 }}>
      <div>
        <div className="section-title"><MessageCircle size={14} style={{ display: "inline", marginRight: 6 }}/>Telegram 自动监测</div>
        <div className="section-sub">最近 {feed.windowDays} 天 · 中文标题与摘要 · 阿文仅保留在官方原文链接</div>
      </div>
      <Badge tone={feed.generatedAt ? "green" : "default"}><Clock3 size={10}/>{updated}</Badge>
    </div>
    {visible.length ? <div className="signal-grid">
      {visible.map(item => <Card className="signal-card" key={item.id}>
        <div className="feed-meta">
          <span>{item.date}</span><span>·</span><span>{item.country}</span><span>·</span><span>{item.category}</span>
          <Badge tone={item.priority === "最高" ? "red" : item.priority === "高" ? "default" : "green"}>{item.priority}优先级</Badge>
        </div>
        <h3 className="news-title">{item.title}</h3>
        <p className="news-text">{item.summary}</p>
        <div className="feed-meta" style={{ marginTop: 10 }}>
          <span>{item.account}</span><span>·</span><span>@{item.handle}</span><span>·</span><span>{item.tier}</span><span>·</span><span>{item.language}</span>
          {item.views > 0 && <span>{item.views.toLocaleString()} 阅读</span>}
          {item.forwards > 0 && <span>{item.forwards.toLocaleString()} 转发</span>}
        </div>
        <a className="feed-link" href={item.url} target="_blank" rel="noreferrer">查看 Telegram 原文 <ExternalLink size={11} style={{ display: "inline" }}/></a>
      </Card>)}
    </div> : <Card className="card-pad">
      <div className="section-sub">目前没有完成中文翻译并通过发布校验的新消息。未翻译的阿文消息不会显示在公开页面。</div>
    </Card>}
  </section>;
}
