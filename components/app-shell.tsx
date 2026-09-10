"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Archive, LayoutDashboard, Newspaper, Radio, Scale, Users } from "lucide-react";
import { useLanguage } from "@/components/language-context";
import report from "@/data/report.json";
import sources from "@/data/sources.json";

const links = [
  {href: "/", label: "情报总览", labelEn: "Intelligence overview", icon: LayoutDashboard},
  {href: "/briefings", label: "双周简报", labelEn: "Biweekly briefing", icon: Newspaper},
  {href: "/compliance", label: "合规与营商", labelEn: "Compliance", icon: Scale},
  {href: "/people", label: "政府人员", labelEn: "Government officials", icon: Users},
  {href: "/sources", label: "社媒信源", labelEn: "Social sources", icon: Radio},
  {href: "/archive", label: "历史归档", labelEn: "Archive", icon: Archive}
];

function Navigation({ mobile = false, language }: {mobile?: boolean; language: "zh" | "en"}) {
  const pathname = usePathname();
  return <nav className={mobile ? "mobile-nav" : "nav-list"}>{links.map(({href, label, labelEn, icon: Icon}) => {
    const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
    return <Link key={href} href={href} className={`side-link ${active ? "active" : ""}`}><Icon size={16}/><span>{language === "en" ? labelEn : label}</span></Link>;
  })}</nav>;
}

export function AppShell({ children }: {children: React.ReactNode}) {
  const { language } = useLanguage();
  const isEnglish = language === "en";
  const verified = sources.filter((source) => source.status === "正常" || source.status === "已核验").length;
  return <div className="shell">
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark"><Radio size={20}/>{isEnglish ? "Levant ICT Intelligence" : "黎凡特 ICT 情报中心"}</div>
        <div className="brand-sub">Iraq · Jordan · Lebanon<br/>{isEnglish ? "Biweekly decision-intelligence cockpit" : "双周决策情报驾驶舱"}</div>
      </div>
      <Navigation language={language}/>
      <div className="sidebar-foot"><span className="online"/>{isEnglish ? "Multi-platform sources connected" : "多平台信源已接入"}<br/><span style={{opacity: .72}}>{isEnglish ? `${verified}/${sources.length} accounts verified · X/TG/FB` : `${verified}/${sources.length} 个账号已核验 · X/TG/FB`}</span></div>
    </aside>
    <main className="main">
      <header className="topbar">
        <div>
          <div className="page-title">{isEnglish ? "Iraq Representative Office ICT Biweekly Briefing" : "伊拉克代表处 ICT 双周简报"}</div>
          <div className="top-meta">{isEnglish ? "Iraq Representative Office · Wu Hao 679001 · MSSD AI Team" : "伊拉克代表处 吴昊679001 · MSSD AI团队"}</div>
        </div>
        <div className="top-actions"><span className="chip">{report.issue.replace("-", "—")}</span><span className="chip">{isEnglish ? `Updated ${report.generated}` : `更新于 ${report.generated}`}</span></div>
      </header>
      <div className="content">{children}</div>
    </main>
    <Navigation mobile language={language}/>
  </div>;
}
