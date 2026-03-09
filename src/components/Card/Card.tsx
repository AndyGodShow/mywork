import React from 'react';
import { Card as CardModel, Suit } from '../../logic/Card';
import { SuitIcon } from './SuitIcon';
import styles from './Card.module.css';

interface CardProps {
    card?: CardModel;
    hidden?: boolean;
    /** 发牌顺序索引，控制 stagger 延迟（每张间隔 110ms） */
    dealIndex?: number;
    className?: string;
}

export const Card: React.FC<CardProps> = ({
    card,
    hidden = false,
    dealIndex = 0,
    className = '',
}) => {
    const isRed = card && (card.suit === Suit.Hearts || card.suit === Suit.Diamonds);
    const dealStyle: React.CSSProperties = {
        animationDelay: `${dealIndex * 110}ms`,
    };

    if (hidden || !card) {
        return (
            <div
                className={`${styles.card} ${styles.back} ${className}`}
                style={dealStyle}
            >
                <div className={styles.pattern} />
            </div>
        );
    }

    const isAce = card.rank === 'A';
    const isFace = ['J', 'Q', 'K'].includes(card.rank);

    let specialClass = '';
    if (isAce) specialClass = styles.aceCard;
    if (isFace) specialClass = styles.faceCard;

    return (
        <div
            className={`${styles.card} ${styles.front} ${isRed ? styles.red : styles.black} ${specialClass} ${className}`}
            style={dealStyle}
        >
            <div className={styles.innerBorder}>
                <div className={styles.topCorner}>
                    <span>{card.rank}</span>
                    <SuitIcon suit={card.suit} className={styles.cornerSuit} />
                </div>

                <div className={styles.centerArea}>
                    {isFace ? (
                        <div className={styles.faceArtwork}>
                            <SuitIcon suit={card.suit} className={styles.faceSuit} />
                            <div className={styles.faceRank}>{card.rank}</div>
                        </div>
                    ) : (
                        <SuitIcon suit={card.suit} className={styles.centerSuit} />
                    )}
                </div>

                <div className={styles.bottomCorner}>
                    <span>{card.rank}</span>
                    <SuitIcon suit={card.suit} className={styles.cornerSuit} />
                </div>
            </div>
        </div>
    );
};
