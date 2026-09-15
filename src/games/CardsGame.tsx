import { useState } from 'react';
import { motion } from 'motion/react';
import {
  BarChart2,
  Layers,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  PlayingCard,
  CardSuit,
  CardRank,
  drawRandomCard,
  SUITS,
  RANKS,
  simulateCardDraws,
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

export const CardsGame: React.FC = () => {
  const { t, language, recordCardDraw, openProbabilityModal, stats, isDark } = useApp();

  const [currentCard, setCurrentCard] = useState<PlayingCard | null>(null);
  const [selectedSuit, setSelectedSuit] = useState<CardSuit | 'any'>('any');
  const [selectedRank, setSelectedRank] = useState<CardRank | 'any'>('any');
  const [selectedColor, setSelectedColor] = useState<'red' | 'black' | 'any'>('any');
  const [lastWin, setLastWin] = useState<boolean | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  // Simulation
  const [simResults, setSimResults] = useState<any[] | null>(null);

  const calculateTargetProb = () => {
    let favorable = 0;
    const total = 52;

    for (const suit of SUITS) {
      for (const rank of RANKS) {
        let match = true;
        if (selectedSuit !== 'any' && suit.id !== selectedSuit) match = false;
        if (selectedRank !== 'any' && rank !== selectedRank) match = false;
        if (selectedColor !== 'any' && suit.color !== selectedColor) match = false;
        if (match) favorable++;
      }
    }

    return { favorable, total, prob: favorable / total };
  };

  const { favorable, total, prob } = calculateTargetProb();

  const handleDraw = () => {
    setIsDrawing(true);
    setTimeout(() => {
      const card = drawRandomCard();
      setCurrentCard(card);

      let won = true;
      if (selectedSuit !== 'any' && card.suit !== selectedSuit) won = false;
      if (selectedRank !== 'any' && card.rank !== selectedRank) won = false;
      if (selectedColor !== 'any' && card.color !== selectedColor) won = false;

      setLastWin(won);
      recordCardDraw(won);
      setIsDrawing(false);
    }, 450);
  };

  const handleShowChances = () => {
    openProbabilityModal({
      title: t('gameCardsTitle'),
      event:
        language === 'hy'
          ? `Հանել քարտ (${selectedSuit !== 'any' ? selectedSuit : ''} ${selectedRank !== 'any' ? selectedRank : ''} ${selectedColor !== 'any' ? selectedColor : ''} ${selectedSuit === 'any' && selectedRank === 'any' && selectedColor === 'any' ? 'Ցանկացած' : ''})`
          : language === 'ru'
          ? `Вытянуть карту (${selectedSuit !== 'any' ? selectedSuit : ''} ${selectedRank !== 'any' ? selectedRank : ''} ${selectedColor !== 'any' ? selectedColor : ''} ${selectedSuit === 'any' && selectedRank === 'any' && selectedColor === 'any' ? 'Любая' : ''})`
          : `Draw specified condition card (${selectedSuit !== 'any' ? selectedSuit : ''} ${selectedRank !== 'any' ? selectedRank : ''} ${selectedColor !== 'any' ? selectedColor : ''})`,
      theoretical: prob,
      theoreticalFraction: `${favorable}/${total}`,
      whyText:
        language === 'hy'
          ? `Ստանդարտ կապուկում կա 52 քարտ: Ձեր ընտրած պայմանին բավարարում է ${favorable} քարտ: P = ${favorable}/52:`
          : language === 'ru'
          ? `В стандартной колоде 52 карты. Выбранному условию удовлетворяет ${favorable} карт. Вероятность P = ${favorable}/52.`
          : `Standard deck has 52 cards. Exactly ${favorable} cards satisfy your chosen criteria. P = ${favorable}/52.`,
      formula: `P(E) = |E| / |S| = ${favorable} / 52`,
      recommendation:
        selectedSuit !== 'any' && selectedRank !== 'any'
          ? language === 'hy'
            ? 'Կոնկրետ 1 քարտի շանսը ընդամենը 1/52 (1.92%) է:'
            : language === 'ru'
            ? 'Шанс выпадения конкретной карты составляет всего 1/52 (1.92%).'
            : 'Odds of any unique individual card are exactly 1/52 (1.92%).'
          : selectedSuit !== 'any'
          ? language === 'hy'
            ? 'Կոնկրետ մաստի շանսը 13/52 = 1/4 (25.0%) է:'
            : language === 'ru'
            ? 'Шанс выпадения конкретной масти 13/52 = 1/4 (25.0%).'
            : 'Odds of a single specific suit are 13/52 = 25.0%.'
          : undefined,
      breakdown: [
        { label: language === 'hy' ? 'Համապատասխան քարտեր' : language === 'ru' ? 'Подходящие' : 'Target Cards', value: prob, color: 'bg-emerald-500' },
        { label: language === 'hy' ? 'Այլ քարտեր' : language === 'ru' ? 'Остальные' : 'Other Cards', value: 1 - prob, color: 'bg-indigo-500' },
      ],
    });
  };

  const runSuitSimulation = (n: number) => {
    const res = simulateCardDraws(n);
    const chartData = [
      { name: '♠ Spades', theoretical: 25, experimental: Number(((res.suits.spades / n) * 100).toFixed(1)), color: '#6366f1' },
      { name: '♥ Hearts', theoretical: 25, experimental: Number(((res.suits.hearts / n) * 100).toFixed(1)), color: '#ef4444' },
      { name: '♦ Diamonds', theoretical: 25, experimental: Number(((res.suits.diamonds / n) * 100).toFixed(1)), color: '#f59e0b' },
      { name: '♣ Clubs', theoretical: 25, experimental: Number(((res.suits.clubs / n) * 100).toFixed(1)), color: '#10b981' },
    ];
    setSimResults(chartData);
  };

  return (
    <div className="space-y-6 sm:space-y-8 transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-rose-500/30 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 font-mono-math">
            <span>{language === 'hy' ? 'ԽԱՂ 03' : language === 'ru' ? 'ИГРА 03' : 'GAME 03'}</span>
            <span>•</span>
            <span>{t('gameCardsConcept')}</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {t('gameCardsTitle')}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mt-1">{t('gameCardsSubtitle')}</p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button
            type="button"
            onClick={handleShowChances}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-rose-600/25 transition-all hover:scale-105 active:scale-95 cursor-pointer min-h-[44px]"
          >
            <BarChart2 className="w-4 h-4 shrink-0" />
            <span>{t('showChances')}</span>
          </button>
        </div>
      </div>

      {/* Target Configuration & Deck View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Prediction Target Selectors */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
            <span>{language === 'hy' ? 'Ընտրեք Կանխատեսման Պայմանը' : language === 'ru' ? 'Выберите условия прогноза' : 'Define Target Card Condition'}</span>
          </h3>

          {/* Suit Filter */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
              {t('suit')}:
            </span>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => setSelectedSuit('any')}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer min-h-[40px] ${
                  selectedSuit === 'any'
                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {language === 'hy' ? 'Ցանկացած Մաստ' : language === 'ru' ? 'Любая масть' : 'Any Suit'}
              </button>
              {SUITS.map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedSuit(s.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all cursor-pointer min-h-[40px] ${
                    selectedSuit === s.id
                      ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className={s.color === 'red' ? 'text-red-500 font-bold text-base' : 'text-slate-900 dark:text-white text-base'}>
                    {s.symbol}
                  </span>
                  <span>{t(s.nameKey as any)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Rank Filter */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
              {t('rank')}:
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedRank('any')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer min-h-[36px] ${
                  selectedRank === 'any'
                    ? 'bg-rose-600 text-white border-rose-600'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {language === 'hy' ? 'Ցանկացած' : language === 'ru' ? 'Любой' : 'Any'}
              </button>
              {RANKS.map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setSelectedRank(r)}
                  className={`w-9 h-9 rounded-lg text-xs font-mono-math font-bold border transition-all flex items-center justify-center cursor-pointer ${
                    selectedRank === r
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Live Calculated Probability Stat Box */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 block font-semibold">{t('calculatedProbability')}</span>
              <span className="text-sm font-mono-math text-slate-700 dark:text-slate-300">{favorable} / {total} {t('cardsCount')}</span>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-rose-600 dark:text-rose-400 font-mono-math">
              {(prob * 100).toFixed(2)}%
            </div>
          </div>
        </div>

        {/* Dynamic Interactive Card Display */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center min-h-[340px] space-y-4 shadow-xs">
          {currentCard ? (
            <motion.div
              initial={{ rotateY: 180, scale: 0.8 }}
              animate={{ rotateY: 0, scale: 1 }}
              transition={{ duration: 0.4 }}
              className={`w-36 h-52 sm:w-44 sm:h-64 rounded-2xl p-4 bg-white border-4 shadow-2xl flex flex-col justify-between select-none ${
                currentCard.color === 'red' ? 'text-red-600 border-red-400' : 'text-slate-900 border-slate-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xl sm:text-2xl font-black font-mono-math">{currentCard.rank}</span>
                <span className="text-xl sm:text-2xl">{currentCard.suitSymbol}</span>
              </div>
              <div className="text-5xl sm:text-6xl text-center">{currentCard.suitSymbol}</div>
              <div className="flex items-center justify-between rotate-180">
                <span className="text-xl sm:text-2xl font-black font-mono-math">{currentCard.rank}</span>
                <span className="text-xl sm:text-2xl">{currentCard.suitSymbol}</span>
              </div>
            </motion.div>
          ) : (
            <div className="w-36 h-52 sm:w-44 sm:h-64 rounded-2xl bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 p-4 text-center">
              <span className="text-4xl mb-2">🎴</span>
              <span className="text-xs font-semibold">{language === 'hy' ? 'Քարտը դեռ հանված չէ' : language === 'ru' ? 'Карта не вытянута' : 'No card drawn'}</span>
            </div>
          )}

          {/* Draw Button */}
          <button
            type="button"
            disabled={isDrawing}
            onClick={handleDraw}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-bold text-sm shadow-md shadow-rose-600/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer min-h-[48px]"
          >
            {isDrawing ? t('loading') : t('drawCard')}
          </button>
        </div>
      </div>

      {/* Suit Distribution Simulation Chart */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
              <span>{language === 'hy' ? 'Մաստերի Բաշխման Գիտափորձ' : language === 'ru' ? 'Эксперимент распределения мастей' : 'Suit Distribution Experiment'}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {language === 'hy'
                ? 'Ապացուցեք 4 մաստերի 25% հավասարաչափ բաշխումը մեծ թվով հանումներով'
                : language === 'ru'
                ? 'Подтвердите равномерность 25% распределения мастей серией испытаний'
                : 'Empirically verify 25% uniform distribution over repeated draws'}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {[100, 500, 5000].map(n => (
              <button
                key={n}
                type="button"
                onClick={() => runSuitSimulation(n)}
                className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-600 hover:text-white text-xs font-mono-math text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer min-h-[38px]"
              >
                {n} {t('trials')}
              </button>
            ))}
          </div>
        </div>

        {simResults && (
          <div className="h-64 sm:h-72 w-full pt-4 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={simResults} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke={isDark ? '#94a3b8' : '#475569'} tick={{ fontSize: 11 }} />
                <YAxis unit="%" stroke={isDark ? '#94a3b8' : '#475569'} tick={{ fontSize: 11 }} domain={[0, 40]} />
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
                <Bar dataKey="experimental" name={t('experimentalProb')} fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardsGame;
