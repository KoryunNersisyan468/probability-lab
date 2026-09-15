// Mathematical Probability Engine & Simulators

export interface MontyHallResult {
  trials: number;
  stayWins: number;
  switchWins: number;
  stayWinRate: number;
  switchWinRate: number;
}

// Monty Hall Simulator
export function simulateMontyHall(trials: number): MontyHallResult {
  let stayWins = 0;
  let switchWins = 0;

  for (let i = 0; i < trials; i++) {
    const prizeDoor = Math.floor(Math.random() * 3);
    const initialPick = Math.floor(Math.random() * 3);

    // Host reveals an empty door
    let hostDoor: number;
    do {
      hostDoor = Math.floor(Math.random() * 3);
    } while (hostDoor === initialPick || hostDoor === prizeDoor);

    // Stay Strategy
    if (initialPick === prizeDoor) {
      stayWins++;
    }

    // Switch Strategy
    const switchedPick = [0, 1, 2].find(d => d !== initialPick && d !== hostDoor)!;
    if (switchedPick === prizeDoor) {
      switchWins++;
    }
  }

  return {
    trials,
    stayWins,
    switchWins,
    stayWinRate: stayWins / trials,
    switchWinRate: switchWins / trials,
  };
}

// Password Combinatorics & Calculations
export interface PasswordPreset {
  id: string;
  name: string;
  length: number;
  charSetSize: number;
  charsSample: string;
  description: string;
}

export const PASSWORD_PRESETS: Record<string, PasswordPreset> = {
  pin4: {
    id: 'pin4',
    name: '4-Digit PIN',
    length: 4,
    charSetSize: 10,
    charsSample: '0123456789',
    description: '10⁴ = 10,000 combinations',
  },
  pin6: {
    id: 'pin6',
    name: '6-Digit PIN',
    length: 6,
    charSetSize: 10,
    charsSample: '0123456789',
    description: '10⁶ = 1,000,000 combinations',
  },
  letters4: {
    id: 'letters4',
    name: '4 Lowercase Letters',
    length: 4,
    charSetSize: 26,
    charsSample: 'abcdefghijklmnopqrstuvwxyz',
    description: '26⁴ = 456,976 combinations',
  },
  letters6: {
    id: 'letters6',
    name: '6 Lowercase Letters',
    length: 6,
    charSetSize: 26,
    charsSample: 'abcdefghijklmnopqrstuvwxyz',
    description: '26⁶ = 308,915,776 combinations',
  },
  alphanumeric6: {
    id: 'alphanumeric6',
    name: '6 Alphanumeric',
    length: 6,
    charSetSize: 62,
    charsSample: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    description: '62⁶ ≈ 56.8 Billion combinations',
  },
  complex8: {
    id: 'complex8',
    name: '8 Complex (Symbols)',
    length: 8,
    charSetSize: 94,
    charsSample: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+-=[]{}|;:,.<>?',
    description: '94⁸ ≈ 6.09 × 10¹⁵ combinations',
  },
};

export function calculateCombinations(charSetSize: number, length: number): number {
  return Math.pow(charSetSize, length);
}

export function simulatePasswordGuesses(totalCombinations: number, guessesCount: number): {
  guessesCount: number;
  successProbability: number;
  theoreticalPerGuessProb: number;
} {
  const theoreticalPerGuessProb = 1 / totalCombinations;
  // Probability of guessing in k independent random guesses = 1 - (1 - 1/N)^k
  const successProbability = 1 - Math.pow(1 - theoreticalPerGuessProb, guessesCount);

  return {
    guessesCount,
    successProbability: Math.min(1, successProbability),
    theoreticalPerGuessProb,
  };
}

