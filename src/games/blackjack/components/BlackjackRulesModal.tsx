import React from 'react';
import styles from '../../baccarat/components/RulesModal/RulesModal.module.css';

interface BlackjackRulesModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const BlackjackRulesModal: React.FC<BlackjackRulesModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onClose}>×</button>
                <h2>游戏指南 & 规则</h2>

                <div className={styles.content}>
                    <section>
                        <h3>🎴 点数计算</h3>
                        <p>二十一点中，牌的点数计算如下：</p>
                        <ul>
                            <li><strong>A:</strong> 1 点 或 11 点（自动取对玩家最有利的值）</li>
                            <li><strong>2 - 10:</strong> 牌面点数</li>
                            <li><strong>J, Q, K:</strong> 10 点</li>
                        </ul>
                        <p><strong>目标：</strong>手牌点数尽可能接近 21 点，但不能超过 21 点（爆牌/Bust）。</p>
                    </section>

                    <section>
                        <h3>🎮 游戏流程</h3>
                        <ol>
                            <li><strong>下注 (Bet)：</strong>选择筹码金额进行下注。</li>
                            <li><strong>发牌 (Deal)：</strong>玩家和庄家各发两张牌，庄家一张明牌一张暗牌。</li>
                            <li><strong>玩家操作：</strong>
                                <ul>
                                    <li><strong>要牌 (Hit)：</strong>再拿一张牌</li>
                                    <li><strong>停牌 (Stand)：</strong>不再拿牌</li>
                                    <li><strong>加倍 (Double Down)：</strong>加倍注码，只拿一张牌后自动停牌</li>
                                </ul>
                            </li>
                            <li><strong>庄家操作：</strong>庄家翻开暗牌，16 点及以下必须要牌，17 点及以上必须停牌 (S17)。</li>
                            <li><strong>结算：</strong>比较双方点数，更接近 21 点的一方获胜。</li>
                        </ol>
                    </section>

                    <section>
                        <h3>📜 特殊规则</h3>
                        <div className={styles.ruleGrid}>
                            <div className={styles.ruleBox}>
                                <h4>Blackjack (黑杰克)</h4>
                                <ul>
                                    <li>前两张牌恰好为 <strong>A + 10/J/Q/K</strong></li>
                                    <li>直接获胜，赔率 <strong>3:2</strong></li>
                                    <li>买 100 赢 <strong>150</strong></li>
                                </ul>
                            </div>
                            <div className={styles.ruleBox}>
                                <h4>爆牌 (Bust)</h4>
                                <ul>
                                    <li>手牌点数 <strong>超过 21 点</strong></li>
                                    <li>无论庄家点数如何，<strong>立刻输</strong></li>
                                    <li>因此要牌前须谨慎考虑爆牌风险</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h3>💰 赔率表</h3>
                        <table className={styles.payoutTable}>
                            <thead>
                                <tr>
                                    <th>结果</th>
                                    <th>赔率</th>
                                    <th>说明</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className={styles.green}>Blackjack</td>
                                    <td>3 : 2</td>
                                    <td>前两张牌为 A + 10点牌</td>
                                </tr>
                                <tr>
                                    <td className={styles.blue}>普通赢</td>
                                    <td>1 : 1</td>
                                    <td>点数比庄家高且未爆牌</td>
                                </tr>
                                <tr>
                                    <td>平局 (Push)</td>
                                    <td>退还本金</td>
                                    <td>双方点数相同</td>
                                </tr>
                                <tr>
                                    <td className={styles.red}>输</td>
                                    <td>失去注码</td>
                                    <td>爆牌或点数低于庄家</td>
                                </tr>
                            </tbody>
                        </table>
                    </section>

                    <section>
                        <h3>💡 基本策略提示</h3>
                        <p>游戏中会显示 <strong>💡 数学建议</strong>，这是根据基本策略表给出的最优操作。遵循基本策略可以将赌场优势降到约 <strong>0.5%</strong>。</p>
                        <ul>
                            <li><strong>Hit (要牌)：</strong>当你的点数较低，爆牌风险小时</li>
                            <li><strong>Stand (停牌)：</strong>当你的点数足够高，或庄家容易爆牌时</li>
                            <li><strong>Double (加倍)：</strong>当你有优势时（如 11 点对庄家弱牌）</li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
};
