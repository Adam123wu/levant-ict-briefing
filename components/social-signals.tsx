import { ExternalLink, Radio, ShieldAlert } from "lucide-react";
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
