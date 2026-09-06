import { BriefingView } from "@/components/briefing-view";
import { SocialSignals } from "@/components/social-signals";
import { Scale } from "lucide-react";
import Link from "next/link";
import report from "@/data/report.json";
import signals from "@/data/social-signals.json";

export default function BriefingsPage(){return <><div className="hero"><div><div className="eyebrow">Biweekly Briefing · {report.issue.replace("-","—")}</div><h1>ICT 双周简报</h1><p>{report.period} · {report.stats.news}条有效新闻 · {report.stats.opportunities}个商机信号</p></div><div className="top-actions"><Link className="button" href="/compliance"><Scale size={14}/>合规与营商分析</Link><a className="button secondary" href={`../archive/${report.sourceFile}`}>查看原版长报告</a></div></div><SocialSignals signals={signals}/><BriefingView countries={report.countries}/></>}