export function simulatePasswordCracking(charSetSize: number, length: number, guesses: number, trials: number): {
  successCount: number;
  successRate: number;
  totalSpace: number;
  theoretical: number;
  avgAttempts: number;
} {
  const totalSpace = Math.pow(charSetSize, length);
  const theoretical = 1 - Math.pow(1 - 1 / totalSpace, guesses);
  let successCount = 0;
  let totalAttemptsUsed = 0;

  for (let t = 0; t < trials; t++) {
    // Generate random secret target in space [0, totalSpace)
    const secret = Math.floor(Math.random() * totalSpace);
    let won = false;
    let attemptsThisTrial = guesses;

    for (let g = 0; g < guesses; g++) {
      const guess = Math.floor(Math.random() * totalSpace);
      if (guess === secret) {
        won = true;
        attemptsThisTrial = g + 1;
        break;
      }
    }
    if (won) successCount++;
    totalAttemptsUsed += attemptsThisTrial;
  }

  return {
    successCount,
    successRate: successCount / trials,
    totalSpace,
    theoretical,
    avgAttempts: Number((totalAttemptsUsed / trials).toFixed(1)),
  };
}

// 52 Playing Cards Simulator
export type CardSuit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type CardRank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface PlayingCard {
  suit: CardSuit;
  rank: CardRank;
  color: 'red' | 'black';
  suitSymbol: string;
  nameKey: string;
}

export interface SuitDefinition {
  id: CardSuit;
  symbol: string;
  color: 'red' | 'black';
  nameKey: string;
}

export const SUITS: SuitDefinition[] = [
  { id: 'spades', symbol: '♠', color: 'black', nameKey: 'spades' },
  { id: 'hearts', symbol: '♥', color: 'red', nameKey: 'hearts' },
  { id: 'diamonds', symbol: '♦', color: 'red', nameKey: 'diamonds' },
  { id: 'clubs', symbol: '♣', color: 'black', nameKey: 'clubs' },
];

export const RANKS: CardRank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export function drawRandomCard(): PlayingCard {
  const suitDef = SUITS[Math.floor(Math.random() * SUITS.length)];
  const rank = RANKS[Math.floor(Math.random() * RANKS.length)];

  return {
    suit: suitDef.id,
    rank,
    color: suitDef.color,
    suitSymbol: suitDef.symbol,
    nameKey: suitDef.nameKey,
  };
}

export function simulateCardDraws(trials: number): {
  suits: Record<CardSuit, number>;
  colors: { red: number; black: number };
  trials: number;
} {
  const suits: Record<CardSuit, number> = {
    spades: 0,
    hearts: 0,
    diamonds: 0,
    clubs: 0,
  };
  let red = 0;
  let black = 0;

  for (let i = 0; i < trials; i++) {
    const card = drawRandomCard();
    suits[card.suit]++;
    if (card.color === 'red') red++;
    else black++;
  }

  return {
    suits,
    colors: { red, black },
    trials,
  };
}

// Dice Sum Theoretical Probabilities
export function getTwoDiceTheoreticalDistribution(): Record<number, { combinations: number; probability: number; fraction: string }> {
  const dist: Record<number, { combinations: number; probability: number; fraction: string }> = {};
  const total = 36;
  const combos: Record<number, number> = {
    2: 1,
    3: 2,
    4: 3,
    5: 4,
    6: 5,
    7: 6,
    8: 5,
    9: 4,
    10: 3,
    11: 2,
    12: 1,
  };

  for (let s = 2; s <= 12; s++) {
    const c = combos[s];
    dist[s] = {
      combinations: c,
      probability: c / total,
      fraction: `${c}/36`,
    };
  }
  return dist;
}

export function simulateDiceRolls(diceCount: number, trials: number): {
  distribution: Record<number, number>;
  totalTrials: number;
  trials: number;
  mostFrequentSum: number;
} {
  const distribution: Record<number, number> = {};
  const minSum = diceCount;
  const maxSum = diceCount * 6;

  for (let s = minSum; s <= maxSum; s++) {
    distribution[s] = 0;
  }

  for (let i = 0; i < trials; i++) {
    let sum = 0;
    for (let d = 0; d < diceCount; d++) {
      sum += Math.floor(Math.random() * 6) + 1;
    }
    distribution[sum] = (distribution[sum] || 0) + 1;
  }

  let maxCount = -1;
  let mostFrequentSum = minSum;
  for (const s in distribution) {
    if (distribution[s] > maxCount) {
      maxCount = distribution[s];
      mostFrequentSum = Number(s);
    }
  }

  return {
    distribution,
    totalTrials: trials,
    trials,
    mostFrequentSum,
  };
}

