import React, { useState } from 'react';
import { runBlackjackSimulation } from '../logic/BlackjackSimulationEngine';
import type { BlackjackSimulationResult } from '../logic/BlackjackSimulationEngine';
import { AssetCurve } from '../../../components/Common/Simulation/AssetCurve';
import {
    BasicStrategyPlayer,
    MartingaleBasicStrategy,
    DealerMimicStrategy
} from '../logic/BlackjackStrategies';
import styles from '../../../components/Common/Simulation/Simulation.module.css';

type StrategyType = 'BASIC' | 'MARTINGALE_BASIC' | 'DEALER_MIMIC';

export const BlackjackSimulation: React.FC = () => {
    const [rounds, setRounds] = useState<number | ''>(1000);
    const [baseBet, setBaseBet] = useState<number | ''>(100);
    const [strategyType, setStrategyType] = useState<StrategyType>('BASIC');
    const [result, setResult] = useState<BlackjackSimulationResult | null>(null);
    const [loading, setLoading] = useState(false);

    const handleRun = async () => {
        setLoading(true);
        setTimeout(() => {
            let strategy;
            const currentBaseBet = baseBet === '' ? 100 : baseBet;
            const currentRounds = rounds === '' ? 1000 : rounds;

            switch (strategyType) {
                case 'BASIC':
                    strategy = new BasicStrategyPlayer(currentBaseBet);
                    break;
                case 'MARTINGALE_BASIC':
                    strategy = new MartingaleBasicStrategy(currentBaseBet);
                    break;
                case 'DEALER_MIMIC':
                    strategy = new DealerMimicStrategy(currentBaseBet);
                    break;
                default:
                    strategy = new BasicStrategyPlayer(currentBaseBet);
            }

            const res = runBlackjackSimulation(currentRounds, strategy);
            setResult(res);
            setLoading(false);
        }, 100);
    };

    return (
        <div className={styles.container}>
            <h2>Blackjack 批量模拟测试</h2>

            <div className={styles.config}>
                <div className={styles.field}>
                    <label>模拟局数:</label>
                    <input
                        type="number"
                        value={rounds}
                        onChange={(e) => setRounds(e.target.value === '' ? '' : Number(e.target.value))}
                        min="10"
                        max="100000"
                    />
                </div>

                <div className={styles.field}>
                    <label>初始注码:</label>
                    <input
                        type="number"
                        value={baseBet}
                        onChange={(e) => setBaseBet(e.target.value === '' ? '' : Number(e.target.value))}
                        min="1"
                        max="10000"
                    />
                </div>

                <div className={styles.field}>
                    <label>下注策略:</label>
                    <select value={strategyType} onChange={(e) => setStrategyType(e.target.value as StrategyType)}>
                        <option value="BASIC">基本策略 (Basic Strategy)</option>
                        <option value="MARTINGALE_BASIC">倍投 + 基本策略</option>
                        <option value="DEALER_MIMIC">模仿庄家 (Mimic Dealer)</option>
                    </select>
                </div>

                <button className={styles.runBtn} onClick={handleRun} disabled={loading}>
                    {loading ? '运行中...' : '开始模拟'}
                </button>
            </div>

            {result && (
                <div className={styles.results}>
                    <h3>测试结果 ({result.totalRounds} 局)</h3>

                    <div className={styles.statsGrid}>
                        <div className={styles.statBox}>
                            <span className={styles.statLabel}>玩家赢 (Player)</span>
                            <span className={styles.statValue}>{result.playerWins} ({((result.playerWins / result.totalRounds) * 100).toFixed(2)}%)</span>
                        </div>
                        <div className={styles.statBox}>
                            <span className={styles.statLabel}>庄家赢 (Dealer)</span>
                            <span className={styles.statValue}>{result.dealerWins} ({((result.dealerWins / result.totalRounds) * 100).toFixed(2)}%)</span>
                        </div>
                        <div className={styles.statBox}>
                            <span className={styles.statLabel}>平局 (Push)</span>
                            <span className={styles.statValue}>{result.pushes} ({((result.pushes / result.totalRounds) * 100).toFixed(2)}%)</span>
                        </div>
                        <div className={styles.statBox}>
                            <span className={styles.statLabel}>Blackjacks</span>
                            <span className={styles.statValue} style={{ color: '#ffd700' }}>{result.blackjacks}</span>
                        </div>
                        <div className={styles.statBox}>
                            <span className={styles.statLabel}>最终余额</span>
                            <span className={`${styles.statValue} ${result.finalBalance >= 10000 ? styles.positive : styles.negative}`}>
                                ${result.finalBalance.toFixed(0)}
                            </span>
                        </div>
                        <div className={styles.statBox}>
                            <span className={styles.statLabel}>最高连赢/输</span>
                            <span className={styles.statValue}>{result.maxWinStreak} / {result.maxLossStreak}</span>
                        </div>
                    </div>

                    {result.balanceHistory && (
                        <AssetCurve data={result.balanceHistory} startBalance={10000} />
                    )}
                </div>
            )}
        </div>
    );
};
