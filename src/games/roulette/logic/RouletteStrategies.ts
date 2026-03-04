import type { RouletteBetType, RouletteBet } from '../types';
import { pickRandom } from '../../../logic/Random';

export interface RouletteStrategy {
    name: string;
    description: string;
    reset(): void;
    getBets(balance: number, lastWon: boolean | null): RouletteBet[];
}

/**
 * 平注押红 — 每局固定金额押红
 */
export class FlatRedStrategy implements RouletteStrategy {
    name = "平注押红 (Flat Red)";
    description = "每局用固定金额押红色。";

    private baseBet: number;

    constructor(baseBet: number = 100) {
        this.baseBet = baseBet;
    }

    reset() { }

    getBets(balance: number): RouletteBet[] {
        const amount = Math.min(this.baseBet, balance);
        if (amount <= 0) return [];
        return [{ type: 'red', amount }];
    }
}

/**
 * 倍投押红 — 输则翻倍，赢则回基注
 */
export class MartingaleRedStrategy implements RouletteStrategy {
    name = "倍投押红 (Martingale Red)";
    description = "押红色，输了翻倍，赢了重置为基注。";

    private baseBet: number;
    private currentBet: number;

    constructor(baseBet: number = 100) {
        this.baseBet = baseBet;
        this.currentBet = baseBet;
    }

    reset() {
        this.currentBet = this.baseBet;
    }

    getBets(balance: number, lastWon: boolean | null): RouletteBet[] {
        if (lastWon === null) {
            this.currentBet = this.baseBet;
        } else if (lastWon) {
            this.currentBet = this.baseBet;
        } else {
            this.currentBet *= 2;
        }

        const amount = Math.min(this.currentBet, balance);
        if (amount <= 0) return [];
        return [{ type: 'red', amount }];
    }
}

/**
 * 随机外围注 — 每局随机选择一个外围注类型
 */
export class RandomOutsideStrategy implements RouletteStrategy {
    name = "随机外围注 (Random Outside)";
    description = "每局随机选择红/黑/高/低/单/双中的一个下注。";

    private baseBet: number;

    constructor(baseBet: number = 100) {
        this.baseBet = baseBet;
    }

    reset() { }

    getBets(balance: number): RouletteBet[] {
        const amount = Math.min(this.baseBet, balance);
        if (amount <= 0) return [];

        const outsideBets: RouletteBetType[] = ['red', 'black', 'even', 'odd', 'low', 'high'];
        const randomType = pickRandom(outsideBets);

        return [{ type: randomType, amount }];
    }
}