// Coin Simulator & Convergence Curve Generator
export function simulateCoinFlips(trials: number): {
  heads: number;
  tails: number;
  headsRatio: number;
  tailsRatio: number;
  historyPoints: Array<{ step: number; headsPct: number; expected: number; trial?: number; ratio?: number }>;
} {
  let heads = 0;
  let tails = 0;
  const historyPoints: Array<{ step: number; headsPct: number; expected: number; trial?: number; ratio?: number }> = [];
  const pointInterval = Math.max(1, Math.floor(trials / 50));

  for (let i = 1; i <= trials; i++) {
    if (Math.random() < 0.5) {
      heads++;
    } else {
      tails++;
    }

    if (i % pointInterval === 0 || i === trials || i === 10 || i === 50 || i === 100) {
      historyPoints.push({
        step: i,
        trial: i,
        headsPct: Number(((heads / i) * 100).toFixed(2)),
        ratio: Number((heads / i).toFixed(4)),
        expected: 50.0,
      });
    }
  }

  return {
    heads,
    tails,
    headsRatio: heads / trials,
    tailsRatio: tails / trials,
    historyPoints,
  };
}

// Weather Probability Simulator
export interface WeatherCondition {
  id: 'sunny' | 'rainy' | 'cloudy' | 'snowy';
  labelKey: string;
  icon: string;
  probability: number;
  color: string;
}

export function sampleWeather(distribution: WeatherCondition[]): WeatherCondition {
  const rand = Math.random();
  let cumulative = 0;
  for (const item of distribution) {
    cumulative += item.probability;
    if (rand <= cumulative) {
      return item;
    }
  }
  return distribution[distribution.length - 1];
}

export function simulateWeatherDays(
  distribution: WeatherCondition[],
  days: number
): {
  counts: Record<string, number>;
  frequencies: Record<string, number>;
  totalDays: number;
} {
  const counts: Record<string, number> = {};
  for (const item of distribution) {
    counts[item.id] = 0;
  }

  for (let d = 0; d < days; d++) {
    const outcome = sampleWeather(distribution);
    counts[outcome.id] = (counts[outcome.id] || 0) + 1;
  }

  const frequencies: Record<string, number> = {};
  for (const item of distribution) {
    frequencies[item.id] = counts[item.id] / days;
  }

  return {
    counts,
    frequencies,
    totalDays: days,
  };
}

// Birthday Paradox Simulator
export function calculateTheoreticalBirthdayProbability(n: number): number {
  if (n >= 365) return 1.0;
  let probNoMatch = 1.0;
  for (let i = 0; i < n; i++) {
    probNoMatch *= (365 - i) / 365;
  }
  return 1.0 - probNoMatch;
}

export function simulateBirthdayParadox(groupSize: number, trials: number): {
  theoretical: number;
  experimental: number;
  chartData: Array<{ people: number; prob: number }>;
} {
  let matchCount = 0;

  for (let t = 0; t < trials; t++) {
    const birthdays = new Set<number>();
    let hasMatch = false;
    for (let p = 0; p < groupSize; p++) {
      const day = Math.floor(Math.random() * 365);
      if (birthdays.has(day)) {
        hasMatch = true;
        break;
      }
      birthdays.add(day);
    }
    if (hasMatch) matchCount++;
  }

  const theoretical = calculateTheoreticalBirthdayProbability(groupSize);
  const experimental = matchCount / trials;

  // Chart data from N=2 to N=70
  const chartData: Array<{ people: number; prob: number }> = [];
  for (let p = 2; p <= 75; p += 2) {
    chartData.push({
      people: p,
      prob: Number((calculateTheoreticalBirthdayProbability(p) * 100).toFixed(2)),
    });
  }

  return {
    theoretical,
    experimental,
    chartData,
  };
}

