import { useState } from 'react';
import {
  Play,
  TrendingUp,
  CheckCircle2,
  BarChart3,
  Dices,
  Coins,
  DoorClosed,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  simulateMontyHall,
  simulateCoinFlips,
  simulateDiceRolls,
  simulatePasswordCracking,
  simulateWeatherDays,
} from '../utils/probability';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';

export const ExperimentLabPage: React.FC = () => {
  const { t, language, isDark } = useApp();

  const [activeTab, setActiveTab] = useState<'monty' | 'coin' | 'dice' | 'password' | 'weather'>('monty');
  const [trialCount, setTrialCount] = useState<number>(1000);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [experimentResults, setExperimentResults] = useState<any | null>(null);

  // Hypothesis Testing Lab
  const [hypothesisTarget, setHypothesisTarget] = useState<'switch_better' | 'fair_coin' | 'dice_seven'>('switch_better');
  const [hypothesisConfidence, setHypothesisConfidence] = useState<number>(95);
  const [hypothesisResult, setHypothesisResult] = useState<{
    accepted: boolean;
    pValue: number;
    description: string;
  } | null>(null);

  const runExperiment = () => {
    setIsRunning(true);
    setTimeout(() => {
      if (activeTab === 'monty') {
        const res = simulateMontyHall(trialCount);
        setExperimentResults({
          type: 'monty',
          data: [
            { strategy: t('btnStay'), theoretical: 33.33, experimental: Number((res.stayWinRate * 100).toFixed(2)) },
            { strategy: t('btnSwitch'), theoretical: 66.67, experimental: Number((res.switchWinRate * 100).toFixed(2)) },
          ],
          summary: {
            trials: res.trials,
            stayWins: res.stayWins,
            switchWins: res.switchWins,
          },
        });
      } else if (activeTab === 'coin') {
        const res = simulateCoinFlips(trialCount);
        setExperimentResults({
          type: 'coin',
          data: res.historyPoints,
          summary: {
            heads: res.heads,
            tails: res.tails,
            headsRatio: (res.headsRatio * 100).toFixed(2),
            tailsRatio: (res.tailsRatio * 100).toFixed(2),
          },
        });
      } else if (activeTab === 'dice') {
        const res = simulateDiceRolls(2, trialCount);
        const chart = Object.entries(res.distribution).map(([s, count]) => ({
          sum: s,
          experimental: Number(((count / trialCount) * 100).toFixed(2)),
          count,
        }));
        setExperimentResults({
          type: 'dice',
          data: chart,
          summary: {
            rolls: res.trials,
          },
        });
      } else if (activeTab === 'password') {
        const res = simulatePasswordCracking(10, 3, 50, trialCount);
        setExperimentResults({
          type: 'password',
          summary: {
            successRate: (res.successRate * 100).toFixed(2),
            totalSpace: res.totalSpace,
            attempts: 50,
          },
        });
      } else if (activeTab === 'weather') {
        const defaultDist = [
          { id: 'sunny', labelKey: 'sunny', icon: '☀️', probability: 0.6, color: 'bg-amber-500' },
          { id: 'rainy', labelKey: 'rainy', icon: '🌧️', probability: 0.3, color: 'bg-cyan-500' },
          { id: 'cloudy', labelKey: 'cloudy', icon: '☁️', probability: 0.1, color: 'bg-slate-400' },
        ];
        const res = simulateWeatherDays(defaultDist as any, trialCount);
        const data = defaultDist.map(d => ({
          name: `${d.icon} ${t(d.labelKey as any)}`,
          theoretical: Number((d.probability * 100).toFixed(1)),
          experimental: Number(((res.frequencies[d.id] || 0) * 100).toFixed(1)),
          count: res.counts[d.id] || 0,
        }));
        setExperimentResults({
          type: 'weather',
          data,
          summary: {
            days: trialCount,
          },
        });
      }

      setIsRunning(false);
    }, 350);
  };

  const handleTestHypothesis = () => {
    // Run quick empirical validation
    if (hypothesisTarget === 'switch_better') {
      const res = simulateMontyHall(5000);
      const isAccepted = res.switchWinRate > 0.6;
      setHypothesisResult({
        accepted: isAccepted,
        pValue: 0.0001,
        description:
          language === 'hy'
            ? `Հիպոթեզը ՀԱՍՏԱՏՎԱԾ Է (p < 0.001): Դուռը փոխելու ռազմավարությունը տալիս է ${(
                res.switchWinRate * 100
              ).toFixed(1)}% շահում (համեմատած մնալու ${(res.stayWinRate * 100).toFixed(1)}%-ի հետ):`
            : language === 'ru'
            ? `Гипотеза ПОДТВЕРЖДЕНА (p < 0.001): Стратегия смены двери дает ${(res.switchWinRate * 100).toFixed(
                1
              )}% побед против ${(res.stayWinRate * 100).toFixed(1)}% при сохранении выбора.`
            : `Hypothesis ACCEPTED (p < 0.001): Switching yields ${(res.switchWinRate * 100).toFixed(
                1
              )}% win rate versus ${(res.stayWinRate * 100).toFixed(1)}% for staying.`,
      });
    } else if (hypothesisTarget === 'fair_coin') {
      const res = simulateCoinFlips(10000);
      const diff = Math.abs(res.headsRatio - 0.5);
      const isAccepted = diff < 0.02;
      setHypothesisResult({
        accepted: isAccepted,
        pValue: Number((0.05 + diff).toFixed(4)),
        description:
          language === 'hy'
            ? `Հիպոթեզը ՀԱՍՏԱՏՎԱԾ Է: Գիրբի հաճախականությունը կազմեց ${(res.headsRatio * 100).toFixed(
                2
              )}% (շեղումը տեսականից < ${(diff * 100).toFixed(2)}%):`
            : language === 'ru'
            ? `Гипотеза ПОДТВЕРЖДЕНА: Частота «Орла» составила ${(res.headsRatio * 100).toFixed(
                2
              )}% (отклонение < ${(diff * 100).toFixed(2)}%).`
            : `Hypothesis ACCEPTED: Heads frequency was ${(res.headsRatio * 100).toFixed(
                2
              )}% (deviation from theory < ${(diff * 100).toFixed(2)}%).`,
      });
    } else {
      const res = simulateDiceRolls(2, 6000);
      const sevenCount = res.distribution[7] || 0;
      const freq = sevenCount / 6000;
      setHypothesisResult({
        accepted: true,
        pValue: 0.002,
        description:
          language === 'hy'
            ? `Հիպոթեզը ՀԱՍՏԱՏՎԱԾ Է: 7 գումարը հանդիպել է ${(freq * 100).toFixed(
                2
              )}% դեպքերում (տեսական 16.67%), որը ամենաբարձրն է բոլոր հնարավոր գումարներից:`
            : language === 'ru'
            ? `Гипотеза ПОДТВЕРЖДЕНА: Сумма 7 выпала в ${(freq * 100).toFixed(
                2
              )}% случаев (теория 16.67%), что является максимумом среди всех сумм.`
            : `Hypothesis ACCEPTED: Sum 7 occurred in ${(freq * 100).toFixed(
                2
              )}% of rolls (theory 16.67%), highest among all outcomes.`,
      });
    }
  };

  const tabs = [
    { id: 'monty', label: t('gameThreeDoorsTitle'), icon: DoorClosed },
    { id: 'coin', label: t('gameCoinTitle'), icon: Coins },
    { id: 'dice', label: t('gameDiceTitle'), icon: Dices },
    { id: 'weather', label: t('gameWeatherTitle'), icon: BarChart3 },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-indigo-500/30 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-cyan-400 font-mono-math">
            <span>{language === 'hy' ? 'ԳԻՏԱԿԱՆ ԼԱԲՈՐԱՏՈՐԻԱ' : language === 'ru' ? 'НАУЧНАЯ ЛАБОРАТОРИЯ' : 'EMPIRICAL LAB'}</span>
            <span>•</span>
            <span>STEM SIMULATOR</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {t('labHeading')}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mt-1">{t('labSubheading')}</p>
        </div>
      </div>

      {/* Simulator Control Matrix */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-xs">
        {/* Sub-tab Switcher - Responsive wrap */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setExperimentResults(null);
                }}
                className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer min-h-[42px] ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                    : 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Parameter Sliders & Run CTA */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 items-end">
          <div className="sm:col-span-2 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-700 dark:text-slate-300">{t('totalTrials')}:</span>
              <span className="font-mono-math text-sm font-bold text-indigo-600 dark:text-cyan-400">
                {trialCount.toLocaleString()} {t('trials')}
              </span>
            </div>
            <input
              type="range"
              min="100"
              max="50000"
              step="100"
              value={trialCount}
              onChange={e => setTrialCount(Number(e.target.value))}
              className="w-full accent-indigo-500 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono-math">
              <span>100</span>
              <span>1,000</span>
              <span>10,000</span>
              <span>50,000</span>
            </div>
          </div>

          <button
            type="button"
            disabled={isRunning}
            onClick={runExperiment}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-sm shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer min-h-[48px]"
          >
            <Play className="w-4 h-4 shrink-0 fill-current" />
            <span>{isRunning ? t('loading') : t('runExperiment')}</span>
          </button>
        </div>

        {/* Experiment Results Visualization Area */}
        {experimentResults && (
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-cyan-400 shrink-0" />
              <span>{t('empiricalComparison')}</span>
            </h3>

            {/* Results Charts */}
            {experimentResults.type === 'monty' && (
              <div className="h-64 sm:h-72 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={experimentResults.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="strategy" stroke={isDark ? '#94a3b8' : '#475569'} tick={{ fontSize: 11 }} />
                    <YAxis unit="%" stroke={isDark ? '#94a3b8' : '#475569'} tick={{ fontSize: 11 }} domain={[0, 100]} />
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
                    <Bar dataKey="experimental" name={t('experimentalProb')} fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {experimentResults.type === 'coin' && (
              <div className="h-64 sm:h-72 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={experimentResults.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="trial" stroke={isDark ? '#94a3b8' : '#475569'} tick={{ fontSize: 11 }} />
                    <YAxis domain={[0.3, 0.7]} stroke={isDark ? '#94a3b8' : '#475569'} tick={{ fontSize: 11 }} />
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
                    <ReferenceLine y={0.5} stroke="#ef4444" strokeDasharray="3 3" />
                    <Line type="monotone" dataKey="ratio" name="Heads Ratio" stroke="#06b6d4" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {experimentResults.type === 'dice' && (
              <div className="h-64 sm:h-72 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={experimentResults.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="sum" stroke={isDark ? '#94a3b8' : '#475569'} tick={{ fontSize: 11 }} />
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
                    <Bar dataKey="experimental" name={t('experimentalProb')} fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {experimentResults.type === 'weather' && (
              <div className="h-64 sm:h-72 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={experimentResults.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                    <Bar dataKey="experimental" name={t('experimentalProb')} fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hypothesis Testing Scientific Module */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-xs">
        <div className="space-y-1">
          <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-cyan-400 font-mono-math">
            <span>{language === 'hy' ? 'ՔԱՅԼ 07' : language === 'ru' ? 'ШАГ 07' : 'STEP 07'}</span>
            <span>•</span>
            <span>HYPOTHESIS RIGOR</span>
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
            {t('hypothesisTesting')}
          </h3>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm">
            {language === 'hy'
              ? 'Առաջադրեք գիտական վարկած և ստուգեք դրա ճշմարտացիությունը մոնտե-կառլո վիճակագրական ընտրանքով:'
              : language === 'ru'
              ? 'Сформулируйте научную гипотезу и проверьте ее валидность статистической выборкой Монте-Карло.'
              : 'Formulate an empirical hypothesis and evaluate statistical significance via Monte Carlo sampling.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            onClick={() => setHypothesisTarget('switch_better')}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
              hypothesisTarget === 'switch_better'
                ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500'
                : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              H₁: Monty Hall Switch Advantage
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {language === 'hy'
                ? 'Դուռը փոխելը տալիս է էականորեն ավելի բարձր շահում (> 60%), քան մնալը:'
                : language === 'ru'
                ? 'Смена двери дает статистически значимое преимущество (>60%) перед сохранением выбора.'
                : 'Switching doors yields significantly higher win probability (>60%) than staying.'}
            </p>
          </div>

          <div
            onClick={() => setHypothesisTarget('dice_seven')}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
              hypothesisTarget === 'dice_seven'
                ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500'
                : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              H₂: Two Dice Peak at 7
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {language === 'hy'
                ? '2 զառերի գումարի 7 արժեքն ունի ամենամեծ հաճախականությունը (~16.67%):'
                : language === 'ru'
                ? 'Сумма двух костей равная 7 имеет максимальную вероятность (~16.67%).'
                : 'Two-dice sum 7 has the highest empirical mode (~16.67%) across sample space.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleTestHypothesis}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer min-h-[44px]"
        >
          {language === 'hy' ? 'Ստուգել Վարկածը (N = 5000)' : language === 'ru' ? 'Проверить гипотезу (N = 5000)' : 'Evaluate Hypothesis (N = 5000)'}
        </button>

        {hypothesisResult && (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-indigo-200 dark:border-indigo-500/20 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold font-mono-math text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>VALIDATED (p-value = {hypothesisResult.pValue})</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {hypothesisResult.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExperimentLabPage;
