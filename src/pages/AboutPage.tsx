import React from 'react';
import {
  GraduationCap,
  Sigma,
  Layers,
  FlaskConical,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AboutPage: React.FC = () => {
  const { t, language } = useApp();

  return (
    <div className="space-y-12 max-w-4xl mx-auto transition-colors duration-200">
      {/* Header */}
      <div className="text-center space-y-4 pt-4">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-cyan-400 font-mono-math">
          {language === 'hy'
            ? 'ՄԱԹԵՄԱՏԻԿԱ ԵՎ STEM ԿՐԹՈՒԹՅՈՒՆ'
            : language === 'ru'
            ? 'МАТЕМАТИКА И STEM ОБРАЗОВАНИЕ'
            : 'MATHEMATICS & STEM EDUCATION'}
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          {language === 'hy'
            ? 'Նախագծի Մասին և Մաթեմատիկական Հիմունքներ'
            : language === 'ru'
            ? 'О проекте и математических основах'
            : 'About The Project & Mathematical Foundations'}
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          {t('aboutMissionDesc')}
        </p>
      </div>

      {/* Project Presentation Overview Card */}
      <div className="p-8 rounded-3xl bg-white dark:bg-gradient-to-r dark:from-indigo-950/80 dark:via-slate-900 dark:to-slate-900 border border-slate-200 dark:border-indigo-500/30 shadow-xs space-y-6">
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
              {language === 'hy' ? 'Ինտերակտիվ STEM Մաթեմատիկական Հարթակ' : language === 'ru' ? 'Интерактивная STEM математическая платформа' : 'Interactive STEM Mathematics Showcase'}
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

      {/* Core Mathematical Foundations */}
      <div className="space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-mono-math">
            {language === 'hy' ? 'ՏԵՍԱԿԱՆ ՀԻՄՈՒՆՔՆԵՐ' : language === 'ru' ? 'ТЕОРЕТИЧЕСКАЯ БАЗА' : 'THEORETICAL FRAMEWORK'}
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {t('aboutMathTitle')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. Kolmogorov Axioms */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
            <div className="flex items-center gap-2.5 text-indigo-600 dark:text-cyan-400 font-bold text-sm">
              <Sigma className="w-5 h-5" />
              <span>{language === 'hy' ? '1. Կոլմոգորովի Աքսիոմատիկա (1933)' : language === 'ru' ? '1. Аксиоматика Колмогорова (1933)' : '1. Kolmogorov Axioms (1933)'}</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {language === 'hy'
                ? 'Հավանականության ժամանակակից տեսության հիմքը: Հավանականության ֆունկցիան P(A) բավարարում է երեք աքսիոմների՝ ոչ-բացասականություն P(A) ≥ 0, նորմավորում P(Ω) = 1, և հաշվելի ադիտիվություն:'
                : language === 'ru'
                ? 'Фундамент современной теории вероятностей: функция P(A) удовлетворяет неотрицательности P(A) ≥ 0, нормированности P(Ω) = 1 и счетной аддитивности.'
                : 'The foundational axioms of probability theory established by Andrey Kolmogorov: non-negativity P(A) ≥ 0, unit measure P(Ω) = 1, and countable additivity.'}
            </p>
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono-math text-xs text-indigo-600 dark:text-cyan-300">
              0 ≤ P(A) ≤ 1 &nbsp;|&nbsp; P(Ω) = 1 &nbsp;|&nbsp; P(∪ Aᵢ) = Σ P(Aᵢ)
            </div>
          </div>

          {/* 2. Law of Large Numbers */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
            <div className="flex items-center gap-2.5 text-amber-600 dark:text-amber-400 font-bold text-sm">
              <TrendingUp className="w-5 h-5" />
              <span>{language === 'hy' ? '2. Մեծ Թվերի Օրենք (LLN)' : language === 'ru' ? '2. Закон больших чисел (ЗБЧ)' : '2. Law of Large Numbers (LLN)'}</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {language === 'hy'
                ? 'Ապացուցում է, որ փորձերի քանակի (N) անսահման աճին զուգահեռ, փորձարարական հարաբերական հաճախականությունը ձգտում է տեսական մաթեմատիկական հավանականությանը:'
                : language === 'ru'
                ? 'Доказывает, что при неограниченном росте числа независимых испытаний N эмпирическая относительная частота сходится к теоретической вероятности.'
                : 'States that as the number of identically repeated trials N grows large, the sample mean and empirical frequencies converge toward the theoretical expected value.'}
            </p>
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono-math text-xs text-amber-700 dark:text-amber-300">
              lim (n → ∞) P(|X̄ₙ - μ| ≥ ε) = 0
            </div>
          </div>

          {/* 3. Bayes Theorem & Conditional Probability */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
            <div className="flex items-center gap-2.5 text-purple-600 dark:text-purple-400 font-bold text-sm">
              <FlaskConical className="w-5 h-5" />
              <span>{language === 'hy' ? '3. Պայմանական Հավանականություն և Բայես' : language === 'ru' ? '3. Условная вероятность и теорема Байеса' : '3. Conditional Probability & Bayes'}</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {language === 'hy'
                ? 'Մոնտի Հոլլի (3 Դռներ) պարադոքսի մաթեմատիկական բացատրությունը: Հաղորդավարի կողմից դատարկ դռան բացումը ապահովում է նոր ինֆորմացիա, որը փոխում է մնացած դռան ետևում մրցանակի պայմանական հավանականությունը 2/3-ի:'
                : language === 'ru'
                ? 'Математическое объяснение парадокса Монти Холла: открытие ведущим пустой двери дает новую информацию, обновляя условную вероятность выигрыша при смене двери до 2/3.'
                : 'Explains the Monty Hall problem: when new information is revealed by the host opening a non-prize door, conditional probability shifts the remaining unopened door probability to 2/3.'}
            </p>
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono-math text-xs text-purple-700 dark:text-purple-300">
              P(A | B) = [ P(B | A) · P(A) ] / P(B)
            </div>
          </div>

          {/* 4. Combinatorics & Search Spaces */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
            <div className="flex items-center gap-2.5 text-rose-600 dark:text-rose-400 font-bold text-sm">
              <Layers className="w-5 h-5" />
              <span>{language === 'hy' ? '4. Կոմբինատորիկա և Տարածություններ' : language === 'ru' ? '4. Комбинаторика и пространства исходов' : '4. Combinatorics & Exponential Spaces'}</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {language === 'hy'
                ? 'Գաղտնաբառերի և կրիպտոգրաֆիական անվտանգության հիմքը: N սիմվոլներով L երկարությամբ տողի հնարավոր տարբերակների քանակն աճում է էքսպոնենցիալ կերպով (Nᴸ):'
                : language === 'ru'
                ? 'Основа криптографии и безопасности паролей: алфавит из N символов длиной L дает экспоненциальное пространство поиска Nᴸ вариантов.'
                : 'Fundamental principle of cryptography and password entropy: a charset of size N with length L yields an exponential search space of Nᴸ permutations.'}
            </p>
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono-math text-xs text-rose-700 dark:text-rose-300">
              Total Permutations = Nᴸ &nbsp;|&nbsp; P(Single Guess) = 1 / Nᴸ
            </div>
          </div>
        </div>
      </div>

      {/* Philosophy Callout */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3 shadow-xs">
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
