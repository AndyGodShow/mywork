import { describe, it, expect } from 'vitest';
import { getNumberInfo, calculateRoulettePayout } from './RouletteEngine';
import type { RouletteBet } from '../types';

// ===== getNumberInfo =====
describe('getNumberInfo', () => {
    it('0 是绿色', () => {
        const info = getNumberInfo(0);
        expect(info.color).toBe('green');
    });

    it('1 是红色、奇数、小', () => {
        const info = getNumberInfo(1);
        expect(info.color).toBe('red');
        expect(info.isEven).toBe(false);
        expect(info.isLow).toBe(true);
    });

    it('2 是黑色、偶数', () => {
        const info = getNumberInfo(2);
        expect(info.color).toBe('black');
        expect(info.isEven).toBe(true);
    });

    it('19 是红色、大数', () => {
        const info = getNumberInfo(19);
        expect(info.color).toBe('red');
        expect(info.isLow).toBe(false);
    });

    it('打 (dozen) 正确: 1=第一打, 13=第二打, 25=第三打', () => {
        expect(getNumberInfo(1).dozen).toBe(1);
        expect(getNumberInfo(13).dozen).toBe(2);
        expect(getNumberInfo(25).dozen).toBe(3);
    });

    it('列 (column) 正确: 1=第1列, 2=第2列, 3=第3列', () => {
        expect(getNumberInfo(1).column).toBe(1);
        expect(getNumberInfo(2).column).toBe(2);
        expect(getNumberInfo(3).column).toBe(3);
    });
});

// ===== calculateRoulettePayout =====
describe('calculateRoulettePayout', () => {
    const bet = (type: RouletteBet['type'], amount: number, value?: number): RouletteBet => ({
        type,
        amount,
        value: value ?? 0,
    });

    // 直注 (35:1 payout = 36x bet including original)
    it('直注命中 36 倍', () => {
        expect(calculateRoulettePayout(bet('straight', 100, 17), 17)).toBe(3600);
    });

    it('直注未中 0', () => {
        expect(calculateRoulettePayout(bet('straight', 100, 17), 18)).toBe(0);
    });

    // 红黑
    it('红注命中 2 倍', () => {
        expect(calculateRoulettePayout(bet('red', 100), 1)).toBe(200); // 1 is red
    });

    it('红注未中 0', () => {
        expect(calculateRoulettePayout(bet('red', 100), 2)).toBe(0); // 2 is black
    });

    it('红注对 0 输', () => {
        expect(calculateRoulettePayout(bet('red', 100), 0)).toBe(0);
    });

    // 奇偶
    it('偶注命中 2 倍', () => {
        expect(calculateRoulettePayout(bet('even', 100), 2)).toBe(200);
    });

    it('偶注对 0 输 (0 不算偶数)', () => {
        expect(calculateRoulettePayout(bet('even', 100), 0)).toBe(0);
    });

    // 大小
    it('小注 (1-18) 命中 2 倍', () => {
        expect(calculateRoulettePayout(bet('low', 100), 18)).toBe(200);
    });

    it('大注 (19-36) 命中 2 倍', () => {
        expect(calculateRoulettePayout(bet('high', 100), 19)).toBe(200);
    });

    // 打注
    it('第一打命中 3 倍', () => {
        expect(calculateRoulettePayout(bet('dozen1', 100), 12)).toBe(300);
    });

    it('第一打未中 0', () => {
        expect(calculateRoulettePayout(bet('dozen1', 100), 13)).toBe(0);
    });

    // 列注
    it('第一列命中 3 倍', () => {
        expect(calculateRoulettePayout(bet('column1', 100), 1)).toBe(300);
    });

    // 街注
    it('街注 (1-3) 命中 12 倍', () => {
        expect(calculateRoulettePayout(bet('street', 100, 1), 2)).toBe(1200);
    });

    it('街注未中 0', () => {
        expect(calculateRoulettePayout(bet('street', 100, 1), 4)).toBe(0);
    });

    // 线注
    it('线注 (1-6) 命中 6 倍', () => {
        expect(calculateRoulettePayout(bet('line', 100, 1), 5)).toBe(600);
    });
});
