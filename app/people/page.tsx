import { Users } from "lucide-react";
import { PeopleTable } from "@/components/people-table";
import people from "@/data/people.json";

export default function PeoplePage(){return <><div className="hero"><div><div className="eyebrow">Government Stakeholder Monitor</div><h1>政府人员监控</h1><p>伊拉克、约旦、黎巴嫩国家级元首、总理与现任内阁</p></div><span className="chip"><Users size={13} style={{display:"inline",marginRight:5}}/>78个岗位</span></div><PeopleTable data={people}/></>}
