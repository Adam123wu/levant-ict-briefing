// Explicitly reviewed homepage reverse links; not a general auto-verification rule.
import fs from 'node:fs/promises';
const sources=JSON.parse(await fs.readFile('config/sources.json','utf8'));
const candidates=JSON.parse(await fs.readFile('config/nepal-source-candidates.json','utf8')).socialCandidates;
const approved={
 'np-nta':['NepalTelecommunicationsAuthority','ntagovnp'],
 'np-ntc':['NepalTelecom.NT','ndcl_nt','nepal-telecom'],
 'np-ncell':['ncell','Ncell'],
 'np-worldlink':['wlink.np','WLinkComm','worldlink-communications'],
 'np-vianet':['vianetnepal','Vianetofficial','vianet-communications'],
 'np-subisu':['subisu'],
 'np-gadgetbyte':['gadgetbytenepal'],
 'np-nepalitelecom':['Nepaltelecoms','nepalitelecom'],
 'np-kathmandupost':['kathmandupost'],
 'np-onlinekhabar':['onlinekhabarinenglish','OnlineKhabar_En'],
 'np-huawei':['huawei','Huawei'],
 'np-nokia':['nokia'],
 'np-zte':['ZTECorp','ZTEPress','zte'],
 'np-cisco':['Cisco','cisco'],
 'np-nrb':['NepalRastraBank','NRB.CentralBank']
};
const normalize=raw=>{const u=new URL(raw.trim());u.search='';u.hash='';u.hostname=u.hostname.replace('twitter.com','x.com');u.pathname=u.pathname.replace(/\/$/,'');return u.toString();};
const seen=new Set(sources.map(s=>normalize(s.url).toLowerCase()));
for(const c of candidates){
 const url=normalize(c.url),handle=new URL(url).pathname.split('/').pop();
 if(!approved[c.sourceId]?.includes(handle)||seen.has(url.toLowerCase()))continue;
 const base=sources.find(s=>s.id===c.sourceId),host=new URL(url).hostname;
 const platform=host.includes('facebook')?'Facebook':host.includes('linkedin')?'LinkedIn':'X';
 sources.push({...base,id:base.id+'-'+platform.toLowerCase(),platform,url,handle,verificationUrl:c.evidenceUrl,identityVerified:true,status:'账号已核验·帖子待扫描',statusEn:'Identity verified; posts not scanned',lastCollectedAt:null,lastAttemptAt:null,verifiedBy:'机构/媒体官网反向链接，2026-09-18 人工复核',verifiedByEn:'Organization/publisher homepage reverse link, reviewed 2026-09-18'});
 seen.add(url.toLowerCase());
}
await fs.writeFile('config/sources.json',JSON.stringify(sources,null,2)+'\n');
console.log(`${sources.length} total sources after reviewed social-link import.`);
