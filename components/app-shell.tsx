"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Archive, LayoutDashboard, Newspaper, Radio, Scale, Users } from "lucide-react";
import report from "@/data/report.json";
import sources from "@/data/sources.json";

const links = [
  {href:"/",label:"情报总览",icon:LayoutDashboard},
  {href:"/briefings",label:"双周简报",icon:Newspaper},
  {href:"/compliance",label:"合规与营商",icon:Scale},
  {href:"/people",label:"政府人员",icon:Users},
  {href:"/sources",label:"社媒信源",icon:Radio},
  {href:"/archive",label:"历史归档",icon:Archive}
];

function Navigation({mobile=false}:{mobile?:boolean}) {
  const pathname = usePathname();
  return <nav className={mobile?"mobile-nav":"nav-list"}>{links.map(({href,label,icon:Icon}) => {
    const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
    return <Link key={href} href={href} className={`side-link ${active?"active":""}`}><Icon size={16}/><span>{label}</span></Link>;
  })}</nav>;
}

export function AppShell({children}:{children:React.ReactNode}) {
  const verified=sources.filter(source=>source.status==="正常"||source.status==="已核验").length;
  return <div className="shell"><aside className="sidebar"><div className="brand"><div className="brand-mark"><Radio size={20}/>黎凡特 ICT 情报中心</div><div className="brand-sub">Iraq · Jordan · Lebanon<br/>双周决策情报驾驶舱</div></div><Navigation/><div className="sidebar-foot"><span className="online"/>多平台信源已接入<br/><span style={{opacity:.72}}>{verified}/{sources.length} 个账号已核验 · X/TG/FB</span></div></aside><main className="main"><header className="topbar"><div><div className="page-title">伊拉克代表处 ICT 双周简报</div><div className="top-meta">伊拉克代表处 吴昊679001 · MSSD AI团队</div></div><div className="top-actions"><span className="chip">{report.issue.replace("-","—")}</span><span className="chip">更新于 {report.generated}</span></div></header><div className="content">{children}</div></main><Navigation mobile/></div>;
}
