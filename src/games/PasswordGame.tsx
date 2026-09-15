import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  KeyRound,
  BarChart2,
  ShieldCheck,
  ShieldAlert,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { simulatePasswordCracking } from '../utils/probability';

export const PasswordGame: React.FC = () => {
  const { t, language, recordPasswordGuess, openProbabilityModal, stats } = useApp();

  const [length, setLength] = useState<number>(3);
  const [includeDigits, setIncludeDigits] = useState<boolean>(true);
  const [includeLowercase, setIncludeLowercase] = useState<boolean>(false);
  const [includeUppercase, setIncludeUppercase] = useState<boolean>(false);

  // Secret password & attempts
  const [secret, setSecret] = useState<string>('');
  const [userGuess, setUserGuess] = useState<string>('');
  const [attempts, setAttempts] = useState<number>(0);
  const [lastWin, setLastWin] = useState<boolean | null>(null);
  const [history, setHistory] = useState<Array<{ guess: string; match: boolean }>>([]);

  // Monte Carlo Simulation
  const [simResults, setSimResults] = useState<{
    successRate: number;
    avgAttempts: number;
    spaceSize: number;
  } | null>(null);

  // Build character pool
  const getPool = () => {
    let pool = '';
    if (includeDigits) pool += '0123456789';
    if (includeLowercase) pool += 'abcdefghijklmnopqrstuvwxyz';
    if (includeUppercase) pool += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return pool.length > 0 ? pool : '0123456789';
  };

  const pool = getPool();
  const poolSize = pool.length;
  const totalCombinations = Math.pow(poolSize, length);

  const generateSecret = () => {
    let s = '';
    for (let i = 0; i < length; i++) {
      s += pool.charAt(Math.floor(Math.random() * pool.length));
    }
    setSecret(s);
    setAttempts(0);
    setUserGuess('');
    setLastWin(null);
    setHistory([]);
  };

  useEffect(() => {
    generateSecret();
  }, [length, includeDigits, includeLowercase, includeUppercase]);

  const handleGuessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userGuess || userGuess.length !== length) return;

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    const isMatch = userGuess === secret;
    setLastWin(isMatch);
    setHistory(prev => [{ guess: userGuess, match: isMatch }, ...prev.slice(0, 7)]);

    recordPasswordGuess(isMatch, newAttempts);
    if (isMatch) {
      setTimeout(() => {
        generateSecret();
      }, 2500);
    }
  };

  const handleShowChances = () => {
    openProbabilityModal({
      title: t('gamePasswordTitle'),
      event:
        language === 'hy'
          ? `Ճիշտ գուշակել ${length} նիշանոց գաղտնաբառը (${poolSize} նիշային բազմությունից) առաջին փորձից`
          : language === 'ru'
          ? `Угадать ${length}-значный пароль из алфавита (${poolSize} символов) с 1-й попытки`
          : `Guessing a ${length}-character passcode from a pool of ${poolSize} characters on 1st trial`,
      theoretical: 1 / totalCombinations,
      theoreticalFraction: `1 / ${totalCombinations.toLocaleString()}`,
      whyText: t('passwordFormulaWhy'),
      formula: `P(Guess) = 1 / Nᴸ = 1 / (${poolSize}^${length}) = 1 / ${totalCombinations.toLocaleString()}`,
      recommendation:
        language === 'hy'
          ? 'Գաղտնաբառի երկարությունը (L) մեծացնելը էքսպոնենցիալ կերպով նվազեցնում է կոտրելու հավանականությունը: 3 նիշի դեպքում՝ 1/1,000, 4 նիշի դեպքում՝ 1/10,000:'
          : language === 'ru'
          ? 'Увеличение длины пароля (L) экспоненциально уменьшает вероятность взлома: для L=3 шанс 1/1000, для L=4 — 1/10 000.'
          : 'Increasing passcode length exponentially diminishes brute-force odds: length 3 is 1/1,000, while length 4 is 1/10,000.',
    });
  };

  const runSimulation = (simAttempts: number) => {
    const res = simulatePasswordCracking(poolSize, length, simAttempts, 1000);
    setSimResults({
      successRate: res.successRate,
      avgAttempts: res.avgAttempts,
      spaceSize: res.totalSpace,
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8 transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-cyan-500/30 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 font-mono-math">
            <span>{language === 'hy' ? 'ԽԱՂ 02' : language === 'ru' ? 'ИГРА 02' : 'GAME 02'}</span>
            <span>•</span>
            <span>{t('gamePasswordConcept')}</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {t('gamePasswordTitle')}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mt-1">{t('gamePasswordSubtitle')}</p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button
            type="button"
            onClick={handleShowChances}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-cyan-600/25 transition-all hover:scale-105 active:scale-95 cursor-pointer min-h-[44px]"
          >
            <BarChart2 className="w-4 h-4 shrink-0" />
            <span>{t('showChances')}</span>
          </button>

          <button
            type="button"
            onClick={generateSecret}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            title={t('reset')}
            aria-label={t('reset')}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Passcode Config & Combination Space Metric */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Controls Card */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
            <span>{language === 'hy' ? 'Կոմբինատոր Պարամետրեր' : language === 'ru' ? 'Параметры комбинаций' : 'Combinatorial Parameters'}</span>
          </h3>

          {/* Length Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-700 dark:text-slate-300">
                {t('passwordLength')} (L):
              </span>
              <span className="font-mono-math text-sm text-cyan-600 dark:text-cyan-400 font-bold">
                {length} {language === 'hy' ? 'նիշ' : language === 'ru' ? 'символов' : 'chars'}
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="5"
              step="1"
              value={length}
              onChange={e => setLength(Number(e.target.value))}
              className="w-full accent-cyan-500 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono-math">
              <span>2 (Easy)</span>
              <span>3 (Normal)</span>
              <span>4 (Hard)</span>
              <span>5 (Extreme)</span>
            </div>
          </div>

          {/* Character Sets Checklist */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
              {t('characterSet')} (N):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeDigits}
                  onChange={e => setIncludeDigits(e.target.checked || (!includeLowercase && !includeUppercase))}
                  className="rounded text-cyan-600 focus:ring-cyan-500"
                />
                <span className="text-slate-800 dark:text-slate-200">0-9 ({t('digitsOnly')})</span>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeLowercase}
                  onChange={e => setIncludeLowercase(e.target.checked)}
                  className="rounded text-cyan-600 focus:ring-cyan-500"
                />
                <span className="text-slate-800 dark:text-slate-200">a-z ({t('lettersLower')})</span>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeUppercase}
                  onChange={e => setIncludeUppercase(e.target.checked)}
                  className="rounded text-cyan-600 focus:ring-cyan-500"
                />
                <span className="text-slate-800 dark:text-slate-200">A-Z ({t('lettersUpper')})</span>
              </label>
            </div>
          </div>
        </div>

        {/* Space Breakdown Card */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-cyan-200 dark:border-cyan-500/30 flex flex-col justify-between space-y-4 shadow-xs">
          <div>
            <span className="text-[10px] font-mono-math uppercase tracking-wider text-cyan-600 dark:text-cyan-400 font-bold block">
              {t('totalCombinations')}
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono-math mt-1 break-words">
              {totalCombinations.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono-math">
              Nᴸ = {poolSize}^{length}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">{t('singleGuessChance')}:</span>
              <span className="font-mono-math text-cyan-600 dark:text-cyan-400 font-bold">
                {((1 / totalCombinations) * 100).toFixed(4)}%
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">{t('alphabetSize')}:</span>
              <span className="font-mono-math text-slate-900 dark:text-white font-bold">{poolSize}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Passcode Cracker Vault Stage */}
      <div className="p-5 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-w-xl mx-auto space-y-6 shadow-xs">
        <div className="text-center space-y-1">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {language === 'hy' ? 'Գաղտնաբառի Գուշակման Վահանակ' : language === 'ru' ? 'Панель взлома пароля' : 'Passcode Guess Console'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {language === 'hy'
              ? `Մուտքագրեք ${length} նիշանոց գաղտնաբառը և ստուգեք Ձեր ինտուիցիան`
              : language === 'ru'
              ? `Введите ${length}-значный пароль и испытайте интуицию`
              : `Enter a ${length}-character combination to test your luck`}
          </p>
        </div>

        {/* Guess Form - Responsive layout */}
        <form onSubmit={handleGuessSubmit} className="space-y-4">
          <div className="flex justify-center">
            <input
              type="text"
              maxLength={length}
              value={userGuess}
              onChange={e => setUserGuess(e.target.value)}
              placeholder={'•'.repeat(length)}
              className="w-full max-w-xs text-center text-2xl sm:text-3xl tracking-widest font-mono-math px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-cyan-500 focus:outline-hidden uppercase"
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={userGuess.length !== length}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 disabled:opacity-40 text-white font-bold text-sm shadow-md shadow-cyan-600/25 transition-all cursor-pointer min-h-[44px]"
            >
              {t('guessPassword')} ({attempts} {t('trials')})
            </button>
          </div>
        </form>

        {/* Feedback Alert */}
        {lastWin !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-4 rounded-xl flex items-center gap-3 ${
              lastWin
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300'
                : 'bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-500/40 text-rose-800 dark:text-rose-300'
            }`}
          >
            {lastWin ? <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-500" /> : <ShieldAlert className="w-5 h-5 shrink-0 text-rose-500" />}
            <div className="text-xs sm:text-sm">
              <span className="font-bold">{lastWin ? t('win') : t('loss')}! </span>
              {lastWin
                ? language === 'hy'
                  ? `Շնորհավորում ենք: Գաղտնաբառը գտնվեց ${attempts} փորձից:`
                  : language === 'ru'
                  ? `Поздравляем! Пароль взломан за ${attempts} попыток.`
                  : `Passcode cracked in ${attempts} attempts!`
                : language === 'hy'
                ? `«${userGuess}»-ը սխալ էր: Փորձեք նորից կամ ուսումնասիրեք հավանականությունը:`
                : language === 'ru'
                ? `«${userGuess}» не подошел. Попробуйте еще раз.`
                : `«${userGuess}» was incorrect. Try another guess.`}
            </div>
          </motion.div>
        )}

        {/* Recent History */}
        {history.length > 0 && (
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-mono-math uppercase text-slate-500 dark:text-slate-400 block mb-2">
              {language === 'hy' ? 'Վերջին Փորձերը' : language === 'ru' ? 'Последние попытки' : 'Recent Attempts'}
            </span>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {history.map((h, i) => (
                <span
                  key={i}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono-math font-bold border ${
                    h.match
                      ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-400 text-emerald-700 dark:text-emerald-300'
                      : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {h.guess} {h.match ? '✓' : '✗'}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Simulation Experiment Section */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
              <span>{language === 'hy' ? 'Կոպիտ Ուժի (Brute-Force) Սիմուլյացիա' : language === 'ru' ? 'Симуляция Brute-Force' : 'Brute-Force Simulation'}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {language === 'hy'
                ? 'Սիմուլացրեք հարձակման արդյունավետությունը N փորձերով'
                : language === 'ru'
                ? 'Оцените шансы перебора при ограниченном числе попыток'
                : 'Simulate brute-force success probability within N trials'}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {[10, 50, 200, 1000].map(k => (
              <button
                key={k}
                type="button"
                onClick={() => runSimulation(k)}
                className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-cyan-600 hover:text-white text-xs font-mono-math text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer min-h-[38px]"
              >
                {k} {t('trials')}
              </button>
            ))}
          </div>
        </div>

        {simResults && (
          <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-cyan-200 dark:border-cyan-500/20 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">{t('simSuccessRate')}</div>
              <div className="text-lg sm:text-xl font-bold text-cyan-600 dark:text-cyan-400 font-mono-math">
                {(simResults.successRate * 100).toFixed(2)}%
              </div>
            </div>
            <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">{t('avgAttemptsNeeded')}</div>
              <div className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-mono-math">
                ~{Math.round(simResults.spaceSize / 2).toLocaleString()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordGame;
