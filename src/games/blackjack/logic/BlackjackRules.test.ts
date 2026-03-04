import { describe, it, expect } from 'vitest';
import { Card, Suit, Rank } from '../../../logic/Card';
import {
    calculateScore,
    isBlackjack,
    isBust,
    shouldDealerHit,
    getBasicStrategyAction,
} from './BlackjackRules';

// ===== 辅助函数 =====
const card = (rank: Rank, suit: Suit = Suit.Spades) => new Card(suit, rank);

// ===== calculateScore =====
describe('calculateScore', () => {
    it('普通手牌', () => {
        const result = calculateScore([card(Rank.Five), card(Rank.Nine)]);
        expect(result.score).toBe(14);
        expect(result.isSoft).toBe(false);
    });

    it('含 A 的软手', () => {
        const result = calculateScore([card(Rank.Ace), card(Rank.Six)]);
        expect(result.score).toBe(17);
        expect(result.isSoft).toBe(true);
    });

    it('A 降级为 1 (超过 21)', () => {
        const result = calculateScore([card(Rank.Ace), card(Rank.Seven), card(Rank.Eight)]);
        expect(result.score).toBe(16); // 1+7+8
        expect(result.isSoft).toBe(false);
    });

    it('双 A', () => {
        const result = calculateScore([card(Rank.Ace), card(Rank.Ace)]);
        expect(result.score).toBe(12); // 11+1
        expect(result.isSoft).toBe(true);
    });

    it('Blackjack (21 点)', () => {
        const result = calculateScore([card(Rank.Ace), card(Rank.King)]);
        expect(result.score).toBe(21);
        expect(result.isSoft).toBe(true);
    });

    it('爆牌 (超过 21)', () => {
        const result = calculateScore([card(Rank.King), card(Rank.Queen), card(Rank.Five)]);
        expect(result.score).toBe(25);
        expect(result.isSoft).toBe(false);
    });
});

// ===== isBlackjack =====
describe('isBlackjack', () => {
    it('A + 10 = Blackjack', () => {
        expect(isBlackjack([card(Rank.Ace), card(Rank.Ten)])).toBe(true);
    });

    it('A + K = Blackjack', () => {
        expect(isBlackjack([card(Rank.Ace), card(Rank.King)])).toBe(true);
    });

    it('三张牌 21 点不是 Blackjack', () => {
        expect(isBlackjack([card(Rank.Seven), card(Rank.Seven), card(Rank.Seven)])).toBe(false);
    });

    it('非 21 点', () => {
        expect(isBlackjack([card(Rank.King), card(Rank.Nine)])).toBe(false);
    });
});

// ===== isBust =====
describe('isBust', () => {
    it('超过 21 为爆牌', () => {
        expect(isBust([card(Rank.King), card(Rank.Queen), card(Rank.Five)])).toBe(true);
    });

    it('21 点不爆牌', () => {
        expect(isBust([card(Rank.Ace), card(Rank.King)])).toBe(false);
    });
});

// ===== shouldDealerHit =====
describe('shouldDealerHit', () => {
    it('16 点庄家要牌', () => {
        expect(shouldDealerHit([card(Rank.King), card(Rank.Six)])).toBe(true);
    });

    it('17 点庄家停牌 (S17)', () => {
        expect(shouldDealerHit([card(Rank.King), card(Rank.Seven)])).toBe(false);
    });

    it('Soft 17 也停牌 (S17 规则)', () => {
        expect(shouldDealerHit([card(Rank.Ace), card(Rank.Six)])).toBe(false);
    });
});

// ===== getBasicStrategyAction =====
describe('getBasicStrategyAction', () => {
    const dealer = (rank: Rank) => card(rank);

    it('硬 17+ 停牌', () => {
        expect(getBasicStrategyAction(18, dealer(Rank.Ten), 2)).toBe('STAND');
    });

    it('硬 11 加倍', () => {
        expect(getBasicStrategyAction(11, dealer(Rank.Six), 2)).toBe('DOUBLE');
    });

    it('硬 13 对庄 5 停牌', () => {
        expect(getBasicStrategyAction(13, dealer(Rank.Five), 2)).toBe('STAND');
    });

    it('硬 13 对庄 7 要牌', () => {
        expect(getBasicStrategyAction(13, dealer(Rank.Seven), 2)).toBe('HIT');
    });

    it('硬 8 要牌', () => {
        expect(getBasicStrategyAction(8, dealer(Rank.Four), 2)).toBe('HIT');
    });
});
