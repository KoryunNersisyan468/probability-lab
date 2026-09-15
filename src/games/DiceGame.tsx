import React, { useState } from 'react';
import {
  BarChart2,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  getTwoDiceTheoreticalDistribution,
  simulateDiceRolls,
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

export const DiceGame: React.FC = () => {
  const { t, language, recordDiceRoll, openProbabilityModal, stats, isDark } = useApp();

  const [diceCount, setDiceCount] = useState<1 | 2 | 3>(2);
  const [diceValues, setDiceValues] = useState<number[]>([3, 4]);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [predictedSum, setPredictedSum] = useState<number | null>(7);
  const [lastResult, setLastResult] = useState<{ sum: number; won: boolean } | null>(null);

  // Experiment Simulation
  const [simChartData, setSimChartData] = useState<any[] | null>(null);

  const currentSum = diceValues.reduce((a, b) => a + b, 0);

  const rollDice = () => {
    setIsRolling(true);
    setTimeout(() => {
      const newValues = Array.from({ length: diceCount }, () => Math.floor(Math.random() * 6) + 1);
      setDiceValues(newValues);
      const sum = newValues.reduce((a, b) => a + b, 0);
      const won = predictedSum !== null && predictedSum === sum;

      recordDiceRoll(sum, predictedSum ?? undefined);
      setLastResult({ sum, won });
      setIsRolling(false);
    }, 500);
  };

  const handleShowChances = () => {
    if (diceCount === 2) {
      const theoDist = getTwoDiceTheoreticalDistribution();
      const currentProb = predictedSum ? theoDist[predictedSum]?.probability || 0 : theoDist[7].probability;
      const currentFrac = predictedSum ? theoDist[predictedSum]?.fraction || '0/36' : '6/36';

      openProbabilityModal({
        title: `${t('gameDiceTitle')} — 2 Dice Sum (${predictedSum || 7})`,
        event:
          language === 'hy'
            ? `2 զառերի գումարը հավասար է ${predictedSum || 7}`
            : language === 'ru'
            ? `Сумма двух костей равна ${predictedSum || 7}`
            : `Rolling a sum of ${predictedSum || 7} with 2 dice`,
        theoretical: currentProb,
        theoreticalFraction: currentFrac,
        experimental:
          stats.dice.rolls > 0 && predictedSum && stats.dice.sumFrequency[predictedSum]
            ? stats.dice.sumFrequency[predictedSum] / stats.dice.rolls
            : undefined,
        sampleSize: stats.dice.rolls,
        whyText: t('mostLikelySum'),
        formula: 'P(Sum = k) = (Number of pairs summing to k) / 36',
        recommendation:
          language === 'hy'
            ? '7-ն ունի առավելագույն շանս (16.67%), որովհետև ստացվում է 6 տարբեր զույգերով (1+6, 2+5, 3+4, 4+3, 5+2, 6+1):'
            : language === 'ru'
            ? 'Сумма 7 имеет максимальную вероятность (16.67%), так как образуется 6 различными парами.'
            : 'Sum 7 has the highest mathematical probability (16.67%), originating from 6 possible combinations.',
        breakdown: Object.entries(theoDist).map(([s, val]) => ({
          label: `${language === 'hy' ? 'Գումար' : language === 'ru' ? 'Сумма' : 'Sum'} ${s} (${val.fraction})`,
          value: val.probability,
          color: Number(s) === 7 ? 'bg-amber-500' : 'bg-indigo-500',
        })),
      });
    } else {
      openProbabilityModal({
        title: `${t('gameDiceTitle')} (${diceCount} ${diceCount === 1 ? 'Die' : 'Dice'})`,
        event: language === 'hy' ? `${diceCount} զառերի գլորում` : language === 'ru' ? `Бросок ${diceCount} костей` : `Rolling ${diceCount} dice`,
        theoretical: 1 / Math.pow(6, diceCount),
        theoreticalFraction: `1/${Math.pow(6, diceCount)}`,
        whyText:
          language === 'hy'
            ? `Ընդհանուր տարբերակների քանակը 6^${diceCount} = ${Math.pow(6, diceCount)} է:`
            : language === 'ru'
            ? `Общее число исходов составляет 6^${diceCount} = ${Math.pow(6, diceCount)}.`
            : `Total sample space size is 6^${diceCount} = ${Math.pow(6, diceCount)}.`,
        formula: `Sample Space = 6^${diceCount}`,
      });
    }
  };

  const runDiceSimulation = (n: number) => {
    const res = simulateDiceRolls(diceCount, n);
    const minSum = diceCount;
    const maxSum = diceCount * 6;
    const twoDiceTheo = diceCount === 2 ? getTwoDiceTheoreticalDistribution() : null;

    const data: any[] = [];
    for (let s = minSum; s <= maxSum; s++) {
      const expCount = res.distribution[s] || 0;
      const expPct = Number(((expCount / n) * 100).toFixed(2));
      const theoPct = twoDiceTheo ? Number((twoDiceTheo[s]?.probability * 100).toFixed(2)) : 0;

      data.push({
        sum: `${s}`,
        experimental: expPct,
        theoretical: theoPct,
        count: expCount,
      });
    }
    setSimChartData(data);
  };

  // Render Pip Dots on Die Face
  const renderDieFace = (val: number) => {
    const pipPositions: Record<number, number[]> = {
      1: [4],
      2: [0, 8],
      3: [0, 4, 8],
      4: [0, 2, 6, 8],
      5: [0, 2, 4, 6, 8],
      6: [0, 2, 3, 5, 6, 8],
    };
    const active = pipPositions[val] || [];

    return (
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl p-2 sm:p-2.5 shadow-xl border-2 border-slate-300 dark:border-slate-700 grid grid-cols-3 grid-rows-3 gap-1 shrink-0">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => (
          <div key={i} className="flex items-center justify-center">
            {active.includes(i) && (
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-slate-950 shadow-inner" />
            )}
          </div>
        ))}
      </div>
    );
  };

  const possibleSums =
    diceCount === 1
      ? [1, 2, 3, 4, 5, 6]
      : diceCount === 2
      ? [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
      : [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

  return (
    <div className="space-y-6 sm:space-y-8 transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-amber-500/30 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 font-mono-math">
            <span>{language === 'hy' ? 'ԽԱՂ 04' : language === 'ru' ? 'ИГРА 04' : 'GAME 04'}</span>
            <span>•</span>
            <span>{t('gameDiceConcept')}</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {t('gameDiceTitle')}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mt-1">{t('gameDiceSubtitle')}</p>
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

      {/* Main Dice Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Controls & Sum Prediction */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
          {/* Dice Count Selector */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
              {t('diceCount')}:
            </span>
            <div className="flex gap-2">
              {[1, 2, 3].map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setDiceCount(c as any);
                    setDiceValues(Array(c).fill(1));
                    setPredictedSum(c === 1 ? 4 : c === 2 ? 7 : 10);
                  }}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer min-h-[42px] ${
                    diceCount === c
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {c} {c === 1 ? (language === 'hy' ? 'Զառ' : language === 'ru' ? 'Кость' : 'Die') : language === 'hy' ? 'Զառեր' : language === 'ru' ? 'Кости' : 'Dice'}
                </button>
              ))}
            </div>
          </div>

          {/* Sum Prediction Buttons */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t('predictSum')}:
              </span>
              {predictedSum && diceCount === 2 && (
                <span className="text-[11px] font-mono-math text-amber-600 dark:text-amber-400 font-bold">
                  P = {(getTwoDiceTheoreticalDistribution()[predictedSum]?.probability * 100 || 0).toFixed(1)}% ({getTwoDiceTheoreticalDistribution()[predictedSum]?.fraction})
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {possibleSums.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setPredictedSum(s)}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-xs sm:text-sm font-mono-math font-bold border transition-all flex items-center justify-center cursor-pointer ${
                    predictedSum === s
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : s === 7 && diceCount === 2
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-500/40 text-amber-800 dark:text-amber-300 font-black'
                      : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dice Arena */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-between min-h-[340px] space-y-4 shadow-xs">
          {/* Animated Dice Pair */}
          <div className={`my-auto flex items-center justify-center gap-3 sm:gap-4 ${isRolling ? 'animate-dice-roll' : ''}`}>
            {diceValues.map((v, idx) => (
              <React.Fragment key={idx}>{renderDieFace(v)}</React.Fragment>
            ))}
          </div>

          {/* Sum Display */}
          <div className="text-center">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t('currentSum')}</div>
            <div className="text-3xl sm:text-4xl font-black font-mono-math text-slate-900 dark:text-white mt-0.5">
              {currentSum}
            </div>
            {lastResult && (
              <div
                className={`text-xs font-bold mt-1 ${
                  lastResult.won ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {lastResult.won ? `🎉 ${t('win')}! (${lastResult.sum})` : `${t('loss')}`}
              </div>
            )}
          </div>

          {/* Roll Button */}
          <button
            type="button"
            disabled={isRolling}
            onClick={rollDice}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 text-white font-bold text-sm shadow-md shadow-amber-600/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer min-h-[48px]"
          >
            {isRolling ? t('loading') : t('rollDice')}
          </button>
        </div>
      </div>

      {/* Distribution Chart (Bell Curve demonstration) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>{t('bellCurveDistribution')}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {language === 'hy'
                ? 'Զառերի գումարի բաշխման սիմուլյացիա (7-ի կենտրոնացումը)'
                : language === 'ru'
                ? 'Симуляция распределения суммы (пик на значении 7)'
                : 'Sum distribution simulation showing bell-shaped concentration around 7'}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {[100, 1000, 10000].map(n => (
              <button
                key={n}
                type="button"
                onClick={() => runDiceSimulation(n)}
                className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-amber-600 hover:text-white text-xs font-mono-math text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer min-h-[38px]"
              >
                {n} {t('trials')}
              </button>
            ))}
          </div>
        </div>

        {simChartData && (
          <div className="h-64 sm:h-72 w-full pt-4 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={simChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                {diceCount === 2 && (
                  <Bar dataKey="theoretical" name={t('theoreticalProb')} fill="#94a3b8" radius={[4, 4, 0, 0]} />
                )}
                <Bar dataKey="experimental" name={t('experimentalProb')} fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiceGame;
