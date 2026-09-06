"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Archive, LayoutDashboard, Newspaper, Radio, Users } from "lucide-react";

const links = [
  {href:"/",label:"情报总览",icon:LayoutDashboard},
  {href:"/briefings",label:"双周简报",icon:Newspaper},
  {href:"/people",label:"政府人员",icon:Users},
  {href:"/sources",label:"Telegram 信源",icon:Radio},
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
  return <div className="shell"><aside className="sidebar"><div className="brand"><div className="brand-mark"><Radio size={20}/>黎凡特 ICT 情报中心</div><div className="brand-sub">Iraq · Jordan · Lebanon<br/>双周决策情报驾驶舱</div></div><Navigation/><div className="sidebar-foot"><span className="online"/>Telegram 采集正常<br/><span style={{opacity:.72}}>6 个政府信源 · 14天 185条</span></div></aside><main className="main"><header className="topbar"><div><div className="page-title">伊拉克代表处 ICT 双周简报</div><div className="top-meta">伊拉克代表处 吴昊679001 · MSSD AI团队</div></div><div className="top-actions"><span className="chip">W35—36</span><span className="chip">更新于 2026-09-06</span></div></header><div className="content">{children}</div></main><Navigation mobile/></div>;
}
