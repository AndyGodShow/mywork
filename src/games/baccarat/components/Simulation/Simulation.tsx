import React from 'react';
import { SimulationPanel, StatBox } from '../../../../components/SimulationPanel';
import type { SimulationResult } from '../../logic/SimulationEngine';
import { runSimulation } from '../../logic/SimulationEngine';
import { BACCARAT_STRATEGY_OPTIONS, createBaccaratStrategy } from '../../logic/Strategies';
import { formatMoney, formatPercent, formatSignedMoney } from '../../../../components/Common/Simulation/stats';

export const Simulation: React.FC = () => (
    <SimulationPanel
        strategyOptions={BACCARAT_STRATEGY_OPTIONS}
        onRun={async ({ rounds, baseBet, initialBalance, strategyIndex }) =>
            runSimulation(rounds, createBaccaratStrategy(strategyIndex, baseBet), initialBalance)
        }
        renderStats={(result, ctx) => {
            const r = result as SimulationResult;
            return (
                <>
                    <StatBox label="庄赢 (Banker)" value={`${r.bankerWins} (${formatPercent(r.bankerWins, r.totalRounds)}%)`} />
                    <StatBox label="闲赢 (Player)" value={`${r.playerWins} (${formatPercent(r.playerWins, r.totalRounds)}%)`} />
                    <StatBox label="和局 (Tie)" value={`${r.ties} (${formatPercent(r.ties, r.totalRounds)}%)`} />
                    <StatBox label="最终余额" value={formatMoney(r.finalBalance)} isPositive={r.finalBalance >= ctx.initialBalance} />
                    <StatBox label="净盈亏" value={formatSignedMoney(r.finalBalance - ctx.initialBalance)} isPositive={r.finalBalance >= ctx.initialBalance} />
                    <StatBox label="最高连赢" value={String(r.maxWinStreak)} />
                    <StatBox label="最高连输" value={String(r.maxLossStreak)} alwaysNegative />
                </>
            );
        }}
    />
);
