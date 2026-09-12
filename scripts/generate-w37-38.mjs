import fs from "node:fs/promises";

const issue = "W37-38";
const generated = "2026-09-12";
const periodZh = "2026年9月5日 — 9月12日（滚动更新，完整周期至9月18日）";
const periodEn = "5–12 September 2026 (rolling update; the full W37–38 window closes on 18 September)";
const author = "伊拉克代表处 吴昊679001";

const categories = [
  ["本国运营商最新动态", "Latest operator developments"],
  ["本国部委最新动态", "Latest ministry and regulator developments"],
  ["本国财团投资动态", "Local consortium investment developments"],
  ["本国政治与大选进展及内幕", "Political and electoral developments"],
  ["本国 ISP/DSP 和互联网运营商的投资动态", "ISP, DSP and internet-operator investment"],
  ["ICT 竞争对手最新动态", "Latest ICT competitor developments"],
  ["运营商在集团侧相关信息", "Operator group-level intelligence"],
  ["美国对本国政治和经济活动的干预", "U.S. intervention and sanctions exposure"],
  ["本国主流媒体对华为的报道与评价", "Local mainstream-media coverage of Huawei"],
  ["本国头部客户的新机会点", "New opportunities with top customers"],
  ["社交媒体新闻追踪", "Social-media and official-channel tracking"]
];

const item = (date, badge, title, text, opportunity, links, titleEn, textEn, opportunityEn) => ({
  date, badge, title, text, opportunity, links, titleEn, textEn, opportunityEn
});

