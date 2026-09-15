import React from 'react';
import { motion } from 'motion/react';
import { Lock, CheckCircle2, Trophy } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AchievementsPage: React.FC = () => {
  const { t, language, achievements } = useApp();

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const progressPct = ((unlockedCount / achievements.length) * 100).toFixed(0);

  return (
    <div className="space-y-8 transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-gradient-to-r dark:from-amber-950/70 dark:via-indigo-950/60 dark:to-slate-900 border border-slate-200 dark:border-amber-500/30 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 font-mono-math">
            <span>{language === 'hy' ? 'ՆՎԱՃՈՒՄՆԵՐ ԵՎ ԿՐԾՔԱՆՇԱՆՆԵՐ' : language === 'ru' ? 'ДОСТИЖЕНИЯ И ЗНАЧКИ' : 'MILESTONES & BADGES'}</span>
            <span>•</span>
            <span>STEM MASTERY</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {t('achievementsHeading')}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">{t('achievementsSubheading')}</p>
        </div>

        {/* Aggregate Progress Badge */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-amber-300 dark:border-amber-500/30 flex items-center gap-4">
          <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 block font-semibold">
              {language === 'hy' ? 'Բացված Նվաճումներ' : language === 'ru' ? 'Открытые значки' : 'Unlocked Badges'}
            </span>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white font-mono-math">
              {unlockedCount} / {achievements.length} <span className="text-amber-600 dark:text-amber-400 text-sm">({progressPct}%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Line */}
      <div className="w-full bg-slate-100 dark:bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
        <div
          className="bg-gradient-to-r from-amber-500 via-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map(badge => (
          <motion.div
            key={badge.id}
            whileHover={{ y: -4 }}
            className={`p-6 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
              badge.unlocked
                ? 'bg-white dark:bg-slate-900/90 border-amber-300 dark:border-amber-500/40 shadow-md shadow-amber-500/10'
                : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl border ${
                  badge.unlocked
                    ? 'bg-amber-50 dark:bg-amber-500/20 border-amber-300 dark:border-amber-500/40'
                    : 'bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 grayscale'
                }`}
              >
                {badge.icon}
              </div>

              {badge.unlocked ? (
                <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{language === 'hy' ? 'Բացված' : language === 'ru' ? 'Открыто' : 'Unlocked'}</span>
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700">
                  <Lock className="w-3.5 h-3.5" />
                  <span>{language === 'hy' ? 'Փակված' : language === 'ru' ? 'Закрыто' : 'Locked'}</span>
                </span>
              )}
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t(badge.titleKey as any)}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                {t(badge.descKey as any)}
              </p>
            </div>

            {badge.unlocked && badge.unlockedAt && (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[10px] font-mono-math text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>{language === 'hy' ? 'Բացվել է՝' : language === 'ru' ? 'Открыто:' : 'Unlocked on:'}</span>
                <span>{new Date(badge.unlockedAt).toLocaleDateString()}</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
