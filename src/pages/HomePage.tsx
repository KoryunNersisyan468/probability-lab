
import { Link } from 'react-router';
import { motion } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  FlaskConical,
  BarChart2,
  Gamepad2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HomePage: React.FC = () => {
  const { t, language } = useApp();

  const journeySteps = [
    { num: '01', titleKey: 'journeyStep1', icon: '📖' },
    { num: '02', titleKey: 'journeyStep2', icon: '🎯' },
    { num: '03', titleKey: 'journeyStep3', icon: '🎮' },
    { num: '04', titleKey: 'journeyStep4', icon: '📊' },
    { num: '05', titleKey: 'journeyStep5', icon: '🧪' },
    { num: '06', titleKey: 'journeyStep6', icon: '📈' },
    { num: '07', titleKey: 'journeyStep7', icon: '🔬' },
    { num: '08', titleKey: 'journeyStep8', icon: '💡' },
  ];

  const games = [
    {
      id: 'doors',
      num: '01',
      title: t('gameThreeDoorsTitle'),
      concept: t('gameThreeDoorsConcept'),
      desc: t('gameThreeDoorsDesc'),
      icon: '🚪',
      badge: language === 'hy' ? 'Մոնթի Հոլի Պարադոքս' : language === 'ru' ? 'Парадокс Монти Холла' : 'Monty Hall Paradox',
    },
    {
      id: 'password',
      num: '02',
      title: t('gamePasswordTitle'),
      concept: t('gamePasswordConcept'),
      desc: t('gamePasswordDesc'),
      icon: '🔑',
      badge: language === 'hy' ? 'Կոմբինատորիկա Nᴸ' : language === 'ru' ? 'Комбинаторика Nᴸ' : 'Combinatorics Nᴸ',
    },
    {
      id: 'cards',
      num: '03',
      title: t('gameCardsTitle'),
      concept: t('gameCardsConcept'),
      desc: t('gameCardsDesc'),
      icon: '🃏',
      badge: language === 'hy' ? '52-քարտանոց Կապուկ' : language === 'ru' ? 'Колода из 52 карт' : '52-Card Deck',
    },
    {
      id: 'dice',
      num: '04',
      title: t('gameDiceTitle'),
      concept: t('gameDiceConcept'),
      desc: t('gameDiceDesc'),
      icon: '🎲',
      badge: language === 'hy' ? 'Բաշխում և Գումարներ' : language === 'ru' ? 'Распределение и суммы' : 'Distribution & Sums',
    },
    {
      id: 'coin',
      num: '05',
      title: t('gameCoinTitle'),
      concept: t('gameCoinConcept'),
      desc: t('gameCoinDesc'),
      icon: '🪙',
      badge: language === 'hy' ? 'Մեծ Թվերի Օրենք' : language === 'ru' ? 'Закон больших чисел' : 'Law of Large Numbers',
    },
    {
      id: 'weather',
      num: '06',
      title: t('gameWeatherTitle'),
      concept: t('gameWeatherConcept'),
      desc: t('gameWeatherDesc'),
      icon: '☀️',
      badge: language === 'hy' ? 'Հավանականային Կանխատեսում' : language === 'ru' ? 'Вероятностный прогноз' : 'Probabilistic Forecast',
    },
    {
      id: 'quiz',
      num: '07',
      title: t('gameQuizTitle'),
      concept: t('gameQuizConcept'),
      desc: t('gameQuizDesc'),
      icon: '🧠',
      badge: language === 'hy' ? '10 Փորձառու Հարցեր' : language === 'ru' ? '10 Мастер-вопросов' : '10 Master Challenges',
    },
  ];

  const getStemBadgeText = () => {
    if (language === 'hy') return 'ՀԱՅԱՍՏԱՆԻ STEM & ՄԱԹԵՄԱՏԻԿԱԿԱՆ ԿՐԹԱԿԱՆ ՀԱՐԹԱԿ';
    if (language === 'ru') return 'ОБРАЗОВАТЕЛЬНАЯ ПЛАТФОРМА STEM И МАТЕМАТИКИ';
    return 'ARMENIA STEM & MATH EDUCATION PLATFORM';
  };

  const getScientificSubtitle = () => {
    if (language === 'hy') return 'Յուրաքանչյուր մաթեմատիկական հայտնագործություն անցնում է այս 8 հիմնարար փուլերով';
    if (language === 'ru') return 'Каждое математическое открытие проходит эти 8 фундаментальных этапов';
    return 'Every mathematical discovery follows this structured 8-step empirical pipeline';
  };

  const getWhyHeading = () => {
    if (language === 'hy') return 'Ինչո՞վ է առանձնանում այս Լաբորատորիան';
    if (language === 'ru') return 'В чем уникальность этой лаборатории?';
    return 'Why The Probability Lab?';
  };

  const getWhySub = () => {
    if (language === 'hy') return 'Մենք վերածել ենք չոր մաթեմատիկական բանաձևերը իրական ժամանակի ինտերակտիվ գիտափորձերի:';
    if (language === 'ru') return 'Мы превратили сухие формулы в интерактивные эксперименты в реальном времени.';
    return 'Transforming abstract statistics into tangible, real-time empirical exploration.';
  };

  return (
    <div className="space-y-12 sm:space-y-16 md:space-y-20 transition-colors duration-200">
      {/* Hero Section */}
      <section className="relative pt-4 sm:pt-6 pb-8 sm:pb-12 text-center max-w-4xl mx-auto space-y-4 sm:space-y-6">
        {/* Floating background decorative glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-indigo-500/10 dark:bg-indigo-600/15 blur-[100px] sm:blur-[120px] rounded-full pointer-events-none -z-10" />

        {/* STEM Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300 text-[10px] sm:text-xs font-mono-math font-semibold shadow-xs max-w-full"
        >
          <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 text-indigo-600 dark:text-cyan-400" />
          <span className="truncate">{getStemBadgeText()}</span>
        </motion.div>

        {/* Titles */}
        <div className="space-y-2">
          <h1 className="text-2xl xs:text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight break-words">
            {language === 'hy' ? (
              <>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-600 dark:from-cyan-400 dark:via-indigo-300 dark:to-purple-400">
                  ՀԱՎԱՆԱԿԱՆՈՒԹՅԱՆ ԼԱԲՈՐԱՏՈՐԻԱ
                </span>
                <span className="block text-lg sm:text-2xl md:text-3xl text-slate-600 dark:text-slate-400 font-bold mt-1 font-sans">
                  THE PROBABILITY LAB
                </span>
              </>
            ) : language === 'ru' ? (
              <>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-600 dark:from-cyan-400 dark:via-indigo-300 dark:to-purple-400">
                  ЛАБОРАТОРИЯ ВЕРОЯТНОСТЕЙ
                </span>
                <span className="block text-lg sm:text-2xl md:text-3xl text-slate-600 dark:text-slate-400 font-bold mt-1">
                  «ՀԱՎԱՆԱԿԱՆՈՒԹՅԱՆ ԼԱԲՈՐԱՏՈՐԻԱ»
                </span>
              </>
            ) : (
              <>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-600 dark:from-cyan-400 dark:via-indigo-300 dark:to-purple-400">
                  THE PROBABILITY LAB
                </span>
                <span className="block text-lg sm:text-2xl md:text-3xl text-slate-600 dark:text-slate-400 font-bold mt-1">
                  «ՀԱՎԱՆԱԿԱՆՈՒԹՅԱՆ ԼԱԲՈՐԱՏՈՐԻԱ»
                </span>
              </>
            )}
          </h1>
        </div>

        {/* Philosophy Quote */}
        <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 backdrop-blur-md max-w-2xl mx-auto shadow-sm dark:shadow-xl">
          <p className="text-sm sm:text-base md:text-lg text-slate-800 dark:text-indigo-200 font-medium italic leading-relaxed">
            "{t('philosophyQuote')}"
          </p>
          <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-2 font-mono-math uppercase tracking-wider">
            {t('coreJourney')}
          </p>
        </div>

        {/* Call to Action Buttons - Responsive Stack on Mobile */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 w-full max-w-md mx-auto sm:max-w-none">
          <Link
            to="/games"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 transition-all hover:scale-105 active:scale-95 min-h-[48px]"
          >
            <Gamepad2 className="w-4 h-4 shrink-0" />
            <span>{t('startExploring')}</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </Link>

          <Link
            to="/lab"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-white font-semibold text-sm border border-slate-200 dark:border-slate-700 shadow-xs transition-all hover:scale-105 min-h-[48px]"
          >
            <FlaskConical className="w-4 h-4 shrink-0 text-indigo-600 dark:text-cyan-400" />
            <span>{t('runExperiment')}</span>
          </Link>
        </div>
      </section>

      {/* 8-Step Scientific Journey Section */}
      <section className="space-y-4 sm:space-y-6">
        <div className="text-center space-y-1.5 sm:space-y-2">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-cyan-400 font-mono-math">
            {language === 'hy' ? 'ԳԻՏԱԿԱՆ ՈՒՂԻՆ' : language === 'ru' ? 'НАУЧНЫЙ МЕТОД' : 'THE SCIENTIFIC METHOD'}
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
            {t('coreJourney')}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm max-w-xl mx-auto px-2">
            {getScientificSubtitle()}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-3">
          {journeySteps.map(step => (
            <motion.div
              key={step.num}
              whileHover={{ y: -4 }}
              className="p-3 sm:p-4 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center space-y-2 shadow-xs dark:shadow-md transition-all hover:border-indigo-500/40"
            >
              <div className="text-xl sm:text-2xl">{step.icon}</div>
              <span className="text-[9px] sm:text-[10px] font-mono-math text-indigo-700 dark:text-indigo-400 font-bold px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900">
                {step.num}
              </span>
              <span className="text-[11px] sm:text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                {t(step.titleKey as any)}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 7 Interactive Probability Games Grid */}
      <section className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-mono-math">
              {language === 'hy' ? 'ՓՈՐՁԱՌՈՒԹՅՈՒՆ ԵՎ ԲԱՑԱՀԱՅՏՈՒՄ' : language === 'ru' ? 'ОПЫТ И ОТКРЫТИЯ' : 'EXPERIENCE & DISCOVER'}
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              {t('exploreGames')}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1">{t('heroIntro')}</p>
          </div>

          <Link
            to="/games"
            className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-cyan-400 hover:underline transition-colors w-fit"
          >
            <span>{t('viewAll')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {games.map(g => (
            <motion.div
              key={g.id}
              whileHover={{ y: -5 }}
              className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4 sm:space-y-5 transition-all hover:border-indigo-500/50 shadow-xs dark:shadow-lg relative overflow-hidden"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-xl sm:text-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xs shrink-0">
                    {g.icon}
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-mono-math font-bold px-2 sm:px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300 truncate max-w-[180px]">
                    {g.badge}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-mono-math uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold block">
                    {language === 'hy' ? 'ԽԱՂ' : language === 'ru' ? 'ИГРА' : 'GAME'} {g.num} • {g.concept}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5">{g.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{g.desc}</p>
                </div>
              </div>

              <Link
                to={`/games?game=${g.id}`}
                className="w-full py-2.5 sm:py-3 px-4 rounded-xl bg-slate-50 dark:bg-slate-950 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-between transition-all min-h-[44px]"
              >
                <span>{language === 'hy' ? 'Բացել Խաղը' : language === 'ru' ? 'Открыть игру' : 'Launch Lab'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Core Laboratory Features */}
      <section className="p-5 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-indigo-500/20 space-y-6 sm:space-y-8 shadow-xs">
        <div className="text-center space-y-1.5 sm:space-y-2">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            {getWhyHeading()}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            {getWhySub()}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 space-y-2 shadow-xs">
            <div className="p-2.5 rounded-xl bg-cyan-100 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 w-fit">
              <BarChart2 className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              {language === 'hy' ? 'Իրական Ժամանակի Շանսեր' : language === 'ru' ? 'Шансы в реальном времени' : 'Real-time Odds'}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {language === 'hy'
                ? '«Ցույց տալ հավանականությունը» կոճակը ցուցադրում է մաթեմատիկական ճշգրիտ հաշվարկները յուրաքանչյուր քայլում:'
                : language === 'ru'
                ? 'Кнопка «Показать шансы» мгновенно выводит точный расчет классической вероятности.'
                : 'Instant access to dynamic classical probability calculations and strategic recommendations.'}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 space-y-2 shadow-xs">
            <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 w-fit">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              {t('lawOfLargeNumbers')}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {language === 'hy'
                ? 'Սիմուլյացիոն շարժիչը կարող է ակնթարթորեն կատարել մինչև 1,000,000 փորձ՝ ապացուցելով կոնվերգենցիան:'
                : language === 'ru'
                ? 'Движок симуляции может моментально выполнить до 1 000 000 испытаний, демонстрируя сходимость.'
                : 'Simulate up to 1,000,000 algorithmic trials to watch experimental frequency converge on theory.'}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 space-y-2 shadow-xs">
            <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 w-fit">
              <FlaskConical className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              {language === 'hy' ? 'Հիպոթեզների Ստուգում' : language === 'ru' ? 'Проверка гипотез' : 'Hypothesis Testing'}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {language === 'hy'
                ? 'Առաջադրեք սեփական գիտական վարկածը, անցկացրեք փորձը և ստացեք վիճակագրական եզրակացություն:'
                : language === 'ru'
                ? 'Формулируйте гипотезы, проводите строгие испытания и подтверждайте математические выводы.'
                : 'Formulate hypotheses, run rigorous empirical tests, and validate mathematical assertions.'}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 space-y-2 shadow-xs">
            <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 w-fit">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              {t('navAchievements')}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {language === 'hy'
                ? 'Բացեք բոլոր նվաճումները, անցեք գիտելիքների թեստը և դարձեք հավանականության վարպետ:'
                : language === 'ru'
                ? 'Разблокируйте достижения, пройдите тест знаний и овладейте теорией вероятностей.'
                : 'Unlock STEM milestones, master paradoxes, and track cross-game statistical metrics.'}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
