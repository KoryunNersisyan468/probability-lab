
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
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
  ChevronRight,
} from 'lucide-react';

import { useApp } from '../context/AppContext';
import { Language, Theme } from '../types';
import { ORDERED_GAMES } from '../utils/gamesConfig';

export const Navbar: React.FC = () => {
  const { language, setLanguage, theme, setTheme, t, achievements } = useApp();

  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [mobileGamesExpanded, setMobileGamesExpanded] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        langRef.current &&
        !langRef.current.contains(event.target as Node)
      ) {
        setLangDropdownOpen(false);
      }

      if (
        themeRef.current &&
        !themeRef.current.contains(event.target as Node)
      ) {
        setThemeDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close menus when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileGamesExpanded(false);
    setLangDropdownOpen(false);
    setThemeDropdownOpen(false);
  }, [location.pathname, location.search]);

  // Lock background scroll when mobile menu is open
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const scrollY = window.scrollY;

    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';

      window.scrollTo(0, scrollY);
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

  const languages: {
    code: Language;
    label: string;
    flag: string;
    short: string;
  }[] = [
    { code: 'hy', label: 'Հայերեն', flag: '🇦🇲', short: 'ՀԱՅ' },
    { code: 'en', label: 'English', flag: '🇬🇧', short: 'ENG' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺', short: 'РУС' },
  ];

  const themes: {
    code: Theme;
    label: string;
    icon: typeof Sun;
  }[] = [
    { code: 'light', label: t('themeLight'), icon: Sun },
    { code: 'dark', label: t('themeDark'), icon: Moon },
    { code: 'system', label: t('themeSystem'), icon: Monitor },
  ];

  const currentLangObj =
    languages.find(l => l.code === language) || languages[0];

  const getIsActive = (path: string) =>
    location.pathname === path ||
    (path !== '/' && location.pathname.startsWith(path));

  return (
    <>
      {/* ================= DESKTOP HEADER ================= */}

      <header className="fixed top-0 left-0 right-0 z-40 w-full border-b border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-[#06090e]/95 backdrop-blur-xl shadow-xs transition-colors duration-200 pt-[env(safe-area-inset-top)]">
        <div className="mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-18 gap-2">

            {/* LEFT: MOBILE MENU + BRAND */}

            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 lg:flex-initial">

              {/* Mobile Hamburger */}

              <div className="flex items-center lg:hidden shrink-0">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(true)}
                  className="p-2 sm:p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label={t('mobileMenu')}
                  aria-expanded={mobileMenuOpen}
                >
                  <Menu className="w-5 h-5 text-indigo-600 dark:text-violet-400" />
                </button>
              </div>

              {/* ProbLab Brand Logo */}

              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="ProbLab Home"
                className="flex items-center rounded-xl p-0.5 min-w-0 group focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <img
                  src="logo.png"
                  alt="ProbLab"
                  className="h-9 sm:h-10 lg:h-11 w-auto max-w-[130px] object-contain rounded-lg transition-transform duration-200 group-hover:scale-[1.03]"
                />
              </Link>
            </div>

            {/* DESKTOP NAVIGATION */}

            <nav className="hidden lg:flex items-center space-x-1 shrink-0">
              {navLinks.map(link => {
                const Icon = link.icon;
                const isActive = getIsActive(link.path);

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
                        isActive
                          ? 'text-indigo-600 dark:text-indigo-400'
                          : 'text-slate-400'
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

            {/* RIGHT: LANGUAGE + THEME */}

            <div className="hidden lg:flex items-center space-x-1.5 sm:space-x-2 shrink-0">

              {/* Language Selector */}

              <div className="relative" ref={langRef}>
                <button
                  type="button"
                  onClick={() => {
                    setLangDropdownOpen(!langDropdownOpen);
                    setThemeDropdownOpen(false);
                  }}
                  className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 sm:py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer min-h-[38px] sm:min-h-[40px]"
                  aria-label={t('languageSelector')}
                  aria-expanded={langDropdownOpen}
                >
                  <Globe className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />

                  <span className="font-mono-math font-bold text-xs">
                    {currentLangObj.flag} {currentLangObj.short}
                  </span>

                  <ChevronDown
                    className={`w-3 h-3 text-slate-400 transition-transform duration-200 shrink-0 ${
                      langDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
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

                        {language === l.code && (
                          <span className="text-indigo-600 dark:text-indigo-400 text-xs">
                            ✓
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Theme Selector */}

              <div className="relative" ref={themeRef}>
                <button
                  type="button"
                  onClick={() => {
                    setThemeDropdownOpen(!themeDropdownOpen);
                    setLangDropdownOpen(false);
                  }}
                  className="p-2 sm:p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer min-h-[38px] min-w-[38px] sm:min-h-[40px] sm:min-w-[40px] flex items-center justify-center"
                  title={t('themeLight')}
                  aria-label="Toggle theme"
                  aria-expanded={themeDropdownOpen}
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

                          {theme === th.code && (
                            <span className="text-indigo-600 dark:text-indigo-400 text-xs">
                              ✓
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ================= MOBILE NAVIGATION ================= */}

      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">

            {/* Backdrop */}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* Mobile Drawer */}

            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{
                type: 'spring',
                damping: 28,
                stiffness: 300,
              }}
              className="relative w-full max-w-sm sm:max-w-md bg-white dark:bg-[#070b12] text-slate-900 dark:text-slate-100 shadow-2xl flex flex-col h-full min-h-[50dvh] max-h-[100dvh] z-10 border-r border-slate-200 dark:border-slate-800"
            >

              {/* DRAWER HEADER */}

              <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-800 pt-[calc(env(safe-area-inset-top)+1rem)] shrink-0">

                {/* Brand */}

                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="ProbLab Home"
                  className="flex items-center"
                >
                  <img
                    src="logo.png"
                    alt="ProbLab"
                    className="h-10 w-auto max-w-[140px] object-contain rounded-lg"
                  />
                </Link>

                {/* Close Button */}

                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label={t('close')}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* SCROLLABLE DRAWER BODY */}

              <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-6 scrollbar-thin">

                {/* MAIN NAVIGATION */}

                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-2 font-mono-math">
                    {language === 'hy'
                      ? 'ՄԵՆՅՈՒ ԵՎ ԷՋԵՐ'
                      : language === 'ru'
                        ? 'МЕНЮ И СТРАНИЦЫ'
                        : 'NAVIGATION & PAGES'}
                  </div>

                  <div className="space-y-1">
                    {navLinks.map(link => {
                      const Icon = link.icon;
                      const isActive = getIsActive(link.path);
                      const isGamesLink = link.path === '/games';

                      // Games menu with expandable submenu

                      if (isGamesLink) {
                        return (
                          <div key={link.path} className="space-y-1">

                            <div
                              className={`flex items-center justify-between rounded-xl transition-all min-h-[46px] ${
                                isActive
                                  ? 'bg-indigo-50 dark:bg-indigo-600/25 text-indigo-700 dark:text-white border border-indigo-200 dark:border-indigo-500/40 shadow-xs'
                                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 border border-transparent'
                              }`}
                            >
                              {/* Games Link */}

                              <Link
                                to={link.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-3 px-3.5 py-3 flex-1 min-w-0"
                              >
                                <div
                                  className={`p-2 rounded-lg ${
                                    isActive
                                      ? 'bg-indigo-600 text-white'
                                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                                  }`}
                                >
                                  <Icon className="w-4 h-4" />
                                </div>

                                <span className="text-sm font-bold truncate">
                                  {link.label}
                                </span>
                              </Link>

                              {/* Expand Button */}

                              <button
                                type="button"
                                onClick={e => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setMobileGamesExpanded(prev => !prev);
                                }}
                                aria-label={
                                  mobileGamesExpanded
                                    ? t('collapseGames')
                                    : t('expandGames')
                                }
                                aria-expanded={mobileGamesExpanded}
                                className="p-3 mr-1 rounded-lg hover:bg-slate-200/80 dark:hover:bg-slate-800 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-500 dark:text-slate-400"
                              >
                                <motion.div
                                  animate={{
                                    rotate: mobileGamesExpanded ? 180 : 0,
                                  }}
                                  transition={{ duration: 0.2 }}
                                  className="flex items-center justify-center"
                                >
                                  <ChevronDown className="w-4 h-4" />
                                </motion.div>
                              </button>
                            </div>

                            {/* GAMES SUBMENU */}

                            <AnimatePresence>
                              {mobileGamesExpanded && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{
                                    duration: 0.25,
                                    ease: 'easeInOut',
                                  }}
                                  className="overflow-hidden pl-3 pr-1 space-y-1 pt-1 pb-1 border-l-2 border-indigo-200 dark:border-indigo-500/30 ml-4 my-1"
                                >
                                  {ORDERED_GAMES.map(g => (
                                    <Link
                                      key={g.id}
                                      to={`/games?game=${g.id}`}
                                      onClick={() => setMobileMenuOpen(false)}
                                      className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 border border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-all min-h-[44px]"
                                    >
                                      <div className="flex items-center gap-2.5 truncate">
                                        <span className="text-base shrink-0">
                                          {g.icon}
                                        </span>

                                        <span className="text-slate-400 font-mono-math text-[11px] shrink-0">
                                          {g.num}.
                                        </span>

                                        <span className="font-bold text-slate-800 dark:text-slate-200 truncate">
                                          {t(g.titleKey)}
                                        </span>
                                      </div>

                                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                    </Link>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      }

                      // Other navigation links

                      return (
                        <Link
                          key={link.path}
                          to={link.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-bold transition-all min-h-[46px] ${
                            isActive
                              ? 'bg-indigo-50 dark:bg-indigo-600/25 text-indigo-700 dark:text-white border border-indigo-200 dark:border-indigo-500/40 shadow-xs'
                              : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-lg ${
                                isActive
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>

                            <span>{link.label}</span>
                          </div>

                          {link.badge !== undefined ? (
                            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-slate-950 shadow-xs">
                              {link.badge}
                            </span>
                          ) : (
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* LANGUAGE + THEME */}

                <div className="space-y-4 pt-3 border-t border-slate-200 dark:border-slate-800/80">

                  {/* LANGUAGE SELECTOR */}

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
                          onClick={() => setLanguage(l.code)}
                          className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer min-h-[44px] ${
                            language === l.code
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/25'
                              : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                          }`}
                        >
                          <span className="text-sm">{l.flag}</span>
                          <span>{l.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* THEME SELECTOR */}

                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-2 mb-2 font-mono-math flex items-center gap-1.5">
                      <Sun className="w-3.5 h-3.5 text-amber-500" />

                      <span>
                        {language === 'hy'
                          ? 'ԹԵՄԱՅԻ ԸՆՏՐՈՒԹՅՈՒՆ'
                          : language === 'ru'
                            ? 'ВЫБОР ТЕМЫ'
                            : 'THEME MODE'}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {themes.map(th => {
                        const ThemeIcon = th.icon;

                        return (
                          <button
                            key={th.code}
                            type="button"
                            onClick={() => setTheme(th.code)}
                            className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer min-h-[44px] ${
                              theme === th.code
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/25'
                                : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
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

              {/* DRAWER FOOTER */}

              <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 text-center pb-[calc(env(safe-area-inset-bottom)+1rem)] shrink-0">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold tracking-wide">
                  ProbLab
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
