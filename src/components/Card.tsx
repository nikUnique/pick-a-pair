import { Card as CardType } from "../types/game";
import "./Card.css";

interface CardProps {
  card: CardType;
  onClick: () => void;
  disabled: boolean;
}

function Card({ card, onClick, disabled }: CardProps) {
  const handleClick = () => {
    if (!disabled && !card.isFlipped && !card.isMatched) {
      onClick();
    }
  };

  return (
    <div
      className={`card ${card.isFlipped || card.isMatched ? "flipped" : ""} ${card.isMatched ? "matched" : ""}`}
      onClick={handleClick}
    >
      <div className='card-inner'>
        <div className='card-front'>?</div>
        <div className='card-back'>{card.emoji}</div>
      </div>
    </div>
  );
}

export default Card;
