// ===== 龙虎斗模拟面板（对标百家乐标准） =====

import React, { useState } from 'react';
import { ALL_DT_STRATEGIES } from '../logic/DragonTigerStrategies';
import { runDragonTigerSimulation } from '../logic/DragonTigerSimulationEngine';
import type { DTSimulationResult } from '../logic/DragonTigerSimulationEngine';
import { AssetCurve } from '../../../components/Common/Simulation/AssetCurve';
import { formatPercent } from '../../../components/Common/Simulation/stats';
import { waitForNextFrame } from '../../../utils/deferToNextFrame';
import styles from '../../../components/Common/Simulation/Simulation.module.css';

export const DTSimulation: React.FC = () => {
    const [si, setSi] = useState(0);
    const [rounds, setRounds] = useState<number | ''>(1000);
    const [baseBet, setBaseBet] = useState<number | ''>(100);
    const [mart, setMart] = useState(false);
    const [result, setResult] = useState<DTSimulationResult | null>(null);
    const [loading, setLoading] = useState(false);

    const handleRun = async () => {
        setLoading(true);
        const currentRounds = rounds === '' ? 1000 : rounds;
        const currentBaseBet = baseBet === '' ? 100 : baseBet;
        await waitForNextFrame();
        setResult(runDragonTigerSimulation({
            rounds: currentRounds,
            initialBalance: 10000,
            bets: ALL_DT_STRATEGIES[si].getBets(currentBaseBet),
            useMartingale: mart,
        }));
        setLoading(false);
    };

    return (
        <div className={styles.container}>
            <h2>批量模拟测试</h2>

            <div className={styles.config}>
                <div className={styles.field}>
                    <label>下注策略:</label>
                    <select value={si} onChange={e => setSi(Number(e.target.value))}>
                        {ALL_DT_STRATEGIES.map((s, i) => (
                            <option key={i} value={i}>{s.name}</option>
                        ))}
                    </select>
                </div>

                <div className={styles.field}>
                    <label>模拟局数:</label>
                    <input
                        type="number"
                        value={rounds}
                        onChange={e => setRounds(e.target.value === '' ? '' : Number(e.target.value))}
                        min="10"
                        max="100000"
                    />
                </div>

                <div className={styles.field}>
                    <label>初始注码:</label>
                    <input
                        type="number"
                        value={baseBet}
                        onChange={e => setBaseBet(e.target.value === '' ? '' : Number(e.target.value))}
                        min="1"
                        max="10000"
                    />
                </div>

                <div className={styles.field}>
                    <label>加注策略:</label>
                    <select value={mart ? 'martingale' : 'flat'} onChange={e => setMart(e.target.value === 'martingale')}>
                        <option value="flat">平注 (Flat Bet)</option>
                        <option value="martingale">马丁格尔 (Martingale)</option>
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
                            <span className={styles.statLabel}>龙赢 (Dragon)</span>
                            <span className={styles.statValue}>
                                {result.resultDistribution.dragon} ({formatPercent(result.resultDistribution.dragon, result.totalRounds)}%)
                            </span>
                        </div>
                        <div className={styles.statBox}>
                            <span className={styles.statLabel}>虎赢 (Tiger)</span>
                            <span className={styles.statValue}>
                                {result.resultDistribution.tiger} ({formatPercent(result.resultDistribution.tiger, result.totalRounds)}%)
                            </span>
                        </div>
                        <div className={styles.statBox}>
                            <span className={styles.statLabel}>和局 (Tie)</span>
                            <span className={styles.statValue}>
                                {result.resultDistribution.tie} ({formatPercent(result.resultDistribution.tie, result.totalRounds)}%)
                            </span>
                        </div>
                        <div className={styles.statBox}>
                            <span className={styles.statLabel}>最终余额</span>
                            <span className={`${styles.statValue} ${result.netProfit >= 0 ? styles.positive : styles.negative}`}>
                                ${(10000 + result.netProfit).toFixed(0)}
                            </span>
                        </div>
                        <div className={styles.statBox}>
                            <span className={styles.statLabel}>最高连赢</span>
                            <span className={styles.statValue}>{result.maxConsecutiveWins}</span>
                        </div>
                        <div className={styles.statBox}>
                            <span className={styles.statLabel}>最高连输</span>
                            <span className={`${styles.statValue} ${styles.negative}`}>{result.maxConsecutiveLosses}</span>
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
