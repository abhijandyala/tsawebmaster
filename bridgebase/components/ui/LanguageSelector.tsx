'use client';

import { useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useGoogleTranslate } from '@/lib/useGoogleTranslate';

const SUPPORTED_LANGUAGES = [
  // Most common in Charlotte
  { code: 'en', name: 'English', native: 'English' },
  { code: 'es', name: 'Spanish', native: 'Español' },
  { code: 'zh-CN', name: 'Chinese (Simplified)', native: '简体中文' },
  { code: 'zh-TW', name: 'Chinese (Traditional)', native: '繁體中文' },
  { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt' },
  { code: 'ko', name: 'Korean', native: '한국어' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'ar', name: 'Arabic', native: 'العربية' },
  { code: 'tl', name: 'Tagalog/Filipino', native: 'Tagalog' },
  { code: 'fr', name: 'French', native: 'Français' },
  
  // South Asian languages
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ur', name: 'Urdu', native: 'اردو' },
  { code: 'ne', name: 'Nepali', native: 'नेपाली' },
  { code: 'si', name: 'Sinhala', native: 'සිංහල' },
  
  // Southeast Asian languages
  { code: 'th', name: 'Thai', native: 'ไทย' },
  { code: 'my', name: 'Burmese', native: 'မြန်မာ' },
  { code: 'km', name: 'Khmer', native: 'ភាសាខ្មែរ' },
  { code: 'lo', name: 'Lao', native: 'ລາວ' },
  { code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia' },
  { code: 'ms', name: 'Malay', native: 'Bahasa Melayu' },
  
  // East Asian languages
  { code: 'ja', name: 'Japanese', native: '日本語' },
  
  // Middle Eastern languages
  { code: 'fa', name: 'Persian/Farsi', native: 'فارسی' },
  { code: 'he', name: 'Hebrew', native: 'עברית' },
  { code: 'tr', name: 'Turkish', native: 'Türkçe' },
  { code: 'ku', name: 'Kurdish', native: 'Kurdî' },
  { code: 'ps', name: 'Pashto', native: 'پښتو' },
  
  // African languages
  { code: 'am', name: 'Amharic', native: 'አማርኛ' },
  { code: 'sw', name: 'Swahili', native: 'Kiswahili' },
  { code: 'so', name: 'Somali', native: 'Soomaali' },
  { code: 'ha', name: 'Hausa', native: 'Hausa' },
  { code: 'yo', name: 'Yoruba', native: 'Yorùbá' },
  { code: 'ig', name: 'Igbo', native: 'Igbo' },
  { code: 'zu', name: 'Zulu', native: 'isiZulu' },
  
  // European languages
  { code: 'de', name: 'German', native: 'Deutsch' },
  { code: 'pt', name: 'Portuguese', native: 'Português' },
  { code: 'ru', name: 'Russian', native: 'Русский' },
  { code: 'uk', name: 'Ukrainian', native: 'Українська' },
  { code: 'pl', name: 'Polish', native: 'Polski' },
  { code: 'it', name: 'Italian', native: 'Italiano' },
  { code: 'nl', name: 'Dutch', native: 'Nederlands' },
  { code: 'el', name: 'Greek', native: 'Ελληνικά' },
  { code: 'ro', name: 'Romanian', native: 'Română' },
  { code: 'hu', name: 'Hungarian', native: 'Magyar' },
  { code: 'cs', name: 'Czech', native: 'Čeština' },
  { code: 'sv', name: 'Swedish', native: 'Svenska' },
  { code: 'no', name: 'Norwegian', native: 'Norsk' },
  { code: 'da', name: 'Danish', native: 'Dansk' },
  { code: 'fi', name: 'Finnish', native: 'Suomi' },
  { code: 'bg', name: 'Bulgarian', native: 'Български' },
  { code: 'hr', name: 'Croatian', native: 'Hrvatski' },
  { code: 'sr', name: 'Serbian', native: 'Српски' },
  { code: 'sk', name: 'Slovak', native: 'Slovenčina' },
  { code: 'sl', name: 'Slovenian', native: 'Slovenščina' },
  { code: 'lt', name: 'Lithuanian', native: 'Lietuvių' },
  { code: 'lv', name: 'Latvian', native: 'Latviešu' },
  { code: 'et', name: 'Estonian', native: 'Eesti' },
  
  // Latin American indigenous
  { code: 'ht', name: 'Haitian Creole', native: 'Kreyòl Ayisyen' },
  
  // Caribbean
  { code: 'jw', name: 'Javanese', native: 'Basa Jawa' },
  
  // Other
  { code: 'ka', name: 'Georgian', native: 'ქართული' },
  { code: 'hy', name: 'Armenian', native: 'Հայերեն' },
  { code: 'az', name: 'Azerbaijani', native: 'Azərbaycan' },
  { code: 'uz', name: 'Uzbek', native: 'Oʻzbek' },
  { code: 'kk', name: 'Kazakh', native: 'Қазақ' },
  { code: 'mn', name: 'Mongolian', native: 'Монгол' },
];

export function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { currentLang, changeLanguage } = useGoogleTranslate({
    languages: SUPPORTED_LANGUAGES,
    pageLanguage: 'en',
  });

  const filteredLanguages = SUPPORTED_LANGUAGES.filter(lang =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.native.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLanguageChange = (langCode: string) => {
    changeLanguage(langCode);
    setIsOpen(false);
  };

  const currentLanguage = SUPPORTED_LANGUAGES.find(l => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-foreground-secondary hover:text-foreground border border-border hover:border-primary/50 transition-colors"
        aria-label="Select language"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{currentLanguage.native}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => { setIsOpen(false); setSearchQuery(''); }} 
          />
          <div className="absolute right-0 top-full mt-2 w-72 max-h-96 bg-surface border border-border shadow-lg z-50 flex flex-col">
            <div className="p-2 border-b border-border">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search languages..."
                className="w-full px-3 py-2 text-sm bg-background border border-border text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-primary"
                autoFocus
              />
            </div>
            <div className="flex-1 overflow-y-auto py-1">
              {filteredLanguages.length === 0 ? (
                <p className="px-4 py-3 text-sm text-foreground-muted text-center">
                  No languages found
                </p>
              ) : (
                filteredLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => { handleLanguageChange(lang.code); setSearchQuery(''); }}
                    className={`w-full px-4 py-2.5 text-left text-sm hover:bg-background transition-colors flex items-center justify-between ${
                      currentLang === lang.code ? 'bg-primary/5 text-primary' : 'text-foreground'
                    }`}
                  >
                    <span className="font-medium">{lang.native}</span>
                    <span className="text-foreground-muted text-xs">{lang.name}</span>
                  </button>
                ))
              )}
            </div>
            <div className="p-2 border-t border-border">
              <p className="text-xs text-foreground-muted text-center">
                {SUPPORTED_LANGUAGES.length} languages • Powered by Google Translate
              </p>
            </div>
          </div>
        </>
      )}

      {/* Hidden Google Translate element */}
      <div id="google_translate_element" className="hidden" />

      {/* Hide Google Translate banner */}
      <style jsx global>{`
        .goog-te-banner-frame,
        .goog-te-balloon-frame,
        #goog-gt-tt,
        .goog-te-gadget,
        .goog-tooltip,
        .goog-tooltip:hover {
          display: none !important;
        }
        body {
          top: 0 !important;
        }
        .skiptranslate {
          display: none !important;
        }
        .goog-te-spinner-pos {
          display: none !important;
        }
      `}</style>
    </div>
  );
}
