import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Calculator,
  Sparkles,
  Lightbulb,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProbabilityPanel: React.FC = () => {
  const { isProbabilityModalOpen, probabilityModalData, closeProbabilityModal, t, language } = useApp();

  if (!isProbabilityModalOpen || !probabilityModalData) return null;

  const {
    title,
    event,
    theoretical,
    theoreticalFraction,
    experimental,
    sampleSize,
    whyText,
    formula,
    recommendation,
    breakdown,
  } = probabilityModalData;

  const theoPct = (theoretical * 100).toFixed(2);
  const expPct = experimental !== undefined ? (experimental * 100).toFixed(2) : null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
        {/* Backdrop Click */}
        <div
          className="fixed inset-0"
          onClick={closeProbabilityModal}
          aria-hidden="true"
        />

        {/* Modal Window - Responsive container fitting all devices */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-indigo-500/30 p-5 sm:p-6 md:p-8 shadow-2xl z-10 space-y-5 sm:space-y-6 my-auto"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="space-y-1 pr-2">
              <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-cyan-400 font-mono-math">
                <Calculator className="w-3.5 h-3.5" />
                <span>{t('calculatedProbability')}</span>
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                {title}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                {event}
              </p>
            </div>

            <button
              type="button"
              onClick={closeProbabilityModal}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shrink-0 cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Metric Comparison Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Theoretical Odds */}
            <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-500/30 space-y-1">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 font-mono-math block">
                {t('theoreticalProb')} (P)
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-indigo-900 dark:text-white font-mono-math">
                {theoPct}%
              </div>
              {theoreticalFraction && (
                <div className="text-xs text-indigo-700 dark:text-indigo-300 font-mono-math">
                  Fraction: <span className="font-bold">{theoreticalFraction}</span>
                </div>
              )}
            </div>

            {/* Experimental Empirical Odds */}
            <div className="p-4 sm:p-5 rounded-2xl bg-cyan-50/70 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-500/30 space-y-1">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-300 font-mono-math block">
                {t('experimentalProb')} (f)
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-cyan-900 dark:text-white font-mono-math">
                {expPct ? `${expPct}%` : '—'}
              </div>
              <div className="text-xs text-cyan-700 dark:text-cyan-300 font-mono-math">
                {sampleSize && sampleSize > 0
                  ? `Sample Size: ${sampleSize} trials`
                  : language === 'hy'
                  ? 'Տվյալներ չկան (կատարեք փորձ)'
                  : language === 'ru'
                  ? 'Нет данных (проведите тест)'
                  : 'No player trials yet'}
              </div>
            </div>
          </div>

          {/* Formula Pill Box */}
          {formula && (
            <div className="p-3 sm:p-4 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-mono-math uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold block">
                {language === 'hy' ? 'Մաթեմատիկական Բանաձև' : language === 'ru' ? 'Математическая формула' : 'Exact Formula'}
              </span>
              <div className="text-xs sm:text-sm font-mono-math font-bold text-slate-900 dark:text-indigo-300 overflow-x-auto py-0.5">
                {formula}
              </div>
            </div>
          )}

          {/* Breakdown items if available */}
          {breakdown && breakdown.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono-math block">
                {language === 'hy' ? 'Տարբերակների Բաշխում' : language === 'ru' ? 'Распределение вариантов' : 'Event Distribution Breakdown'}
              </span>
              <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                {breakdown.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-700 dark:text-slate-300 truncate pr-2">{item.label}</span>
                      <span className="font-mono-math text-slate-900 dark:text-white font-bold shrink-0">
                        {(item.value * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`${item.color || 'bg-indigo-500'} h-full rounded-full transition-all`}
                        style={{ width: `${Math.min(100, item.value * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Educational "Why" Explanation */}
          {whyText && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-400 font-mono-math">
                <Sparkles className="w-4 h-4" />
                <span>{t('whyTitle')}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {whyText}
              </p>
            </div>
          )}

          {/* Strategic Recommendation */}
          {recommendation && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-500/30 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 font-mono-math">
                <Lightbulb className="w-4 h-4" />
                <span>{t('recommendationTitle')}</span>
              </div>
              <p className="text-xs sm:text-sm text-amber-900 dark:text-amber-200 leading-relaxed font-medium">
                {recommendation}
              </p>
            </div>
          )}

          {/* Close Action Button */}
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={closeProbabilityModal}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer min-h-[44px]"
            >
              {language === 'hy' ? 'Հասկացա (Փակել)' : language === 'ru' ? 'Понятно (Закрыть)' : 'Understood (Close)'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProbabilityPanel;
