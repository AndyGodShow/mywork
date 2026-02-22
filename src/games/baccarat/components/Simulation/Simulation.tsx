
import React, { useState } from 'react';
import { runSimulation } from '../../logic/SimulationEngine';
import type { SimulationResult } from '../../logic/SimulationEngine';
import { AssetCurve } from '../../../../components/Common/Simulation/AssetCurve';
import { FlatBetStrategy, MartingaleStrategy, AlwaysTieStrategy, RandomStrategy, MartingaleRandomStrategy } from '../../logic/Strategies';
import styles from '../../../../components/Common/Simulation/Simulation.module.css';

type StrategyType = 'FLAT_PLAYER' | 'FLAT_BANKER' | 'MARTINGALE_PLAYER' | 'MARTINGALE_BANKER' | 'ALWAYS_TIE' | 'RANDOM' | 'MARTINGALE_RANDOM';

export const Simulation: React.FC = () => {
    const [rounds, setRounds] = useState<number | ''>(1000);
    const [baseBet, setBaseBet] = useState<number | ''>(100);
    const [strategyType, setStrategyType] = useState<StrategyType>('FLAT_PLAYER');
    const [result, setResult] = useState<SimulationResult | null>(null);
    const [loading, setLoading] = useState(false);

    const handleRun = async () => {
        setLoading(true);
        // Yield to UI thread
        setTimeout(() => {
            let strategy;
            // Default to 0 or some safe value if empty
            const currentBaseBet = baseBet === '' ? 100 : baseBet;
            const currentRounds = rounds === '' ? 1000 : rounds;

            switch (strategyType) {
                case 'FLAT_PLAYER':
                    strategy = new FlatBetStrategy(currentBaseBet, 'PLAYER');
                    break;
                case 'FLAT_BANKER':
                    strategy = new FlatBetStrategy(currentBaseBet, 'BANKER');
                    break;
                case 'MARTINGALE_PLAYER':
                    strategy = new MartingaleStrategy(currentBaseBet, 'PLAYER');
                    break;
                case 'MARTINGALE_BANKER':
                    strategy = new MartingaleStrategy(currentBaseBet, 'BANKER');
                    break;
                case 'ALWAYS_TIE':
                    strategy = new AlwaysTieStrategy(currentBaseBet);
                    break;
                case 'RANDOM':
                    strategy = new RandomStrategy(currentBaseBet);
                    break;
                case 'MARTINGALE_RANDOM':
                    strategy = new MartingaleRandomStrategy(currentBaseBet);
                    break;
                default:
                    strategy = new FlatBetStrategy(currentBaseBet, 'PLAYER');
            }

            const res = runSimulation(currentRounds, strategy);
            setResult(res);
            setLoading(false);
        }, 100);
    };

    return (
        <div className={styles.container}>
            <h2>批量模拟测试</h2>

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
                        <option value="FLAT_PLAYER">平注押闲 (Flat Player)</option>
                        <option value="FLAT_BANKER">平注押庄 (Flat Banker)</option>
                        <option value="MARTINGALE_PLAYER">倍投押闲 (Martingale Player)</option>
                        <option value="MARTINGALE_BANKER">倍投押庄 (Martingale Banker)</option>
                        <option value="MARTINGALE_RANDOM">倍投随机 (Martingale Random)</option>
                        <option value="ALWAYS_TIE">全程押和 (Always Tie)</option>
                        <option value="RANDOM">随机下注 (Random)</option>
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
                            <span className={styles.statLabel}>庄赢 (Banker)</span>
                            <span className={styles.statValue}>{result.bankerWins} ({((result.bankerWins / result.totalRounds) * 100).toFixed(2)}%)</span>
                        </div>
                        <div className={styles.statBox}>
                            <span className={styles.statLabel}>闲赢 (Player)</span>
                            <span className={styles.statValue}>{result.playerWins} ({((result.playerWins / result.totalRounds) * 100).toFixed(2)}%)</span>
                        </div>
                        <div className={styles.statBox}>
                            <span className={styles.statLabel}>和局 (Tie)</span>
                            <span className={styles.statValue}>{result.ties} ({((result.ties / result.totalRounds) * 100).toFixed(2)}%)</span>
                        </div>
                        <div className={styles.statBox}>
                            <span className={styles.statLabel}>最终余额</span>
                            <span className={`${styles.statValue} ${result.finalBalance >= 10000 ? styles.positive : styles.negative}`}>
                                ${result.finalBalance.toFixed(0)}
                            </span>
                        </div>
                        <div className={styles.statBox}>
                            <span className={styles.statLabel}>最高连赢</span>
                            <span className={styles.statValue}>{result.maxWinStreak}</span>
                        </div>
                        <div className={styles.statBox}>
                            <span className={styles.statLabel}>最高连输</span>
                            <span className={`${styles.statValue} ${styles.negative}`}>{result.maxLossStreak}</span>
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
