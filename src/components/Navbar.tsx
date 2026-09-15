import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import {
  Sparkles,
  FlaskConical,
  Gamepad2,
  BarChart3,
  Award,
  Info,
  Menu,
  X,
  Sun,
  Moon,
  Monitor,
  Globe,
  ChevronDown,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Language, Theme } from '../types';

export const Navbar: React.FC = () => {
  const { language, setLanguage, theme, setTheme, t, achievements } = useApp();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
      if (themeRef.current && !themeRef.current.contains(event.target as Node)) {
        setThemeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setLangDropdownOpen(false);
    setThemeDropdownOpen(false);
  }, [location.pathname, location.search]);

  // Prevent background scroll when mobile menu is open on small screens
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { path: '/', label: t('navHome'), icon: Sparkles },
    { path: '/games', label: t('navGames'), icon: Gamepad2 },
    { path: '/lab', label: t('navLab'), icon: FlaskConical },
    { path: '/stats', label: t('navStats'), icon: BarChart3 },
    {
      path: '/achievements',
      label: t('navAchievements'),
      icon: Award,
      badge: unlockedCount > 0 ? unlockedCount : undefined,
    },
    { path: '/about', label: t('navProject'), icon: Info },
  ];

  const languages: { code: Language; label: string; flag: string; short: string }[] = [
    { code: 'hy', label: 'Հայերեն', flag: '🇦🇲', short: 'ՀԱՅ' },
    { code: 'en', label: 'English', flag: '🇬🇧', short: 'ENG' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺', short: 'РУС' },
  ];

  const themes: { code: Theme; label: string; icon: typeof Sun }[] = [
    { code: 'light', label: t('themeLight'), icon: Sun },
    { code: 'dark', label: t('themeDark'), icon: Moon },
    { code: 'system', label: t('themeSystem'), icon: Monitor },
  ];

  const currentLangObj = languages.find(l => l.code === language) || languages[0];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-[#06090e]/95 backdrop-blur-xl shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Mobile Left: Hamburger button */}
          <div className="flex items-center lg:hidden mr-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={t('mobileMenu')}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Brand Logo & Title */}
          <Link
            to="/"
            className="flex items-center space-x-2.5 sm:space-x-3 group focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl p-1 min-w-0"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-500 p-0.5 flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:shadow-indigo-500/35 transition-shadow">
              <div className="w-full h-full bg-white dark:bg-[#06090e] rounded-[10px] flex items-center justify-center">
                <span className="text-xs sm:text-base font-extrabold font-mono-math text-indigo-600 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-cyan-400 dark:to-indigo-400">
                  P(A)
                </span>
              </div>
            </div>
            <div className="min-w-0">
              <div className="text-xs sm:text-base font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5 font-sans truncate">
                <span className="truncate">{t('appTitle')}</span>
                <span className="hidden xs:inline-flex items-center px-1.5 py-0.2 rounded text-[9px] sm:text-[10px] font-bold bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
                  STEM
                </span>
              </div>
              <div className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block truncate">
                {t('appSubtitle')}
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive =
                location.pathname === link.path ||
                (link.path !== '/' && location.pathname.startsWith(link.path));
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all ${
                    isActive
                      ? 'text-indigo-700 dark:text-white bg-indigo-50 dark:bg-indigo-600/25 border border-indigo-200 dark:border-indigo-500/40 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'
                    }`}
                  />
                  <span>{link.label}</span>
                  {link.badge !== undefined && (
                    <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 shadow-xs">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Controls: Language & Theme */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            {/* Language Selector Popover */}
            <div className="relative" ref={langRef}>
              <button
                type="button"
                onClick={() => {
                  setLangDropdownOpen(!langDropdownOpen);
                  setThemeDropdownOpen(false);
                }}
                className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer min-h-[40px]"
                aria-label={t('languageSelector')}
              >
                <Globe className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span className="font-mono-math font-bold text-xs">{currentLangObj.flag} {currentLangObj.short}</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${langDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50">
                  {languages.map(l => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => {
                        setLanguage(l.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 text-xs font-semibold flex items-center justify-between hover:bg-indigo-50 dark:hover:bg-indigo-600/20 transition-colors cursor-pointer ${
                        language === l.code
                          ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50/80 dark:bg-indigo-950/50'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">{l.flag}</span>
                        <span>{l.label}</span>
                      </div>
                      {language === l.code && <span className="text-indigo-600 dark:text-indigo-400 text-xs">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Selector Popover */}
            <div className="relative" ref={themeRef}>
              <button
                type="button"
                onClick={() => {
                  setThemeDropdownOpen(!themeDropdownOpen);
                  setLangDropdownOpen(false);
                }}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
                title={t('themeLight')}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Moon className="w-4 h-4 text-indigo-400" />
                ) : theme === 'light' ? (
                  <Sun className="w-4 h-4 text-amber-500" />
                ) : (
                  <Monitor className="w-4 h-4 text-cyan-500" />
                )}
              </button>

              {themeDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50">
                  {themes.map(th => {
                    const ThemeIcon = th.icon;
                    return (
                      <button
                        key={th.code}
                        type="button"
                        onClick={() => {
                          setTheme(th.code);
                          setThemeDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2.5 text-xs font-semibold flex items-center justify-between hover:bg-indigo-50 dark:hover:bg-indigo-600/20 transition-colors cursor-pointer ${
                          theme === th.code
                            ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50/80 dark:bg-indigo-950/50'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <ThemeIcon className="w-4 h-4" />
                          <span>{th.label}</span>
                        </div>
                        {theme === th.code && <span className="text-indigo-600 dark:text-indigo-400 text-xs">✓</span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Slide-down Full Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="lg:hidden fixed inset-x-0 top-16 sm:top-18 bottom-0 bg-white/98 dark:bg-[#06090e]/98 backdrop-blur-2xl border-b border-slate-200 dark:border-slate-800 z-50 overflow-y-auto px-4 py-6 shadow-2xl flex flex-col justify-between"
        >
          <div className="space-y-4">
            {/* Nav Header Text */}
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-2 font-mono-math">
              {language === 'hy' ? 'ՄԵՆՅՈՒ ԵՎ ԷՋԵՐ' : language === 'ru' ? 'МЕНЮ И СТРАНИЦЫ' : 'NAVIGATION & PAGES'}
            </div>

            {/* Links List */}
            <div className="space-y-1.5">
              {navLinks.map(link => {
                const Icon = link.icon;
                const isActive =
                  location.pathname === link.path ||
                  (link.path !== '/' && location.pathname.startsWith(link.path));
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-bold transition-all min-h-[48px] ${
                      isActive
                        ? 'bg-indigo-50 dark:bg-indigo-600/30 text-indigo-700 dark:text-white border border-indigo-200 dark:border-indigo-500/50 shadow-xs'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-xl ${
                          isActive
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span>{link.label}</span>
                    </div>
                    {link.badge !== undefined && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-slate-950 shadow-xs">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Dedicated Mobile Language & Theme Selectors */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 space-y-4">
              {/* Language Selector Pill Group */}
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-2 mb-2 font-mono-math flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>{t('languageSelector')}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {languages.map(l => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => {
                        setLanguage(l.code);
                      }}
                      className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer min-h-[44px] ${
                        language === l.code
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/25'
                          : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className="text-sm">{l.flag}</span>
                      <span>{l.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme Selector Pill Group */}
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-2 mb-2 font-mono-math flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>{language === 'hy' ? 'Թեմայի Ընտրություն' : language === 'ru' ? 'Выбор темы' : 'Theme Mode'}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {themes.map(th => {
                    const ThemeIcon = th.icon;
                    return (
                      <button
                        key={th.code}
                        type="button"
                        onClick={() => {
                          setTheme(th.code);
                        }}
                        className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer min-h-[44px] ${
                          theme === th.code
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/25'
                            : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <ThemeIcon className="w-3.5 h-3.5" />
                        <span>{th.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Footer Note */}
          <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono-math">
              The Probability Lab • STEM Education
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
