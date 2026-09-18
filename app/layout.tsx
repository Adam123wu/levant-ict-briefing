import type { Metadata } from "next";
import "./globals.css";
import { NepalShell as AppShell } from "@/components/nepal-shell";
import { LanguageProvider } from "@/components/language-context";

export const metadata: Metadata = { title: "尼泊尔 ICT 情报中心", description: "尼泊尔 ICT 双周新闻、监管与政府机构、运营商、设备商及社交媒体监控" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body><LanguageProvider><AppShell>{children}</AppShell></LanguageProvider></body></html>;
}
