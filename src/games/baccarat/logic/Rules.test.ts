import { describe, it, expect } from 'vitest';
import { Card, Suit, Rank } from '../../../logic/Card';
import {
    calculateHandValue,
    isNatural,
    isPair,
    getPlayerThirdCardAction,
    getBankerThirdCardAction,
    determineWinner,
    GameResult,
} from './Rules';

// ===== 辅助函数 =====
const card = (rank: Rank, suit: Suit = Suit.Spades) => new Card(suit, rank);

// ===== calculateHandValue =====
describe('calculateHandValue', () => {
    it('普通手牌 (取模 10)', () => {
        expect(calculateHandValue([card(Rank.Three), card(Rank.Four)])).toBe(7);
    });

    it('10 + K = 0 (20 mod 10)', () => {
        expect(calculateHandValue([card(Rank.Ten), card(Rank.King)])).toBe(0);
    });

    it('A = 1, 9 + A = 0', () => {
        expect(calculateHandValue([card(Rank.Nine), card(Rank.Ace)])).toBe(0);
    });

    it('5 + 6 = 1 (11 mod 10)', () => {
        expect(calculateHandValue([card(Rank.Five), card(Rank.Six)])).toBe(1);
    });

    it('三张牌: 2+3+4 = 9', () => {
        expect(calculateHandValue([card(Rank.Two), card(Rank.Three), card(Rank.Four)])).toBe(9);
    });
});

// ===== isNatural =====
describe('isNatural', () => {
    it('8 点是天生赢家', () => {
        expect(isNatural([card(Rank.Three), card(Rank.Five)])).toBe(true);
    });

    it('9 点是天生赢家', () => {
        expect(isNatural([card(Rank.Four), card(Rank.Five)])).toBe(true);
    });

    it('7 点不是天生赢家', () => {
        expect(isNatural([card(Rank.Three), card(Rank.Four)])).toBe(false);
    });
});

// ===== isPair =====
describe('isPair', () => {
    it('两张相同 rank 是对子', () => {
        expect(isPair([card(Rank.King), card(Rank.King, Suit.Hearts)])).toBe(true);
    });

    it('不同 rank 不是对子', () => {
        expect(isPair([card(Rank.King), card(Rank.Queen)])).toBe(false);
    });
});

// ===== getPlayerThirdCardAction =====
describe('getPlayerThirdCardAction', () => {
    it('0-5 点要牌', () => {
        expect(getPlayerThirdCardAction([card(Rank.Two), card(Rank.Three)])).toBe('draw');
    });

    it('6-9 点停牌', () => {
        expect(getPlayerThirdCardAction([card(Rank.Three), card(Rank.Four)])).toBe('stand');
    });
});

// ===== getBankerThirdCardAction (核心复杂规则) =====
describe('getBankerThirdCardAction', () => {
    it('庄 0-2 总是要牌', () => {
        const hand = [card(Rank.Ace), card(Rank.Ace)]; // 2 点
        expect(getBankerThirdCardAction(hand, card(Rank.Eight))).toBe('draw');
    });

    it('庄 3，闲第三张 8 则停', () => {
        const hand = [card(Rank.Ace), card(Rank.Two)]; // 3 点
        expect(getBankerThirdCardAction(hand, card(Rank.Eight))).toBe('stand');
    });

    it('庄 3，闲第三张非 8 则要', () => {
        const hand = [card(Rank.Ace), card(Rank.Two)]; // 3 点
        expect(getBankerThirdCardAction(hand, card(Rank.Five))).toBe('draw');
    });

    it('庄 4，闲第三张 2-7 则要', () => {
        const hand = [card(Rank.Ace), card(Rank.Three)]; // 4 点
        expect(getBankerThirdCardAction(hand, card(Rank.Five))).toBe('draw');
    });

    it('庄 4，闲第三张 8 则停', () => {
        const hand = [card(Rank.Ace), card(Rank.Three)]; // 4 点
        expect(getBankerThirdCardAction(hand, card(Rank.Eight))).toBe('stand');
    });

    it('庄 5，闲第三张 4-7 则要', () => {
        const hand = [card(Rank.Two), card(Rank.Three)]; // 5 点
        expect(getBankerThirdCardAction(hand, card(Rank.Six))).toBe('draw');
    });

    it('庄 5，闲第三张 3 则停', () => {
        const hand = [card(Rank.Two), card(Rank.Three)]; // 5 点
        expect(getBankerThirdCardAction(hand, card(Rank.Three))).toBe('stand');
    });

    it('庄 6，闲第三张 6-7 则要', () => {
        const hand = [card(Rank.Two), card(Rank.Four)]; // 6 点
        expect(getBankerThirdCardAction(hand, card(Rank.Seven))).toBe('draw');
    });

    it('庄 6，闲第三张 5 则停', () => {
        const hand = [card(Rank.Two), card(Rank.Four)]; // 6 点
        expect(getBankerThirdCardAction(hand, card(Rank.Five))).toBe('stand');
    });

    it('庄 7 总是停牌', () => {
        const hand = [card(Rank.Three), card(Rank.Four)]; // 7 点
        expect(getBankerThirdCardAction(hand, card(Rank.Five))).toBe('stand');
    });

    it('闲家未补牌时，庄 0-5 要牌', () => {
        const hand = [card(Rank.Two), card(Rank.Three)]; // 5 点
        expect(getBankerThirdCardAction(hand)).toBe('draw');
    });

    it('闲家未补牌时，庄 6+ 停牌', () => {
        const hand = [card(Rank.Three), card(Rank.Four)]; // 7 点
        expect(getBankerThirdCardAction(hand)).toBe('stand');
    });
});

// ===== determineWinner =====
describe('determineWinner', () => {
    it('闲大于庄 = 闲赢', () => {
        expect(determineWinner(
            [card(Rank.Four), card(Rank.Five)], // 9
            [card(Rank.Three), card(Rank.Four)]  // 7
        )).toBe(GameResult.PlayerWin);
    });

    it('庄大于闲 = 庄赢', () => {
        expect(determineWinner(
            [card(Rank.Three), card(Rank.Four)], // 7
            [card(Rank.Four), card(Rank.Five)]   // 9
        )).toBe(GameResult.BankerWin);
    });

    it('相同点数 = 和局', () => {
        expect(determineWinner(
            [card(Rank.Three), card(Rank.Four)], // 7
            [card(Rank.Two), card(Rank.Five)]    // 7
        )).toBe(GameResult.Tie);
    });
});
