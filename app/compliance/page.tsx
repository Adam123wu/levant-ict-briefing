import {
  BookOpen,
  Building2,
  CalendarClock,
  ExternalLink,
  Landmark,
  RefreshCw,
  Scale,
  ShieldAlert,
  TrendingUp
} from "lucide-react";
import { Badge, Card } from "@/components/ui";
import analysis from "@/data/compliance-analysis.json";
import legalNews from "@/data/iraq-legal-news.json";

const dimensionLabels = Object.fromEntries(analysis.method.map(item => [item.id, item.label]));
const countryColors: Record<string, string> = { iq: "#c13515", jo: "#2563eb", lb: "#2f7a2f" };
const legalSources = Object.fromEntries(legalNews.sources.map(source => [source.id, source]));
const currentLegalItems = legalNews.items.filter(item => item.date >= legalNews.refresh.windowStart && item.date <= legalNews.refresh.windowEnd);

function priorityTone(priority: string): "red" | "amber" | "green" {
  if (priority === "高") return "red";
  if (priority === "中") return "amber";
  return "green";
}

export default function CompliancePage() {
  return <>
    <div className="hero">
      <div><div className="eyebrow">Compliance & Business Environment</div><h1>合规与营商分析</h1><p>{analysis.issue.replace("-", "—")} 快照 · 六维加权评分 · 风险、证据与行动建议</p></div>
      <Badge tone="amber"><Scale size={12}/> 更新于 {analysis.generated}</Badge>
    </div>

    <Card className="legal-desk">
      <div className="legal-desk-head">
        <div className="legal-desk-title">
          <div className="legal-icon"><BookOpen size={20}/></div>
          <div><div className="eyebrow">Iraq Legal Intelligence</div><h2>{legalNews.title}</h2><p>{legalNews.subtitle}</p></div>
        </div>
        <Badge tone="green"><RefreshCw size={11}/> {legalNews.refresh.status}</Badge>
      </div>

      <div className="legal-kpis">
        <div><span>本期动态</span><strong>{currentLegalItems.length}</strong><small>{legalNews.refresh.windowStart} — {legalNews.refresh.windowEnd}</small></div>
        <div><span>官方信源</span><strong>{legalNews.sources.length}</strong><small>全部为 T1 一手页面</small></div>
        <div><span>高优先级</span><strong>{currentLegalItems.filter(item => item.priority === "高").length}</strong><small>需要业务负责人跟踪</small></div>
        <div><span>自动更新</span><strong><CalendarClock size={22}/> 周日</strong><small>{legalNews.refresh.cadence}</small></div>
      </div>

      <div className="legal-method"><Landmark size={15}/><div><strong>判读口径</strong><span>{legalNews.methodology}</span></div></div>

      <div className="legal-news-list">
        {legalNews.items.map(item => {
          const source = legalSources[item.sourceId];
          return <article className="legal-news-item" key={item.id}>
            <div className="legal-news-meta">
              <Badge tone={priorityTone(item.priority)}>{item.priority}优先级</Badge>
              <Badge>{item.status}</Badge>
              <span>{item.date}</span><span>·</span><span>{source.name}</span>
            </div>
            <h3>{item.title}</h3>
            <p className="legal-summary">{item.summary}</p>
            <div className="legal-interpretation">
              <div><span>法律状态</span><p>{item.legalEffect}</p></div>
              <div><span>营商影响</span><p>{item.businessImpact}</p></div>
            </div>
            <div className="legal-actions">
              <strong>建议动作</strong>
              <ol>{item.actions.map(action => <li key={action}>{action}</li>)}</ol>
            </div>
            <a className="legal-source-link" href={item.url} target="_blank" rel="noreferrer">查看官方原文 <ExternalLink size={12}/></a>
          </article>;
        })}
      </div>

      <div className="legal-source-section">
        <div className="section-head"><div><div className="section-title">官方法律信源监控矩阵</div><div className="section-sub">立法、正式公报、司法、ICT、银行支付、税务与投资准入</div></div><Badge tone="green">{legalNews.sources.length}/{legalNews.sources.length} 运行中</Badge></div>
        <div className="legal-source-grid">{legalNews.sources.map(source => <a href={source.url} target="_blank" rel="noreferrer" className="legal-source-card" key={source.id}>
          <div><Badge>{source.category}</Badge><span className="source-live">● {source.status}</span></div>
          <strong>{source.name}</strong><p>{source.scope}</p>
          <span className="source-tier">{source.tier} · 官方一手信源 <ExternalLink size={11}/></span>
        </a>)}</div>
      </div>

      <div className="compliance-note legal-disclaimer"><ShieldAlert size={14}/><span>{legalNews.disclaimer}</span></div>
    </Card>

    <Card className="card-pad methodology-card">
      <div className="section-head"><div><div className="section-title">评分规则</div><div className="section-sub">总分 = 各维度得分 × 权重；10 分代表风险更低、营商条件更成熟</div></div><Badge>0—10 分</Badge></div>
      <div className="method-grid">{analysis.method.map(item => <div className="method-item" key={item.id}><div><strong>{item.label}</strong><Badge tone="amber">{item.weight}%</Badge></div><p>{item.description}</p></div>)}</div>
      <div className="compliance-note"><ShieldAlert size={14}/><span>{analysis.disclaimer}</span></div>
    </Card>

    <div className="compliance-country-list">{analysis.countries.map(country => {
      const color = countryColors[country.code];
      return <Card className="compliance-country" key={country.code}>
        <div className="compliance-country-head">
          <div><div className="country-name">{country.flag} {country.name}</div><div className="section-sub">本期综合判断</div></div>
          <div className="compliance-score"><strong style={{ color }}>{country.score.toFixed(1)}</strong><span>/ 10</span></div>
          <div className="compliance-risk"><Badge tone={country.score < 4 ? "red" : country.score < 6 ? "amber" : "green"}>{country.risk}</Badge><span><TrendingUp size={12}/> {country.trend}</span></div>
        </div>
        <p className="compliance-summary">{country.summary}</p>
        <div className="dimension-grid">{country.dimensions.map(dimension => <div className="dimension-row" key={dimension.id}>
          <div className="dimension-label"><span>{dimensionLabels[dimension.id]}</span><strong>{dimension.score.toFixed(1)}</strong></div>
          <div className="progress"><span style={{ width: `${dimension.score * 10}%`, background: color }}/></div>
          <p>{dimension.assessment}</p>
        </div>)}</div>
        <div className="compliance-detail-grid">
          <div><h3><ShieldAlert size={14}/>重点监控</h3><ul>{country.watchlist.map(item => <li key={item}>{item}</li>)}</ul></div>
          <div><h3><Building2 size={14}/>建议动作</h3><ul>{country.actions.map(item => <li key={item}>{item}</li>)}</ul></div>
          <div><h3><ExternalLink size={14}/>证据链</h3><ul>{country.evidence.map(item => <li key={item.url}><a href={item.url} target="_blank" rel="noreferrer">{item.label}</a><span>{item.date}</span></li>)}</ul></div>
        </div>
      </Card>;
    })}</div>
  </>;
}
