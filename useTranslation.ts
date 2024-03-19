import { useEffect, useState } from "react";
import translations from "./i18n/translations";

type UseTranslationReturn = {
    t: (key: string) => string;
    setLanguage: (language: string) => void;
};

const useTranslation = (): UseTranslationReturn => {
    const [language, setLang] = useState<string>("en-US");

    const t = (key: string): string => {
        const path = key.split('.'); // Split the key by '.' to get the path
        let current = translations[language];

        for (let i = 0; i < path.length; i++) {
            if (current[path[i]] !== undefined) {
                current = current[path[i]];
            } else {
                // Return the original key if any part of the path doesn't exist
                return key;
            }
        }

        // If the final value is a string, return it; otherwise, return the original key
        return typeof current === 'string' ? current : key;
    };

    const setLanguage = (language: string): void => {
        setLang(language);
    };

    useEffect(() => {
        const lang = localStorage.getItem("lang");
        if (lang) {
            setLang(lang);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("lang", language);
    }, [language]);

    return { t, setLanguage };
};

export default useTranslation;
