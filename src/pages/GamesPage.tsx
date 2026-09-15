
import { useSearchParams } from 'react-router';
import { useApp } from '../context/AppContext';
import { ThreeDoorsGame } from '../games/ThreeDoorsGame';
import { PasswordGame } from '../games/PasswordGame';
import { CardsGame } from '../games/CardsGame';
import { DiceGame } from '../games/DiceGame';
import { CoinGame } from '../games/CoinGame';
import { WeatherGame } from '../games/WeatherGame';
import { QuizGame } from '../games/QuizGame';

export const GamesPage: React.FC = () => {
  const { t } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeGame = searchParams.get('game') || 'doors';

  const selectGame = (id: string) => {
    setSearchParams({ game: id });
  };

  const navItems = [
    { id: 'doors', title: t('gameThreeDoorsTitle'), icon: '🚪' },
    { id: 'password', title: t('gamePasswordTitle'), icon: '🔑' },
    { id: 'cards', title: t('gameCardsTitle'), icon: '🃏' },
    { id: 'dice', title: t('gameDiceTitle'), icon: '🎲' },
    { id: 'coin', title: t('gameCoinTitle'), icon: '🪙' },
    { id: 'weather', title: t('gameWeatherTitle'), icon: '☀️' },
    { id: 'quiz', title: t('gameQuizTitle'), icon: '🧠' },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 transition-colors duration-200">
      {/* Game Switcher Tabs - Responsive scrollable bar with touch-friendly pills */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2.5 pt-1 border-b border-slate-200 dark:border-slate-800 scrollbar-thin">
        {navItems.map(item => {
          const isActive = activeGame === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => selectGame(item.id)}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer min-h-[42px] ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md shadow-indigo-600/25'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 shadow-xs'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.title}</span>
            </button>
          );
        })}
      </div>

      {/* Render Selected Game */}
      <div className="relative min-h-[500px]">
        {activeGame === 'doors' && <ThreeDoorsGame />}
        {activeGame === 'password' && <PasswordGame />}
        {activeGame === 'cards' && <CardsGame />}
        {activeGame === 'dice' && <DiceGame />}
        {activeGame === 'coin' && <CoinGame />}
        {activeGame === 'weather' && <WeatherGame />}
        {activeGame === 'quiz' && <QuizGame />}
      </div>
    </div>
  );
};

export default GamesPage;
