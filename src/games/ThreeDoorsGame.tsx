import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  DoorClosed,
  Sparkles,
  RotateCcw,
  BarChart2,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { simulateMontyHall } from '../utils/probability';

export const ThreeDoorsGame: React.FC = () => {
  const { t, language, recordThreeDoorsGame, openProbabilityModal, stats } = useApp();

  const [prizeDoor, setPrizeDoor] = useState<number>(() => Math.floor(Math.random() * 3));
  const [selectedDoor, setSelectedDoor] = useState<number | null>(null);
  const [revealedDoor, setRevealedDoor] = useState<number | null>(null);
  const [finalDoor, setFinalDoor] = useState<number | null>(null);
  const [gameStage, setGameStage] = useState<'pick' | 'host_reveal' | 'finished'>('pick');
  const [resultMessage, setResultMessage] = useState<string>('');
  const [switched, setSwitched] = useState<boolean>(false);

  // Quick mini experiment
  const [simResults, setSimResults] = useState<{
    stayWinRate: number;
    switchWinRate: number;
    trials: number;
  } | null>(null);

  const resetGame = () => {
    setPrizeDoor(Math.floor(Math.random() * 3));
    setSelectedDoor(null);
    setRevealedDoor(null);
    setFinalDoor(null);
    setGameStage('pick');
    setResultMessage('');
    setSwitched(false);
  };

  // Step 1: User selects door
  const handleSelectDoor = (doorIndex: number) => {
    if (gameStage !== 'pick') return;
    setSelectedDoor(doorIndex);

    // Host reveals an empty door
    let hostPick: number;
    do {
      hostPick = Math.floor(Math.random() * 3);
    } while (hostPick === doorIndex || hostPick === prizeDoor);

    setRevealedDoor(hostPick);
    setGameStage('host_reveal');
  };

  // Step 2: Stay or Switch
  const handleDecision = (shouldSwitch: boolean) => {
    if (gameStage !== 'host_reveal' || selectedDoor === null || revealedDoor === null) return;

    let finalPick = selectedDoor;
    if (shouldSwitch) {
      finalPick = [0, 1, 2].find(d => d !== selectedDoor && d !== revealedDoor)!;
    }

    setSwitched(shouldSwitch);
    setFinalDoor(finalPick);
    setGameStage('finished');

    const won = finalPick === prizeDoor;
    recordThreeDoorsGame(won, shouldSwitch);

    if (won) {
      setResultMessage(shouldSwitch ? t('montyWinSwitch') : t('montyWinStay'));
    } else {
      setResultMessage(shouldSwitch ? t('montyLossSwitch') : t('montyLossStay'));
    }
  };

  // Real-time Show My Chances handler
  const handleShowChances = () => {
    if (gameStage === 'pick') {
      openProbabilityModal({
        title: t('gameThreeDoorsTitle'),
        event: language === 'hy' ? 'Դեռ ոչ մի դուռ ընտրված չէ' : language === 'ru' ? 'Ни одна дверь еще не выбрана' : 'Initial State (No Door Selected)',
        theoretical: 1 / 3,
        theoreticalFraction: '1/3',
        whyText:
          language === 'hy'
            ? '3 դռներից յուրաքանչյուրի հետևում մրցանակի լինելու հավանականությունը հավասարապես 1/3 (33.33%) է:'
            : language === 'ru'
            ? 'До первого выбора за каждой из 3 дверей приз находится с равной вероятностью 1/3 (33.33%).'
            : 'Before any choice is made, each of the 3 doors has an equal 1/3 (33.33%) chance of concealing the prize.',
        formula: 'P(Door i) = 1/3 ≈ 33.33%',
        breakdown: [
          { label: `${t('door')} 1`, value: 1 / 3, color: 'bg-indigo-500' },
          { label: `${t('door')} 2`, value: 1 / 3, color: 'bg-indigo-500' },
          { label: `${t('door')} 3`, value: 1 / 3, color: 'bg-indigo-500' },
        ],
      });
    } else if (gameStage === 'host_reveal') {
      const switchDoor = [0, 1, 2].find(d => d !== selectedDoor && d !== revealedDoor)!;
      openProbabilityModal({
        title: t('gameThreeDoorsTitle'),
        event:
          language === 'hy'
            ? `Հաղորդավարը բացել է Դուռ ${revealedDoor! + 1}-ը (Դատարկ): Դուք ընտրել եք Դուռ ${selectedDoor! + 1}-ը:`
            : language === 'ru'
            ? `Ведущий открыл пустую Дверь ${revealedDoor! + 1}. Вы изначально выбрали Дверь ${selectedDoor! + 1}.`
            : `Host revealed empty Door ${revealedDoor! + 1}. You are currently on Door ${selectedDoor! + 1}.`,
        theoretical: 2 / 3,
        theoreticalFraction: '2/3',
        whyText: t('montyExplanationWhy'),
        formula: 'P(Stay) = 1/3 (33.3%) | P(Switch) = 2/3 (66.7%)',
        recommendation:
          language === 'hy'
            ? 'Միշտ ՓՈԽԵԼ (Switch) դուռը: Շահելու շանսը կրկնապատկվում է (66.7% ընդդեմ 33.3%):'
            : language === 'ru'
            ? 'Всегда МЕНЯТЬ дверь! Вероятность победы удваивается (с 33.3% до 66.7%).'
            : 'Always SWITCH. Your probability of winning doubles from 33.3% to 66.7%.',
        breakdown: [
          { label: `${t('btnStay')} (Door ${selectedDoor! + 1})`, value: 1 / 3, color: 'bg-amber-500' },
          { label: `${t('btnSwitch')} (Door ${switchDoor + 1})`, value: 2 / 3, color: 'bg-emerald-500' },
        ],
      });
    } else {
      const won = finalDoor === prizeDoor;
      openProbabilityModal({
        title: t('gameThreeDoorsTitle'),
        event: language === 'hy' ? `Խաղի ավարտ (${won ? t('win') : t('loss')})` : language === 'ru' ? `Завершение игры (${won ? 'Победа' : 'Поражение'})` : `Game Finished (${won ? 'Win' : 'Loss'})`,
        theoretical: switched ? 2 / 3 : 1 / 3,
        theoreticalFraction: switched ? '2/3' : '1/3',
        experimental: stats.threeDoors.games > 0 ? stats.threeDoors.wins / stats.threeDoors.games : undefined,
        sampleSize: stats.threeDoors.games,
        whyText: t('montyExplanationWhy'),
        formula: 'P(Win | Switch) = 2/3, P(Win | Stay) = 1/3',
      });
    }
  };

  const runSimulation = (n: number) => {
    const res = simulateMontyHall(n);
    setSimResults({
      stayWinRate: res.stayWinRate,
      switchWinRate: res.switchWinRate,
      trials: res.trials,
    });
  };

  const stayRate =
    stats.threeDoors.stayWins + stats.threeDoors.stayLosses > 0
      ? (
          (stats.threeDoors.stayWins / (stats.threeDoors.stayWins + stats.threeDoors.stayLosses)) *
          100
        ).toFixed(1)
      : '0.0';

  const switchRate =
    stats.threeDoors.switchWins + stats.threeDoors.switchLosses > 0
      ? (
          (stats.threeDoors.switchWins / (stats.threeDoors.switchWins + stats.threeDoors.switchLosses)) *
          100
        ).toFixed(1)
      : '0.0';

  return (
    <div className="space-y-6 sm:space-y-8 transition-colors duration-200">
      {/* Game Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-indigo-500/30 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-mono-math">
            <span>{language === 'hy' ? 'ԽԱՂ 01' : language === 'ru' ? 'ИГРА 01' : 'GAME 01'}</span>
            <span>•</span>
            <span>{t('gameThreeDoorsConcept')}</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {t('gameThreeDoorsTitle')}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mt-1">{t('gameThreeDoorsSubtitle')}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button
            type="button"
            onClick={handleShowChances}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/25 transition-all hover:scale-105 active:scale-95 cursor-pointer min-h-[44px]"
          >
            <BarChart2 className="w-4 h-4 shrink-0" />
            <span>{t('showChances')}</span>
          </button>

          <button
            type="button"
            onClick={resetGame}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            title={t('reset')}
            aria-label={t('reset')}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stage Instruction Banner */}
      <div className="text-center p-3.5 sm:p-4 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm shadow-xs">
        {gameStage === 'pick' && (
          <span className="font-semibold text-indigo-600 dark:text-cyan-300 text-sm sm:text-base flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-cyan-400 shrink-0" />
            <span>{t('montyStep1')}</span>
          </span>
        )}
        {gameStage === 'host_reveal' && (
          <span className="font-semibold text-amber-600 dark:text-amber-300 text-sm sm:text-base animate-pulse">
            {t('montyStep2')}
          </span>
        )}
        {gameStage === 'finished' && (
          <div className="space-y-1">
            <span
              className={`font-bold text-base sm:text-lg ${
                finalDoor === prizeDoor ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {finalDoor === prizeDoor ? `🎉 ${t('win')}!` : `❌ ${t('loss')}`}
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-300">{resultMessage}</p>
          </div>
        )}
      </div>

      {/* 3 Interactive Doors Stage - Responsive layout on 320px+ */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 max-w-4xl mx-auto py-2 sm:py-4">
        {[0, 1, 2].map(idx => {
          const isSelected = selectedDoor === idx;
          const isRevealed = revealedDoor === idx;
          const isPrize = prizeDoor === idx;
          const isFinal = finalDoor === idx;
          const isOpen = isRevealed || (gameStage === 'finished' && (isFinal || isPrize));

          return (
            <motion.div
              key={idx}
              whileHover={gameStage === 'pick' ? { scale: 1.02 } : {}}
              whileTap={gameStage === 'pick' ? { scale: 0.98 } : {}}
              onClick={() => handleSelectDoor(idx)}
              className={`relative cursor-pointer rounded-2xl p-2.5 sm:p-5 md:p-6 flex flex-col items-center justify-between min-h-[220px] sm:min-h-[280px] md:min-h-[310px] border-2 transition-all duration-300 ${
                isOpen
                  ? isPrize
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 shadow-md shadow-amber-500/15'
                    : 'bg-slate-100 dark:bg-slate-900/60 border-slate-300 dark:border-slate-700 opacity-80'
                  : isSelected
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 shadow-lg shadow-indigo-500/20 ring-2 ring-indigo-400/50'
                  : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 hover:border-indigo-400 shadow-xs'
              }`}
            >
              {/* Door Header Label */}
              <div className="w-full flex items-center justify-between gap-1 mb-2">
                <span className="text-[10px] sm:text-xs font-mono-math font-bold px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300 truncate">
                  {t('door')} {idx + 1}
                </span>
                {isSelected && !isOpen && (
                  <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-600 text-white shadow-xs shrink-0">
                    {language === 'hy' ? 'Ընտրված' : language === 'ru' ? 'Выбрано' : 'Selected'}
                  </span>
                )}
              </div>

              {/* Door Visual Center */}
              <div className="my-auto flex flex-col items-center justify-center">
                {isOpen ? (
                  isPrize ? (
                    <div className="text-center space-y-1 animate-bounce">
                      <div className="text-3xl sm:text-5xl md:text-6xl">🎁</div>
                      <div className="text-[10px] sm:text-xs font-bold text-amber-600 dark:text-amber-300">{t('doorPrize')}</div>
                    </div>
                  ) : (
                    <div className="text-center space-y-1">
                      <div className="text-3xl sm:text-5xl md:text-6xl">🐐</div>
                      <div className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400">{t('doorGoat')}</div>
                    </div>
                  )
                ) : (
                  <div className="text-center space-y-2">
                    <DoorClosed className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-indigo-600 dark:text-indigo-400 mx-auto transition-transform" />
                    <div className="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400">
                      {gameStage === 'pick'
                        ? language === 'hy'
                          ? 'Ընտրել'
                          : language === 'ru'
                          ? 'Выбрать'
                          : 'Choose'
                        : '???'}
                    </div>
                  </div>
                )}
              </div>

              {/* Door Bottom Footer */}
              <div className="w-full text-center mt-2 pt-2 border-t border-slate-200 dark:border-slate-800/60 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-mono-math truncate">
                {gameStage === 'pick' && 'P = 33.3%'}
                {gameStage === 'host_reveal' && isSelected && 'P(Stay)=33%'}
                {gameStage === 'host_reveal' && !isSelected && !isRevealed && 'P(Switch)=67%'}
                {gameStage === 'host_reveal' && isRevealed && 'P = 0%'}
                {gameStage === 'finished' && (isPrize ? '🎁 Prize' : '🐐 Goat')}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Decision Buttons (Stay vs Switch) - Vertical Stack on Mobile */}
      {gameStage === 'host_reveal' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl mx-auto flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-500/40 shadow-xl"
        >
          <button
            type="button"
            onClick={() => handleDecision(false)}
            className="w-full sm:w-1/2 py-3.5 px-4 rounded-xl bg-amber-50 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-slate-700 text-amber-800 dark:text-amber-300 font-bold text-sm border border-amber-300 dark:border-amber-500/30 shadow-xs transition-all hover:scale-[1.02] active:scale-95 cursor-pointer min-h-[48px]"
          >
            {t('btnStay')}
          </button>

          <button
            type="button"
            onClick={() => handleDecision(true)}
            className="w-full sm:w-1/2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-md shadow-emerald-600/25 transition-all hover:scale-[1.03] active:scale-95 ring-2 ring-emerald-400 cursor-pointer min-h-[48px]"
          >
            {t('btnSwitch')}
          </button>
        </motion.div>
      )}

      {/* Game Finished Reset Button */}
      {gameStage === 'finished' && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={resetGame}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 transition-all hover:scale-105 cursor-pointer min-h-[48px]"
          >
            {t('playAgain')}
          </button>
        </div>
      )}

      {/* Live Player Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-center shadow-xs">
        <div>
          <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">{t('totalTrials')}</div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-mono-math">{stats.threeDoors.games}</div>
        </div>
        <div>
          <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">{t('wins')}</div>
          <div className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono-math">{stats.threeDoors.wins}</div>
        </div>
        <div>
          <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">{language === 'hy' ? 'Մնալ %' : language === 'ru' ? 'Остаться %' : 'Stay %'}</div>
          <div className="text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-400 font-mono-math">{stayRate}%</div>
          <div className="text-[10px] text-slate-400">{stats.threeDoors.stayWins} wins</div>
        </div>
        <div>
          <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">{language === 'hy' ? 'Փոխել %' : language === 'ru' ? 'Сменить %' : 'Switch %'}</div>
          <div className="text-xl sm:text-2xl font-bold text-indigo-600 dark:text-cyan-400 font-mono-math">{switchRate}%</div>
          <div className="text-[10px] text-slate-400">{stats.threeDoors.switchWins} wins</div>
        </div>
      </div>

      {/* Fast Laboratory Simulation Section */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-cyan-400 shrink-0" />
              <span>{language === 'hy' ? 'Արագ Մաթեմատիկական Սիմուլյացիա' : language === 'ru' ? 'Быстрая симуляция' : 'Instant Simulation'}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {language === 'hy'
                ? 'Ստուգեք Մեծ թվերի օրենքը ավտոմատ փորձերով'
                : language === 'ru'
                ? 'Проверьте закон больших чисел автоматическими испытаниями'
                : 'Verify Law of Large Numbers via automated trials'}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {[100, 1000, 10000].map(n => (
              <button
                key={n}
                type="button"
                onClick={() => runSimulation(n)}
                className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white text-xs font-mono-math text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer min-h-[38px]"
              >
                {n.toLocaleString()} {t('trials')}
              </button>
            ))}
          </div>
        </div>

        {simResults && (
          <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-indigo-200 dark:border-indigo-500/20 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">{t('btnStay')}</div>
              <div className="text-lg sm:text-xl font-bold text-amber-600 dark:text-amber-400 font-mono-math">
                {(simResults.stayWinRate * 100).toFixed(2)}%
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">{t('theoreticalProb')}: 33.33%</div>
            </div>

            <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">{t('btnSwitch')}</div>
              <div className="text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono-math">
                {(simResults.switchWinRate * 100).toFixed(2)}%
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">{t('theoreticalProb')}: 66.67%</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThreeDoorsGame;
