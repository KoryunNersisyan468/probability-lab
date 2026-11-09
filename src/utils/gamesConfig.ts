import { Language } from '../types';

export interface GameDefinition {
  id: string; // The query parameter used in /games?game=... e.g. 'doors'
  order: number;
  num: string;
  icon: string;
  titleKey: string;
  subtitleKey: string;
  conceptKey: string;
  descKey: string;
  badgeKeys: {
    hy: string;
    en: string;
    ru: string;
  };
}

/**
 * Single centralized game configuration and ordering source of truth.
 * Mandatory order:
 * 1. 🚪 Three Doors
 * 2. 🪙 Coin Flip Lab
 * 3. 🎲 Dice Lab
 * 4. ☀️ Weather Predictor
 * 5. 🔐 Password Challenge
 * 6. 🃏 52 Cards Lab
 * 7. 🧠 Math Challenge (Quiz)
 */
export const ORDERED_GAMES: GameDefinition[] = [
  {
    id: 'doors',
    order: 1,
    num: '01',
    icon: '🚪',
    titleKey: 'gameThreeDoorsTitle',
    subtitleKey: 'gameThreeDoorsSubtitle',
    conceptKey: 'gameThreeDoorsConcept',
    descKey: 'gameThreeDoorsDesc',
    badgeKeys: {
      hy: 'Մոնթի Հոլի Պարադոքս',
      en: 'Monty Hall Paradox',
      ru: 'Парадокс Монти Холла',
    },
  },
  {
    id: 'coin',
    order: 2,
    num: '02',
    icon: '🪙',
    titleKey: 'gameCoinTitle',
    subtitleKey: 'gameCoinSubtitle',
    conceptKey: 'gameCoinConcept',
    descKey: 'gameCoinDesc',
    badgeKeys: {
      hy: 'Մեծ Թվերի Օրենք',
      en: 'Law of Large Numbers',
      ru: 'Закон больших чисел',
    },
  },
  {
    id: 'dice',
    order: 3,
    num: '03',
    icon: '🎲',
    titleKey: 'gameDiceTitle',
    subtitleKey: 'gameDiceSubtitle',
    conceptKey: 'gameDiceConcept',
    descKey: 'gameDiceDesc',
    badgeKeys: {
      hy: 'Բաշխում և Գումարներ',
      en: 'Distribution & Sums',
      ru: 'Распределение и суммы',
    },
  },
  {
    id: 'weather',
    order: 4,
    num: '04',
    icon: '☀️',
    titleKey: 'gameWeatherTitle',
    subtitleKey: 'gameWeatherSubtitle',
    conceptKey: 'gameWeatherConcept',
    descKey: 'gameWeatherDesc',
    badgeKeys: {
      hy: 'Հավանականային Կանխատեսում',
      en: 'Probabilistic Forecast',
      ru: 'Вероятностный прогноз',
    },
  },
  {
    id: 'password',
    order: 5,
    num: '05',
    icon: '🔐',
    titleKey: 'gamePasswordTitle',
    subtitleKey: 'gamePasswordSubtitle',
    conceptKey: 'gamePasswordConcept',
    descKey: 'gamePasswordDesc',
    badgeKeys: {
      hy: 'Կոմբինատորիկա Nᴸ',
      en: 'Combinatorics Nᴸ',
      ru: 'Комбинаторика Nᴸ',
    },
  },
  {
    id: 'cards',
    order: 6,
    num: '06',
    icon: '🃏',
    titleKey: 'gameCardsTitle',
    subtitleKey: 'gameCardsSubtitle',
    conceptKey: 'gameCardsConcept',
    descKey: 'gameCardsDesc',
    badgeKeys: {
      hy: '52-քարտանոց Կապուկ',
      en: '52-Card Deck',
      ru: 'Колода из 52 карт',
    },
  },
  {
    id: 'quiz',
    order: 7,
    num: '07',
    icon: '🧠',
    titleKey: 'gameQuizTitle',
    subtitleKey: 'gameQuizSubtitle',
    conceptKey: 'gameQuizConcept',
    descKey: 'gameQuizDesc',
    badgeKeys: {
      hy: '10 Փորձառու Հարցեր',
      en: '10 Master Challenges',
      ru: '10 Мастер-вопросов',
    },
  },
];

export const getGameBadge = (game: GameDefinition, language: Language): string => {
  return game.badgeKeys[language] || game.badgeKeys.en;
};
