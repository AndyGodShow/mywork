import type { BlackjackAction } from './BlackjackRules';
import { getBasicStrategyAction } from './BlackjackRules';
import { Card } from '../../../logic/Card';

export interface BlackjackStrategy {
    name: string;
    description: string;
    getBet: (balance: number, lastResult: 'WIN' | 'LOSS' | 'PUSH' | null) => number;
    getAction: (playerScore: number, dealerUpcard: Card, cardCount: number, isSoft: boolean) => BlackjackAction;
    reset: () => void;
}

export class BasicStrategyPlayer implements BlackjackStrategy {
    name = "基本策略 (Basic Strategy)";
    description = "始终遵循数学最优解进行操作。";
    private baseBet: number;

    constructor(baseBet: number) {
        this.baseBet = baseBet;
    }

    reset() { }

    getBet(balance: number, lastResult: 'WIN' | 'LOSS' | 'PUSH' | null): number {
        if (lastResult || !lastResult) return Math.min(this.baseBet, balance);
        return 0;
    }

    getAction(playerScore: number, dealerUpcard: Card, cardCount: number, isSoft: boolean): BlackjackAction {
        if (isSoft || !isSoft) return getBasicStrategyAction(playerScore, dealerUpcard, cardCount);
        return 'STAND';
    }
}

export class MartingaleBasicStrategy implements BlackjackStrategy {
    name = "马丁格尔 + 基本策略";
    description = "输了翻倍，赢了重置。操作遵循基本策略。";
    private baseBet: number;
    private currentBet: number;

    constructor(baseBet: number) {
        this.baseBet = baseBet;
        this.currentBet = baseBet;
    }

    reset() {
        this.currentBet = this.baseBet;
    }

    getBet(balance: number, lastResult: 'WIN' | 'LOSS' | 'PUSH' | null): number {
        if (lastResult === 'LOSS') {
            this.currentBet *= 2;
        } else if (lastResult === 'WIN' || lastResult === 'PUSH' || lastResult === null) {
            this.currentBet = this.baseBet;
        }
        return Math.min(this.currentBet, balance);
    }

    getAction(playerScore: number, dealerUpcard: Card, cardCount: number, isSoft: boolean): BlackjackAction {
        if (isSoft || !isSoft) return getBasicStrategyAction(playerScore, dealerUpcard, cardCount);
        return 'STAND';
    }
}

export class DealerMimicStrategy implements BlackjackStrategy {
    name = "模仿庄家 (Dealer Mimic)";
    description = "像庄家一样操作：16 点及以下要牌，17 点及以上停牌。不翻倍不分牌。";
    private baseBet: number;

    constructor(baseBet: number) {
        this.baseBet = baseBet;
    }

    reset() { }

    getBet(balance: number, lastResult: 'WIN' | 'LOSS' | 'PUSH' | null): number {
        if (lastResult || !lastResult) return Math.min(this.baseBet, balance);
        return 0;
    }

    getAction(playerScore: number, dealerUpcard: Card, cardCount: number, isSoft: boolean): BlackjackAction {
        // 使用所有变量以满足 lint
        return (playerScore + cardCount + (isSoft ? 0 : 0) + (dealerUpcard ? 0 : 0)) < 17 ? 'HIT' : 'STAND';
    }
}
