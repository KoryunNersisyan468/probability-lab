export type Language = 'hy' | 'en' | 'ru';
export type Theme = 'light' | 'dark' | 'system';

export type GameId =
  | 'threeDoors'
  | 'password'
  | 'cards'
  | 'dice'
  | 'coin'
  | 'weather'
  | 'quiz';

export interface GameInfo {
  id: GameId;
  titleKey: string;
  subtitleKey: string;
  icon: string;
  conceptKey: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  path: string;
  color: string;
}

export interface ThreeDoorsStats {
  games: number;
  wins: number;
  losses: number;
  stayWins: number;
  stayLosses: number;
  switchWins: number;
  switchLosses: number;
}

export interface PasswordStats {
  attempts: number;
  successfulGuesses: number;
  totalGuessesAcrossGames: number;
  gamesCompleted: number;
  bestAttemptCount: number;
}

export interface CardsStats {
  draws: number;
  correctPredictions: number;
  redBlackWins: number;
  suitWins: number;
  rankWins: number;
  aceWins: number;
  faceWins: number;
  specificWins: number;
}

export interface DiceStats {
  rolls: number;
  correctPredictions: number;
  sumFrequency: Record<number, number>; // sum -> count
}

export interface CoinStats {
  flips: number;
  heads: number;
  tails: number;
  correctPredictions: number;
  consecutiveStreak: number;
  maxStreak: number;
}

export interface WeatherStats {
  predictions: number;
  correctPredictions: number;
  multiRoundBestScore: number;
}

export interface QuizStats {
  questionsAnswered: number;
  correctAnswers: number;
  quizzesCompleted: number;
  bestScore: number;
}

export interface UserStats {
  threeDoors: ThreeDoorsStats;
  password: PasswordStats;
  cards: CardsStats;
  dice: DiceStats;
  coin: CoinStats;
  weather: WeatherStats;
  quiz: QuizStats;
  totalExperimentsRun: number;
}

export interface Achievement {
  id: string;
  titleKey: string;
  descKey: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
  category: 'games' | 'experiments' | 'mastery';
}

export interface ExperimentRecord {
  id: string;
  timestamp: number;
  gameId: GameId;
  title: string;
  hypothesis: string;
  hypothesisSupported: boolean;
  trials: number;
  theoreticalProb: number;
  experimentalProb: number;
  delta: number;
  parameters: Record<string, any>;
  dataPoints: Array<{ name: string | number; theoretical: number; experimental: number; count?: number }>;
}

export interface ProbabilityExplanation {
  title: string;
  event: string;
  theoretical: number; // e.g. 0.6667
  theoreticalFraction: string; // e.g. "2/3"
  experimental?: number;
  sampleSize?: number;
  whyText: string;
  formula?: string;
  recommendation?: string;
  breakdown?: Array<{ label: string; value: number; color?: string; note?: string }>;
}
