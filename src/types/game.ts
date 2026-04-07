export interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface GameState {
  cards: Card[];
  flippedCards: Card[];
  moves: number;
  matches: number;
  isGameWon: boolean;
}