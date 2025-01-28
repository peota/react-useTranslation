# useTranslation Hook & Translation Context

## Overview
The `useTranslation` hook and the `TranslationContext` provide a lightweight solution for managing translations and localization in your React application. These utilities support nested keys for translation lookups, dynamic language switching, and persistent language preferences.

## Features
- **Dynamic Language Switching:** Users can change the language dynamically.
- **Nested Key Support:** Translation keys can be nested, enabling better organization of translation files.
- **Persistent Language Setting:** The selected language is stored in `localStorage` and loaded automatically.
- **Error Handling:** Fallbacks to a default language if the translation file is missing.
- **Customizable:** Translation files can be dynamically loaded.

---

## useTranslation Hook

### File: `useTranslation.ts`

### Description
This hook provides utility methods to:
- Fetch translated strings using the `t` function.
- Change the current language using the `setLanguage` function.

### Usage
```tsx
import useTranslation from './useTranslation';

const Component = () => {
    const { t, setLanguage } = useTranslation();

    return (
        <div>
            <p>{t('greeting.hello')}</p>
            <button onClick={() => setLanguage('he-IL')}>Switch to Hebrew</button>
        </div>
    );
};
```

### API
#### `t(key: string): string`
Translates a given key to the current language. If the key does not exist, the original key is returned.

#### `setLanguage(language: string): void`
Updates the current language and persists it in `localStorage`.

---

## Translation Context

### File: `TranslationContext.ts`

### Description
Provides a global context for managing translations and the current language across the entire application.

### Components
#### `TranslationProvider`
Wraps your application to provide translation functionality.

#### `useTranslation`
A custom hook that accesses the translation context.

### Usage

#### Provider Setup
```tsx
import { TranslationProvider } from './TranslationContext';

const App = () => (
    <TranslationProvider>
        <YourAppComponents />
    </TranslationProvider>
);
```

#### Using Translations
```tsx
import { useTranslation } from './TranslationContext';

const Component = () => {
    const { t, setLanguage, language } = useTranslation();

    return (
        <div>
            <p>{t('greeting.hello')}</p>
            <p>Current Language: {language}</p>
            <button onClick={() => setLanguage('en-US')}>Switch to English</button>
        </div>
    );
};
```

### API
#### `TranslationProvider`
Wraps your application and provides translation data and state.

#### `useTranslation`
Access translation methods and the current language.

- **`t(key: string): string`**
  Resolves a key to its translated value. Supports nested keys.
- **`setLanguage(language: string): void`**
  Updates the current language and reloads the appropriate translation file.
- **`language: string`**
  The current language.

---

## Translation Files

### Folder Structure
```
src/
  i18n/
    en-US.json
    he-IL.json
```

### Example Translation File: `en-US.json`
```json
{
    "greeting": {
        "hello": "Hello",
        "welcome": "Welcome"
    }
}
```

### Example Translation File: `he-IL.json`
```json
{
    "greeting": {
        "hello": "שלום",
        "welcome": "ברוך הבא"
    }
}
```

---

## Key Highlights
- **Dynamic Import:** The `loadTranslations` function dynamically loads translation files based on the current language.
- **Fallback Mechanism:** Automatically falls back to the default language (`en-US`) if a translation file fails to load.

---

## Error Handling
- If a translation key is missing, the `t` function returns the original key.
- If the language is unsupported, an error is logged, and the default language is used.

---

## Future Improvements
- **TypeScript Enhancements:** Stronger typing for translation keys.
- **Language Detection:** Automatically detect the user’s preferred language.
- **Performance:** Cache loaded translations to minimize re-fetching.

---

## Contribution
Feel free to submit issues and pull requests for improvements or new features.

