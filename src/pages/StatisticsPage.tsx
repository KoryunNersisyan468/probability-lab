import { Download, Trash2, PieChart as PieIcon } from 'lucide-react';
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
  const { t, language, stats, resetAllStats, isDark } = useApp();

  // Safely extract with fallbacks to avoid crashes
  const threeDoors = stats?.threeDoors ?? { games: 0, wins: 0, stayWins: 0, stayLosses: 0, switchWins: 0, switchLosses: 0 };
  const password = stats?.password ?? { attempts: 0, successfulGuesses: 0 };
  const cards = stats?.cards ?? { draws: 0, correctPredictions: 0 };
  const dice = stats?.dice ?? { rolls: 0 };
  const coin = stats?.coin ?? { flips: 0, heads: 0, tails: 0 };
  const weather = stats?.weather ?? { predictions: 0, correctPredictions: 0 };
  const quiz = stats?.quiz ?? { quizzesCompleted: 0 };

  const totalActions =
    threeDoors.games +
    password.attempts +
    cards.draws +
    dice.rolls +
    coin.flips +
    weather.predictions;

  const totalWins =
    threeDoors.wins +
    password.successfulGuesses +
    cards.correctPredictions +
    coin.heads +
    weather.correctPredictions;

  const winRate = totalActions > 0 ? ((totalWins / totalActions) * 100).toFixed(1) : '0.0';

  const gameBreakdownData = [
    { name: t('gameThreeDoorsTitle'), value: threeDoors.games, color: '#6366f1' },
    { name: t('gamePasswordTitle'), value: password.attempts, color: '#06b6d4' },
    { name: t('gameCardsTitle'), value: cards.draws, color: '#f43f5e' },
    { name: t('gameDiceTitle'), value: dice.rolls, color: '#f59e0b' },
    { name: t('gameCoinTitle'), value: coin.flips, color: '#10b981' },
    { name: t('gameWeatherTitle'), value: weather.predictions, color: '#a855f7' },
  ].filter(d => d.value > 0);

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(stats, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `probability_lab_telemetry_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 sm:space-y-8 transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-indigo-500/30 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-cyan-400 font-mono-math">
            <span>{language === 'hy' ? 'ՎԻՃԱԿԱԳՐՈՒԹՅՈՒՆ ԵՎ ՏԵԼԵՄԵՏՐԻԱ' : language === 'ru' ? 'СТАТИСТИКА И ТЕЛЕМЕТРИЯ' : 'TELEMETRY & ANALYTICS'}</span>
            <span>•</span>
            <span>EMPIRICAL LOG</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {t('statsHeading')}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mt-1">{t('statsSubheading')}</p>
        </div>

        {/* Global Data Actions */}
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

      {/* Aggregate High-Level Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
          <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 block font-semibold">{t('totalTrials')}</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono-math">{totalActions}</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
          <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 block font-semibold">{t('wins')}</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono-math">{totalWins}</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
          <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 block font-semibold">{t('accuracyRate')}</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-cyan-400 font-mono-math">{winRate}%</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
          <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 block font-semibold">{t('quizzesCompleted')}</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-purple-600 dark:text-purple-400 font-mono-math">{quiz.quizzesCompleted}</div>
        </div>
      </div>

      {/* Breakdown by Game Category */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart Card */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-indigo-600 dark:text-cyan-400 shrink-0" />
            <span>{language === 'hy' ? 'Ակտիվության Բաշխում' : language === 'ru' ? 'Распределение активности' : 'Activity Distribution'}</span>
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
                      <Cell key={`cell-${index}`} fill={entry.color} />
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
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-slate-400 text-xs">
              {language === 'hy' ? 'Խաղացեք որևէ խաղ՝ տվյալներ տեսնելու համար' : language === 'ru' ? 'Сыграйте в любую игру для сбора данных' : 'Play games to generate telemetry logs'}
            </div>
          )}
        </div>

        {/* Individual Game Breakdown Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Monty Hall Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>🚪</span>
                <span>{t('gameThreeDoorsTitle')}</span>
              </span>
              <span className="text-xs font-mono-math text-slate-500 dark:text-slate-400">{threeDoors.games} plays</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
              <div>
                <span className="text-slate-500 dark:text-slate-400">{t('btnStay')}: </span>
                <span className="font-mono-math font-bold text-amber-600 dark:text-amber-400">
                  {threeDoors.stayWins}/{threeDoors.stayWins + threeDoors.stayLosses}
                </span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">{t('btnSwitch')}: </span>
                <span className="font-mono-math font-bold text-emerald-600 dark:text-emerald-400">
                  {threeDoors.switchWins}/{threeDoors.switchWins + threeDoors.switchLosses}
                </span>
              </div>
            </div>
          </div>

          {/* Password Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>🔑</span>
                <span>{t('gamePasswordTitle')}</span>
              </span>
              <span className="text-xs font-mono-math text-slate-500 dark:text-slate-400">{password.attempts} guesses</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
              <div>
                <span className="text-slate-500 dark:text-slate-400">{t('wins')}: </span>
                <span className="font-mono-math font-bold text-cyan-600 dark:text-cyan-400">{password.successfulGuesses}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">Avg Guesses: </span>
                <span className="font-mono-math font-bold text-slate-900 dark:text-white">
                  {password.successfulGuesses > 0 ? (password.attempts / password.successfulGuesses).toFixed(1) : '—'}
                </span>
              </div>
            </div>
          </div>

          {/* Cards Deck Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>🃏</span>
                <span>{t('gameCardsTitle')}</span>
              </span>
              <span className="text-xs font-mono-math text-slate-500 dark:text-slate-400">{cards.draws} draws</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
              <div>
                <span className="text-slate-500 dark:text-slate-400">{t('wins')}: </span>
                <span className="font-mono-math font-bold text-rose-600 dark:text-rose-400">{cards.correctPredictions}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">Success: </span>
                <span className="font-mono-math font-bold text-slate-900 dark:text-white">
                  {cards.draws > 0 ? `${((cards.correctPredictions / cards.draws) * 100).toFixed(1)}%` : '—'}
                </span>
              </div>
            </div>
          </div>

          {/* Coin Toss Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>🪙</span>
                <span>{t('gameCoinTitle')}</span>
              </span>
              <span className="text-xs font-mono-math text-slate-500 dark:text-slate-400">{coin.flips} flips</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
              <div>
                <span className="text-slate-500 dark:text-slate-400">{t('heads')}: </span>
                <span className="font-mono-math font-bold text-amber-600 dark:text-amber-400">{coin.heads}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">{t('tails')}: </span>
                <span className="font-mono-math font-bold text-indigo-600 dark:text-indigo-400">{coin.tails}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;