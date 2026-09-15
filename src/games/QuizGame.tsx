import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { QUIZ_QUESTIONS } from '../utils/probability';

export const QuizGame: React.FC = () => {
  const { t, language, recordQuizCompletion } = useApp();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const currentQ = QUIZ_QUESTIONS[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQ.correctIndex;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      recordQuizCompletion(score + (selectedOption === currentQ.correctIndex ? 0 : 0));
    }
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  const getQuestionText = () => {
    if (language === 'hy') return currentQ.questionHy;
    if (language === 'ru') return currentQ.questionRu;
    return currentQ.questionEn;
  };

  const getOptions = () => {
    if (language === 'hy') return currentQ.optionsHy;
    if (language === 'ru') return currentQ.optionsRu;
    return currentQ.optionsEn;
  };

  const getExplanation = () => {
    if (language === 'hy') return currentQ.explanationHy;
    if (language === 'ru') return currentQ.explanationRu;
    return currentQ.explanationEn;
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-3xl mx-auto transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-purple-500/30 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 font-mono-math">
            <span>{language === 'hy' ? 'ԽԱՂ 07' : language === 'ru' ? 'ИГРА 07' : 'GAME 07'}</span>
            <span>•</span>
            <span>{t('gameQuizConcept')}</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {t('gameQuizTitle')}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mt-1">{t('gameQuizSubtitle')}</p>
        </div>

        <button
          type="button"
          onClick={resetQuiz}
          className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors w-fit cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
          title={t('reset')}
          aria-label={t('reset')}
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {!isFinished ? (
        <div className="p-5 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-xs">
          {/* Progress Bar & Counter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono-math text-slate-500 dark:text-slate-400">
              <span>
                {language === 'hy' ? 'Հարց' : language === 'ru' ? 'Вопрос' : 'Question'} {currentIndex + 1} / {QUIZ_QUESTIONS.length}
              </span>
              <span className="text-purple-600 dark:text-purple-400 font-bold">
                {language === 'hy' ? 'Միավորներ՝' : language === 'ru' ? 'Баллы:' : 'Score:'} {score}
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
              <div
                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Display */}
          <div className="py-2">
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-relaxed break-words">
              {getQuestionText()}
            </h3>
          </div>

          {/* Options Grid */}
          <div className="space-y-3">
            {getOptions().map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctIndex;
              let btnClass = 'bg-slate-50 dark:bg-slate-950/80 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700';

              if (isAnswered) {
                if (isCorrect) {
                  btnClass = 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-400 dark:border-emerald-500 text-emerald-900 dark:text-emerald-300 shadow-xs';
                } else if (isSelected) {
                  btnClass = 'bg-rose-50 dark:bg-rose-950/70 border-rose-400 dark:border-rose-500 text-rose-900 dark:text-rose-300';
                } else {
                  btnClass = 'bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-3.5 sm:p-4 rounded-xl border-2 text-left text-xs sm:text-sm font-semibold flex items-center justify-between transition-all cursor-pointer min-h-[48px] break-words whitespace-normal ${btnClass}`}
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center font-mono-math font-bold text-xs shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="break-words leading-snug">{opt}</span>
                  </div>

                  {isAnswered && (
                    <span className="shrink-0 ml-2">
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : isSelected ? (
                        <XCircle className="w-5 h-5 text-rose-500" />
                      ) : null}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box on Answer */}
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 sm:p-5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-500/30 space-y-2"
            >
              <div className="text-xs font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1.5 uppercase tracking-wider font-mono-math">
                <span>{language === 'hy' ? 'Մաթեմատիկական Բացատրություն' : language === 'ru' ? 'Математическое объяснение' : 'Mathematical Rationale'}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {getExplanation()}
              </p>
            </motion.div>
          )}

          {/* Next Button */}
          {isAnswered && (
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleNext}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-md shadow-purple-600/25 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer min-h-[48px]"
              >
                <span>
                  {currentIndex < QUIZ_QUESTIONS.length - 1
                    ? language === 'hy'
                      ? 'Հաջորդ Հարցը'
                      : language === 'ru'
                      ? 'Следующий вопрос'
                      : 'Next Question'
                    : language === 'hy'
                    ? 'Տեսնել Արդյունքը'
                    : language === 'ru'
                    ? 'Посмотреть результат'
                    : 'View Final Score'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Quiz Finished Score Card */
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-500/40 text-center space-y-6 shadow-xs">
          <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 w-fit mx-auto border border-purple-200 dark:border-purple-500/30">
            <Trophy className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {language === 'hy' ? 'Թեստն Ավարտված է!' : language === 'ru' ? 'Тест завершен!' : 'Quiz Completed!'}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm">
              {language === 'hy'
                ? `Դուք ճիշտ պատասխանեցիք ${score} / ${QUIZ_QUESTIONS.length} հարցերի:`
                : language === 'ru'
                ? `Вы правильно ответили на ${score} из ${QUIZ_QUESTIONS.length} вопросов.`
                : `You scored ${score} out of ${QUIZ_QUESTIONS.length} correct answers.`}
            </p>
          </div>

          <div className="text-4xl sm:text-5xl font-black font-mono-math text-purple-600 dark:text-purple-400">
            {((score / QUIZ_QUESTIONS.length) * 100).toFixed(0)}%
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={resetQuiz}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md shadow-purple-600/25 transition-all hover:scale-105 cursor-pointer min-h-[48px]"
            >
              {language === 'hy' ? 'Անցնել Թեստը Նորից' : language === 'ru' ? 'Пройти тест заново' : 'Retake Challenge'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizGame;
