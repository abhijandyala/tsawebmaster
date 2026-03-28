'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Globe, ChevronDown } from 'lucide-react';
import { useGoogleTranslate } from '@/lib/useGoogleTranslate';

/** Google Translate website widget codes — search filters the list. */
const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'es', name: 'Spanish', native: 'Español' },
  { code: 'fr', name: 'French', native: 'Français' },
  { code: 'de', name: 'German', native: 'Deutsch' },
  { code: 'it', name: 'Italian', native: 'Italiano' },
  { code: 'pt', name: 'Portuguese', native: 'Português' },
  { code: 'nl', name: 'Dutch', native: 'Nederlands' },
  { code: 'pl', name: 'Polish', native: 'Polski' },
  { code: 'ru', name: 'Russian', native: 'Русский' },
  { code: 'uk', name: 'Ukrainian', native: 'Українська' },
  { code: 'cs', name: 'Czech', native: 'Čeština' },
  { code: 'sk', name: 'Slovak', native: 'Slovenčina' },
  { code: 'ro', name: 'Romanian', native: 'Română' },
  { code: 'hu', name: 'Hungarian', native: 'Magyar' },
  { code: 'bg', name: 'Bulgarian', native: 'Български' },
  { code: 'hr', name: 'Croatian', native: 'Hrvatski' },
  { code: 'sr', name: 'Serbian', native: 'Српски' },
  { code: 'sl', name: 'Slovenian', native: 'Slovenščina' },
  { code: 'el', name: 'Greek', native: 'Ελληνικά' },
  { code: 'sv', name: 'Swedish', native: 'Svenska' },
  { code: 'da', name: 'Danish', native: 'Dansk' },
  { code: 'no', name: 'Norwegian', native: 'Norsk' },
  { code: 'fi', name: 'Finnish', native: 'Suomi' },
  { code: 'et', name: 'Estonian', native: 'Eesti' },
  { code: 'lv', name: 'Latvian', native: 'Latviešu' },
  { code: 'lt', name: 'Lithuanian', native: 'Lietuvių' },
  { code: 'ga', name: 'Irish', native: 'Gaeilge' },
  { code: 'cy', name: 'Welsh', native: 'Cymraeg' },
  { code: 'is', name: 'Icelandic', native: 'Íslenska' },
  { code: 'sq', name: 'Albanian', native: 'Shqip' },
  { code: 'mk', name: 'Macedonian', native: 'Македонски' },
  { code: 'bs', name: 'Bosnian', native: 'Bosanski' },
  { code: 'tr', name: 'Turkish', native: 'Türkçe' },
  { code: 'he', name: 'Hebrew', native: 'עברית' },
  { code: 'fa', name: 'Persian', native: 'فارسی' },
  { code: 'ar', name: 'Arabic', native: 'العربية' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'ur', name: 'Urdu', native: 'اردو' },
  { code: 'ne', name: 'Nepali', native: 'नेपाली' },
  { code: 'si', name: 'Sinhala', native: 'සිංහල' },
  { code: 'zh-CN', name: 'Chinese (Simplified)', native: '简体中文' },
  { code: 'zh-TW', name: 'Chinese (Traditional)', native: '繁體中文' },
  { code: 'ja', name: 'Japanese', native: '日本語' },
  { code: 'ko', name: 'Korean', native: '한국어' },
  { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt' },
  { code: 'th', name: 'Thai', native: 'ไทย' },
  { code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia' },
  { code: 'ms', name: 'Malay', native: 'Bahasa Melayu' },
  { code: 'tl', name: 'Tagalog', native: 'Tagalog' },
  { code: 'my', name: 'Burmese', native: 'မြန်မာ' },
  { code: 'km', name: 'Khmer', native: 'ភាសាខ្មែរ' },
  { code: 'lo', name: 'Lao', native: 'ລາວ' },
  { code: 'jv', name: 'Javanese', native: 'Basa Jawa' },
  { code: 'sw', name: 'Swahili', native: 'Kiswahili' },
  { code: 'am', name: 'Amharic', native: 'አማርኛ' },
  { code: 'so', name: 'Somali', native: 'Soomaali' },
  { code: 'ha', name: 'Hausa', native: 'Hausa' },
  { code: 'yo', name: 'Yoruba', native: 'Yorùbá' },
  { code: 'zu', name: 'Zulu', native: 'isiZulu' },
  { code: 'xh', name: 'Xhosa', native: 'isiXhosa' },
  { code: 'af', name: 'Afrikaans', native: 'Afrikaans' },
  { code: 'ht', name: 'Haitian Creole', native: 'Kreyòl Ayisyen' },
  { code: 'ka', name: 'Georgian', native: 'ქართული' },
  { code: 'hy', name: 'Armenian', native: 'Հայերեն' },
  { code: 'az', name: 'Azerbaijani', native: 'Azərbaycan' },
  { code: 'kk', name: 'Kazakh', native: 'Қазақ' },
  { code: 'uz', name: 'Uzbek', native: 'Oʻzbek' },
  { code: 'ky', name: 'Kyrgyz', native: 'Кыргызча' },
  { code: 'tg', name: 'Tajik', native: 'Тоҷикӣ' },
  { code: 'mn', name: 'Mongolian', native: 'Монгол' },
  { code: 'ps', name: 'Pashto', native: 'پښتو' },
  { code: 'ku', name: 'Kurdish', native: 'Kurdî' },
  { code: 'la', name: 'Latin', native: 'Latina' },
  { code: 'ca', name: 'Catalan', native: 'Català' },
  { code: 'eu', name: 'Basque', native: 'Euskara' },
  { code: 'gl', name: 'Galician', native: 'Galego' },
];

const PANEL_WIDTH = 288;
const PANEL_GAP = 8;

export function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const [panelRect, setPanelRect] = useState({ top: 0, left: 0, width: PANEL_WIDTH });
  const triggerRef = useRef<HTMLButtonElement>(null);

  const { currentLang, changeLanguage } = useGoogleTranslate({
    languages: SUPPORTED_LANGUAGES,
    pageLanguage: 'en',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const updatePanelPosition = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const width = Math.min(PANEL_WIDTH, vw - 24);
    const left = Math.max(12, Math.min(r.right - width, vw - width - 12));
    const top = r.bottom + PANEL_GAP;
    setPanelRect({ top, left, width });
  }, []);

  useLayoutEffect(() => {
    if (!isOpen) return;
    updatePanelPosition();
    window.addEventListener('resize', updatePanelPosition);
    window.addEventListener('scroll', updatePanelPosition, true);
    return () => {
      window.removeEventListener('resize', updatePanelPosition);
      window.removeEventListener('scroll', updatePanelPosition, true);
    };
  }, [isOpen, updatePanelPosition]);

  const filteredLanguages = SUPPORTED_LANGUAGES.filter(
    (lang) =>
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.native.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLanguageChange = (langCode: string) => {
    changeLanguage(langCode);
    setIsOpen(false);
  };

  const close = () => {
    setIsOpen(false);
    setSearchQuery('');
  };

  const currentLanguage = SUPPORTED_LANGUAGES.find((l) => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  const dropdown =
    mounted &&
    isOpen &&
    createPortal(
      <>
        <div
          className="fixed inset-0 z-[200] bg-black/30 backdrop-blur-[2px] sm:bg-black/20"
          aria-hidden
          onClick={close}
        />
        <div
          role="listbox"
          aria-label="Languages"
          className="fixed z-[210] flex max-h-[min(70vh,24rem)] flex-col overflow-hidden rounded-2xl border border-border-light bg-surface/98 shadow-2xl ring-1 ring-black/5 backdrop-blur-xl dark:ring-white/10"
          style={{
            top: panelRect.top,
            left: panelRect.left,
            width: panelRect.width,
          }}
        >
          <div className="shrink-0 border-b border-border p-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search languages…"
              className="w-full min-w-0 rounded-xl border-2 border-border bg-surface-muted px-3 py-2.5 text-sm text-foreground placeholder:text-foreground-muted focus:border-accent focus:outline-none"
              autoFocus
            />
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain py-1">
            {filteredLanguages.length === 0 ? (
              <p className="px-4 py-3 text-center text-sm text-foreground-muted">No languages found</p>
            ) : (
              filteredLanguages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  role="option"
                  aria-selected={currentLang === lang.code}
                  onClick={() => {
                    handleLanguageChange(lang.code);
                    setSearchQuery('');
                  }}
                  className={`mx-1 flex w-[calc(100%-0.5rem)] flex-col items-stretch gap-0.5 rounded-xl px-3 py-2.5 text-left transition-colors ${
                    currentLang === lang.code
                      ? 'bg-accent-soft font-semibold text-accent-dark'
                      : 'text-foreground hover:bg-accent-soft/30'
                  }`}
                >
                  <span className="break-words text-sm font-medium leading-snug">{lang.native}</span>
                  <span className="break-words text-xs leading-snug text-foreground-muted">{lang.name}</span>
                </button>
              ))
            )}
          </div>
          <div className="shrink-0 border-t border-border p-2">
            <p className="text-center text-xs text-foreground-muted">
              {SUPPORTED_LANGUAGES.length} languages • Google Translate
            </p>
          </div>
        </div>
      </>,
      document.body
    );

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="flex items-center gap-2 rounded-xl border-2 border-border px-3 py-2 text-sm font-medium text-foreground-secondary transition-colors hover:border-accent/40 hover:bg-accent-soft/25 hover:text-accent"
        aria-label="Select language"
      >
        <Globe className="h-4 w-4 shrink-0" />
        <span className="hidden sm:inline">{currentLanguage.native}</span>
        <ChevronDown className={`h-3 w-3 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {dropdown}
    </div>
  );
}
