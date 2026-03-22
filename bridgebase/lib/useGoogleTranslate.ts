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
  const initializedRef = useRef(false);
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

    if (initializedRef.current) {
      return;
    }

    if (!document.getElementById('google-translate-script')) {
      initializedRef.current = true;
      
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);

      window.googleTranslateElementInit = () => {
        if (!isMounted) return;
        
        if (!window.google?.translate?.TranslateElement) {
          console.warn('Google Translate: API not yet available');
          return;
        }
        
        const targetElement = document.getElementById(elementIdRef.current);
        if (!targetElement) {
          console.warn(`Google Translate: Element with ID '${elementIdRef.current}' not found`);
          return;
        }
        
        new window.google.translate.TranslateElement(
          {
            pageLanguage: pageLanguageRef.current,
            includedLanguages: languagesRef.current.map(l => l.code).join(','),
            autoDisplay: false,
          },
          elementIdRef.current
        );
        setIsLoaded(true);
      };
    } else if (window.google?.translate) {
      setIsLoaded(true);
    } else {
      checkInterval = setInterval(() => {
        if (window.google?.translate) {
          if (isMounted) setIsLoaded(true);
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
      if (window.googleTranslateElementInit) {
        window.googleTranslateElementInit = () => {};
      }
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
