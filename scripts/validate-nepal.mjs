import fs from 'node:fs';
import assert from 'node:assert/strict';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const d=read('data/nepal.json');
assert.deepEqual(Object.keys(d.report.countries),['np']);
assert.equal(d.report.countries.np.sections.length,11);
for(const group of [d.sources,d.people,d.signals,d.telegram.items,d.legal.sources])for(const item of group)assert.equal(item.country,'尼泊尔');
const ids=new Set();
for(const s of d.sources){assert(!ids.has(s.id));ids.add(s.id);assert(s.id.startsWith('np-'));assert.equal(new URL(s.url).protocol,'https:');if(s.platform==='Telegram')assert(s.identityVerified&&s.verificationUrl);}
for(const t of read('config/topic-source-routing.json').topics)assert.deepEqual(t.countries,['尼泊尔']);
const hosts=new Set(d.legal.sources.map(s=>new URL(s.url).hostname));
for(const s of d.legal.sources)assert(new URL(s.url).hostname.endsWith('.gov.np')||new URL(s.url).hostname.endsWith('.org.np'));
for(const i of d.legal.items){assert(hosts.has(new URL(i.url).hostname));assert(i.title&&i.titleEn&&i.summary&&i.summaryEn&&i.status&&i.actions.length>=2);}
for(const c of d.compliance.countries){assert.equal(c.code,'np');const score=c.dimensions.reduce((n,x)=>n+x.score*d.compliance.method.find(m=>m.id===x.id).weight/100,0);assert(Math.abs(c.score-Math.round(score*10)/10)<0.001);}
const count=d.report.countries.np.sections.reduce((n,s)=>n+s.items.length,0);assert.equal(d.report.stats.news,count);
assert.equal(d.telegram.messageCount,d.telegram.items.length);
console.log('Nepal country, source, legal-domain, routing, score and news-count checks passed.');
