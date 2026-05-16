import React from 'react';
import { SimulationPanel, StatBox } from '../../../components/SimulationPanel';
import type { RouletteSimulationResult } from '../logic/RouletteSimulationEngine';
import { runRouletteSimulation } from '../logic/RouletteSimulationEngine';
import { ALL_ROULETTE_STRATEGIES } from '../logic/RouletteStrategies';
import { formatMoney, formatPercent, formatSignedMoney } from '../../../components/Common/Simulation/stats';

export const RouletteSimulation: React.FC = () => (
    <SimulationPanel
        title="轮盘批量模拟测试"
        strategyOptions={ALL_ROULETTE_STRATEGIES.map(s => ({ name: s.label }))}
        onRun={async ({ rounds, baseBet, initialBalance, strategyIndex }) => {
            const strategy = ALL_ROULETTE_STRATEGIES[strategyIndex].create(baseBet);
            return runRouletteSimulation(rounds, strategy, initialBalance);
        }}
        renderStats={(result, ctx) => {
            const r = result as RouletteSimulationResult;
            return (
                <>
                    <StatBox label="赢 (Win)" value={`${r.wins} (${formatPercent(r.wins, r.totalRounds)}%)`} />
                    <StatBox label="输 (Loss)" value={`${r.losses} (${formatPercent(r.losses, r.totalRounds)}%)`} />
                    <StatBox label="最终余额" value={formatMoney(r.finalBalance)} isPositive={r.finalBalance >= ctx.initialBalance} />
                    <StatBox label="净盈亏" value={formatSignedMoney(r.finalBalance - ctx.initialBalance)} isPositive={r.finalBalance >= ctx.initialBalance} />
                    <StatBox label="最高连赢" value={String(r.maxWinStreak)} />
                    <StatBox label="最高连输" value={String(r.maxLossStreak)} alwaysNegative />
                    <StatBox label="收益率" value={`${((r.finalBalance - ctx.initialBalance) / ctx.initialBalance * 100).toFixed(2)}%`} isPositive={r.finalBalance >= ctx.initialBalance} />
                </>
            );
        }}
    />
);
