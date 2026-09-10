"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Language = "zh" | "en";
type LanguageContextValue = {language: Language; setLanguage: (language: Language) => void};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: {children: React.ReactNode}) {
  const [language, setLanguage] = useState<Language>("zh");
  useEffect(() => {
    document.documentElement.lang = language === "en" ? "en" : "zh-CN";
  }, [language]);
  const value = useMemo(() => ({language, setLanguage}), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
