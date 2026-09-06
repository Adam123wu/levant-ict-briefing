"use client";

import { useMemo, useState } from "react";
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui";

type Person={id:number;country:string;name:string;role:string;tg?:string|null;fb?:string|null;x?:string|null;li?:string|null;account:string;person:string;verified:string;source:string;priority:string};

export function PeopleTable({data}:{data:Person[]}){
  const [query,setQuery]=useState(""); const [country,setCountry]=useState("全部");
  const filtered=useMemo(()=>data.filter(p=>(country==="全部"||p.country===country)&&`${p.country} ${p.name} ${p.role}`.toLowerCase().includes(query.toLowerCase())),[data,query,country]);
  const columns=useMemo<ColumnDef<Person>[]>(()=>[
    {accessorKey:"country",header:"国家"},{accessorKey:"name",header:"姓名",cell:i=><strong>{i.getValue<string>()}</strong>},{accessorKey:"role",header:"现任职务"},
    {id:"social",header:"官方社媒",cell:({row})=>{const social:Array<[string|null|undefined,string]>=[[row.original.tg,"TG"],[row.original.fb,"FB"],[row.original.x,"X"],[row.original.li,"IN"]];return <>{social.filter((x):x is [string,string]=>Boolean(x[0])).map(([url,label])=><a key={label} className="social-link" href={url} target="_blank" rel="noreferrer">{label}</a>)}</>}},
    {accessorKey:"account",header:"账号状态",cell:i=><Badge tone={i.getValue<string>().includes("已核验")?"green":"amber"}>{i.getValue<string>()}</Badge>},{accessorKey:"verified",header:"最后核验"},{accessorKey:"priority",header:"优先级"}
  ],[]);
  const table=useReactTable({data:filtered,columns,getCoreRowModel:getCoreRowModel(),getFilteredRowModel:getFilteredRowModel(),getSortedRowModel:getSortedRowModel(),getPaginationRowModel:getPaginationRowModel(),initialState:{pagination:{pageSize:15}}});
  return <div className="table-card card"><div className="table-tools"><input className="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="搜索姓名、职务或国家…"/><select className="select" value={country} onChange={e=>setCountry(e.target.value)}><option>全部</option><option>伊拉克</option><option>约旦</option><option>黎巴嫩</option></select><a className="button secondary" href="../downloads/政府人员监控矩阵_v1.0.xlsx">下载 Excel</a></div><div className="table-wrap"><table className="data-table"><thead>{table.getHeaderGroups().map(g=><tr key={g.id}>{g.headers.map(h=><th key={h.id} onClick={h.column.getToggleSortingHandler()}>{flexRender(h.column.columnDef.header,h.getContext())}{h.column.getIsSorted()==="asc"?" ↑":h.column.getIsSorted()==="desc"?" ↓":""}</th>)}</tr>)}</thead><tbody>{table.getRowModel().rows.map(r=><tr key={r.id}>{r.getVisibleCells().map(c=><td key={c.id}>{flexRender(c.column.columnDef.cell,c.getContext())}</td>)}</tr>)}</tbody></table></div><div className="pagination"><span>共 {filtered.length} 人 · 第 {table.getState().pagination.pageIndex+1}/{table.getPageCount()} 页</span><div><button disabled={!table.getCanPreviousPage()} onClick={()=>table.previousPage()}>上一页</button> <button disabled={!table.getCanNextPage()} onClick={()=>table.nextPage()}>下一页</button></div></div></div>;
}