const countries = {
  iq: {
    name: "伊拉克", nameEn: "Iraq", flag: "🇮🇶", color: "#C13515",
    sections: [
      [
        item(
          "2026-09-06", "CMC 官方 + Telegram 核验",
          "Korek 关停行动扩大至基尔库克、尼尼微和萨拉赫丁，多省运营连续性风险进入执行阶段",
          "CMC 表示，其北部办公室与国家安全机构在三省关闭 Korek 办公和服务场所，延续此前在巴格达、卡尔巴拉、纳杰夫、迪瓦尼耶和巴比伦的行动。该变化不等于网络已在全国同一时点停服，但已把牌照争议转化为客户服务、渠道和付款的现实风险。",
          "涉及 Korek 的网络扩容、备件、软件续保和回款必须升级为红色审查；合同中加入监管许可、服务连续性和终止付款保护。",
          [["CMC 9/6", "https://cmc.iq/2026/09/06/%D9%87%D9%8A%D8%A3%D8%A9-%D8%A7%D9%84%D8%A5%D8%B9%D9%84%D8%A7%D9%85-%D9%88%D8%A7%D9%84%D8%A7%D8%AA%D8%B5%D8%A7%D9%84%D8%A7%D8%AA-%D8%AA%D9%88%D8%B3%D8%B9-%D8%A5%D8%AC%D8%B1%D8%A7%D8%A1%D8%A7%D8%AA/"]],
          "Korek closures expand to Kirkuk, Nineveh and Salah al-Din as multi-governorate continuity risk becomes operational",
          "CMC said its northern office, working with the National Security Service, closed Korek offices and service locations across three governorates, extending earlier action in Baghdad, Karbala, Najaf, Diwaniyah and Babil. This does not establish a simultaneous nationwide network shutdown, but it turns the licensing dispute into a practical customer-service, channel and payment risk.",
          "Treat Korek network expansion, spares, software renewal and collections as red-review items. Add regulatory-approval, service-continuity and protected-payment conditions to contracts."
        )
      ],
      [
        item(
          "2026-09-10", "CMC 官方 + Telegram 核验",
          "CMC 启动国家级人工智能基础设施论证，重点转向算力、先进数据处理和本地能力",
          "CMC 执行机构负责人 Baligh Abu Kalal 与总理人工智能事务顾问 Diaa Al-Jumaili 讨论建设国家级专业基础设施，用于运行人工智能应用和先进数据处理，并同意继续研究项目与合作机制。当前属于项目论证，不是已招标或已拨款项目。",
          "优先准备主权 AI 云、GPU/存储、数据中心网络、安全、运维和人才培养的一体化方案；在预算和采购主体明确前仅列为 L2 机会。",
          [["CMC 9/10", "https://cmc.iq/2026/09/10/%D9%87%D9%8A%D8%A3%D8%A9-%D8%A7%D9%84%D8%A5%D8%B9%D9%84%D8%A7%D9%85-%D9%88%D8%A7%D9%84%D8%A7%D8%AA%D8%B5%D8%A7%D9%84%D8%A7%D8%AA-%D8%AA%D9%83%D8%B4%D9%81-%D8%AE%D8%B7%D8%A9-%D9%84%D8%A8%D9%86%D8%A7/"]],
          "CMC begins scoping national AI infrastructure, shifting focus to compute, advanced data processing and domestic capability",
          "CMC chief executive Baligh Abu Kalal and the prime minister's AI adviser Diaa Al-Jumaili discussed specialised national infrastructure for AI workloads and advanced data processing, and agreed to continue studying projects and cooperation models. This is a scoping signal, not a confirmed tender or funded programme.",
          "Prepare an integrated sovereign-AI cloud, GPU/storage, data-centre networking, security, operations and skills package. Keep it at L2 until the budget and procurement owner are confirmed."
        ),
        item(
          "2026-09-09", "通信部 Telegram 官方频道",
          "通信部研究把政府安全 LTE 网络扩展至全部政府机构，并评估 5G 升级",
          "通信部长 Mustafa Sanad 与 Taurus Arm 公司讨论扩大政府安全 LTE 网络覆盖范围，并研究用 5G 提升速度、性能与政府服务安全。官方信息尚未披露采购方式、资金规模或独家安排。",
          "立即核实 Taurus Arm 的角色、股权与制裁状况，并向通信部提交分阶段 LTE/5G 政务专网、核心网安全和统一运维方案。",
          [["通信部 Telegram 9/9", "https://t.me/mociraq2023/1697"]],
          "The Ministry of Communications considers extending the secure government LTE network to all public institutions and assessing a 5G upgrade",
          "Communications Minister Mustafa Sanad discussed expanding the secure government LTE network with Taurus Arm and using 5G to improve speed, performance and service security. The official post did not disclose procurement method, funding or exclusivity.",
          "Verify Taurus Arm's role, ownership and sanctions status immediately, then present the ministry with a phased LTE/5G government-network, secure core and unified-operations proposal."
        )
      ],
      [
        item(
          "2026-09-10", "总理府英文频道 + INA 交叉核验",
          "总理主持省际协调高级委员会会议，成立跨部门委员会清理停滞投资项目障碍",
          "总理府英文频道表示，委员会将研究并处理已识别停滞或未启动投资项目面临的法律、技术和行政障碍。公开信息没有列出具体项目、资金或时限，因此这是项目解阻机制信号，而不是单项复工公告。",
          "把各省数据中心、政府网络和数字基础设施项目按“法律/技术/行政”三类障碍建立清单；仅在项目被正式纳入且责任机构明确后上调机会级别。",
          [["PMO 9/10", "https://t.me/IraqiPMOEng/24735"], ["INA 9/10", "https://t.me/inainaiq/158509"]],
          "The prime minister chairs the provincial coordination commission as an inter-agency committee is formed to clear obstacles facing stalled investment projects",
          "The PMO English channel said the committee will examine legal, technical and administrative obstacles affecting identified stalled or uninitiated investment projects. No project list, funding or timeline was published, so this is an unblocking-mechanism signal rather than confirmation that a specific project has restarted.",
          "Create a legal, technical and administrative obstacle register for provincial data-centre, government-network and digital-infrastructure projects. Raise an opportunity only when the project is formally included and the responsible authority is identified."
        )
      ],
      [
        item(
          "2026-09-08", "IHEC 官方",
          "选举委员会对统一国家身份证用于投票开展技术测试，身份核验基础设施成为近期政治技术变量",
          "IHEC 的技术与法律小组在选举委员会实验室测试统一国家身份证用于投票的技术和法律要求。该事项表明选举基础设施正在向国家身份数据联动推进，但官方页面尚未证明已形成全国部署决定。",
          "与选举相关的身份、网络或数据项目必须保持技术中立并强化数据最小化、访问审计和选举完整性控制。",
          [["IHEC 9/8", "https://ihec.iq/?lang=en-us"]],
          "IHEC tests use of the unified national ID for voting, making identity-verification infrastructure a near-term political technology variable",
          "IHEC's technical and legal team tested the technical and legal requirements for using the unified national ID in voting. The signal points toward linkage with national identity data, but the official page does not establish a nationwide deployment decision.",
          "Any election-related identity, network or data project should remain technically neutral and apply strong data-minimisation, access-audit and election-integrity controls."
        )
      ],
      [],
      [],
      [
        item(
          "2026-09-10 ~ 09-11", "通信部 + INA + 964media",
          "伊拉克与 Ooredoo 签署海湾—欧洲互联网过境合同，目标 3—4 个月接通；海缆登陆附件拟下月签署",
          "伊拉克通信与信息总公司与 Ooredoo 签署经伊拉克向欧洲传输国际互联网容量的合同。Sanad 称路线已开工，预计 3—4 个月接通；9 月 11 日进一步说明海缆登陆附件拟下月在多哈签署。公开报道同时显示收益分成仍存在 28% 与 30% 的谈判差异，因此应区分已签过境合同与待签海缆附件。",
          "这是 ITPC 国际骨干、DWDM、跨境 PoP、网络安全与低时延运营平台的 L1 机会；投标前核对合同边界、收入分成、既有 Falcon/GCX 路由和库区段责任。",
          [["964media 9/10", "https://en.964media.com/52350/"], ["NINA 9/11", "https://ninanews.com/website/News/Details?Key=1314292"]],
          "Iraq and Ooredoo sign a Gulf-to-Europe internet-transit contract targeting activation in three to four months; a marine-landing addendum is planned next month",
          "Iraq's General Company for Communications and Informatics signed a contract with Ooredoo to carry international internet capacity through Iraq toward Europe. Sanad said work was under way and connection was expected within three to four months; on 11 September he separately said the marine-landing addendum would be signed in Doha next month. Public reporting also points to a 28% versus 30% revenue-share gap, so the signed transit contract and pending landing addendum should be treated separately.",
          "This is an L1 opportunity in ITPC international backbone, DWDM, border PoPs, network security and low-latency operations. Validate scope, revenue share, existing Falcon/GCX routes and responsibility for the Kurdistan segment before bidding."
        )
      ],
      [
        item(
          "2026-09-10", "美国财政部 OFAC 官方",
          "OFAC 新行动直接点名伊拉克通信解决方案企业与承包网络，第三方和最终受益人审查阈值上升",
          "美国财政部在 Operation Economic Outcast 下制裁 Kata'ib Hizballah 和 Lebanese Hizballah 支持网络。伊拉克相关对象包括 Ain Al-Iraq for Protecting Technology and Audio, Visual, and Communications Solutions Company、Al-Brouj 及多名个人。该公告同时强调 50% 规则、严格责任和部分二级制裁暴露。",
          "所有政府、安防、通信集成和经销伙伴须在报价、下单、付款前重新筛查实体、董事、股东、银行和实际受益人；仅做名称模糊匹配不够。",
          [["U.S. Treasury 9/10", "https://home.treasury.gov/news/press-releases/sb0626/"]],
          "New OFAC action explicitly names an Iraqi communications-solutions company and contracting networks, raising third-party and beneficial-owner review thresholds",
          "Under Operation Economic Outcast, the U.S. Treasury sanctioned networks supporting Kata'ib Hizballah and Lebanese Hizballah. Iraq-related targets include Ain Al-Iraq for Protecting Technology and Audio, Visual, and Communications Solutions Company, Al-Brouj and several individuals. The notice reiterates the 50 Percent Rule, strict-liability exposure and certain secondary-sanctions risks.",
          "Re-screen entities, directors, shareholders, banks and beneficial owners for every government, security, communications-integration and reseller relationship before quotation, order and payment. Name-only fuzzy matching is insufficient."
        )
      ],
      [],
      [
        item(
          "2026-09-12", "本期综合研判",
          "本期三条最高优先级机会：国际过境网络、主权 AI 基础设施、政府安全 LTE/5G",
          "三条机会均已出现官方需求信号，但成熟度不同：Ooredoo/ITPC 过境合同已签、属于 L1；政府安全 LTE 扩围有部长级讨论、属于 L2；国家 AI 基础设施仍在论证、属于 L2。Korek 相关机会因监管执行和回款风险降为观察或暂停。",
          "七日动作：向 ITPC 提交过境骨干假设清单；向通信部预约政务专网技术会；向 CMC 提交主权 AI 参考架构；对上述项目伙伴执行 OFAC 增量筛查。",
          [["Ooredoo 过境合同", "https://en.964media.com/52350/"], ["CMC AI 计划", "https://cmc.iq/2026/09/10/%D9%87%D9%8A%D8%A3%D8%A9-%D8%A7%D9%84%D8%A5%D8%B9%D9%84%D8%A7%D9%85-%D9%88%D8%A7%D9%84%D8%A7%D8%AA%D8%B5%D8%A7%D9%84%D8%A7%D8%AA-%D8%AA%D9%83%D8%B4%D9%81-%D8%AE%D8%B7%D8%A9-%D9%84%D8%A8%D9%86%D8%A7/"]],
          "Three top-priority opportunities this period: international transit, sovereign AI infrastructure and secure government LTE/5G",
          "All three now have official demand signals, but maturity differs: the Ooredoo/ITPC transit contract is signed and rated L1; secure government LTE expansion has ministerial discussion and is L2; national AI infrastructure remains at scoping stage and is L2. Korek-related opportunities move to watch or hold because of enforcement and collection risk.",
          "Seven-day actions: submit a transit-backbone assumptions list to ITPC; request a government-network technical session with the ministry; give CMC a sovereign-AI reference architecture; and run incremental OFAC screening on all project partners."
        )
      ],
      [
        item("2026-09-10", "Telegram · 通信部", "通信部发布 Ooredoo 过境容量合同签约信息", "官方频道确认伊拉克通信与信息总公司与 Ooredoo 签署海湾至欧洲的互联网容量过境合同。", "并入“运营商集团侧”和“头部客户机会”两条主线。", [["Telegram 原帖", "https://t.me/mociraq2023/1698"]], "Ministry channel announces the Ooredoo transit-capacity contract", "The official channel confirmed that Iraq's General Company for Communications and Informatics signed a Gulf-to-Europe internet-transit contract with Ooredoo.", "Routed to operator group intelligence and top-customer opportunities."),
        item("2026-09-09", "Telegram · 通信部", "通信部讨论安全政府 LTE 网络全国扩围与 5G 升级", "部长与 Taurus Arm 讨论把安全政府 LTE 网络延伸至全部政府机构，并评估 5G 性能升级。", "并入“部委动态”和“头部客户机会”。", [["Telegram 原帖", "https://t.me/mociraq2023/1697"]], "Ministry discusses nationwide expansion of secure government LTE and a 5G upgrade", "The minister discussed extending the secure government LTE network to all public institutions with Taurus Arm and assessing a 5G performance upgrade.", "Routed to ministry developments and top-customer opportunities."),
        item("2026-09-10", "Telegram · CMC", "CMC 披露国家人工智能基础设施计划", "CMC 与总理人工智能顾问讨论国家级 AI 和先进数据处理基础设施。", "并入“部委动态”和“头部客户机会”。", [["Telegram 原帖", "https://t.me/iraqcmc/10972"]], "CMC discloses a national AI-infrastructure plan", "CMC and the prime minister's AI adviser discussed national infrastructure for AI and advanced data processing.", "Routed to regulator developments and top-customer opportunities."),
        item("2026-09-08", "Telegram · CMC", "CMC 讨论虚假 SIM 卡、无人机规则和本地邮件服务", "CMC 管理层会议同步审议虚假 SIM 卡治理、无人机相关规则、本地邮件服务和部分 Starlink 交付延迟。", "并入“部委动态”和“营商合规”预警。", [["Telegram 原帖", "https://t.me/iraqcmc/10968"]], "CMC discusses fraudulent SIMs, drone rules and a local mail service", "CMC management reviewed fraudulent-SIM controls, drone-related rules, a local mail service and delays affecting some Starlink equipment deliveries.", "Routed to regulator developments and business-compliance alerts."),
        item("2026-09-06", "Telegram · CMC", "CMC 将 Korek 场所关闭行动扩大至三省", "官方频道确认基尔库克、尼尼微和萨拉赫丁的 Korek 办公与服务场所被关闭。", "并入“运营商动态”和“营商合规”红色预警。", [["Telegram 原帖", "https://t.me/iraqcmc/10939"]], "CMC expands Korek location closures to three governorates", "The official channel confirmed closure of Korek offices and service locations in Kirkuk, Nineveh and Salah al-Din.", "Routed to operator developments and a red business-compliance alert.")
      ]
    ]
  },
  jo: {
    name: "约旦", nameEn: "Jordan", flag: "🇯🇴", color: "#0656A0",
    sections: [
      [
        item(
          "2026-09", "Umniah 官方",
          "Umniah by Beyon 与 Ericsson 推进二期 5G 和全国网络扩容",
          "Umniah 宣布继续扩大全国网络容量与性能，并与 Ericsson 推进 5G 二期。官方稿强调对企业云服务、数据交换、网络韧性和连接能力的支撑，但未披露投资额、站点数或新增覆盖地图。",
          "跟踪无线扩容、传输、室分、能源和企业专网配套；不得把“二期推进”直接等同于已完成全国覆盖。",
          [["Umniah 官方", "https://www.umniah.com/explore-umniah/umniah-network-expansion-with-ericsson/"]],
          "Umniah by Beyon advances phase-two 5G and nationwide network expansion with Ericsson",
          "Umniah said it is expanding network capacity and performance across Jordan while continuing the second phase of its 5G programme with Ericsson. The release highlights support for enterprise cloud services, data exchange, resilience and connectivity, but gives no investment value, site count or new coverage map.",
          "Track radio expansion, transport, indoor coverage, energy and private-network follow-ons. Do not equate 'phase two' with completed nationwide coverage."
        )
      ],
      [
        item(
          "2026-09-06", "Petra 官方媒体",
          "约旦与沙特 HUMAIN 签署人工智能合作备忘录，政府 AI 场景进入联合识别阶段",
          "MoDEE 部长 Sami Smeirat 与 HUMAIN CEO Tareq Amin 签署战略备忘录，合作方向包括人才、创新生态和识别可规模化的政府 AI 场景。备忘录代表合作框架，不等同于已授标项目。",
          "以政府 AI 场景发现、主权云/数据、模型治理和人才培养切入；等到预算、数据责任和采购方式明确后再上调机会级别。",
          [["Petra 9/6", "https://www.petra.gov.jo/en/index.php/en/news/jordan-saudi-arabias-humain-sign-strategic-mou-to-advance-ai-development-and-innovation"]],
          "Jordan and Saudi Arabia's HUMAIN sign an AI cooperation MoU as government use cases move into joint identification",
          "MoDEE Minister Sami Smeirat and HUMAIN CEO Tareq Amin signed a strategic MoU covering talent, the innovation ecosystem and identification of scalable government AI use cases. The MoU is a cooperation framework, not an awarded project.",
          "Engage around government AI discovery, sovereign cloud/data, model governance and skills. Raise the opportunity stage only after budget, data accountability and procurement method are clear."
        ),
        item(
          "2026-09-10", "投资部官方重核",
          "2026 年《投资环境条例》已入官方公报，“合规承诺式许可”缩短开发区项目启动路径",
          "投资部确认修订条例已在 6 月 4 日公报发布，并于本期更新官方说明。新机制允许开发区内部分经济活动基于投资者合规声明较快启动，随后接受检查；这不是豁免监管义务。",
          "对数据中心、云、软件和数字服务项目，需逐项确认是否属于适用活动、开发区条件、后检查清单和非约旦投资限制。",
          [["投资部官方", "https://www.moin.gov.jo/En/NewsDetails/Amended_Investment_Environment_Regulation_Published_in_the_Official_Gazette"]],
          "The 2026 Investment Environment Regulation is in the Official Gazette, introducing compliance-based licensing for faster starts in development zones",
          "The Ministry of Investment confirmed that the amended regulation was published in the 4 June Gazette and refreshed its official explanation this period. It allows certain development-zone activities to start more quickly on an investor compliance declaration, followed by inspection; it is not an exemption from regulatory duties.",
          "For data-centre, cloud, software and digital-service projects, confirm eligible activities, development-zone conditions, post-inspection controls and foreign-investment restrictions item by item."
        )
      ],
      [],
      [],
      [],
      [
        item("2026-09", "Umniah 官方", "Ericsson 锁定 Umniah 二期 5G 扩容，竞争焦点从首发转向容量与体验", "官方公告确认 Ericsson 继续作为 Umniah 二期 5G 的战略技术伙伴。竞争指标将更多落在容量、体验、自动化运维和企业连接，而不是单纯覆盖口号。", "围绕多厂商传输、室分、能源效率、自动化运维和企业专网提出可量化替代价值。", [["Umniah 官方", "https://www.umniah.com/explore-umniah/umniah-network-expansion-with-ericsson/"]], "Ericsson secures Umniah's phase-two 5G expansion as competition shifts from launch claims to capacity and experience", "The official release confirms Ericsson remains Umniah's strategic technology partner for phase-two 5G. Competition will increasingly centre on capacity, experience, automated operations and enterprise connectivity rather than headline coverage claims.", "Quantify alternative value in multi-vendor transport, indoor coverage, energy efficiency, automated operations and enterprise private networks.")
      ],
      [
        item("2026-09", "Beyon 集团品牌", "Umniah 以 Beyon 集团品牌继续 5G 二期投入，集团能力向约旦落地", "Umniah 的公告把网络扩容与 Beyon 集团品牌、企业连接和数字服务能力绑定。该信号有利于从集团伙伴与约旦本地网络两条线同步跟进。", "同时维护 Beyon 集团技术关系与 Umniah 本地采购/网络团队，避免只在单一层级推进。", [["Umniah 官方", "https://www.umniah.com/explore-umniah/umniah-network-expansion-with-ericsson/"]], "Umniah continues phase-two 5G investment under the Beyon brand, bringing group capability into Jordan", "Umniah links network expansion with the Beyon group brand, enterprise connectivity and digital services. The signal supports parallel engagement at group-partner and local-network levels.", "Maintain both Beyon group technical relationships and Umniah's local procurement/network engagement instead of relying on one level.")
      ],
      [],
      [],
      [
        item("2026-09-12", "本期综合研判", "约旦机会组合：Umniah 5G 二期、政府 AI 场景和开发区合规许可", "三条主线成熟度分别为 L2、L2 和市场准入条件。约旦总体执行环境稳定，但备忘录和政策说明均不能替代预算、RFP 或许可证。", "七日动作：建立 Umniah 二期 5G 配套清单；向 MoDEE 提供政府 AI 场景工作坊框架；对开发区数据中心项目完成许可适用性核验。", [["Umniah", "https://www.umniah.com/explore-umniah/umniah-network-expansion-with-ericsson/"], ["Petra", "https://www.petra.gov.jo/en/index.php/en/news/jordan-saudi-arabias-humain-sign-strategic-mou-to-advance-ai-development-and-innovation"]], "Jordan opportunity set: Umniah phase-two 5G, government AI use cases and compliance-based development-zone licensing", "The three tracks are respectively L2, L2 and a market-entry condition. Jordan remains comparatively executable, but an MoU and policy explanation do not replace a budget, RFP or licence.", "Seven-day actions: map Umniah phase-two 5G follow-ons; offer MoDEE a government-AI use-case workshop; and complete licensing applicability checks for development-zone data-centre projects.")
      ],
      [
        item("2026-09", "官网 · Umniah", "Umniah 宣布继续网络扩容和二期 5G", "官方公告把网络升级与企业云、数据交换和韧性需求直接关联。", "并入“运营商动态”“竞争对手”和“集团侧”三条主线。", [["官方原文", "https://www.umniah.com/explore-umniah/umniah-network-expansion-with-ericsson/"]], "Umniah announces continued network expansion and phase-two 5G", "The official release directly links the upgrade to enterprise cloud, data exchange and resilience needs.", "Routed to operator, competitor and group-level tracks."),
        item("2026-09-06", "政府媒体 · Petra", "MoDEE 与 HUMAIN 推进政府 AI 合作", "战略备忘录覆盖人才、创新与可规模化政府 AI 场景识别。", "并入“部委动态”和“头部客户机会”。", [["Petra 原文", "https://www.petra.gov.jo/en/index.php/en/news/jordan-saudi-arabias-humain-sign-strategic-mou-to-advance-ai-development-and-innovation"]], "MoDEE and HUMAIN advance government AI cooperation", "The strategic MoU covers skills, innovation and identification of scalable government AI use cases.", "Routed to ministry developments and top-customer opportunities."),
        item("2026-09-10", "官网 · 投资部", "投资部重申开发区合规承诺式许可机制", "官方更新说明该机制可缩短启动时间，但仍受后续检查和适用规则约束。", "并入独立“营商与合规”栏目。", [["投资部原文", "https://www.moin.gov.jo/En/NewsDetails/Amended_Investment_Environment_Regulation_Published_in_the_Official_Gazette"]], "Investment Ministry reiterates compliance-based licensing in development zones", "The refreshed official explanation says the mechanism can shorten start-up time while remaining subject to post-licensing inspection and applicable rules.", "Routed to the standalone business and compliance section.")
      ]
    ]
  },
  lb: {
    name: "黎巴嫩", nameEn: "Lebanon", flag: "🇱🇧", color: "#2F7A2F",
    sections: [
      [],
      [],
      [],
      [
        item(
          "2026-09-12", "AP + 黎巴嫩国家通讯社转述",
          "总统 Joseph Aoun 赴纳巴提耶视察，南部停火后的安全与网络恢复条件再度承压",
          "Aoun 在安全机构负责人陪同下访问纳巴提耶。报道指出，Ali Taher 高地附近局势仍紧张。该变化会直接影响南部通信站点进入许可、施工安全、燃料与备件运输及恢复工期。",
          "南部通信恢复项目采用分区进入、动态安保评估、移动基站/微波临时恢复和不可抗力里程碑；不以全国性计划替代站点级安全确认。",
          [["AP 9/12", "https://apnews.com/article/867b9fc371b7944264f8647f319520de"]],
          "President Joseph Aoun visits Nabatiyeh as post-ceasefire security and network-restoration conditions in the south come under renewed pressure",
          "Aoun visited Nabatiyeh accompanied by security chiefs. Reporting says tension remains around the Ali Taher ridge. This directly affects site-access approval, workforce safety, fuel and spare-parts logistics, and restoration schedules for southern telecom assets.",
          "Use zone-by-zone access, dynamic security reviews, mobile-site/microwave temporary restoration and force-majeure milestones. Do not substitute a national plan for site-level security confirmation."
        )
      ],
      [],
      [],
      [],
      [
        item(
          "2026-09-10", "美国财政部 OFAC 官方",
          "OFAC 制裁黎巴嫩现金、黄金和汇兑网络，付款链与最终受益人风险显著上升",
          "美国财政部行动点名 Hussein Ibrahim、Abdallah Hamieh、Ghaith Hussein Wehbe，以及相关黄金和汇兑主体，称其参与向 Hezbollah 转移资金。公告同时重申 50% 规则及与受制裁方提供或接受资金、货物、服务的风险。",
          "黎巴嫩项目必须筛查客户、分包商、汇兑所、收款银行、实际控制人及 50% 所有权；严禁以现金或非透明换汇绕过银行审查。",
          [["U.S. Treasury 9/10", "https://home.treasury.gov/news/press-releases/sb0626/"]],
          "OFAC sanctions Lebanese cash, gold and exchange networks, materially increasing payment-chain and beneficial-owner risk",
          "The U.S. Treasury action names Hussein Ibrahim, Abdallah Hamieh, Ghaith Hussein Wehbe and related gold and exchange entities, alleging participation in transfers to Hizballah. The notice reiterates the 50 Percent Rule and risks around providing or receiving funds, goods or services involving blocked persons.",
          "Screen customers, subcontractors, exchange houses, receiving banks, controllers and 50%-owned entities. Do not use cash or opaque exchange channels to bypass banking review."
        )
      ],
      [],
      [
        item(
          "2026-09-12", "本期综合研判",
          "黎巴嫩机会应只推进“有资金保障的网络恢复”，银行改革尚未解除回款约束",
          "银行重组法已于 9 月 10 日以第 71 号发布，但公开解读显示其实施仍取决于金融损失/存款回收立法。叠加新一轮 OFAC 行动和南部安全压力，大型无担保项目暂不具备可执行性。",
          "优先国际融资、托管账户、预付款或不可撤销保函支持的 FTTH、传输、LTE/5G 恢复项目；所有本地付款与分包链执行强化尽调。",
          [["银行法更新", "https://dailybeirut.com/en/lebanon-news/after-approval-in-the-parliament-aoun-publishes-law-on-bank-restructuring/"], ["U.S. Treasury", "https://home.treasury.gov/news/press-releases/sb0626/"]],
          "Lebanon opportunities should be limited to funded network restoration; banking reform has not removed collection constraints",
          "The bank-restructuring law was published as Law 71 on 10 September, but public legal analysis says implementation still depends on financial-loss/deposit-recovery legislation. Combined with fresh OFAC action and security pressure in the south, large unsecured projects are not yet executable.",
          "Prioritise FTTH, transport and LTE/5G restoration backed by international finance, escrow, advance payment or irrevocable guarantees. Apply enhanced due diligence to all local payment and subcontracting chains."
        )
      ],
      [
        item("2026-09-12", "政府动态 · NNA/AP", "Aoun 访问纳巴提耶并评估南部局势", "总统在安全机构负责人陪同下赴南部，显示站点进入和施工安全仍需动态判断。", "并入“政治动态”和“头部客户机会”风险条件。", [["AP 报道", "https://apnews.com/article/867b9fc371b7944264f8647f319520de"]], "Aoun visits Nabatiyeh and assesses conditions in the south", "The president travelled south with security chiefs, showing that site access and workforce security still require dynamic assessment.", "Routed to political developments and opportunity execution conditions."),
        item("2026-09-10", "法律媒体 · 多源核验", "第 71 号银行重组法发布，但实施仍附带前置立法条件", "新法推进银行改革，但不能据此认定存款回收、银行付款能力或项目回款已恢复。", "并入独立“营商与合规”栏目。", [["法律更新", "https://dailybeirut.com/en/lebanon-news/after-approval-in-the-parliament-aoun-publishes-law-on-bank-restructuring/"]], "Bank-restructuring Law 71 is published, but implementation remains conditional on further legislation", "The law advances bank reform, but does not establish that deposit recovery, banking payment capacity or project collections have normalised.", "Routed to the standalone business and compliance section."),
        item("2026-09-09", "公报动态 · Amnesty 复核", "黎巴嫩新媒体法于 9 月 3 日入公报，线上内容与媒体责任规则变化", "新法改善部分记者和线上表达保护，但对虚假有害新闻、侮辱和诽谤仍保留争议性条款。", "媒体、内容平台和企业外宣需更新本地法律审查清单。", [["Amnesty 9/9", "https://www.amnesty.org/en/latest/news/2026/09/lebanon-new-media-law-makes-progress-but-leaves-serious-free-expression-gaps/"]], "Lebanon's new media law enters the Gazette on 3 September, changing online-content and media-liability rules", "The law improves some protections for journalists and online expression while leaving contested provisions on false or harmful news, insult and defamation.", "Media, content platforms and corporate communications should refresh local legal-review checklists.")
      ]
    ]
  }
};

