// One-time migration. Former market inputs remain available in git and legacy/market-backup.
import fs from 'node:fs/promises';
const write = (path, value) => fs.writeFile(path, JSON.stringify(value, null, 2) + '\n');
if(await fs.access('legacy/market-backup/sources.json').then(()=>true,()=>false))throw Error('Migration already applied; refusing to reset live Nepal data.');
await fs.mkdir('legacy/market-backup', {recursive:true});
for (const file of ['sources.json','social-signals.json','social-signal-translations-en.json','telegram-feed.json','telegram-translations.json','telegram-translations-en.json','compliance-analysis.json','people-social-overrides.json','topic-source-routing.json']) {
  await fs.copyFile(`config/${file}`, `legacy/market-backup/${file}`);
}
const rows = [
 ['nta','尼泊尔电信管理局 NTA','Nepal Telecommunications Authority','通信监管','Telecom regulation','https://www.nta.gov.np/','T1'],
 ['mocit','通信与信息技术部 MoCIT','Ministry of Communication and Information Technology','通信部','ICT ministry','https://mocit.gov.np/','T1'],
 ['pmo','总理及部长会议办公室','Office of the Prime Minister and Council of Ministers','政府决策','Government','https://www.opmcm.gov.np/','T1'],
 ['ntc','尼泊尔电信 Nepal Telecom','Nepal Telecom','运营商','Operator','https://www.ntc.net.np/','T1'],
 ['ncell','Ncell','Ncell','运营商','Operator','https://www.ncell.com.np/en','T1'],
 ['worldlink','WorldLink','WorldLink','ISP','ISP','https://worldlink.com.np/','T1'],
 ['vianet','Vianet','Vianet','ISP','ISP','https://www.vianet.com.np/','T1'],
 ['subisu','Subisu','Subisu','ISP','ISP','https://www.subisu.net.np/','T1'],
 ['dishhome','DishHome','DishHome','ISP','ISP','https://dishhome.com.np/','T1'],
 ['cgnet','CG NET','CG NET','ISP','ISP','https://cgnet.com.np/','T1'],
 ['techpana','TechPana 科技媒体','TechPana','科技与设备媒体','Technology and device media','https://www.techpana.com/','T2'],
 ['ictsamachar','ICT Samachar','ICT Samachar','科技与设备媒体','Technology and device media','https://ictsamachar.com/','T2'],
 ['gadgetbyte','GadgetByte Nepal','GadgetByte Nepal','科技与设备媒体','Technology and device media','https://www.gadgetbytenepal.com/','T2'],
 ['nepalitelecom','NepaliTelecom','NepaliTelecom','产业媒体','Telecom media','https://www.nepalitelecom.com/','T2'],
 ['ictbyte','ICT BYTE','ICT BYTE','科技与设备媒体','Technology and device media','https://ictbyte.com/','T2'],
 ['kathmandupost','加德满都邮报','The Kathmandu Post','主流媒体','Mainstream media','https://kathmandupost.com/','T2'],
 ['onlinekhabar','Onlinekhabar','Onlinekhabar','主流媒体','Mainstream media','https://english.onlinekhabar.com/','T2'],
 ['huawei','华为全球新闻室 · 尼泊尔筛选','Huawei newsroom · Nepal filter','设备商','Equipment vendor','https://www.huawei.com/en/news','T1'],
 ['nokia','诺基亚新闻室 · 尼泊尔筛选','Nokia newsroom · Nepal filter','设备商','Equipment vendor','https://www.nokia.com/newsroom/','T1'],
 ['zte','中兴新闻室 · 尼泊尔筛选','ZTE newsroom · Nepal filter','设备商','Equipment vendor','https://www.zte.com.cn/global/about/news.html','T1'],
 ['ericsson','爱立信新闻室 · 尼泊尔筛选','Ericsson newsroom · Nepal filter','设备商','Equipment vendor','https://www.ericsson.com/en/newsroom','T1'],
 ['cisco','Cisco 新闻室 · 尼泊尔筛选','Cisco newsroom · Nepal filter','设备商','Equipment vendor','https://newsroom.cisco.com/','T1'],
 ['nrb','尼泊尔央行 NRB','Nepal Rastra Bank','银行支付','Banking and payments','https://www.nrb.org.np/','T1'],
 ['law','尼泊尔法律委员会','Nepal Law Commission','司法','Legislation','https://lawcommission.gov.np/','T1'],
 ['gazette','尼泊尔公报','Nepal Gazette','公报','Gazette','https://rajpatra.dop.gov.np/','T1'],
 ['ppmo','公共采购监督办公室','Public Procurement Monitoring Office','采购','Procurement','https://ppmo.gov.np/','T1'],
 ['ird','国内税务局','Inland Revenue Department','税务','Taxation','https://ird.gov.np/','T1'],
 ['ibn','尼泊尔投资委员会','Investment Board Nepal','投资','Investment','https://ibn.gov.np/','T1']
];
const sources = rows.map(([id,name,nameEn,category,categoryEn,url,tier])=>({id:`np-${id}`,name,nameEn,category,categoryEn,url,tier,country:'尼泊尔',countryCode:'np',platform:'Website',handle:'',owner:nameEn,enabled:true,status:'待扫描',statusEn:'Awaiting scan',posts14d:null,verifiedBy:'机构/媒体公开网站；采集状态单独记录',verifiedByEn:'Public organization or publisher website; scan status recorded separately',lastCollectedAt:null,scope:category==='设备商'?'Nepal-only':'Nepal',verificationUrl:url}));
const socials = [
 ['ict-fb','ICT Samachar','Facebook','https://www.facebook.com/ictsamachar','https://ictsamachar.com/','T2','科技与设备媒体','Technology and device media'],
 ['ict-x','ICT Samachar','X','https://x.com/ictsamachar','https://ictsamachar.com/','T2','科技与设备媒体','Technology and device media'],
 ['ict-in','ICT Samachar','LinkedIn','https://np.linkedin.com/company/ict-samachar','https://ictsamachar.com/','T2','科技与设备媒体','Technology and device media'],
 ['ncell-fb','Ncell','Facebook','https://www.facebook.com/ncell','https://www.ncell.com.np/en/individual/contact-us','T1','运营商','Operator'],
 ['ntc-fb','Nepal Telecom','Facebook','https://www.facebook.com/NepalTelecom.NT','https://cms.ntc.net.np/storage/media/AKCYVBbAWJzlHpr76BwbRPDszHB2UW6zmdAg2PRk.pdf','T1','运营商','Operator']
];
for(const [id,name,platform,url,verificationUrl,tier,category,categoryEn] of socials) sources.push({id:`np-${id}`,name,nameEn:name,platform,url,verificationUrl,tier,category,categoryEn,country:'尼泊尔',countryCode:'np',handle:url.split('/').pop(),owner:name,enabled:true,identityVerified:true,status:'账号已核验·帖子待扫描',statusEn:'Identity verified; posts not scanned',posts14d:null,verifiedBy:'机构/媒体官网反向链接',verifiedByEn:'Linked by the organization or publisher',lastCollectedAt:null,scope:'Nepal'});
await write('config/sources.json',sources);
await write('config/social-signals.json',[]);
await write('config/social-signal-translations-en.json',{});
await write('config/telegram-translations.json',{});
await write('config/telegram-translations-en.json',{});
await write('config/people-social-overrides.json',[]);
await write('config/telegram-feed.json',{generatedAt:null,collectionMode:'awaiting-verified-nepal-channels',windowDays:14,sourceCount:0,scannedMessageCount:0,messageCount:0,items:[],errors:[],coverageGap:'尚无通过官网核验的尼泊尔 Telegram 频道',coverageGapEn:'No Nepal Telegram channels verified through official websites yet.'});
const categories=[['本国运营商最新动态','Operator developments'],['本国部委最新动态','Ministry and regulator developments'],['本国财团投资动态','Consortium investment'],['本国政治与大选进展及内幕','Politics and elections'],['本国 ISP/DSP 和互联网运营商的投资动态','ISP and internet infrastructure investment'],['ICT 竞争对手最新动态','ICT equipment vendors and competitors'],['运营商在集团侧相关信息','Operator group developments'],['外部关系与地缘政治','External relations and geopolitics'],['本国主流媒体对华为的报道与评价','Huawei media coverage'],['本国头部客户的新机会点','Key-account opportunities'],['社交媒体新闻追踪','Important social-media updates']];
await write('config/nepal-report.json',{issue:'W37-38',generated:'2026-09-18',period:'2026年9月5日—9月18日 · 尼泊尔信源迁移版',periodEn:'5–18 September 2026 · Nepal source migration edition',sourceFile:'nepal-w37-38.html',status:'新信源已配置，首轮新闻核验进行中',statusEn:'New sources configured; first news review in progress',summary:['当前监控范围已切换为尼泊尔，原三国内容保留在历史归档。','政府、监管、运营商、ISP、设备商和科技媒体已纳入尼泊尔信源目录。','本页暂不发布未经日期核对、交叉验证和中英翻译的新条目。'],summaryEn:['Active monitoring now covers Nepal; previous country reports remain in the archive.','The source registry covers government, regulators, operators, ISPs, equipment vendors and technology media.','New stories await date checks, corroboration and complete Chinese/English translation.'],countries:{np:{name:'尼泊尔',nameEn:'Nepal',flag:'🇳🇵',sections:categories.map(([category,categoryEn])=>({category,categoryEn,items:[]}))}},stats:{news:0,opportunities:0,telegram:0,countryCounts:{np:0}}});
const legal=sources.filter(s=>['np-nta','np-mocit','np-law','np-gazette','np-nrb','np-ppmo','np-ird','np-ibn'].includes(s.id));
await write('config/nepal-legal-news.json',{country:'尼泊尔',generated:'2026-09-18',title:'尼泊尔法律新闻解读',titleEn:'Nepal legal intelligence',status:'首轮核验中',statusEn:'Initial review pending',sources:legal,items:[],disclaimer:'用于商务风险识别，不构成法律意见。草案、正式公布、生效与执行须分别核验。',disclaimerEn:'For business-risk awareness, not legal advice. Drafting, publication, commencement and enforcement must be verified separately.'});
const old=JSON.parse(await fs.readFile('config/compliance-analysis.json','utf8'));
await write('config/compliance-analysis.json',{issue:'W37-38',generated:'2026-09-18',method:old.method,countries:[],status:'尼泊尔基线待核验，暂不评分',statusEn:'Nepal baseline pending verification; no score assigned',disclaimer:'六维权重沿用，尼泊尔分数须根据尼泊尔证据重新计算。',disclaimerEn:'The six weights are retained; Nepal requires its own evidence-based assessment.'});
await write('config/nepal-people.json',sources.filter(s=>['np-pmo','np-mocit','np-nta','np-nrb','np-ppmo','np-ibn'].includes(s.id)).map((s,i)=>({id:i+1,country:'尼泊尔',name:s.name,nameEn:s.nameEn,role:'机构决策岗位 · 现任姓名待官方核验',roleEn:'Decision-making office; incumbent pending official verification',source:s.url,status:'岗位监控已建立',statusEn:'Office monitoring configured'})));
const routing=JSON.parse(await fs.readFile('config/topic-source-routing.json','utf8'));
const neTerms=['नेपाल','दूरसञ्चार','प्रविधि','इन्टरनेट','फाइबर','स्पेक्ट्रम','अनुमतिपत्र','खरिद','ठेक्का','नियमावली'];
routing.updated='2026-09-18';routing.country='尼泊尔';routing.languages=['ne','en','zh'];
for(const t of routing.topics){t.countries=['尼泊尔'];t.keywords=t.keywords.filter(x=>!/[\u0600-\u06ff]/.test(x)&&!['zain','asiacell','korek','orange jordan','umniah','touch','alfa','ogero','iran','伊朗'].includes(x));if(t.id==='operator_market'){t.keywords.push('nepal telecom','ncell','worldlink','vianet','subisu','dishhome','cg net');t.sourceCategories.push('ISP');}if(t.id==='competitor_intelligence')t.sourceCategories.push('设备商','科技与设备媒体');if(t.id.includes('legal')){t.id='nepal_legal';t.label='尼泊尔法律新闻解读';t.labelEn='Nepal legal intelligence';t.destinations=['尼泊尔法律新闻解读'];t.destinationsEn=['Nepal legal intelligence'];} }
routing.nepaliSearchTerms=neTerms;await write('config/topic-source-routing.json',routing);
console.log(`Configured ${sources.length} Nepal sources; old market preserved in legacy/market-backup.`);
