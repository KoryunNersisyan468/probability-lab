import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AchievementToast: React.FC = () => {
  const { recentUnlockedAchievement, dismissAchievementToast, t, language } = useApp();

  if (!recentUnlockedAchievement) return null;

  const getUnlockedTitle = () => {
    if (language === 'hy') return '🎉 ՆՈՐ ՆՎԱՃՈՒՄ Է ԲԱՑՎԵԼ';
    if (language === 'ru') return '🎉 ДОСТИЖЕНИЕ РАЗБЛОКИРОВАНО';
    return '🎉 ACHIEVEMENT UNLOCKED';
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 50, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 50, opacity: 0, scale: 0.9 }}
        className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-white dark:bg-slate-900 border border-amber-400 dark:border-amber-500/50 rounded-2xl shadow-2xl p-4 flex items-start gap-3 backdrop-blur-xl text-slate-900 dark:text-slate-100"
      >
        <div className="text-3xl p-2 bg-amber-100 dark:bg-amber-500/20 rounded-xl border border-amber-300 dark:border-amber-500/30">
          {recentUnlockedAchievement.icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider font-bold text-amber-600 dark:text-amber-400 font-mono-math">
              {getUnlockedTitle()}
            </span>
            <button
              onClick={dismissAchievementToast}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-0.5"
              aria-label={t('close')}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
            {t(recentUnlockedAchievement.titleKey)}
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
            {t(recentUnlockedAchievement.descKey)}
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
