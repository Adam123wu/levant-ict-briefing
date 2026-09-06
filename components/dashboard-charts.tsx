"use client";

import { AreaChart, BarList } from "@tremor/react";

const trend = [
  {period:"W27-28",新闻:18,商机:12},{period:"W29-30",新闻:21,商机:15},{period:"W31-32",新闻:22,商机:18},{period:"W33-34",新闻:24,商机:20},{period:"W35-36",新闻:29,商机:24}
];
const countries = [{name:"伊拉克",value:13},{name:"约旦",value:8},{name:"黎巴嫩",value:8}];

export function TrendChart(){return <AreaChart className="h-60" data={trend} index="period" categories={["新闻","商机"]} colors={["blue","amber"]} showLegend showGridLines curveType="monotone"/>}
export function CountryBars(){return <BarList data={countries} color="blue" className="mt-2"/>}
