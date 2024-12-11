import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

type Translations = Record<string, string | Record<string, unknown>>;

type TranslationContextType = {
  t: (key: string) => string;
  setLanguage: (language: string) => void;
  language: string;
};

const TranslationContext = createContext<TranslationContextType | null>(null);

const DEFAULT_LANGUAGE = "en-US";

// Function to dynamically load translation files
const loadTranslations = async (lang: string): Promise<Translations> => {
  switch (lang) {
    case "en-US":
      return await import("../i18n/en-US.json");
    case "he-IL":
      return await import("../i18n/he-IL.json");
    default:
      throw new Error(`Unsupported language: ${lang}`);
  }
};

const TranslationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [language, setLang] = useState<string>(
    () => localStorage.getItem("lang") || DEFAULT_LANGUAGE
  );
  const [translations, setTranslations] = useState<Translations>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const lang = localStorage.getItem("lang") || DEFAULT_LANGUAGE;
    setLang(lang);
  }, []);

  useEffect(() => {
    const fetchTranslations = async () => {
      setIsLoading(true);
      try {
        const loadedTranslations = await loadTranslations(language);
        setTranslations(loadedTranslations);
      } catch (error) {
        console.error(
          `Failed to load translations for ${language}, falling back to ${DEFAULT_LANGUAGE}:`,
          error
        );
        const fallbackTranslations = await loadTranslations(DEFAULT_LANGUAGE);
        setTranslations(fallbackTranslations);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTranslations();
  }, [language]);

  const resolveNestedKey = (
    obj: Translations,
    path: string[]
  ): string | undefined => {
    return path.reduce<Translations | string | undefined>((acc, part) => {
      if (acc && typeof acc === "object" && part in acc) {
        return acc[part] as Translations | string;
      }
      return undefined; // Stop if part is not found
    }, obj) as string | undefined;
  };

  const t = useCallback(
    (key: string): string => {
      const path = key.split(".");
      const value = resolveNestedKey(translations, path);
      return typeof value === "string" ? value : key;
    },
    [translations]
  );

  useEffect(() => {
    localStorage.setItem("lang", language);
  }, [language]);

  return (
    <TranslationContext.Provider value={{ t, setLanguage: setLang, language }}>
      {!isLoading && children}
    </TranslationContext.Provider>
  );
};

const useTranslation = (): TranslationContextType => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
};

export { TranslationProvider, useTranslation };