// Buffon's Needle Pi Estimator
export function simulateBuffonsNeedle(drops: number, needleLength = 1, lineDistance = 2): {
  crossings: number;
  estimatedPi: number;
  errorPct: number;
  history: Array<{ step: number; pi: number }>;
} {
  let crossings = 0;
  const history: Array<{ step: number; pi: number }> = [];
  const interval = Math.max(1, Math.floor(drops / 40));

  for (let i = 1; i <= drops; i++) {
    // Random center distance to closest line: uniform [0, lineDistance/2]
    const d = Math.random() * (lineDistance / 2);
    // Random angle: uniform [0, pi/2]
    const theta = Math.random() * (Math.PI / 2);

    // Needle crosses line if d <= (L/2) * sin(theta)
    if (d <= (needleLength / 2) * Math.sin(theta)) {
      crossings++;
    }

    if (i % interval === 0 || i === drops) {
      const currentPi = crossings > 0 ? (2 * needleLength * i) / (lineDistance * crossings) : 0;
      history.push({
        step: i,
        pi: Number(currentPi.toFixed(5)),
      });
    }
  }

  const estimatedPi = crossings > 0 ? (2 * needleLength * drops) / (lineDistance * crossings) : 0;
  const errorPct = Math.abs((estimatedPi - Math.PI) / Math.PI) * 100;

  return {
    crossings,
    estimatedPi,
    errorPct,
    history,
  };
}

// Quiz Questions Interface & Data
export interface QuizQuestionItem {
  id: number;
  questionHy: string;
  questionEn: string;
  questionRu: string;
  optionsHy: string[];
  optionsEn: string[];
  optionsRu: string[];
  correctIndex: number;
  explanationHy: string;
  explanationEn: string;
  explanationRu: string;
}

