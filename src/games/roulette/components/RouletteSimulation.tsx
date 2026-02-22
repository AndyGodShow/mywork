import React, { useState } from 'react';
import { runRouletteSimulation } from '../logic/RouletteSimulationEngine';
import type { RouletteSimulationResult } from '../logic/RouletteSimulationEngine';
import { AssetCurve } from '../../../components/Common/Simulation/AssetCurve';
import {
    FlatRedStrategy,
    MartingaleRedStrategy,
    RandomOutsideStrategy
} from '../logic/RouletteStrategies';
import styles from '../../../components/Common/Simulation/Simulation.module.css';

type StrategyType = 'FLAT_RED' | 'MARTINGALE_RED' | 'RANDOM_OUTSIDE';

export const RouletteSimulation: React.FC = () => {
    const [rounds, setRounds] = useState<number | ''>(1000);
    const [baseBet, setBaseBet] = useState<number | ''>(100);
    const [strategyType, setStrategyType] = useState<StrategyType>('FLAT_RED');
    const [result, setResult] = useState<RouletteSimulationResult | null>(null);
    const [loading, setLoading] = useState(false);

    const handleRun = async () => {
        setLoading(true);
        setTimeout(() => {
            let strategy;
            const currentBaseBet = baseBet === '' ? 100 : baseBet;
            const currentRounds = rounds === '' ? 1000 : rounds;

            switch (strategyType) {
                case 'FLAT_RED':
                    strategy = new FlatRedStrategy(currentBaseBet);
                    break;
                case 'MARTINGALE_RED':
                    strategy = new MartingaleRedStrategy(currentBaseBet);
                    break;
                case 'RANDOM_OUTSIDE':
                    strategy = new RandomOutsideStrategy(currentBaseBet);
                    break;
                default:
                    strategy = new FlatRedStrategy(currentBaseBet);
            }

            const res = runRouletteSimulation(currentRounds, strategy);
            setResult(res);
            setLoading(false);
        }, 100);
    };

    return (
        <div className={styles.container}>
            <h2>轮盘批量模拟测试</h2>

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
                        <option value="FLAT_RED">平注押红 (Flat Red)</option>
                        <option value="MARTINGALE_RED">倍投押红 (Martingale Red)</option>
                        <option value="RANDOM_OUTSIDE">随机外围注 (Random Outside)</option>
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
                            <span className={styles.statLabel}>赢 (Win)</span>
                            <span className={styles.statValue}>{result.wins} ({((result.wins / result.totalRounds) * 100).toFixed(2)}%)</span>
                        </div>
                        <div className={styles.statBox}>
                            <span className={styles.statLabel}>输 (Loss)</span>
                            <span className={styles.statValue}>{result.losses} ({((result.losses / result.totalRounds) * 100).toFixed(2)}%)</span>
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
                        <div className={styles.statBox}>
                            <span className={styles.statLabel}>收益率</span>
                            <span className={`${styles.statValue} ${result.finalBalance >= 10000 ? styles.positive : styles.negative}`}>
                                {((result.finalBalance - 10000) / 10000 * 100).toFixed(2)}%
                            </span>
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
