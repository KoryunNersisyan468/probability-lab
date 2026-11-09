import React from 'react';
import { motion } from 'motion/react';
import {
  GraduationCap,
  CloudSun,
  Trophy,
  Navigation,
  ShieldAlert,
  Shuffle,
  Layers,
  Scale,
  TrendingUp,
  Cpu,
  Brain,
  Microscope,
  Binary,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AboutPage: React.FC = () => {
  const { t, language } = useApp();

  return (
    <div className="space-y-12 max-w-5xl mx-auto transition-colors duration-200">
      {/* Header */}
      <div className="text-center space-y-4 pt-4">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-cyan-400 font-mono-math">
          {language === 'hy'
            ? 'ՄԱԹԵՄԱՏԻԿԱ ԵՎ STEM ԿՐԹՈՒԹՅՈՒՆ'
            : language === 'ru'
            ? 'МАТЕМАТИКА И STEM ОБРАЗОВАНИЕ'
            : 'MATHEMATICS & STEM EDUCATION'}
        </span>
        <h1 className="page-title font-black text-slate-900 dark:text-white tracking-tight">
          {language === 'hy'
            ? 'Նախագծի Մասին և Կրթական Հիմունքներ'
            : language === 'ru'
            ? 'О проекте и образовательных основах'
            : 'About The Project & Educational Foundations'}
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          {t('aboutMissionDesc')}
        </p>
      </div>

      {/* Project Presentation Overview Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-gradient-to-r dark:from-indigo-950/80 dark:via-slate-900 dark:to-slate-900 border border-slate-200 dark:border-indigo-500/30 shadow-xs space-y-5">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {language === 'hy'
                ? '«ՀԱՎԱՆԱԿԱՆՈՒԹՅԱՆ ԼԱԲՈՐԱՏՈՐԻԱ» (The Probability Lab)'
                : language === 'ru'
                ? '«ЛАБОРАТОРИЯ ВЕРОЯТНОСТЕЙ» (The Probability Lab)'
                : 'THE PROBABILITY LAB (Educational Platform)'}
            </h2>
            <span className="text-xs text-indigo-600 dark:text-indigo-300 font-mono-math">
              {language === 'hy'
                ? 'Ինտերակտիվ STEM Մաթեմատիկական Հարթակ'
                : language === 'ru'
                ? 'Интерактивная STEM математическая платформа'
                : 'Interactive STEM Mathematics Showcase'}
            </span>
          </div>
        </div>

        <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
          {language === 'hy'
            ? 'Այս հարթակը նպատակ ունի կոտրելու այն կարծրատիպը, որ հավանականությունների տեսությունը միայն վերացական բանաձևերի շարան է: Իրական ժամանակի 7 ինտերակտիվ խաղերի, մեծածավալ սիմուլյացիոն շարժիչի և գիտական հիպոթեզների ստուգման մոդուլի շնորհիվ յուրաքանչյուր ուսանող և հետազոտող կարող է անձամբ փորձարկել, չափել և վերլուծել պատահույթների բնույթը:'
            : language === 'ru'
            ? 'Эта платформа создана, чтобы преодолеть разрыв между абстрактными формулами и эмпирической интуицией. С помощью 7 интерактивных игр, мощного движка симуляций Монте-Карло и инструментов проверки гипотез каждый может лично исследовать природу случайных событий.'
            : 'This platform bridges the gap between abstract mathematical theory and empirical intuition. Featuring 7 interactive game modules, a high-throughput Monte Carlo simulation engine, and formal hypothesis testing tools, learners experience the emergence of order from randomness firsthand.'}
        </p>
      </div>

      {/* NEW ENGAGING EDUCATIONAL SECTION: Ինչպե՞ս է հավանականությունը բացատրում աշխարհը */}
      <section className="space-y-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono-math">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'hy' ? 'ԿԻՐԱՌԱԿԱՆ ԻՄԱՍՏՈՒԹՅՈՒՆ' : language === 'ru' ? 'ПРИКЛАДНАЯ МУДРОСТЬ' : 'PRACTICAL WISDOM'}</span>
          </div>
          <h2 className="section-title font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t('aboutExplainsWorldTitle')}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
            {t('aboutExplainsWorldSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card A: Everyday Life */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-indigo-500/40 transition-all space-y-4 md:col-span-2"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60">
                <CloudSun className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 font-mono-math">
                  {language === 'hy' ? 'ԹԵՄԱ Ա' : language === 'ru' ? 'ТЕМА А' : 'TOPIC A'}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {t('aboutTopicATitle')}
                </h3>
              </div>
            </div>

            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {t('aboutTopicADesc')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 flex items-start gap-2.5">
                <CloudSun className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  {t('aboutTopicAEx1')}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 flex items-start gap-2.5">
                <Trophy className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  {t('aboutTopicAEx2')}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 flex items-start gap-2.5">
                <Navigation className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  {t('aboutTopicAEx3')}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  {t('aboutTopicAEx4')}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Card B: Randomness & Patterns */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-indigo-500/40 transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800/60">
                  <Shuffle className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 font-mono-math">
                    {language === 'hy' ? 'ԹԵՄԱ Բ' : language === 'ru' ? 'ТЕМА Б' : 'TOPIC B'}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {t('aboutTopicBTitle')}
                  </h3>
                </div>
              </div>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {t('aboutTopicBDesc')}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-cyan-50/60 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800/60 text-xs font-mono-math text-cyan-800 dark:text-cyan-300">
              {language === 'hy'
                ? 'Միկրո մակարդակ՝ քաոս 🎲 ➔ Մակրո մակարդակ՝ խիստ օրինաչափություն 📊'
                : language === 'ru'
                ? 'Микро-уровень: неопределенность 🎲 ➔ Макро-уровень: строгий порядок 📊'
                : 'Micro: pure unpredictability 🎲 ➔ Macro: pristine statistical order 📊'}
            </div>
          </motion.div>

          {/* Card C: Theoretical vs Experimental */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-indigo-500/40 transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800/60">
                  <Scale className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 font-mono-math">
                    {language === 'hy' ? 'ԹԵՄԱ Գ' : language === 'ru' ? 'ТЕМА В' : 'TOPIC C'}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {t('aboutTopicCTitle')}
                  </h3>
                </div>
              </div>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {t('aboutTopicCDesc')}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/60 flex items-center justify-between text-xs font-mono-math text-purple-800 dark:text-purple-300">
              <span>{t('theoreticalProb')}: P = m / n</span>
              <span>↔</span>
              <span>{t('experimentalProb')}: P* = k / N</span>
            </div>
          </motion.div>

          {/* Card D: Law of Large Numbers */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-indigo-500/40 transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-mono-math">
                    {language === 'hy' ? 'ԹԵՄԱ Դ' : language === 'ru' ? 'ТЕМА Г' : 'TOPIC D'}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {t('aboutTopicDTitle')}
                  </h3>
                </div>
              </div>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {t('aboutTopicDDesc')}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-xs font-mono-math text-emerald-800 dark:text-emerald-300">
              lim (N → ∞) | P*(A) - P(A) | = 0 &nbsp;|&nbsp; 10 նետում ≠ 10,000 նետում
            </div>
          </motion.div>

          {/* Card E: Why This Matters */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-indigo-500/40 transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 font-mono-math">
                    {language === 'hy' ? 'ԹԵՄԱ Ե' : language === 'ru' ? 'ТЕМА Д' : 'TOPIC E'}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {t('aboutTopicETitle')}
                  </h3>
                </div>
              </div>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {t('aboutTopicEDesc')}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap pt-1">
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-500" /> AI / ML
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Binary className="w-3.5 h-3.5 text-cyan-500" /> Կրիպտոգրաֆիա
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Microscope className="w-3.5 h-3.5 text-emerald-500" /> Բժշկություն
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Callout */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3 shadow-xs">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          {language === 'hy'
            ? '«Միայն մի՛ սովորեք հավանականությունը: Զգացե՛ք այն: Կանխատեսե՛ք: Փորձարկե՛ք: Վերլուծե՛ք:»'
            : language === 'ru'
            ? '«Не просто учите вероятность. Почувствуйте её. Прогнозируйте. Экспериментируйте. Анализируйте.»'
            : '«Don\'t just learn probability. Experience it. Predict it. Test it. Analyze it.»'}
        </h3>
        <p className="text-sm text-indigo-600 dark:text-indigo-300 italic">
          "Don't just learn probability. Experience it. Predict it. Test it. Analyze it."
        </p>
      </div>
    </div>
  );
};
