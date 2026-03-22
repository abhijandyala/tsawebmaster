'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

interface Language {
  code: string;
  name: string;
  native: string;
}

interface UseGoogleTranslateOptions {
  languages: Language[];
  pageLanguage?: string;
  elementId?: string;
}

interface UseGoogleTranslateReturn {
  currentLang: string;
  isLoaded: boolean;
  changeLanguage: (langCode: string) => void;
}

declare global {
  interface Window {
    google: {
      translate: {
        TranslateElement: new (
          options: {
            pageLanguage: string;
            includedLanguages?: string;
            layout?: number;
            autoDisplay?: boolean;
          },
          elementId: string
        ) => void;
      };
    };
    googleTranslateElementInit: () => void;
  }
}

function getGoogleTranslateCookie(): string | null {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'googtrans' && value) {
      const parts = value.split('/');
      if (parts.length >= 3) {
        return parts[2];
      }
    }
  }
  return null;
}

function triggerGoogleTranslate(langCode: string): boolean {
  const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
  if (select) {
    select.value = langCode;
    select.dispatchEvent(new Event('change'));
    return true;
  }
  return false;
}

export function useGoogleTranslate({ 
  languages, 
  pageLanguage = 'en',
  elementId = 'google_translate_element'
}: UseGoogleTranslateOptions): UseGoogleTranslateReturn {
  const [currentLang, setCurrentLang] = useState('en');
  const [isLoaded, setIsLoaded] = useState(false);
  const languagesRef = useRef(languages);
  const pageLanguageRef = useRef(pageLanguage);
  const elementIdRef = useRef(elementId);

  languagesRef.current = languages;
  pageLanguageRef.current = pageLanguage;
  elementIdRef.current = elementId;

  useEffect(() => {
    let checkInterval: ReturnType<typeof setInterval> | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let isMounted = true;

    const googleLang = getGoogleTranslateCookie();
    let savedLang = 'en';
    try {
      savedLang = localStorage.getItem('preferred-language') || 'en';
    } catch {
      /* private mode / blocked storage */
    }
    const initialLang = googleLang || savedLang;
    setCurrentLang(initialLang);

    if (initialLang !== savedLang) {
      try {
        localStorage.setItem('preferred-language', initialLang);
      } catch {
        /* ignore */
      }
    }

    const ensureTranslateWidget = () => {
      if (!isMounted) return;
      if (!window.google?.translate?.TranslateElement) return;

      const targetElement = document.getElementById(elementIdRef.current);
      if (!targetElement) {
        console.warn(`Google Translate: Element with ID '${elementIdRef.current}' not found`);
        return;
      }

      // Widget already created (e.g. React Strict Mode remount)
      if (targetElement.childElementCount > 0) {
        setIsLoaded(true);
        return;
      }

      new window.google.translate.TranslateElement(
        {
          pageLanguage: pageLanguageRef.current,
          includedLanguages: languagesRef.current.map((l) => l.code).join(','),
          autoDisplay: false,
        },
        elementIdRef.current
      );
      setIsLoaded(true);
    };

    window.googleTranslateElementInit = () => {
      ensureTranslateWidget();
    };

    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src =
        'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    } else if (window.google?.translate?.TranslateElement) {
      ensureTranslateWidget();
    } else {
      checkInterval = setInterval(() => {
        if (window.google?.translate?.TranslateElement) {
          ensureTranslateWidget();
          if (checkInterval) clearInterval(checkInterval);
        }
      }, 100);

      timeoutId = setTimeout(() => {
        if (checkInterval) clearInterval(checkInterval);
      }, 5000);
    }

    return () => {
      isMounted = false;
      if (checkInterval) clearInterval(checkInterval);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const changeLanguage = useCallback((langCode: string) => {
    setCurrentLang(langCode);
    try {
      localStorage.setItem('preferred-language', langCode);
    } catch {
      /* ignore */
    }

    if (!triggerGoogleTranslate(langCode)) {
      let attempts = 0;
      const maxAttempts = 10;
      const interval = setInterval(() => {
        attempts++;
        if (triggerGoogleTranslate(langCode) || attempts >= maxAttempts) {
          clearInterval(interval);
        }
      }, 200);
    }
  }, []);

  return { currentLang, isLoaded, changeLanguage };
}
