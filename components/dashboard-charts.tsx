"use client";

import { AreaChart, BarList } from "@tremor/react";

const history = [
  {period:"W27-28",新闻:18,商机:12},{period:"W29-30",新闻:21,商机:15},{period:"W31-32",新闻:22,商机:18},{period:"W33-34",新闻:24,商机:20},{period:"W35-36",新闻:29,商机:24}
];

export function TrendChart({current}:{current:{period:string;news:number;opportunities:number}}){const trend=[...history.filter(item=>item.period!==current.period),{period:current.period,新闻:current.news,商机:current.opportunities}].slice(-5);return <AreaChart className="h-60" data={trend} index="period" categories={["新闻","商机"]} colors={["blue","amber"]} showLegend showGridLines curveType="monotone"/>}
export function CountryBars({countries}:{countries:{name:string;value:number}[]}){return <BarList data={countries} color="blue" className="mt-2"/>}
