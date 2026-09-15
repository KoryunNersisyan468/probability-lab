import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  BarChart2,
  Sparkles,
  TrendingUp,
  Calendar,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  WeatherCondition,
  sampleWeather,
  simulateWeatherDays,
} from '../utils/probability';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

export const WeatherGame: React.FC = () => {
  const { t, language, recordWeatherPrediction, openProbabilityModal, isDark } = useApp();

  const [currentDistribution, setCurrentDistribution] = useState<WeatherCondition[]>([
    { id: 'sunny', labelKey: 'sunny', icon: '☀️', probability: 0.6, color: 'bg-amber-500' },
    { id: 'rainy', labelKey: 'rainy', icon: '🌧️', probability: 0.3, color: 'bg-cyan-500' },
    { id: 'cloudy', labelKey: 'cloudy', icon: '☁️', probability: 0.1, color: 'bg-slate-400' },
  ]);

  const [selectedPrediction, setSelectedPrediction] = useState<string>('sunny');
  const [actualWeather, setActualWeather] = useState<WeatherCondition | null>(null);
  const [lastWon, setLastWon] = useState<boolean | null>(null);
  const [isSimulatingDay, setIsSimulatingDay] = useState<boolean>(false);

  // Multi-day challenge mode
  const [isChallengeActive, setIsChallengeActive] = useState<boolean>(false);
  const [challengeTotalDays, setChallengeTotalDays] = useState<number>(10);
  const [currentDayIndex, setCurrentDayIndex] = useState<number>(1);
  const [challengeScore, setChallengeScore] = useState<number>(0);

  // Simulation Lab
  const [simChartData, setSimChartData] = useState<any[] | null>(null);

  const generateNewDayDistribution = () => {
    // Generate randomized probabilities summing to 1.0
    const r1 = Math.random();
    const r2 = Math.random();
    const r3 = Math.random();
    const sum = r1 + r2 + r3;

    const pSunny = Number((r1 / sum).toFixed(2));
    const pRainy = Number((r2 / sum).toFixed(2));
    const pCloudy = Number((1 - pSunny - pRainy).toFixed(2));

    return [
      { id: 'sunny' as const, labelKey: 'sunny', icon: '☀️', probability: pSunny, color: 'bg-amber-500' },
      { id: 'rainy' as const, labelKey: 'rainy', icon: '🌧️', probability: pRainy, color: 'bg-cyan-500' },
      { id: 'cloudy' as const, labelKey: 'cloudy', icon: '☁️', probability: Math.max(0.01, pCloudy), color: 'bg-slate-400' },
    ];
  };

  const handlePredict = () => {
    setIsSimulatingDay(true);
    setTimeout(() => {
      const outcome = sampleWeather(currentDistribution);
      setActualWeather(outcome);
      const won = outcome.id === selectedPrediction;
      setLastWon(won);
      recordWeatherPrediction(selectedPrediction, outcome.id);

      if (isChallengeActive) {
        const nextScore = challengeScore + (won ? 1 : 0);
        setChallengeScore(nextScore);

        if (currentDayIndex < challengeTotalDays) {
          setCurrentDayIndex(prev => prev + 1);
          setCurrentDistribution(generateNewDayDistribution());
        }
      }

      setIsSimulatingDay(false);
    }, 450);
  };

  const startChallenge = (days: number) => {
    setChallengeTotalDays(days);
    setCurrentDayIndex(1);
    setChallengeScore(0);
    setIsChallengeActive(true);
    setCurrentDistribution(generateNewDayDistribution());
    setActualWeather(null);
    setLastWon(null);
  };

  const stopChallenge = () => {
    setIsChallengeActive(false);
  };

  const handleShowChances = () => {
    openProbabilityModal({
      title: t('gameWeatherTitle'),
      event:
        language === 'hy'
          ? `Օրվա Հավանականության Բաշխում (Օր ${currentDayIndex})`
          : language === 'ru'
          ? `Распределение вероятностей дня (День ${currentDayIndex})`
          : `Day Probability Distribution (Day ${currentDayIndex})`,
      theoretical: currentDistribution.find(d => d.id === selectedPrediction)?.probability || 0,
      theoreticalFraction: `${(
        (currentDistribution.find(d => d.id === selectedPrediction)?.probability || 0) * 100
      ).toFixed(0)}%`,
      whyText:
        language === 'hy'
          ? 'Օդերևութաբանական կանխատեսումներում հավանականությունը նշանակում է նմանատիպ պայմանների դեպքում տվյալ եղանակի ստացվելու տոկոսային հաճախականությունը: 70% անձրևը չի նշանակում անձրևի 100% երաշխիք:'
          : language === 'ru'
          ? 'В вероятностном прогнозе 70% шанс дождя означает, что при схожих условиях дождь шел в 70 случаях из 100. Вероятность измеряет частоту, а не абсолютную гарантию.'
          : 'In probabilistic forecasting, a 70% chance of rain means that under identical atmospheric patterns, rain occurred in 70 out of 100 historical instances. Probability measures frequency, not absolute certainty.',
      formula: 'Σ P(Weather) = 1.0 (100%)',
      breakdown: currentDistribution.map(d => ({
        label: `${d.icon} ${t(d.labelKey as any)}`,
        value: d.probability,
        color: d.color,
      })),
    });
  };

  const runWeatherSimulation = (n: number) => {
    const res = simulateWeatherDays(currentDistribution, n);
    const data = currentDistribution.map(d => ({
      name: `${d.icon} ${t(d.labelKey as any)}`,
      theoretical: Number((d.probability * 100).toFixed(1)),
      experimental: Number(((res.frequencies[d.id] || 0) * 100).toFixed(1)),
      count: res.counts[d.id] || 0,
    }));
    setSimChartData(data);
  };

  return (
    <div className="space-y-6 sm:space-y-8 transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-amber-500/30 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 font-mono-math">
            <span>{language === 'hy' ? 'ԽԱՂ 06' : language === 'ru' ? 'ИГРА 06' : 'GAME 06'}</span>
            <span>•</span>
            <span>{t('gameWeatherConcept')}</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {t('gameWeatherTitle')}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mt-1">{t('gameWeatherSubtitle')}</p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button
            type="button"
            onClick={handleShowChances}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-amber-600/25 transition-all hover:scale-105 active:scale-95 cursor-pointer min-h-[44px]"
          >
            <BarChart2 className="w-4 h-4 shrink-0" />
            <span>{t('showChances')}</span>
          </button>
        </div>
      </div>

      {/* Weather Distribution & Forecast Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Probability Forecast Card */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>{t('weatherForecastOdds')}</span>
            </h3>
            {isChallengeActive && (
              <span className="text-xs font-mono-math font-bold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
                {language === 'hy' ? 'Օր' : language === 'ru' ? 'День' : 'Day'} {currentDayIndex} / {challengeTotalDays}
              </span>
            )}
          </div>

          {/* Condition Options - Responsive grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {currentDistribution.map(cond => {
              const isSelected = selectedPrediction === cond.id;
              const probPct = (cond.probability * 100).toFixed(0);

              return (
                <div
                  key={cond.id}
                  onClick={() => setSelectedPrediction(cond.id)}
                  className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between min-h-[140px] select-none ${
                    isSelected
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 shadow-md shadow-amber-500/15 ring-2 ring-amber-400/50'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-3xl sm:text-4xl">{cond.icon}</span>
                    <span className="text-xs font-mono-math font-bold px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200">
                      {probPct}%
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-2">{t(cond.labelKey as any)}</h4>
                    {/* Visual Probability Bar */}
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1.5">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: `${probPct}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Forecast Note */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between">
            <span>{language === 'hy' ? 'Ընդհանուր Հավանականությունը՝' : language === 'ru' ? 'Суммарная вероятность:' : 'Total Probability:'}</span>
            <span className="font-mono-math font-bold text-slate-900 dark:text-white">100.0% (Σ = 1.0)</span>
          </div>
        </div>

        {/* Simulation Action Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-between min-h-[340px] space-y-4 shadow-xs">
          <div className="text-center space-y-2 my-auto">
            {actualWeather ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="space-y-2"
              >
                <div className="text-5xl sm:text-6xl">{actualWeather.icon}</div>
                <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  {t(actualWeather.labelKey as any)}
                </div>
                <div
                  className={`text-xs font-bold flex items-center justify-center gap-1 ${
                    lastWon ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {lastWon ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  <span>{lastWon ? `${t('win')}!` : `${t('loss')}`}</span>
                </div>
              </motion.div>
            ) : (
              <div className="text-slate-400 space-y-2">
                <span className="text-4xl sm:text-5xl">🌤️</span>
                <p className="text-xs font-semibold">{t('predictDayPrompt')}</p>
              </div>
            )}
          </div>

          <button
            type="button"
            disabled={isSimulatingDay}
            onClick={handlePredict}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 text-white font-bold text-sm shadow-md shadow-amber-600/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer min-h-[48px]"
          >
            {isSimulatingDay ? t('loading') : t('simulateDay')}
          </button>
        </div>
      </div>

      {/* 10-Day Challenge Controls */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>{t('multiDayChallenge')}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {language === 'hy'
                ? 'Ստուգեք Ձեր կանխատեսողական որոշումները մի քանի օրվա ընթացքում'
                : language === 'ru'
                ? 'Проверьте точность прогнозов в серии последовательных дней'
                : 'Test your optimal decision-making strategy across a multi-day series'}
            </p>
          </div>

          {!isChallengeActive ? (
            <div className="flex gap-2 flex-wrap">
              {[5, 10, 30].map(days => (
                <button
                  key={days}
                  type="button"
                  onClick={() => startChallenge(days)}
                  className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-amber-600 hover:text-white text-xs font-mono-math text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer min-h-[38px]"
                >
                  {days} {language === 'hy' ? 'Օր' : language === 'ru' ? 'Дней' : 'Days'}
                </button>
              ))}
            </div>
          ) : (
            <button
              type="button"
              onClick={stopChallenge}
              className="px-4 py-2 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-500/30 text-xs font-bold transition-colors cursor-pointer min-h-[38px]"
            >
              {language === 'hy' ? 'Դադարեցնել Չելենջը' : language === 'ru' ? 'Остановить челлендж' : 'End Challenge'}
            </button>
          )}
        </div>

        {isChallengeActive && (
          <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-amber-200 dark:border-amber-500/20 grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">{language === 'hy' ? 'Ընթացիկ Օր' : language === 'ru' ? 'Текущий день' : 'Current Day'}</span>
              <span className="text-lg font-bold font-mono-math text-slate-900 dark:text-white">
                {currentDayIndex} / {challengeTotalDays}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">{language === 'hy' ? 'Ճիշտ Կանխատեսումներ' : language === 'ru' ? 'Угадано дней' : 'Correct Predictions'}</span>
              <span className="text-lg font-bold font-mono-math text-emerald-600 dark:text-emerald-400">
                {challengeScore} / {currentDayIndex - 1}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 col-span-2 sm:col-span-1">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">{t('accuracyRate')}</span>
              <span className="text-lg font-bold font-mono-math text-amber-600 dark:text-amber-400">
                {currentDayIndex > 1 ? `${((challengeScore / (currentDayIndex - 1)) * 100).toFixed(1)}%` : '—'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Large Simulation Lab */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
              <span>{language === 'hy' ? 'Կլիմայական Սիմուլյացիա (N Օր)' : language === 'ru' ? 'Климатическая симуляция (N дней)' : 'Long-term Weather Simulation'}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {language === 'hy'
                ? 'Համեմատեք փորձարարական հաճախականությունները տեսական բաշխման հետ'
                : language === 'ru'
                ? 'Сравните наблюдаемую частоту с теоретическим прогнозом'
                : 'Verify empirical weather occurrence against predicted model'}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {[100, 1000, 10000].map(n => (
              <button
                key={n}
                type="button"
                onClick={() => runWeatherSimulation(n)}
                className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-cyan-600 hover:text-white text-xs font-mono-math text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer min-h-[38px]"
              >
                {n} {language === 'hy' ? 'Օր' : language === 'ru' ? 'Дней' : 'Days'}
              </button>
            ))}
          </div>
        </div>

        {simChartData && (
          <div className="h-64 sm:h-72 w-full pt-4 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={simChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke={isDark ? '#94a3b8' : '#475569'} tick={{ fontSize: 11 }} />
                <YAxis unit="%" stroke={isDark ? '#94a3b8' : '#475569'} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#0f172a' : '#ffffff',
                    borderColor: isDark ? '#334155' : '#e2e8f0',
                    borderRadius: '12px',
                    color: isDark ? '#ffffff' : '#0f172a',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="theoretical" name={t('theoreticalProb')} fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="experimental" name={t('experimentalProb')} fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherGame;
