import React from 'react';
import styles from '../../baccarat/components/RulesModal/RulesModal.module.css';

interface RouletteRulesModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const RouletteRulesModal: React.FC<RouletteRulesModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onClose}>×</button>
                <h2>游戏指南 & 规则</h2>

                <div className={styles.content}>
                    <section>
                        <h3>🎡 轮盘简介</h3>
                        <p>本游戏使用<strong>欧洲轮盘</strong>，共 37 个号码（0 - 36）。球在旋转的轮盘中滚动，最终落入一个格子，决定中奖号码。</p>
                        <ul>
                            <li><strong>红色 (RED)：</strong>18 个红色号码</li>
                            <li><strong>黑色 (BLACK)：</strong>18 个黑色号码</li>
                            <li><strong>绿色 0：</strong>1 个绿色号码（这就是赌场优势的来源）</li>
                        </ul>
                    </section>

                    <section>
                        <h3>🎮 下注类型与中英文对照</h3>
                        <table className={styles.payoutTable}>
                            <thead>
                                <tr>
                                    <th>下注类型</th>
                                    <th>中文说明</th>
                                    <th>赔率</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className={styles.blue}>Straight (直注)</td>
                                    <td>押单个号码</td>
                                    <td>35 : 1</td>
                                </tr>
                                <tr>
                                    <td className={styles.red}>RED / BLACK</td>
                                    <td>押红色 / 黑色</td>
                                    <td>1 : 1</td>
                                </tr>
                                <tr>
                                    <td>EVEN / ODD</td>
                                    <td>押双数 / 单数</td>
                                    <td>1 : 1</td>
                                </tr>
                                <tr>
                                    <td>1-18 / 19-36</td>
                                    <td>押低位 / 高位</td>
                                    <td>1 : 1</td>
                                </tr>
                                <tr>
                                    <td>1st 12 / 2nd 12 / 3rd 12</td>
                                    <td>押第一打(1-12) / 第二打(13-24) / 第三打(25-36)</td>
                                    <td>2 : 1</td>
                                </tr>
                                <tr>
                                    <td>2 to 1 (列注)</td>
                                    <td>押一整列（从上到下的竖列）</td>
                                    <td>2 : 1</td>
                                </tr>
                                <tr>
                                    <td className={styles.green}>街注 (Street)</td>
                                    <td>押一横排3个号码（如 1-2-3）</td>
                                    <td>11 : 1</td>
                                </tr>
                                <tr>
                                    <td className={styles.green}>线注 (Line)</td>
                                    <td>押两横排6个号码（如 1-6）</td>
                                    <td>5 : 1</td>
                                </tr>
                            </tbody>
                        </table>
                    </section>

                    <section>
                        <h3>🎲 游戏流程</h3>
                        <ol>
                            <li><strong>选择筹码：</strong>在底部选择筹码面额。</li>
                            <li><strong>点击下注：</strong>在赌桌上点击想要投注的区域，可以在多个位置下注。</li>
                            <li><strong>旋转 (SPIN)：</strong>确认下注后，点击旋转按钮。</li>
                            <li><strong>结算：</strong>球停下后自动结算，赢的注自动到账。</li>
                        </ol>
                    </section>

                    <section>
                        <h3>⚠️ 关于赌场优势</h3>
                        <p>因为有绿色的 <strong>0</strong> 存在，所有下注的实际概率都略低于赔率暗示的概率：</p>
                        <ul>
                            <li>押红色的胜率：<strong>18/37 = 48.6%</strong>（不是 50%）</li>
                            <li>欧洲轮盘赌场优势：<strong>2.7%</strong></li>
                            <li>意味着每投注 100 元，长期平均损失 2.7 元</li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
};
