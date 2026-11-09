import React from 'react';
import { useSearchParams } from 'react-router';
import { useApp } from '../context/AppContext';
import { ORDERED_GAMES } from '../utils/gamesConfig';
import { ThreeDoorsGame } from '../games/ThreeDoorsGame';
import { CoinGame } from '../games/CoinGame';
import { DiceGame } from '../games/DiceGame';
import { WeatherGame } from '../games/WeatherGame';
import { PasswordGame } from '../games/PasswordGame';
import { CardsGame } from '../games/CardsGame';
import { QuizGame } from '../games/QuizGame';

export const GamesPage: React.FC = () => {
  const { t } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeGame = searchParams.get('game') || 'doors';

  const selectGame = (id: string) => {
    setSearchParams({ game: id });
  };

  return (
    <div className="space-y-6 sm:space-y-8 transition-colors duration-200">
      {/* Game Switcher Tabs - Strictly ordered 1 through 7 */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2.5 pt-1 border-b border-slate-200 dark:border-slate-800 scrollbar-thin">
        {ORDERED_GAMES.map(game => {
          const isActive = activeGame === game.id;
          return (
            <button
              key={game.id}
              type="button"
              onClick={() => selectGame(game.id)}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer min-h-[42px] ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md shadow-indigo-600/25'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 shadow-xs'
              }`}
            >
              <span className="text-base">{game.icon}</span>
              <span>{t(game.titleKey)}</span>
            </button>
          );
        })}
      </div>

      {/* Render Selected Game */}
      <div className="relative min-h-[500px]">
        {activeGame === 'doors' && <ThreeDoorsGame />}
        {activeGame === 'coin' && <CoinGame />}
        {activeGame === 'dice' && <DiceGame />}
        {activeGame === 'weather' && <WeatherGame />}
        {activeGame === 'password' && <PasswordGame />}
        {activeGame === 'cards' && <CardsGame />}
        {activeGame === 'quiz' && <QuizGame />}
      </div>
    </div>
  );
};

export default GamesPage;
