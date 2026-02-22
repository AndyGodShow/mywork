// ===== 三公规则弹窗 =====
import React from 'react';

interface Props { isOpen: boolean; onClose: () => void; }

export const SGRulesModal: React.FC<Props> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={onClose}>
            <div style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)', borderRadius: 20, padding: '30px 35px', maxWidth: 600, maxHeight: '80vh', overflowY: 'auto', border: '1px solid rgba(230,81,0,0.3)', color: '#ddd', lineHeight: 1.7 }} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h2 style={{ color: '#fff', margin: 0 }}>🃏 三公规则</h2>
                    <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#aaa', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                </div>
                <h3 style={{ color: '#ff8f00' }}>游戏简介</h3>
                <p>三公是流行于广东、福建一带的传统纸牌游戏。庄闲各发 3 张牌，比较大小。</p>
                <h3 style={{ color: '#ff8f00' }}>手牌大小</h3>
                <ul style={{ paddingLeft: 20 }}>
                    <li><strong>三公</strong>：三张都是 J/Q/K，最大手牌</li>
                    <li><strong>9 点</strong>：三张牌点数之和取个位为 9</li>
                    <li>以此类推...7、6、5、4、3、2、1 点</li>
                    <li><strong>鳖十（0 点）</strong>：最小手牌</li>
                </ul>
                <h3 style={{ color: '#ff8f00' }}>点数计算</h3>
                <p>A = 1点，2-9 = 面值，10/J/Q/K = 0点。三张牌的点数之和取个位数即为手牌点数。</p>
                <h3 style={{ color: '#ff8f00' }}>下注与赔率</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 15, fontSize: '0.9rem' }}>
                    <thead><tr style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                        <th style={{ textAlign: 'left', padding: 8, color: '#aaa' }}>下注</th>
                        <th style={{ textAlign: 'center', padding: 8, color: '#ffd700' }}>赔率</th>
                    </tr></thead>
                    <tbody>
                        {[['闲赢', '1:1'], ['庄赢', '0.95:1（抽佣5%）'], ['和局', '8:1']].map(([t, o], i) => (
                            <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: 8, fontWeight: 'bold' }}>{t}</td>
                                <td style={{ padding: 8, textAlign: 'center', color: '#ffd700' }}>{o}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div style={{ background: 'rgba(230,81,0,0.1)', borderRadius: 10, padding: 15, border: '1px solid rgba(230,81,0,0.3)' }}>
                    <strong>💡 教育提示：</strong>三公比百家乐更简单，核心在于三张牌的点数取个位。三公（三张公牌）是极罕见的最强手牌。
                </div>
            </div>
        </div>
    );
};
