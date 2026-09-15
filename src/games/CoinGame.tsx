import { useState } from 'react';
import {
  BarChart2,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { simulateCoinFlips } from '../utils/probability';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';

export const CoinGame: React.FC = () => {
  const { t, language, recordCoinFlip, openProbabilityModal, stats, isDark } = useApp();

  const [predictedSide, setPredictedSide] = useState<'heads' | 'tails'>('heads');
  const [coinSide, setCoinSide] = useState<'heads' | 'tails'>('heads');
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [lastWin, setLastWin] = useState<boolean | null>(null);

  // Large simulation & convergence data
  const [convergenceData, setConvergenceData] = useState<any[] | null>(null);
  const [simSummary, setSimSummary] = useState<{
    heads: number;
    tails: number;
    headsRatio: number;
    tailsRatio: number;
  } | null>(null);

  const flipCoin = () => {
    setIsFlipping(true);
    setLastWin(null);

    setTimeout(() => {
      const outcome: 'heads' | 'tails' = Math.random() < 0.5 ? 'heads' : 'tails';
      setCoinSide(outcome);
      const won = predictedSide === outcome;
      setLastWin(won);
      recordCoinFlip(outcome, predictedSide);
      setIsFlipping(false);
    }, 1000);
  };

  const handleShowChances = () => {
    const total = stats.coin.flips;
    const expHeads = total > 0 ? stats.coin.heads / total : undefined;

    openProbabilityModal({
      title: t('gameCoinTitle'),
      event: language === 'hy' ? 'Արդար մետաղադրամի նետում' : language === 'ru' ? 'Бросок симметричной монеты' : 'Fair Coin Toss',
      theoretical: 0.5,
      theoreticalFraction: '1/2',
      experimental: expHeads,
      sampleSize: total,
      whyText: t('convergenceDesc'),
      formula: 'P(Heads) = 1/2 = 50.0% | P(Tails) = 1/2 = 50.0%',
      recommendation:
        language === 'hy'
          ? 'Յուրաքանչյուր նետում անկախ է: Եթե անգամ 5 անգամ անընդմեջ Գիրբ է ընկել, 6-րդ նետմանը Գիրբի շանսը դեռևս ճիշտ 50% է (Անկախություն):'
          : language === 'ru'
          ? 'Каждый бросок независим. Даже после серии из 5 «Орлов» подряд, вероятность выпадения «Орла» на следующем броске остается ровно 50%.'
          : 'Every toss is independent. Even after a streak of 5 heads, the next flip remains exactly 50% Heads (Independence of trials).',
      breakdown: [
        { label: t('heads'), value: 0.5, color: 'bg-amber-500' },
        { label: t('tails'), value: 0.5, color: 'bg-indigo-500' },
      ],
    });
  };

  const runConvergenceSimulation = (n: number) => {
    const res = simulateCoinFlips(n);
    setSimSummary({
      heads: res.heads,
      tails: res.tails,
      headsRatio: res.headsRatio,
      tailsRatio: res.tailsRatio,
    });
    setConvergenceData(res.historyPoints);
  };

  const totalFlips = stats.coin.flips;
  const headsPct = totalFlips > 0 ? ((stats.coin.heads / totalFlips) * 100).toFixed(1) : '50.0';
  const tailsPct = totalFlips > 0 ? ((stats.coin.tails / totalFlips) * 100).toFixed(1) : '50.0';

  return (
    <div className="space-y-6 sm:space-y-8 transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-amber-500/30 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 font-mono-math">
            <span>{language === 'hy' ? 'ԽԱՂ 05' : language === 'ru' ? 'ИГРА 05' : 'GAME 05'}</span>
            <span>•</span>
            <span>{t('gameCoinConcept')}</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {t('gameCoinTitle')}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mt-1">{t('gameCoinSubtitle')}</p>
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

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center max-w-4xl mx-auto">
        {/* Animated 3D Coin Canvas */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center min-h-[300px] sm:min-h-[340px] shadow-xs">
          <div className="my-auto perspective-1000">
            <div
              className={`w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 flex items-center justify-center shadow-xl transition-all ${
                isFlipping
                  ? coinSide === 'heads'
                    ? 'animate-coin-heads'
                    : 'animate-coin-tails'
                  : ''
              } ${
                coinSide === 'heads'
                  ? 'bg-gradient-to-tr from-amber-500 via-amber-300 to-yellow-100 border-amber-400 text-slate-950 shadow-amber-500/20'
                  : 'bg-gradient-to-tr from-slate-300 via-slate-100 to-white border-slate-400 text-slate-950 shadow-slate-500/20'
              }`}
            >
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-extrabold font-mono-math">
                  {coinSide === 'heads' ? '֏' : '1'}
                </div>
                <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider mt-0.5">
                  {coinSide === 'heads' ? t('heads') : t('tails')}
                </div>
              </div>
            </div>
          </div>

          {/* Outcome Alert */}
          {lastWin !== null && (
            <div
              className={`mt-4 text-xs sm:text-sm font-bold ${
                lastWin ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {lastWin ? `🎉 ${t('win')}!` : `${t('loss')}`} ({coinSide === 'heads' ? t('heads') : t('tails')})
            </div>
          )}
        </div>

        {/* Prediction & Controls */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-xs">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
              {t('predictCoin')}:
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPredictedSide('heads')}
                className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold border flex flex-col items-center gap-1 transition-all cursor-pointer min-h-[48px] ${
                  predictedSide === 'heads'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20 ring-2 ring-amber-400/50'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="text-base sm:text-lg">֏</span>
                <span>{t('heads')} (50%)</span>
              </button>

              <button
                type="button"
                onClick={() => setPredictedSide('tails')}
                className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold border flex flex-col items-center gap-1 transition-all cursor-pointer min-h-[48px] ${
                  predictedSide === 'tails'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20 ring-2 ring-indigo-400/50'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="text-base sm:text-lg">1</span>
                <span>{t('tails')} (50%)</span>
              </button>
            </div>
          </div>

          <button
            type="button"
            disabled={isFlipping}
            onClick={flipCoin}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 text-white font-bold text-sm shadow-md shadow-amber-600/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer min-h-[48px]"
          >
            {isFlipping ? t('loading') : t('flipCoin')}
          </button>

          {/* Quick Stats Grid */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-3 text-center">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">{t('heads')}</span>
              <span className="text-lg font-bold text-amber-600 dark:text-amber-400 font-mono-math">
                {stats.coin.heads} <span className="text-xs">({headsPct}%)</span>
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">{t('tails')}</span>
              <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400 font-mono-math">
                {stats.coin.tails} <span className="text-xs">({tailsPct}%)</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Law of Large Numbers (Convergence Simulation) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-cyan-400 shrink-0" />
              <span>{t('lawOfLargeNumbers')}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {language === 'hy'
                ? 'Սիմուլյացիան ցուցադրում է փորձարարական հաճախականության ձգտումը դեպի 0.5 (50%)'
                : language === 'ru'
                ? 'Симуляция демонстрирует стремление эмпирической частоты к 0.5 (50%)'
                : 'Simulating cumulative frequency approaching theoretical 50% line'}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {[100, 1000, 10000, 100000].map(n => (
              <button
                key={n}
                type="button"
                onClick={() => runConvergenceSimulation(n)}
                className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white text-xs font-mono-math text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer min-h-[38px]"
              >
                {n.toLocaleString()} {t('trials')}
              </button>
            ))}
          </div>
        </div>

        {convergenceData && (
          <div className="space-y-4">
            {simSummary && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">{t('heads')} Ratio</span>
                  <span className="text-base font-bold font-mono-math text-amber-600 dark:text-amber-400">
                    {(simSummary.headsRatio * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">{t('tails')} Ratio</span>
                  <span className="text-base font-bold font-mono-math text-indigo-600 dark:text-indigo-400">
                    {(simSummary.tailsRatio * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">{t('heads')} Count</span>
                  <span className="text-base font-bold font-mono-math text-slate-900 dark:text-white">
                    {simSummary.heads.toLocaleString()}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">{t('tails')} Count</span>
                  <span className="text-base font-bold font-mono-math text-slate-900 dark:text-white">
                    {simSummary.tails.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            <div className="h-64 sm:h-72 w-full pt-2 min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={convergenceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                  <ReferenceLine y={0.5} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'Theory (50%)', fill: '#ef4444', fontSize: 10 }} />
                  <Line
                    type="monotone"
                    dataKey="ratio"
                    name={`${t('heads')} Ratio`}
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoinGame;
