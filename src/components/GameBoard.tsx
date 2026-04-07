import { useCallback, useEffect, useState } from "react";
import { Card as CardType, GameState } from "../types/game";
import Card from "./Card";
import "./GameBoard.css";

const EMOJIS = ["🎮", "🎲", "🎯", "🎪", "🎨", "🎭", "🎪", "🎯"];

function shuffleArray<T>(array: T[]): T[] {
  return array
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
}

function createInitialCards(): CardType[] {
  const pairs = [...EMOJIS, ...EMOJIS];
  return shuffleArray(pairs).map((emoji, index) => ({
    id: index,
    emoji,
    isFlipped: false,
    isMatched: false,
  }));
}

function GameBoard() {
  const [gameState, setGameState] = useState<GameState>({
    cards: createInitialCards(),
    flippedCards: [],
    moves: 0,
    matches: 0,
    isGameWon: false,
  });

  const [isChecking, setIsChecking] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const handleCardClick = useCallback(
    (cardId: number) => {
      if (isChecking) return;
      if (gameState.flippedCards.length >= 2) return;

      // Start timer on first card click
      if (!isTimerRunning) {
        setIsTimerRunning(true);
      }

      setGameState((prev) => {
        const cardIndex = prev.cards.findIndex((c) => c.id === cardId);
        if (cardIndex === -1) return prev;

        const card = prev.cards[cardIndex];
        if (card.isFlipped || card.isMatched) return prev;

        const newCards = [...prev.cards];
        newCards[cardIndex] = { ...card, isFlipped: true };

        const newFlippedCards = [...prev.flippedCards, newCards[cardIndex]];

        return {
          ...prev,
          cards: newCards,
          flippedCards: newFlippedCards,
        };
      });
    },
    [isChecking, gameState.flippedCards.length, isTimerRunning],
  );

  useEffect(() => {
    if (gameState.flippedCards.length === 2) {
      setIsChecking(true);
      const [first, second] = gameState.flippedCards;

      if (first.emoji === second.emoji) {
        setGameState((prev) => ({
          ...prev,
          cards: prev.cards.map((card) =>
            card.id === first.id || card.id === second.id
              ? { ...card, isMatched: true }
              : card,
          ),
          flippedCards: [],
          matches: prev.matches + 1,
          moves: prev.moves + 1,
        }));
        setIsChecking(false);
      } else {
        setTimeout(() => {
          setGameState((prev) => ({
            ...prev,
            cards: prev.cards.map((card) =>
              card.id === first.id || card.id === second.id
                ? { ...card, isFlipped: false }
                : card,
            ),
            flippedCards: [],
            moves: prev.moves + 1,
          }));
          setIsChecking(false);
        }, 1000);
      }
    }
  }, [gameState.flippedCards]);

  useEffect(() => {
    if (gameState.matches === EMOJIS.length) {
      setGameState((prev) => ({ ...prev, isGameWon: true }));
      setIsTimerRunning(false);
    }
  }, [gameState.matches]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && !gameState.isGameWon) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, gameState.isGameWon]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const resetGame = () => {
    setGameState({
      cards: createInitialCards(),
      flippedCards: [],
      moves: 0,
      matches: 0,
      isGameWon: false,
    });
    setElapsedTime(0);
    setIsTimerRunning(false);
  };

  return (
    <div className='game-container'>
      <div className='game-header'>
        <h1>Pick a Pair</h1>
        <div className='game-stats'>
          <span>Moves: {gameState.moves}</span>
          <span>
            Matches: {gameState.matches}/{EMOJIS.length}
          </span>
          <span>Time: {formatTime(elapsedTime)}</span>
        </div>
      </div>

      {gameState.isGameWon ? (
        <div className='game-won'>
          <h2>🎉 Congratulations! 🎉</h2>
          <p>You won in {gameState.moves} moves!</p>
          <p>Time: {formatTime(elapsedTime)}</p>
          <button
            onClick={resetGame}
            className='reset-button'
          >
            Play Again
          </button>
        </div>
      ) : (
        <div className='game-board'>
          {gameState.cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              onClick={() => handleCardClick(card.id)}
              disabled={isChecking}
            />
          ))}
        </div>
      )}

      <button
        onClick={resetGame}
        className='reset-button'
      >
        Reset Game
      </button>
    </div>
  );
}

export default GameBoard;