const summaryZh = [
  "🇮🇶 伊拉克与 Ooredoo 签署海湾—欧洲互联网过境合同，目标 3—4 个月接通；海缆登陆附件仍待下月签署并完成收益分成谈判。",
  "🇮🇶 通信部研究将政府安全 LTE 网络扩展至全部政府机构并评估 5G；CMC 同期启动国家级 AI 基础设施论证。",
  "🇮🇶 Korek 场所关闭扩大至基尔库克、尼尼微和萨拉赫丁，运营、采购与回款风险继续上升。",
  "🇮🇶🇱🇧 9 月 10 日美国财政部新制裁同时触及伊拉克通信解决方案企业/承包网络与黎巴嫩现金、黄金和汇兑网络，第三方审查必须增量重跑。",
  "🇯🇴 Umniah by Beyon 与 Ericsson 推进二期 5G 扩容；约旦与 HUMAIN 签署政府 AI 合作备忘录。",
  "🇯🇴 投资环境条例的“合规承诺式许可”有利于开发区项目加速，但仍受后检查和适用范围约束。",
  "🇱🇧 第 71 号银行重组法已发布，但回款环境仍取决于后续金融损失/存款回收立法。",
  "🇱🇧 南部安全压力上升；网络恢复项目须按站点确认进入条件并采用资金保障。",
  "📌 本期为 W37–38 滚动更新，信息截止 2026-09-12；9 月 18 日前的新事实将在周日自动任务继续补入同一期。"
];
const summaryEn = [
  "Iraq and Ooredoo signed a Gulf-to-Europe internet-transit contract targeting activation within three to four months; the marine-landing addendum and revenue-share terms remain pending.",
  "Iraq's Ministry of Communications is considering expansion of the secure government LTE network to all institutions and a 5G upgrade, while CMC has begun scoping national AI infrastructure.",
  "Korek location closures expanded to Kirkuk, Nineveh and Salah al-Din, further increasing operating, procurement and collection risk.",
  "A 10 September U.S. Treasury action reaches an Iraqi communications-solutions/contracting network and Lebanese cash, gold and exchange networks, requiring fresh third-party screening.",
  "Umniah by Beyon and Ericsson are advancing phase-two 5G expansion in Jordan, while Jordan and HUMAIN signed a government-AI cooperation MoU.",
  "Jordan's compliance-based licensing can accelerate eligible development-zone projects but remains subject to scope rules and post-licensing inspection.",
  "Lebanon has published bank-restructuring Law 71, but the collection environment still depends on further financial-loss and deposit-recovery legislation.",
  "Security pressure in southern Lebanon is rising; network-restoration work needs site-level access checks and protected funding.",
  "This is a rolling W37–38 update through 12 September 2026. New verified facts through 18 September will be added to the same issue by the Sunday automation."
];

