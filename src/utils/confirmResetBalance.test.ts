import { describe, expect, it, vi } from 'vitest';
import { buildResetBalanceMessage, confirmResetBalance } from './confirmResetBalance';

describe('buildResetBalanceMessage', () => {
    it('includes pending stake when present', () => {
        expect(buildResetBalanceMessage({ pendingStake: 1200 })).toBe(
            '这会将余额重置为初始值，清空当前下注 $1,200。是否继续？',
        );
    });

    it('includes in-progress notice when requested', () => {
        expect(buildResetBalanceMessage({ inProgress: true })).toBe(
            '这会将余额重置为初始值，清空当前局面，中止当前动画或结算。是否继续？',
        );
    });
});

describe('confirmResetBalance', () => {
    it('delegates to window.confirm with the generated message', () => {
        const confirm = vi.fn(() => true);
        vi.stubGlobal('window', { confirm });

        expect(confirmResetBalance({ pendingStake: 300, inProgress: true })).toBe(true);
        expect(confirm).toHaveBeenCalledWith(
            '这会将余额重置为初始值，清空当前下注 $300，中止当前动画或结算。是否继续？',
        );

        vi.unstubAllGlobals();
    });
});