export const QUIZ_QUESTIONS: QuizQuestionItem[] = [
  {
    id: 1,
    questionHy: 'Ո՞րն է լավագույն ռազմավարությունը Երեք Դռների (Monty Hall) խնդրում, երբ հաղորդավարը բացում է դատարկ դուռը:',
    questionEn: 'What is the mathematically optimal strategy in the Three Doors (Monty Hall) problem after the host reveals an empty door?',
    questionRu: 'Какая стратегия математически наиболее выгодна в задаче Трех Дверей (Монти Холла) после открытия ведущим пустой двери?',
    optionsHy: [
      'Մնալ սկզբնական դռանը (շանսը 50% է)',
      'Փոխել դուռը (շանսը 66.7% է)',
      'Տարբերություն չկա, երկուսն էլ 50% են',
      'Ընտրել պատահական մետաղադրամով',
    ],
    optionsEn: [
      'Stay with initial door (chance is 50%)',
      'Switch door (chance is 66.7%)',
      'Makes no difference, both are 50%',
      'Flip a coin to decide',
    ],
    optionsRu: [
      'Оставить начальную дверь (шанс 50%)',
      'Сменить дверь (шанс 66.7%)',
      'Разницы нет, обе по 50%',
      'Выбрать броском монеты',
    ],
    correctIndex: 1,
    explanationHy: 'Սկզբնական ընտրության ժամանակ շահելու շանսը 1/3 էր: Մյուս 2 դռներինը միասին՝ 2/3: Հաղորդավարը բացում է այծով դուռ, ուստի ողջ 2/3 հավանականությունը անցնում է մնացած երրորդ դռանը: Փոխելը կրկնապատկում է շանսը:',
    explanationEn: 'Your initial choice had a 1/3 chance, while the other two doors combined had 2/3. Since the host intentionally reveals a goat, the entire 2/3 probability shifts onto the remaining closed door. Switching doubles your odds!',
    explanationRu: 'Изначальный выбор имел шанс 1/3, а две оставшиеся двери — 2/3. Ведущий целенаправленно открывает козу, поэтому вся вероятность 2/3 переходит на оставшуюся дверь. Смена удваивает шансы!',
  },
  {
    id: 2,
    questionHy: 'Ո՞ր գումարն է ամենահավանականը 2 սովորական 6-նիստ զառ գլորելիս:',
    questionEn: 'What is the most probable sum when rolling two standard 6-sided dice?',
    questionRu: 'Какая сумма очков наиболее вероятна при броске двух стандартных игральных костей?',
    optionsHy: ['6', '7', '8', '12'],
    optionsEn: ['6', '7', '8', '12'],
    optionsRu: ['6', '7', '8', '12'],
    correctIndex: 1,
    explanationHy: '7 գումարը կարող է ստացվել 6 տարբեր կոմբինացիաներով ((1,6), (2,5), (3,4), (4,3), (5,2), (6,1)) ընդհանուր 36-ից: Շանսը 6/36 է (16.67%):',
    explanationEn: 'Sum 7 has 6 distinct combinations out of 36 total outcomes ((1,6), (2,5), (3,4), (4,3), (5,2), (6,1)), giving the maximum probability of 6/36 ≈ 16.67%.',
    explanationRu: 'Сумма 7 может получиться 6 различными комбинациями из 36 возможных ((1,6), (2,5), (3,4), (4,3), (5,2), (6,1)), что дает максимальную вероятность 6/36 ≈ 16.67%.',
  },
  {
    id: 3,
    questionHy: 'Ո՞րն է ստանդարտ 52 խաղաքարտերի տախտակամածից պատահական Տուզ (Ace) քաշելու հավանականությունը:',
    questionEn: 'What is the probability of drawing an Ace from a standard well-shuffled 52-card deck?',
    questionRu: 'Какова вероятность вытянуть Туза из стандартной колоды в 52 карты?',
    optionsHy: ['1/52 (1.92%)', '4/52 (7.69%)', '13/52 (25%)', '26/52 (50%)'],
    optionsEn: ['1/52 (1.92%)', '4/52 (7.69%)', '13/52 (25%)', '26/52 (50%)'],
    optionsRu: ['1/52 (1.92%)', '4/52 (7.69%)', '13/52 (25%)', '26/52 (50%)'],
    correctIndex: 1,
    explanationHy: 'Տախտակամածում կա 4 տուզ (4 տարբեր մաստերի) ընդհանուր 52 քարտից: Հավանականությունը՝ 4/52 = 1/13 ≈ 7.69%:',
    explanationEn: 'There are 4 Aces in a 52-card deck (one for each suit). Therefore, P(Ace) = 4/52 = 1/13 ≈ 7.69%.',
    explanationRu: 'В колоде из 52 карт ровно 4 туза (по одному каждой масти). Следовательно, P(Туз) = 4/52 = 1/13 ≈ 7.69%.',
  },
  {
    id: 4,
    questionHy: 'Եթե գաղտնաբառը բաղկացած է 6 թվանշանից (0-9), որքա՞ն է այն առաջին պատահական փորձով գուշակելու հավանականությունը:',
    questionEn: 'If a PIN code consists of 6 digits (0-9), what is the probability of guessing it correctly on the very first random try?',
    questionRu: 'Если PIN-код состоит из 6 цифр (0-9), какова вероятность угадать его с первой случайной попытки?',
    optionsHy: ['1 / 10,000', '1 / 100,000', '1 / 1,000,000', '1 / 6,000,000'],
    optionsEn: ['1 in 10,000', '1 in 100,000', '1 in 1,000,000', '1 in 6,000,000'],
    optionsRu: ['1 из 10 000', '1 из 100 000', '1 из 1 000 000', '1 из 6 000 000'],
    correctIndex: 2,
    explanationHy: 'Յուրաքանչյուր դիրքում կարող է լինել 10 թիվ: Ընդհանուր կոմբինացիաները՝ 10⁶ = 1,000,000: Մեկ փորձով գուշակելու շանսը 1/1,000,000 է (0.0001%):',
    explanationEn: 'Each of the 6 slots has 10 independent options (0-9). The search space is 10⁶ = 1,000,000. The chance is 1 / 1,000,000 (0.0001%).',
    explanationRu: 'На каждой из 6 позиций может стоять одна из 10 цифр. Пространство вариантов равно 10⁶ = 1 000 000. Вероятность равна 1 / 1 000 000 (0.0001%).',
  },
  {
    id: 5,
    questionHy: 'Եթե մետաղադրամը 10 անգամ նետելիս 8 անգամ ընկել է Գիրբ, արդյո՞ք 11-րդ նետման ժամանակ Ղուշի հավանականությունը 50%-ից ավելի մեծ է:',
    questionEn: 'If a fair coin lands on Heads 8 out of 10 times, is the probability of Tails on the 11th flip greater than 50%?',
    questionRu: 'Если честная монета упала орлом 8 раз из 10, станет ли вероятность выпадения решки на 11-м броске выше 50%?',
    optionsHy: [
      'Այո, որովհետև բնությունը պետք է հավասարակշռի (Մոլախաղացի սխալ)',
      'Ոչ, յուրաքանչյուր նետում անկախ իրադարձություն է և շանսը մնում է 50%',
      'Այո, հավանականությունը դառնում է 80%',
      'Կախված է նետման ուժից',
    ],
    optionsEn: [
      "Yes, nature must balance out (Gambler's Fallacy)",
      'No, every fair coin flip is an independent event with exactly 50% probability',
      'Yes, probability becomes 80%',
      'Depends on flip technique',
    ],
    optionsRu: [
      'Да, природа должна сбалансировать (Ошибка игрока)',
      'Нет, каждый бросок независим и вероятность остается ровно 50%',
      'Да, вероятность становится 80%',
      'Зависит от силы броска',
    ],
    correctIndex: 1,
    explanationHy: 'Մետաղադրամը «հիշողություն» չունի: Նախորդ ելքերը չեն ազդում հաջորդ նետման վրա (Անկախ իրադարձություններ): Կարծիքը, թե շարքից հետո հակառակ ելքը ավելի հավանական է դառնում, կոչվում է «Մոլախաղացի մոլորություն» (Gambler\'s Fallacy):',
    explanationEn: 'A fair coin has no memory. Independent events do not influence future outcomes. Believing a run of Heads makes Tails "due" is the famous Gambler\'s Fallacy.',
    explanationRu: 'Честная монета не имеет памяти. События независимы. Убеждение, что после череды орлов обязана выпасть решка, известно как «Ошибка игрока» (Gambler\'s Fallacy).',
  },
  {
    id: 6,
    questionHy: 'Եթե վաղվա անձրևի հավանականությունը 70% է, նշանակու՞մ է արդյոք, որ անձրևը պարտադիր կգա:',
    questionEn: 'If tomorrow has a 70% probability of rain, does it mean it is guaranteed to rain?',
    questionRu: 'Если вероятность дождя на завтра составляет 70%, означает ли это, что дождь пойдет гарантированно?',
    optionsHy: [
      'Այո, 50%-ից բարձր ցանկացած թիվ նշանակում է 100% երաշխիք',
      'Ոչ, 30% հավանականություն կա, որ անձրև չի լինի (հավանականությունը երաշխիք չէ)',
      'Այո, օդերևութաբանները երբեք չեն սխալվում',
      'Անձրև կգա օրվա միայն 70%-ի ընթացքում',
    ],
    optionsEn: [
      'Yes, anything above 50% guarantees the event',
      'No, there is still a 30% chance of dry weather; probability describes likelihood, not certainty',
      'Yes, forecasts are always deterministic',
      'It will rain for 70% of the day duration',
    ],
    optionsRu: [
      'Да, все что выше 50% гарантирует событие',
      'Нет, остается 30% шанс сухой погоды; вероятность отражает шанс, а не гарантию',
      'Да, прогноз погоды абсолютно точен',
      'Дождь будет идти 70% времени суток',
    ],
    correctIndex: 1,
    explanationHy: 'Հավանականությունը չափում է հնարավորությունը, այլ ոչ թե տալիս բացարձակ երաշխիք: 100 նմանատիպ օրերից մոտ 70-ում անձրև կլինի, իսկ 30-ում՝ ոչ:',
    explanationEn: 'Probability quantifies uncertainty. Under identical atmospheric conditions, rain occurs in roughly 70 out of 100 instances, leaving 30 non-rainy outcomes.',
    explanationRu: 'Вероятность отражает меру неопределенности. При схожих условиях дождь пройдет примерно в 70 случаях из 100, оставляя 30% шанс на сухую погоду.',
  },
  {
    id: 7,
    questionHy: 'Քանի՞ մարդ պետք է լինի սենյակում, որպեսզի առնվազն 2 հոգու ծննդյան օրը համընկնելու շանսը գերազանցի 50%-ը (Ծննդյան օրերի պարադոքս):',
    questionEn: 'How many people must be in a room for the probability of at least two sharing a birthday to exceed 50% (Birthday Paradox)?',
    questionRu: 'Сколько людей должно быть в комнате, чтобы вероятность совпадения дня рождения хотя бы у двух превысила 50% (Парадокс дней рождения)?',
    optionsHy: ['183 մարդ', '100 մարդ', '23 մարդ', '366 մարդ'],
    optionsEn: ['183 people', '100 people', '23 people', '366 people'],
    optionsRu: ['183 человека', '100 человек', '23 человека', '366 человек'],
    correctIndex: 2,
    explanationHy: 'Ընդամենը 23 մարդու դեպքում հնարավոր զույգերի քանակը C(23, 2) = 253 է: Դա բավարար է, որպեսզի համընկման շանսը կազմի 50.7%:',
    explanationEn: 'With 23 individuals, there are C(23, 2) = 253 distinct pairs, which pushes the complementary non-match probability below 50% (actual P ≈ 50.7%).',
    explanationRu: 'При 23 людях число пар равно C(23, 2) = 253. Этого достаточно, чтобы вероятность совпадения превысила 50% (P ≈ 50.7%).',
  },
  {
    id: 8,
    questionHy: 'Ո՞ր գիտափորձի միջոցով կարելի է երկրաչափական հավանականությամբ գնահատել Պի (π) թվի արժեքը:',
    questionEn: "Which famous geometric probability experiment empirically approximates the mathematical constant Pi (π)?",
    questionRu: 'С помощью какого геометрического эксперимента можно приближенно оценить число Пи (π)?',
    optionsHy: [
      'Մոնտի Հոլլի դռներ',
      'Բյուֆոնի ասեղ (Buffon\'s Needle)',
      'Բերնուլիի սխեման',
      'Գալտոնի տախտակ',
    ],
    optionsEn: [
      'Monty Hall Doors',
      "Buffon's Needle",
      'Bernoulli Trials',
      'Galton Board',
    ],
    optionsRu: [
      'Двери Монти Холла',
      'Игла Бюффона',
      'Схема Бернулли',
      'Доска Гальтона',
    ],
    correctIndex: 1,
    explanationHy: 'Ժորժ-Լուի Բյուֆոնը 1777 թ. ապացուցեց, որ զուգահեռ գծերով հարթության վրա ասեղներ նետելիս գծերը հատելու հավանականության միջոցով կարելի է հաշվարկել π-ն:',
    explanationEn: "Georges-Louis Buffon proved in 1777 that dropping needles onto lined paper yields a crossing probability inversely proportional to Pi (π).",
    explanationRu: 'Жорж-Луи Бюффон в 1777 году доказал, что бросание игл на разлинованную плоскость позволяет экспериментально вычислить число Пи.',
  },
];
