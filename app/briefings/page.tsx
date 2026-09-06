import { BriefingView } from "@/components/briefing-view";
import report from "@/data/report.json";

export default function BriefingsPage(){return <><div className="hero"><div><div className="eyebrow">Biweekly Briefing · W35—36</div><h1>ICT 双周简报</h1><p>2026年8月24日—9月4日 · 29条有效新闻 · 24个商机信号</p></div><a className="button secondary" href="../archive/w35-36.html">查看原版长报告</a></div><BriefingView countries={report.countries}/></>}
