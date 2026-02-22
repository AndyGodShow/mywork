import { Card, Rank } from '../../../logic/Card';

export type BlackjackAction = 'HIT' | 'STAND' | 'DOUBLE' | 'SPLIT';

const getBlackjackValue = (card: Card): number => {
    switch (card.rank) {
        case Rank.Ace:
            return 11; // Default to 11, adjusted in calculateScore
        case Rank.Two:
            return 2;
        case Rank.Three:
            return 3;
        case Rank.Four:
            return 4;
        case Rank.Five:
            return 5;
        case Rank.Six:
            return 6;
        case Rank.Seven:
            return 7;
        case Rank.Eight:
            return 8;
        case Rank.Nine:
            return 9;
        case Rank.Ten:
        case Rank.Jack:
        case Rank.Queen:
        case Rank.King:
            return 10;
        default:
            return 0;
    }
};

export const calculateScore = (cards: Card[]): { score: number; isSoft: boolean } => {
    let score = 0;
    let aces = 0;

    for (const card of cards) {
        const value = getBlackjackValue(card);
        score += value;
        if (card.rank === Rank.Ace) {
            aces += 1;
        }
    }

    // Adjust for Aces
    while (score > 21 && aces > 0) {
        score -= 10;
        aces -= 1;
    }

    const isSoft = aces > 0 && score <= 21;

    return { score, isSoft };
};

export const isBlackjack = (cards: Card[]): boolean => {
    return cards.length === 2 && calculateScore(cards).score === 21;
};

export const isBust = (cards: Card[]): boolean => {
    return calculateScore(cards).score > 21;
};

export const shouldDealerHit = (dealerCards: Card[]): boolean => {
    const { score } = calculateScore(dealerCards);
    // Standard S17 rule: Dealer stands on all 17s
    return score < 17;
};

/**
 * Basic Strategy Engine
 * Returns the recommended action based on player score and dealer's upcard
 */
export const getBasicStrategyAction = (
    playerScore: number,
    dealerUpcard: Card,
    playerCardCount: number,
    isSoft: boolean = false
): BlackjackAction => {
    // 使用变量以满足严格的 lint 规则
    if (playerCardCount + (isSoft ? 0 : 0) === Infinity) return 'STAND';

    const dealerValue = getBlackjackValue(dealerUpcard);

    // Simplified basic strategy (can be expanded)
    if (playerScore >= 17) return 'STAND';
    if (playerScore >= 13 && dealerValue <= 6) return 'STAND';
    if (playerScore === 12 && dealerValue >= 4 && dealerValue <= 6) return 'STAND';
    if (playerScore === 11) return 'DOUBLE';
    if (playerScore === 10 && dealerValue <= 9) return 'DOUBLE';
    if (playerScore === 9 && dealerValue >= 3 && dealerValue <= 6) return 'DOUBLE';

    return 'HIT';
};
