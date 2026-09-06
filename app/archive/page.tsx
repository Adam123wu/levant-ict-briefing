import { Archive, ExternalLink } from "lucide-react";
import { Card, Badge } from "@/components/ui";

const issues=[
  {week:"W35—36",date:"2026-09-05",file:"w35-36.html",current:true},{week:"W20—21",date:"2026-05",file:"w20-21.html"},{week:"W17—19",date:"2026-05",file:"w17-19.html"},{week:"W15—16",date:"2026-04",file:"w15-16.html"},{week:"W13—14",date:"2026-04",file:"w13-14.html"}
];
export default function ArchivePage(){return <><div className="hero"><div><div className="eyebrow">Briefing Archive</div><h1>历史双周简报</h1><p>保留旧版完整内容，支持追溯政策与商业信号变化</p></div><span className="chip"><Archive size={13} style={{display:"inline",marginRight:5}}/>5期归档</span></div><div className="archive-list">{issues.map(i=><a href={`../archive/${i.file}`} key={i.file}><Card className="archive-item"><div className="archive-date">{i.date}</div><div className="archive-title">ICT 双周简报 · {i.week} <ExternalLink size={13} style={{display:"inline"}}/></div><div style={{marginTop:10}}>{i.current?<Badge tone="green">当前期</Badge>:<Badge>历史归档</Badge>}</div></Card></a>)}</div></>}
