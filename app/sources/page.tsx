import { Radio, ExternalLink, CheckCircle2, ShieldCheck } from "lucide-react";
import { Badge, Card } from "@/components/ui";
import sources from "@/data/sources.json";

export default function SourcesPage() {
  const verified = sources.filter(source => source.status === "正常" || source.status === "已核验").length;
  const posts = sources.reduce((sum, source) => sum + (typeof source.posts14d === "number" ? source.posts14d : 0), 0);
  const trackedPosts = sources.filter(source => typeof source.posts14d === "number").length;
  const t1 = sources.filter(source => source.tier === "T1").length;
  const platforms = new Set(sources.map(source => source.platform)).size;

  return <>
    <div className="hero">
      <div><div className="eyebrow">Source Operations</div><h1>政府与监管社媒信源</h1><p>政府官员、通信部、监管机构的 X / Telegram / Facebook 官方账号</p></div>
      <Badge tone="green"><CheckCircle2 size={11}/> {verified}/{sources.length} 已核验</Badge>
    </div>
    <div className="grid kpi-grid">
      <Card className="card-pad"><div className="kpi-label">接入账号</div><div className="kpi-value">{sources.length}</div><div className="kpi-note">三国政府与 ICT 机构</div></Card>
      <Card className="card-pad"><div className="kpi-label">平台覆盖</div><div className="kpi-value">{platforms}</div><div className="kpi-note">X · Telegram · Facebook</div></Card>
      <Card className="card-pad"><div className="kpi-label">T1 核心源</div><div className="kpi-value">{t1}</div><div className="kpi-note">通信部、监管机构与政府首脑</div></Card>
      <Card className="card-pad"><div className="kpi-label">已采集消息</div><div className="kpi-value">{posts}</div><div className="kpi-note">{trackedPosts} 个账号具备14天计数</div></Card>
    </div>
    <Card className="table-card"><div className="table-wrap"><table className="data-table">
      <thead><tr><th>状态</th><th>国家</th><th>类型</th><th>机构 / 人员</th><th>平台账号</th><th>层级</th><th>14天消息</th></tr></thead>
      <tbody>{sources.map(source => <tr key={source.id}>
        <td><Badge tone="green"><ShieldCheck size={10}/> {source.status}</Badge></td>
        <td>{source.country}</td><td>{source.category}</td>
        <td><strong>{source.name}</strong><div className="section-sub" style={{ marginTop: 3 }}>{source.owner}</div></td>
        <td><a className="social-link" href={source.url} target="_blank" rel="noreferrer"><Radio size={10}/>{source.platform} · @{source.handle}<ExternalLink size={9}/></a><div className="section-sub" style={{ marginTop: 4 }}>{source.verifiedBy}</div></td>
        <td><Badge tone={source.tier === "T1" ? "red" : "default"}>{source.tier}</Badge></td>
        <td>{typeof source.posts14d === "number" ? source.posts14d : "待首轮采集"}</td>
      </tr>)}</tbody>
    </table></div></Card>
  </>;
}
