import { createContext, useContext, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Achievement,
  ExperimentRecord,
  Language,
  ProbabilityExplanation,
  Theme,
  UserStats,
} from '../types';
import { translations, TranslationKey } from '../i18n/translations';

const INITIAL_STATS: UserStats = {
  threeDoors: {
    games: 0,
    wins: 0,
    losses: 0,
    stayWins: 0,
    stayLosses: 0,
    switchWins: 0,
    switchLosses: 0,
  },
  password: {
    attempts: 0,
    successfulGuesses: 0,
    totalGuessesAcrossGames: 0,
    gamesCompleted: 0,
    bestAttemptCount: 9999,
  },
  cards: {
    draws: 0,
    correctPredictions: 0,
    redBlackWins: 0,
    suitWins: 0,
    rankWins: 0,
    aceWins: 0,
    faceWins: 0,
    specificWins: 0,
  },
  dice: {
    rolls: 0,
    correctPredictions: 0,
    sumFrequency: {},
  },
  coin: {
    flips: 0,
    heads: 0,
    tails: 0,
    correctPredictions: 0,
    consecutiveStreak: 0,
    maxStreak: 0,
  },
  weather: {
    predictions: 0,
    correctPredictions: 0,
    multiRoundBestScore: 0,
  },
  quiz: {
    questionsAnswered: 0,
    correctAnswers: 0,
    quizzesCompleted: 0,
    bestScore: 0,
  },
  totalExperimentsRun: 0,
};

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_steps',
    titleKey: 'ach_first_steps_title',
    descKey: 'ach_first_steps_desc',
    icon: '🌱',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    category: 'games',
  },
  {
    id: 'monty_switcher',
    titleKey: 'ach_monty_switcher_title',
    descKey: 'ach_monty_switcher_desc',
    icon: '🚪',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    category: 'games',
  },
  {
    id: 'monty_master',
    titleKey: 'ach_monty_master_title',
    descKey: 'ach_monty_master_desc',
    icon: '🏆',
    unlocked: false,
    progress: 0,
    maxProgress: 5,
    category: 'games',
  },
  {
    id: 'pass_breaker',
    titleKey: 'ach_pass_breaker_title',
    descKey: 'ach_pass_breaker_desc',
    icon: '🔐',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    category: 'experiments',
  },
  {
    id: 'card_counter',
    titleKey: 'ach_card_counter_title',
    descKey: 'ach_card_counter_desc',
    icon: '🃏',
    unlocked: false,
    progress: 0,
    maxProgress: 10,
    category: 'games',
  },
  {
    id: 'dice_prophet',
    titleKey: 'ach_dice_prophet_title',
    descKey: 'ach_dice_prophet_desc',
    icon: '🎲',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    category: 'games',
  },
  {
    id: 'coin_researcher',
    titleKey: 'ach_coin_researcher_title',
    descKey: 'ach_coin_researcher_desc',
    icon: '🪙',
    unlocked: false,
    progress: 0,
    maxProgress: 100,
    category: 'games',
  },
  {
    id: 'weather_observer',
    titleKey: 'ach_weather_observer_title',
    descKey: 'ach_weather_observer_desc',
    icon: '🌦️',
    unlocked: false,
    progress: 0,
    maxProgress: 10,
    category: 'games',
  },
  {
    id: 'quiz_master',
    titleKey: 'ach_quiz_master_title',
    descKey: 'ach_quiz_master_desc',
    icon: '🧠',
    unlocked: false,
    progress: 0,
    maxProgress: 5,
    category: 'mastery',
  },
  {
    id: 'universal_scientist',
    titleKey: 'ach_universal_scientist_title',
    descKey: 'ach_universal_scientist_desc',
    icon: '🌌',
    unlocked: false,
    progress: 0,
    maxProgress: 4,
    category: 'mastery',
  },
];

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  isDark: boolean;
  t: (key: string) => string;
  stats: UserStats;
  achievements: Achievement[];
  experimentHistory: ExperimentRecord[];
  activeProbabilityModal: ProbabilityExplanation | null;
  isProbabilityModalOpen: boolean; // Alias
  probabilityModalData: ProbabilityExplanation | null; // Alias
  openProbabilityModal: (info: ProbabilityExplanation) => void;
  closeProbabilityModal: () => void;
  recordThreeDoorsGame: (won: boolean, switched: boolean) => void;
  recordPasswordGame: (attempts: number, won: boolean) => void;
  recordCardDraw: (won: boolean, type: string) => void;
  recordDiceRoll: (sum: number, predictedSum?: number) => void;
  recordCoinFlip: (outcome: 'heads' | 'tails', predicted?: 'heads' | 'tails') => void;
  recordWeatherPrediction: (predicted: string, actual: string) => void;
  recordQuizResult: (score: number, total: number) => void;
  recordQuizCompletion: (score: number) => void;
  recordExperimentRun: (trials: number) => void;
  saveExperiment: (exp: ExperimentRecord) => void;
  resetAllStats: () => void;
  resetAllData: () => void;
  recentUnlockedAchievement: Achievement | null;
  dismissAchievementToast: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('problab_lang');
    return (saved as Language) || 'hy';
  });

  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('problab_theme');
    return (saved as Theme) || 'light';
  });

  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('problab_theme');
    if (saved === 'dark') return true;
    if (saved === 'light') return false;
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('problab_stats');
    if (saved) {
      try {
        return { ...INITIAL_STATS, ...JSON.parse(saved) };
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_STATS;
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('problab_achievements');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return INITIAL_ACHIEVEMENTS.map(item => {
          const match = parsed.find((p: Achievement) => p.id === item.id);
          return match ? { ...item, unlocked: match.unlocked, progress: match.progress, unlockedAt: match.unlockedAt } : item;
        });
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_ACHIEVEMENTS;
  });

  const [experimentHistory, setExperimentHistory] = useState<ExperimentRecord[]>(() => {
    const saved = localStorage.getItem('problab_experiments');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const [activeProbabilityModal, setActiveProbabilityModal] = useState<ProbabilityExplanation | null>(null);
  const [recentUnlockedAchievement, setRecentUnlockedAchievement] = useState<Achievement | null>(null);

  // Sync theme
  useEffect(() => {
    localStorage.setItem('problab_theme', theme);
    const root = document.documentElement;

    const applyTheme = (dark: boolean) => {
      setIsDark(dark);
      if (dark) {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
      }
    };

    if (theme === 'dark') {
      applyTheme(true);
    } else if (theme === 'light') {
      applyTheme(false);
    } else {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => {
        applyTheme(e.matches);
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  // Sync language
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('problab_lang', lang);
  };

  const setTheme = (tVal: Theme) => {
    setThemeState(tVal);
  };

  // Sync storage
  useEffect(() => {
    localStorage.setItem('problab_stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('problab_achievements', JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem('problab_experiments', JSON.stringify(experimentHistory));
  }, [experimentHistory]);

  const t = (key: string): string => {
    const currentLangDict = translations[language] as Record<string, string>;
    if (currentLangDict && currentLangDict[key]) {
      return currentLangDict[key];
    }
    const enDict = translations.en as Record<string, string>;
    if (enDict && enDict[key]) {
      return enDict[key];
    }
    return key;
  };

  // Trigger achievement check
  const checkAchievements = (currentStats: UserStats, experiments: ExperimentRecord[]) => {
    let updated = false;
    const newAchievements = achievements.map(ach => {
      if (ach.unlocked) return ach;
      let curProgress = ach.progress;
      let shouldUnlock = false;

      const totalGames =
        currentStats.threeDoors.games +
        currentStats.password.gamesCompleted +
        currentStats.cards.draws +
        currentStats.dice.rolls +
        currentStats.coin.flips +
        currentStats.weather.predictions +
        currentStats.quiz.quizzesCompleted;

      if (ach.id === 'first_steps') {
        curProgress = totalGames > 0 || experiments.length > 0 ? 1 : 0;
        if (curProgress >= ach.maxProgress) shouldUnlock = true;
      } else if (ach.id === 'monty_switcher') {
        curProgress = currentStats.threeDoors.switchWins;
        if (curProgress >= ach.maxProgress) shouldUnlock = true;
      } else if (ach.id === 'monty_master') {
        curProgress = currentStats.threeDoors.wins;
        if (curProgress >= ach.maxProgress) shouldUnlock = true;
      } else if (ach.id === 'pass_breaker') {
        curProgress = currentStats.password.successfulGuesses > 0 || experiments.filter(e => e.gameId === 'password').length > 0 ? 1 : 0;
        if (curProgress >= ach.maxProgress) shouldUnlock = true;
      } else if (ach.id === 'card_counter') {
        curProgress = currentStats.cards.correctPredictions;
        if (curProgress >= ach.maxProgress) shouldUnlock = true;
      } else if (ach.id === 'dice_prophet') {
        curProgress = currentStats.dice.correctPredictions;
        if (curProgress >= ach.maxProgress) shouldUnlock = true;
      } else if (ach.id === 'coin_researcher') {
        curProgress = currentStats.coin.flips;
        if (curProgress >= ach.maxProgress) shouldUnlock = true;
      } else if (ach.id === 'weather_observer') {
        curProgress = currentStats.weather.predictions;
        if (curProgress >= ach.maxProgress) shouldUnlock = true;
      } else if (ach.id === 'quiz_master') {
        curProgress = currentStats.quiz.correctAnswers;
        if (curProgress >= ach.maxProgress) shouldUnlock = true;
      } else if (ach.id === 'universal_scientist') {
        const uniqueGames = new Set(experiments.map(e => e.gameId)).size;
        curProgress = uniqueGames;
        if (curProgress >= ach.maxProgress) shouldUnlock = true;
      }

      if (shouldUnlock) {
        updated = true;
        try {
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.7 } });
        } catch (e) {
          // ignore
        }
        const unlockedObj: Achievement = {
          ...ach,
          progress: ach.maxProgress,
          unlocked: true,
          unlockedAt: new Date().toLocaleTimeString(),
        };
        setRecentUnlockedAchievement(unlockedObj);
        return unlockedObj;
      }

      if (curProgress !== ach.progress) {
        updated = true;
        return { ...ach, progress: Math.min(ach.maxProgress, curProgress) };
      }

      return ach;
    });

    if (updated) {
      setAchievements(newAchievements);
    }
  };

  const openProbabilityModal = (info: ProbabilityExplanation) => {
    setActiveProbabilityModal(info);
  };

  const closeProbabilityModal = () => {
    setActiveProbabilityModal(null);
  };

  const dismissAchievementToast = () => {
    setRecentUnlockedAchievement(null);
  };

  // Game tracking handlers
  const recordThreeDoorsGame = (won: boolean, switched: boolean) => {
    setStats(prev => {
      const next = {
        ...prev,
        threeDoors: {
          games: prev.threeDoors.games + 1,
          wins: prev.threeDoors.wins + (won ? 1 : 0),
          losses: prev.threeDoors.losses + (won ? 0 : 1),
          stayWins: prev.threeDoors.stayWins + (!switched && won ? 1 : 0),
          stayLosses: prev.threeDoors.stayLosses + (!switched && !won ? 1 : 0),
          switchWins: prev.threeDoors.switchWins + (switched && won ? 1 : 0),
          switchLosses: prev.threeDoors.switchLosses + (switched && !won ? 1 : 0),
        },
      };
      checkAchievements(next, experimentHistory);
      return next;
    });
  };

  const recordPasswordGame = (attempts: number, won: boolean) => {
    setStats(prev => {
      const next = {
        ...prev,
        password: {
          attempts: prev.password.attempts + 1,
          successfulGuesses: prev.password.successfulGuesses + (won ? 1 : 0),
          totalGuessesAcrossGames: prev.password.totalGuessesAcrossGames + attempts,
          gamesCompleted: prev.password.gamesCompleted + 1,
          bestAttemptCount: won ? Math.min(prev.password.bestAttemptCount, attempts) : prev.password.bestAttemptCount,
        },
      };
      checkAchievements(next, experimentHistory);
      return next;
    });
  };

  const recordCardDraw = (won: boolean, type: string) => {
    setStats(prev => {
      const next = {
        ...prev,
        cards: {
          ...prev.cards,
          draws: prev.cards.draws + 1,
          correctPredictions: prev.cards.correctPredictions + (won ? 1 : 0),
          redBlackWins: prev.cards.redBlackWins + (type === 'color' && won ? 1 : 0),
          suitWins: prev.cards.suitWins + (type === 'suit' && won ? 1 : 0),
          rankWins: prev.cards.rankWins + (type === 'rank' && won ? 1 : 0),
          aceWins: prev.cards.aceWins + (type === 'ace' && won ? 1 : 0),
          faceWins: prev.cards.faceWins + (type === 'face' && won ? 1 : 0),
          specificWins: prev.cards.specificWins + (type === 'exact' && won ? 1 : 0),
        },
      };
      checkAchievements(next, experimentHistory);
      return next;
    });
  };

  const recordDiceRoll = (sum: number, predictedSum?: number) => {
    setStats(prev => {
      const freq = { ...prev.dice.sumFrequency };
      freq[sum] = (freq[sum] || 0) + 1;
      const isCorrect = predictedSum !== undefined && predictedSum === sum;
      const next = {
        ...prev,
        dice: {
          rolls: prev.dice.rolls + 1,
          correctPredictions: prev.dice.correctPredictions + (isCorrect ? 1 : 0),
          sumFrequency: freq,
        },
      };
      checkAchievements(next, experimentHistory);
      return next;
    });
  };

  const recordCoinFlip = (outcome: 'heads' | 'tails', predicted?: 'heads' | 'tails') => {
    setStats(prev => {
      const isCorrect = predicted ? predicted === outcome : false;
      const newStreak = isCorrect ? prev.coin.consecutiveStreak + 1 : 0;
      const next = {
        ...prev,
        coin: {
          flips: prev.coin.flips + 1,
          heads: prev.coin.heads + (outcome === 'heads' ? 1 : 0),
          tails: prev.coin.tails + (outcome === 'tails' ? 1 : 0),
          correctPredictions: prev.coin.correctPredictions + (isCorrect ? 1 : 0),
          consecutiveStreak: newStreak,
          maxStreak: Math.max(prev.coin.maxStreak, newStreak),
        },
      };
      checkAchievements(next, experimentHistory);
      return next;
    });
  };

  const recordWeatherPrediction = (predicted: string, actual: string) => {
    setStats(prev => {
      const isCorrect = predicted === actual;
      const next = {
        ...prev,
        weather: {
          ...prev.weather,
          predictions: prev.weather.predictions + 1,
          correctPredictions: prev.weather.correctPredictions + (isCorrect ? 1 : 0),
        },
      };
      checkAchievements(next, experimentHistory);
      return next;
    });
  };

  const recordQuizResult = (score: number, total: number) => {
    setStats(prev => {
      const next = {
        ...prev,
        quiz: {
          questionsAnswered: prev.quiz.questionsAnswered + total,
          correctAnswers: prev.quiz.correctAnswers + score,
          quizzesCompleted: prev.quiz.quizzesCompleted + 1,
          bestScore: Math.max(prev.quiz.bestScore, score),
        },
      };
      checkAchievements(next, experimentHistory);
      return next;
    });
  };

  const saveExperiment = (exp: ExperimentRecord) => {
    const updated = [exp, ...experimentHistory.slice(0, 49)];
    setExperimentHistory(updated);
    setStats(prev => {
      const next = {
        ...prev,
        totalExperimentsRun: prev.totalExperimentsRun + 1,
      };
      checkAchievements(next, updated);
      return next;
    });
  };

  const resetAllStats = () => {
    setStats(INITIAL_STATS);
    setAchievements(INITIAL_ACHIEVEMENTS);
    setExperimentHistory([]);
    localStorage.removeItem('problab_stats');
    localStorage.removeItem('problab_achievements');
    localStorage.removeItem('problab_experiments');
  };

  const recordQuizCompletion = (score: number) => {
    recordQuizResult(score, 10);
  };

  const recordExperimentRun = (trials: number) => {
    setStats(prev => {
      const next = {
        ...prev,
        totalExperimentsRun: prev.totalExperimentsRun + trials,
      };
      checkAchievements(next, experimentHistory);
      return next;
    });
  };

  const resetAllData = () => {
    resetAllStats();
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        theme,
        setTheme,
        isDark,
        t,
        stats,
        achievements,
        experimentHistory,
        activeProbabilityModal,
        isProbabilityModalOpen: activeProbabilityModal !== null,
        probabilityModalData: activeProbabilityModal,
        openProbabilityModal,
        closeProbabilityModal,
        recordThreeDoorsGame,
        recordPasswordGame,
        recordCardDraw,
        recordDiceRoll,
        recordCoinFlip,
        recordWeatherPrediction,
        recordQuizResult,
        recordQuizCompletion,
        recordExperimentRun,
        saveExperiment,
        resetAllStats,
        resetAllData,
        recentUnlockedAchievement,
        dismissAchievementToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
