import { Archive, ExternalLink } from "lucide-react";
import { Card, Badge } from "@/components/ui";
import issues from "@/data/archive.json";

export default function ArchivePage(){return <><div className="hero"><div><div className="eyebrow">Briefing Archive</div><h1>历史双周简报</h1><p>保留旧版完整内容，支持追溯政策与商业信号变化</p></div><span className="chip"><Archive size={13} style={{display:"inline",marginRight:5}}/>{issues.length}期归档</span></div><div className="archive-list">{issues.map(i=><a href={`../archive/${i.file}`} key={i.file}><Card className="archive-item"><div className="archive-date">{i.date}</div><div className="archive-title">ICT 双周简报 · {i.week} <ExternalLink size={13} style={{display:"inline"}}/></div><div style={{marginTop:10}}>{i.current?<Badge tone="green">当前期</Badge>:<Badge>历史归档</Badge>}</div></Card></a>)}</div></>}
