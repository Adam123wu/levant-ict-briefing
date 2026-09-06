import { Building2, ExternalLink, Scale, ShieldAlert, TrendingUp } from "lucide-react";
import { Badge, Card } from "@/components/ui";
import analysis from "@/data/compliance-analysis.json";

const dimensionLabels = Object.fromEntries(analysis.method.map(item => [item.id, item.label]));
const countryColors: Record<string, string> = { iq: "#c13515", jo: "#2563eb", lb: "#2f7a2f" };

export default function CompliancePage() {
  return <>
    <div className="hero">
      <div><div className="eyebrow">Compliance & Business Environment</div><h1>合规与营商分析</h1><p>{analysis.issue.replace("-", "—")} 快照 · 六维加权评分 · 风险、证据与行动建议</p></div>
      <Badge tone="amber"><Scale size={12}/> 更新于 {analysis.generated}</Badge>
    </div>

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
