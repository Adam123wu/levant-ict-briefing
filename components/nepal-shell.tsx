"use client";
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useLanguage} from './language-context';
import report from '@/data/report.json';
const links=[['/','情报总览','Overview'],['/briefings','双周简报','Briefing'],['/compliance','合规与法律','Compliance & law'],['/people','政府与监管','Government & regulators'],['/sources','新闻与社媒信源','News & social sources'],['/archive','历史归档','Archive']];
export function NepalShell({children}:{children:React.ReactNode}){
 const {language,setLanguage}=useLanguage(),en=language==='en',path=usePathname();
 const nav=<>{links.map(([href,zh,english])=><Link key={href} href={href} className={`side-link ${path===href||path===href+'/'?'active':''}`}>{en?english:zh}</Link>)}</>;
 return <div className="shell"><aside className="sidebar"><div className="brand"><div className="brand-mark">🇳🇵 {en?'Nepal ICT Intelligence':'尼泊尔 ICT 情报中心'}</div><p className="brand-sub">Nepal · 尼泊尔<br/>{en?'Government · Telecom · Technology':'政府 · 通信 · 科技'}</p></div><nav className="nav-list">{nav}</nav><div className="sidebar-foot">{en?'Nepali / English sources → Chinese / English briefing':'尼泊尔语 / 英语信源 → 中英双语简报'}</div></aside><main className="main"><header className="topbar"><div><div className="page-title">{en?'Nepal ICT Biweekly Briefing':'尼泊尔 ICT 双周简报'}</div><div className="top-meta">{en?'Wu Hao 679001 · MSSD AI Team':'吴昊679001 · MSSD AI团队'}</div></div><div className="top-actions"><span className="chip">{report.issue}</span><div className="language-toggle" aria-label="Language"><button aria-pressed={!en} className={!en?'active':''} onClick={()=>setLanguage('zh')}>中文</button><button aria-pressed={en} className={en?'active':''} onClick={()=>setLanguage('en')}>English</button></div></div></header><div className="content">{children}</div></main><nav className="mobile-nav">{nav}</nav></div>;
}
