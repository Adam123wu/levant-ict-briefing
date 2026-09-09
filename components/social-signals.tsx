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
};

type TelegramFeedData = {
  generatedAt: string | null;
  windowDays: number;
  sourceCount: number;
  messageCount: number;
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
        <div className="section-sub">最近 {feed.windowDays} 天 · 官方频道原文 · 规则初筛后等待编辑研判</div>
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
          <span>{item.account}</span><span>·</span><span>@{item.handle}</span><span>·</span><span>{item.tier}</span>
          {item.views > 0 && <span>{item.views.toLocaleString()} 阅读</span>}
          {item.forwards > 0 && <span>{item.forwards.toLocaleString()} 转发</span>}
        </div>
        <a className="feed-link" href={item.url} target="_blank" rel="noreferrer">查看 Telegram 原文 <ExternalLink size={11} style={{ display: "inline" }}/></a>
      </Card>)}
    </div> : <Card className="card-pad">
      <div className="section-sub">采集器已经接入；完成一次本机 Telegram 授权并添加三个 GitHub Secret 后，这里会在每周日自动更新。</div>
    </Card>}
  </section>;
}
