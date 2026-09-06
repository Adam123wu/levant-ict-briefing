"use client";

import { useState } from "react";
import { Badge, Card } from "@/components/ui";
import { ChevronDown, ExternalLink } from "lucide-react";

type Item={title:string;date:string;badge:string;text:string;opportunity:string;links:{label:string;url:string}[]};
type Country={name:string;sections:{category:string;items:Item[]}[]};

export function BriefingView({countries}:{countries:Record<string,Country>}){
  const [country,setCountry]=useState("iq"); const [open,setOpen]=useState<Record<string,boolean>>({"0":true}); const current=countries[country];
  return <><div className="tabs">{Object.entries(countries).map(([key,c])=><button key={key} className={`tab ${country===key?"active":""}`} onClick={()=>{setCountry(key);setOpen({"0":true})}}>{key==="iq"?"🇮🇶":key==="jo"?"🇯🇴":"🇱🇧"} {c.name}</button>)}</div><div className="accordion">{current.sections.map((section,index)=>{const active=!!open[index];return <Card className="accordion-section" key={section.category}><button className="accordion-trigger" onClick={()=>setOpen(v=>({...v,[index]:!v[index]}))}><span className="accordion-title">{section.category}</span><span style={{display:"flex",alignItems:"center",gap:8}}><Badge>{section.items.length} 条</Badge><ChevronDown size={15} style={{transform:active?"rotate(180deg)":"none",transition:".18s"}}/></span></button>{active&&<div className="accordion-body">{section.items.map((item,i)=><article className="news-card" key={`${item.title}-${i}`}><div className="feed-meta"><span>{item.date||"本期"}</span>{item.badge&&<Badge tone="green">{item.badge}</Badge>}</div><h3 className="news-title">{item.title}</h3><p className="news-text">{item.text}</p>{item.links?.map(link=><a className="feed-link" href={link.url} target="_blank" rel="noreferrer" key={link.url}>{link.label} <ExternalLink size={11} style={{display:"inline"}}/></a>)}{item.opportunity&&<div className="opportunity">{item.opportunity}</div>}</article>)}</div>}</Card>})}</div></>;
}
