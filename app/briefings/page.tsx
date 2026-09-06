import { BriefingView } from "@/components/briefing-view";
import { SocialSignals } from "@/components/social-signals";
import report from "@/data/report.json";
import signals from "@/data/social-signals.json";

export default function BriefingsPage(){return <><div className="hero"><div><div className="eyebrow">Biweekly Briefing · {report.issue.replace("-","—")}</div><h1>ICT 双周简报</h1><p>{report.period} · {report.stats.news}条有效新闻 · {report.stats.opportunities}个商机信号</p></div><a className="button secondary" href={`../archive/${report.sourceFile}`}>查看原版长报告</a></div><SocialSignals signals={signals}/><BriefingView countries={report.countries}/></>}