for (const country of Object.values(countries)) {
  if (country.sections.length !== categories.length) throw new Error(`${country.name}: expected 11 sections`);
}

const esc = (value = "") => String(value).replace(/[&<>"']/g, (char) => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[char]));
const totalNews = Object.values(countries).reduce((sum, country) => sum + country.sections.reduce((n, section) => n + section.length, 0), 0);
const opportunities = Object.values(countries).reduce((sum, country) => sum + country.sections[9].length, 0);

const countryHtml = Object.entries(countries).map(([code, country]) => `
<div id="tab-${code}"><section class="country-panel" style="--accent:${country.color}">
  <header class="country-head"><span class="flag-badge">${country.flag} ${country.name} · ${country.sections.flat().length}条新闻</span></header>
  <div class="channels">
  ${country.sections.map((entries, index) => `<section class="ch-card">
    <div class="ch-head"><span class="ch-lbl">${categories[index][0]}</span><span class="count">${entries.length} 条</span></div>
    <div class="ch-body">${entries.length ? entries.map((entry) => `<article class="ni">
      <div class="ni-date">${esc(entry.date)}</div><span class="vbadge">${esc(entry.badge)}</span>
      <h3 class="ni-title">${esc(entry.title)}</h3>
      <p class="ni-text">${esc(entry.text)}</p>
      ${entry.links?.length ? `<div class="ni-src">${entry.links.map(([label, url]) => `<a href="${esc(url)}">→ ${esc(label)}</a>`).join(" ")}</div>` : ""}
      ${entry.opportunity ? `<div class="opp-box">🎯 ${esc(entry.opportunity)}</div>` : ""}
    </article>`).join("") : `<div class="empty">本期未发现满足双源或官方源门槛的新材料</div>`}</div>
  </section>`).join("")}
  </div>
</section></div>`).join("\n");

const html = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>黎凡特 ICT 双周简报 · ${issue}</title>
<style>
:root{font-family:Inter,"PingFang SC","Microsoft YaHei",sans-serif;color:#172033;background:#f4f7fb}*{box-sizing:border-box}body{margin:0}.wrap{max-width:1240px;margin:auto;padding:40px 22px 80px}.hero{background:#fff;border:1px solid #dfe7f1;border-radius:22px;padding:30px;box-shadow:0 16px 50px rgba(26,48,78,.08)}h1{margin:0 0 12px;font-size:32px}.top-meta,.retro-date{color:#64748b;margin:6px 0}.kpis{display:flex;gap:12px;flex-wrap:wrap;margin:22px 0}.kpi{min-width:150px;background:#f7f9fc;border:1px solid #e5ebf3;border-radius:14px;padding:14px}.kpi-val{font-size:24px;font-weight:800}.kpi-lbl{color:#64748b}.ov-list{padding-left:22px;line-height:1.75}.country-panel{margin-top:28px}.country-head{border-left:5px solid var(--accent);padding:10px 14px;background:#fff;border-radius:12px}.flag-badge{font-size:21px;font-weight:800}.channels{display:grid;gap:15px;margin-top:14px}.ch-card{background:#fff;border:1px solid #dfe7f1;border-radius:16px;overflow:hidden}.ch-head{display:flex;justify-content:space-between;padding:15px 18px;border-top:3px solid var(--accent);border-bottom:1px solid #e8edf4}.ch-lbl{font-weight:800}.count{color:#64748b}.ch-body{padding:0 18px}.ni{padding:19px 0;border-bottom:1px solid #edf1f6}.ni:last-child{border:0}.ni-date{display:inline-block;color:#64748b;margin-right:8px}.vbadge{font-size:12px;color:#12693b;background:#e8f7ee;border-radius:999px;padding:4px 8px}.ni-title{margin:12px 0 8px;font-size:19px}.ni-text{line-height:1.7;color:#42526a}.ni-src a{color:#0969da;margin-right:12px;text-decoration:none}.opp-box{margin-top:13px;padding:13px 15px;background:#fff7e5;border-left:4px solid #d99a12;color:#6d4b00;line-height:1.6}.empty{padding:20px;color:#7b8798;background:#fafbfd}.foot{margin-top:32px;color:#64748b;text-align:center}@media(max-width:640px){.wrap{padding:18px 12px}.hero{padding:20px}h1{font-size:25px}}
</style></head><body><main class="wrap"><section class="hero"><h1>黎凡特 ICT 双周简报 · ${issue}</h1><div class="top-meta">生成日期：2026年9月12日 · 作者：${author}</div><div class="retro-date">${periodZh}</div><div class="kpis"><div class="kpi"><div class="kpi-val">${totalNews}</div><div class="kpi-lbl">本期新闻</div></div><div class="kpi"><div class="kpi-val">${opportunities}</div><div class="kpi-lbl">商机信号</div></div></div><ul class="ov-list">${summaryZh.map((line) => `<li>${esc(line)}</li>`).join("")}</ul></section>${countryHtml}<div class="foot">公开信源研判，不构成法律意见 · ${author}</div></main></body></html>`;

await fs.writeFile("legacy/w37-38.html", html);
await fs.writeFile("public/archive/w37-38.html", html);
await fs.writeFile("w37-38.html", html);
await fs.writeFile("config/report-translations-en.json", JSON.stringify({ issue, period: periodEn, summary: summaryEn }, null, 2));
for (const [code, country] of Object.entries(countries)) {
  const translation = {
    name: country.nameEn,
    sections: country.sections.map((entries, index) => ({
      category: categories[index][1],
      items: entries.map((entry) => ({ title: entry.titleEn, text: entry.textEn, opportunity: entry.opportunityEn || "" }))
    }))
  };
  await fs.writeFile(`config/report-translations-en-${code}.json`, JSON.stringify(translation, null, 2));
}
console.log(`Generated ${issue}: ${totalNews} items, 33 fixed country sections.`);
