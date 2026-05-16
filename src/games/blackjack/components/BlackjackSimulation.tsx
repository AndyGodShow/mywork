import React from 'react';
import { SimulationPanel, StatBox } from '../../../components/SimulationPanel';
import type { BlackjackSimulationResult } from '../logic/BlackjackSimulationEngine';
import { runBlackjackSimulation } from '../logic/BlackjackSimulationEngine';
import { ALL_BLACKJACK_STRATEGIES } from '../logic/BlackjackStrategies';
import { formatMoney, formatPercent, formatSignedMoney } from '../../../components/Common/Simulation/stats';

export const BlackjackSimulation: React.FC = () => (
    <SimulationPanel
        title="Blackjack 批量模拟测试"
        strategyOptions={ALL_BLACKJACK_STRATEGIES.map(s => ({ name: s.label }))}
        onRun={async ({ rounds, baseBet, initialBalance, strategyIndex }) => {
            const strategy = ALL_BLACKJACK_STRATEGIES[strategyIndex].create(baseBet);
            return runBlackjackSimulation(rounds, strategy, initialBalance);
        }}
        renderStats={(result, ctx) => {
            const r = result as BlackjackSimulationResult;
            return (
                <>
                    <StatBox label="玩家赢 (Player)" value={`${r.playerWins} (${formatPercent(r.playerWins, r.totalRounds)}%)`} />
                    <StatBox label="庄家赢 (Dealer)" value={`${r.dealerWins} (${formatPercent(r.dealerWins, r.totalRounds)}%)`} />
                    <StatBox label="平局 (Push)" value={`${r.pushes} (${formatPercent(r.pushes, r.totalRounds)}%)`} />
                    <StatBox label="Blackjacks" value={String(r.blackjacks)} />
                    <StatBox label="最终余额" value={formatMoney(r.finalBalance)} isPositive={r.finalBalance >= ctx.initialBalance} />
                    <StatBox label="净盈亏" value={formatSignedMoney(r.finalBalance - ctx.initialBalance)} isPositive={r.finalBalance >= ctx.initialBalance} />
                    <StatBox label="最高连赢/输" value={`${r.maxWinStreak} / ${r.maxLossStreak}`} />
                </>
            );
        }}
    />
);
