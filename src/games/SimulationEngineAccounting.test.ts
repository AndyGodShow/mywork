import { describe, it, expect } from 'vitest';
import { runSimulation } from './baccarat/logic/SimulationEngine';
import { FlatBetStrategy } from './baccarat/logic/Strategies';
import { runBlackjackSimulation } from './blackjack/logic/BlackjackSimulationEngine';
import { BasicStrategyPlayer } from './blackjack/logic/BlackjackStrategies';
import type { BlackjackStrategy } from './blackjack/logic/BlackjackStrategies';
import { runRouletteSimulation } from './roulette/logic/RouletteSimulationEngine';
import { FlatRedStrategy } from './roulette/logic/RouletteStrategies';
import type { RouletteStrategy } from './roulette/logic/RouletteStrategies';
import { runCrapsSimulation } from './craps/logic/CrapsSimulationEngine';
import { runDragonTigerSimulation } from './dragontiger/logic/DragonTigerSimulationEngine';
import { runSanGongSimulation } from './sangong/logic/SanGongSimulationEngine';
import { runSicBoSimulation } from './sicbo/logic/SicBoSimulationEngine';

const impossibleBlackjackStrategy: BlackjackStrategy = {
    name: 'Impossible',
    description: 'Always bets more than balance.',
    getBet: (balance) => balance + 1,
    getAction: () => 'STAND',
    reset: () => { },
};

const impossibleRouletteStrategy: RouletteStrategy = {
    name: 'Impossible',
    description: 'Always bets more than balance.',
    getBets: (balance) => [{ type: 'red', amount: balance + 1 }],
    reset: () => { },
};

describe('simulation engines accounting', () => {
    it('baccarat: bet > balance should stop before first round', () => {
        const result = runSimulation(100, new FlatBetStrategy(20000, 'PLAYER'), 10000);
        expect(result.totalRounds).toBe(0);
        expect(result.balanceHistory).toEqual([10000]);
        expect(result.history).toHaveLength(0);
    });

    it('blackjack: bet > balance should stop before first round', () => {
        const result = runBlackjackSimulation(100, impossibleBlackjackStrategy, 10000);
        expect(result.totalRounds).toBe(0);
        expect(result.balanceHistory).toEqual([10000]);
    });

    it('roulette: bet > balance should stop before first round', () => {
        const result = runRouletteSimulation(100, impossibleRouletteStrategy, 10000);
        expect(result.totalRounds).toBe(0);
        expect(result.balanceHistory).toEqual([10000]);
        expect(result.wins + result.losses).toBe(0);
    });

    it('craps: no affordable bets should not consume rounds', () => {
        const result = runCrapsSimulation({
            rounds: 100,
            initialBalance: 50,
            bets: [{ type: 'pass_line', amount: 100 }],
        });
        expect(result.totalRounds).toBe(0);
        expect(result.balanceHistory).toEqual([50]);
        expect(result.wins + result.losses).toBe(0);
    });

    it('dragon tiger / sangong / sicbo: no affordable bets should not consume rounds', () => {
        const dt = runDragonTigerSimulation({
            rounds: 100,
            initialBalance: 50,
            bets: [{ type: 'dragon', amount: 100 }],
        });
        expect(dt.totalRounds).toBe(0);
        expect(dt.balanceHistory).toEqual([50]);
        expect(dt.resultDistribution).toEqual({ dragon: 0, tiger: 0, tie: 0 });

        const sg = runSanGongSimulation({
            rounds: 100,
            initialBalance: 50,
            bets: [{ type: 'player_wins', amount: 100 }],
        });
        expect(sg.totalRounds).toBe(0);
        expect(sg.balanceHistory).toEqual([50]);
        expect(sg.resultDistribution).toEqual({ player_wins: 0, banker_wins: 0, tie: 0 });

        const sb = runSicBoSimulation({
            rounds: 100,
            initialBalance: 50,
            bets: [{ type: 'big', amount: 100 }],
        });
        expect(sb.totalRounds).toBe(0);
        expect(sb.balanceHistory).toEqual([50]);
        expect(sb.wins + sb.losses).toBe(0);
    });

    it('played rounds should equal balance history length - 1', () => {
        const baccarat = runSimulation(100, new FlatBetStrategy(100, 'PLAYER'), 10000);
        expect(baccarat.totalRounds).toBe(baccarat.balanceHistory.length - 1);

        const blackjack = runBlackjackSimulation(100, new BasicStrategyPlayer(100), 10000);
        expect(blackjack.totalRounds).toBe(blackjack.balanceHistory.length - 1);

        const roulette = runRouletteSimulation(100, new FlatRedStrategy(100), 10000);
        expect(roulette.totalRounds).toBe(roulette.balanceHistory.length - 1);
    });
});
