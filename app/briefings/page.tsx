import { BriefingsPageContent } from "@/components/briefings-page-content";
import report from "@/data/report.json";
import signals from "@/data/social-signals.json";
import telegramFeed from "@/data/telegram-feed.json";

export default function BriefingsPage() {
  return <BriefingsPageContent report={report} signals={signals} telegramFeed={telegramFeed}/>;
}
