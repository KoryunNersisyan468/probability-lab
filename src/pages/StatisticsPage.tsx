
import React from 'react';
import {
  Download,
  Trash2,
  PieChart as PieIcon,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';

export const StatisticsPage: React.FC = () => {
  const { t, language, stats, resetAllStats, isDark, notify } = useApp();

  // Safe defaults prevent crashes if saved statistics are incomplete.
  const threeDoors = stats?.threeDoors;
  const password = stats?.password;
  const cards = stats?.cards;
  const dice = stats?.dice;
  const coin = stats?.coin;
  const weather = stats?.weather;
  const quiz = stats?.quiz;

  const doorGames = threeDoors?.games ?? 0;
  const doorWins = threeDoors?.wins ?? 0;
  const stayWins = threeDoors?.stayWins ?? 0;
  const stayLosses = threeDoors?.stayLosses ?? 0;
  const switchWins = threeDoors?.switchWins ?? 0;
  const switchLosses = threeDoors?.switchLosses ?? 0;

  const passwordAttempts = password?.attempts ?? 0;
  const passwordWins = password?.successfulGuesses ?? 0;

  const cardDraws = cards?.draws ?? 0;
  const cardWins = cards?.correctPredictions ?? 0;

  const diceRolls = dice?.rolls ?? 0;
  const diceWins = dice?.correctPredictions ?? 0;

  const coinFlips = coin?.flips ?? 0;
  const coinHeads = coin?.heads ?? 0;
  const coinTails = coin?.tails ?? 0;
  const coinWins = coin?.correctPredictions ?? 0;

  const weatherPredictions = weather?.predictions ?? 0;
  const weatherWins = weather?.correctPredictions ?? 0;

  const quizQuestions = quiz?.questionsAnswered ?? 0;
  const quizCorrect = quiz?.correctAnswers ?? 0;
  const quizzesCompleted = quiz?.quizzesCompleted ?? 0;

  // Total attempts across all activities.
  const totalActions =
    doorGames +
    passwordAttempts +
    cardDraws +
    diceRolls +
    coinFlips +
    weatherPredictions +
    quizQuestions;

  // Total successful outcomes / correct predictions.
  const totalWins =
    doorWins +
    passwordWins +
    cardWins +
    diceWins +
    coinWins +
    weatherWins +
    quizCorrect;

  const winRate =
    totalActions > 0
      ? ((totalWins / totalActions) * 100).toFixed(1)
      : '0.0';

  const gameBreakdownData = [
    {
      name: t('gameThreeDoorsTitle'),
      value: doorGames,
      color: '#6366f1',
    },
    {
      name: t('gamePasswordTitle'),
      value: passwordAttempts,
      color: '#06b6d4',
    },
    {
      name: t('gameCardsTitle'),
      value: cardDraws,
      color: '#f43f5e',
    },
    {
      name: t('gameDiceTitle'),
      value: diceRolls,
      color: '#f59e0b',
    },
    {
      name: t('gameCoinTitle'),
      value: coinFlips,
      color: '#10b981',
    },
    {
      name: t('gameWeatherTitle'),
      value: weatherPredictions,
      color: '#a855f7',
    },
    {
      name: language === 'hy'
        ? 'Վիկտորինա'
        : language === 'ru'
          ? 'Викторина'
          : 'Quiz',
      value: quizQuestions,
      color: '#ec4899',
    },
  ].filter((item) => item.value > 0);

  const handleExportData = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(stats, null, 2));

    const downloadAnchor = document.createElement('a');

    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `probability_lab_telemetry_${Date.now()}.json`,
    );

    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    notify({
      type: 'success',
      title:
        language === 'hy'
          ? 'Տվյալներն արտահանվեցին'
          : language === 'ru'
            ? 'Данные экспортированы'
            : 'Data Exported',
      description:
        language === 'hy'
          ? 'JSON ֆայլը հաջողությամբ ներբեռնվեց'
          : language === 'ru'
            ? 'JSON файл успешно сохранен'
            : 'JSON telemetry file downloaded successfully.',
      icon: '📥',
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8 transition-colors duration-200">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-indigo-500/30 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-cyan-400 font-mono-math">
            <span>
              {language === 'hy'
                ? 'ՎԻՃԱԿԱԳՐՈՒԹՅՈՒՆ ԵՎ ՏԵԼԵՄԵՏՐԻԱ'
                : language === 'ru'
                  ? 'СТАТИСТИКА И ТЕЛЕМЕТРИЯ'
                  : 'TELEMETRY & ANALYTICS'}
            </span>

            <span>•</span>

            <span>
              {language === 'hy'
                ? 'ՓՈՐՁԱՐԱՐԱԿԱՆ ԳՐԱՆՑԱՄԱՏՅԱՆ'
                : language === 'ru'
                  ? 'ЭМПИРИЧЕСКИЙ ЖУРНАЛ'
                  : 'EMPIRICAL LOG'}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {t('statsHeading')}
          </h2>

          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mt-1">
            {t('statsSubheading')}
          </p>
        </div>

        {/* Data actions */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button
            type="button"
            onClick={handleExportData}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer min-h-[44px]"
          >
            <Download className="w-4 h-4 shrink-0" />
            <span>{t('exportData')} (JSON)</span>
          </button>

          <button
            type="button"
            onClick={resetAllStats}
            className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-800/60 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            title={t('clearData')}
            aria-label={t('clearData')}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Aggregate metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
          <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 block font-semibold">
            {t('totalTrials')}
          </span>

          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono-math">
            {totalActions}
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
          <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 block font-semibold">
            {t('wins')}
          </span>

          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono-math">
            {totalWins}
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
          <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 block font-semibold">
            {t('accuracyRate')}
          </span>

          <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-cyan-400 font-mono-math">
            {winRate}%
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
          <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 block font-semibold">
            {t('quizzesCompleted')}
          </span>

          <div className="text-2xl sm:text-3xl font-extrabold text-purple-600 dark:text-purple-400 font-mono-math">
            {quizzesCompleted}
          </div>
        </div>
      </div>

      {/* Activity distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Pie chart */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-indigo-600 dark:text-cyan-400 shrink-0" />

            <span>
              {language === 'hy'
                ? 'Ակտիվության Բաշխում'
                : language === 'ru'
                  ? 'Распределение активности'
                  : 'Activity Distribution'}
            </span>
          </h3>

          {gameBreakdownData.length > 0 ? (
            <div className="h-56 sm:h-64 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={gameBreakdownData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {gameBreakdownData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#0f172a' : '#ffffff',
                      borderColor: isDark ? '#334155' : '#e2e8f0',
                      borderRadius: '12px',
                      color: isDark ? '#ffffff' : '#0f172a',
                      fontSize: '12px',
                    }}
                  />

                  <Legend
                    wrapperStyle={{
                      fontSize: '11px',
                      paddingTop: '10px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-slate-400 text-xs">
              {language === 'hy'
                ? 'Խաղացեք որևէ խաղ՝ տվյալներ տեսնելու համար'
                : language === 'ru'
                  ? 'Сыграйте в любую игру для сбора данных'
                  : 'Play games to generate telemetry logs'}
            </div>
          )}
        </div>

        {/* Game statistics */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Three Doors */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>🚪</span>
                <span>{t('gameThreeDoorsTitle')}</span>
              </span>

              <span className="text-xs font-mono-math text-slate-500 dark:text-slate-400">
                {doorGames} {language === 'hy' ? 'խաղ' : language === 'ru' ? 'игр' : 'plays'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
              <div>
                <span className="text-slate-500 dark:text-slate-400">
                  {t('btnStay')}:{' '}
                </span>

                <span className="font-mono-math font-bold text-amber-600 dark:text-amber-400">
                  {stayWins}/{stayWins + stayLosses}
                </span>
              </div>

              <div>
                <span className="text-slate-500 dark:text-slate-400">
                  {t('btnSwitch')}:{' '}
                </span>

                <span className="font-mono-math font-bold text-emerald-600 dark:text-emerald-400">
                  {switchWins}/{switchWins + switchLosses}
                </span>
              </div>
            </div>
          </div>

          {/* Password */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>🔑</span>
                <span>{t('gamePasswordTitle')}</span>
              </span>

              <span className="text-xs font-mono-math text-slate-500 dark:text-slate-400">
                {passwordAttempts} {language === 'hy' ? 'փորձ' : language === 'ru' ? 'попыток' : 'guesses'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
              <div>
                <span className="text-slate-500 dark:text-slate-400">
                  {t('wins')}:{' '}
                </span>

                <span className="font-mono-math font-bold text-cyan-600 dark:text-cyan-400">
                  {passwordWins}
                </span>
              </div>

              <div>
                <span className="text-slate-500 dark:text-slate-400">
                  {language === 'hy'
                    ? 'Միջին փորձեր: '
                    : language === 'ru'
                      ? 'Ср. попыток: '
                      : 'Avg Guesses: '}
                </span>

                <span className="font-mono-math font-bold text-slate-900 dark:text-white">
                  {passwordWins > 0
                    ? (passwordAttempts / passwordWins).toFixed(1)
                    : '—'}
                </span>
              </div>
            </div>
          </div>

          {/* Cards */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>🃏</span>
                <span>{t('gameCardsTitle')}</span>
              </span>

              <span className="text-xs font-mono-math text-slate-500 dark:text-slate-400">
                {cardDraws} {language === 'hy' ? 'քաշում' : language === 'ru' ? 'карт' : 'draws'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
              <div>
                <span className="text-slate-500 dark:text-slate-400">
                  {t('wins')}:{' '}
                </span>

                <span className="font-mono-math font-bold text-rose-600 dark:text-rose-400">
                  {cardWins}
                </span>
              </div>

              <div>
                <span className="text-slate-500 dark:text-slate-400">
                  Success:{' '}
                </span>

                <span className="font-mono-math font-bold text-slate-900 dark:text-white">
                  {cardDraws > 0
                    ? `${((cardWins / cardDraws) * 100).toFixed(1)}%`
                    : '—'}
                </span>
              </div>
            </div>
          </div>

          {/* Dice */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>🎲</span>
                <span>{t('gameDiceTitle')}</span>
              </span>

              <span className="text-xs font-mono-math text-slate-500 dark:text-slate-400">
                {diceRolls} {language === 'ru' ? 'бросков' : 'rolls'}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
              <span className="text-slate-500 dark:text-slate-400">
                {t('wins')}:{' '}
              </span>

              <span className="font-mono-math font-bold text-amber-600 dark:text-amber-400">
                {diceWins}
              </span>

              <span className="text-slate-500 dark:text-slate-400 ml-2">
                ({diceRolls > 0
                  ? `${((diceWins / diceRolls) * 100).toFixed(1)}%`
                  : '—'})
              </span>
            </div>
          </div>

          {/* Coin */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>🪙</span>
                <span>{t('gameCoinTitle')}</span>
              </span>

              <span className="text-xs font-mono-math text-slate-500 dark:text-slate-400">
                {coinFlips} {language === 'hy' ? 'նետում' : language === 'ru' ? 'бросков' : 'flips'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
              <div>
                <span className="text-slate-500 dark:text-slate-400">
                  {t('heads')}:{' '}
                </span>

                <span className="font-mono-math font-bold text-amber-600 dark:text-amber-400">
                  {coinHeads}
                </span>
              </div>

              <div>
                <span className="text-slate-500 dark:text-slate-400">
                  {t('tails')}:{' '}
                </span>

                <span className="font-mono-math font-bold text-indigo-600 dark:text-indigo-400">
                  {coinTails}
                </span>
              </div>
            </div>
          </div>

          {/* Weather */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>🌦️</span>
                <span>{t('gameWeatherTitle')}</span>
              </span>

              <span className="text-xs font-mono-math text-slate-500 dark:text-slate-400">
                {weatherPredictions} {language === 'ru' ? 'прогнозов' : 'predictions'}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
              <span className="text-slate-500 dark:text-slate-400">
                {t('wins')}:{' '}
              </span>

              <span className="font-mono-math font-bold text-purple-600 dark:text-purple-400">
                {weatherWins}
              </span>

              <span className="text-slate-500 dark:text-slate-400 ml-2">
                ({weatherPredictions > 0
                  ? `${((weatherWins / weatherPredictions) * 100).toFixed(1)}%`
                  : '—'})
              </span>
            </div>
          </div>

          {/* Quiz */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>📝</span>
                <span>
                  {language === 'hy'
                    ? 'Վիկտորինա'
                    : language === 'ru'
                      ? 'Викторина'
                      : 'Quiz'}
                </span>
              </span>

              <span className="text-xs font-mono-math text-slate-500 dark:text-slate-400">
                {quizzesCompleted} {language === 'ru' ? 'завершено' : 'completed'}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
              <span className="text-slate-500 dark:text-slate-400">
                {t('wins')}:{' '}
              </span>

              <span className="font-mono-math font-bold text-pink-600 dark:text-pink-400">
                {quizCorrect}/{quizQuestions}
              </span>

              <span className="text-slate-500 dark:text-slate-400 ml-2">
                ({quizQuestions > 0
                  ? `${((quizCorrect / quizQuestions) * 100).toFixed(1)}%`
                  : '—'})
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
