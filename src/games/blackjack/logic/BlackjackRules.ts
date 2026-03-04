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

// ===== 对子判断辅助 =====
const isPair = (cards: Card[]): boolean => {
    if (cards.length !== 2) return false;
    return getBlackjackValue(cards[0]) === getBlackjackValue(cards[1]);
};

/**
 * 完整 Basic Strategy 引擎
 * 
 * 基于标准 4-8 副牌、S17 规则策略表
 * 优先级：Pair → Soft Hand → Hard Hand
 */
export const getBasicStrategyAction = (
    playerScore: number,
    dealerUpcard: Card,
    playerCardCount: number,
    isSoft: boolean = false,
    cards?: Card[]
): BlackjackAction => {
    const d = getBlackjackValue(dealerUpcard);

    // ===== 1. Pair 策略 =====
    if (cards && isPair(cards) && playerCardCount === 2) {
        const pairValue = getBlackjackValue(cards[0]);

        // AA: 总是分牌
        if (pairValue === 11) return 'SPLIT';
        // 10-10: 不分 (站)
        if (pairValue === 10) return 'STAND';
        // 9-9: 对 2-9 (除 7) 分, 对 7/10/A 站
        if (pairValue === 9) return (d === 7 || d >= 10) ? 'STAND' : 'SPLIT';
        // 8-8: 总是分牌
        if (pairValue === 8) return 'SPLIT';
        // 7-7: 对 2-7 分
        if (pairValue === 7) return d <= 7 ? 'SPLIT' : 'HIT';
        // 6-6: 对 2-6 分
        if (pairValue === 6) return d <= 6 ? 'SPLIT' : 'HIT';
        // 5-5: 不分, 当作硬 10 处理 (下面硬手逻辑)
        if (pairValue === 5) { /* fall through to hard hand */ }
        // 4-4: 对 5-6 分
        if (pairValue === 4) return (d === 5 || d === 6) ? 'SPLIT' : 'HIT';
        // 3-3: 对 2-7 分
        if (pairValue === 3) return d <= 7 ? 'SPLIT' : 'HIT';
        // 2-2: 对 2-7 分
        if (pairValue === 2) return d <= 7 ? 'SPLIT' : 'HIT';
    }

    // ===== 2. Soft Hand 策略 (含 A 算 11) =====
    if (isSoft && playerCardCount >= 2) {
        // Soft 20/21: 站
        if (playerScore >= 20) return 'STAND';
        // Soft 19: 对 6 加倍, 否则站
        if (playerScore === 19) return (d === 6 && playerCardCount === 2) ? 'DOUBLE' : 'STAND';
        // Soft 18: 对 3-6 加倍, 对 2/7/8 站, 对 9/10/A 打
        if (playerScore === 18) {
            if (d >= 3 && d <= 6 && playerCardCount === 2) return 'DOUBLE';
            if (d <= 8) return 'STAND';
            return 'HIT';
        }
        // Soft 17: 对 3-6 加倍, 否则打
        if (playerScore === 17) return (d >= 3 && d <= 6 && playerCardCount === 2) ? 'DOUBLE' : 'HIT';
        // Soft 16: 对 4-6 加倍, 否则打
        if (playerScore === 16) return (d >= 4 && d <= 6 && playerCardCount === 2) ? 'DOUBLE' : 'HIT';
        // Soft 15: 对 4-6 加倍, 否则打
        if (playerScore === 15) return (d >= 4 && d <= 6 && playerCardCount === 2) ? 'DOUBLE' : 'HIT';
        // Soft 14: 对 5-6 加倍, 否则打
        if (playerScore === 14) return (d >= 5 && d <= 6 && playerCardCount === 2) ? 'DOUBLE' : 'HIT';
        // Soft 13: 对 5-6 加倍, 否则打
        if (playerScore === 13) return (d >= 5 && d <= 6 && playerCardCount === 2) ? 'DOUBLE' : 'HIT';
        // 其他 soft 手: 打
        return 'HIT';
    }

    // ===== 3. Hard Hand 策略 =====
    if (playerScore >= 17) return 'STAND';
    if (playerScore >= 13) return d <= 6 ? 'STAND' : 'HIT';
    if (playerScore === 12) return (d >= 4 && d <= 6) ? 'STAND' : 'HIT';
    if (playerScore === 11) return playerCardCount === 2 ? 'DOUBLE' : 'HIT';
    if (playerScore === 10) return (d <= 9 && playerCardCount === 2) ? 'DOUBLE' : 'HIT';
    if (playerScore === 9) return (d >= 3 && d <= 6 && playerCardCount === 2) ? 'DOUBLE' : 'HIT';

    return 'HIT';
};

