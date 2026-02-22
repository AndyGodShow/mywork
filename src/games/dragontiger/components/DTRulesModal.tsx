// ===== 龙虎斗规则弹窗 =====
import React from 'react';

interface Props { isOpen: boolean; onClose: () => void; }

export const DTRulesModal: React.FC<Props> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={onClose}>
            <div style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)', borderRadius: 20, padding: '30px 35px', maxWidth: 600, maxHeight: '80vh', overflowY: 'auto', border: '1px solid rgba(255,215,0,0.2)', color: '#ddd', lineHeight: 1.7 }} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h2 style={{ color: '#fff', margin: 0 }}>🐉 龙虎斗规则</h2>
                    <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#aaa', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                </div>
                <h3 style={{ color: '#64b5f6' }}>游戏简介</h3>
                <p>龙虎斗是亚洲赌场中最简单、最快速的游戏。龙和虎各发一张牌，比大小即出结果。</p>
                <h3 style={{ color: '#64b5f6' }}>牌面大小</h3>
                <p>K &gt; Q &gt; J &gt; 10 &gt; 9 &gt; 8 &gt; 7 &gt; 6 &gt; 5 &gt; 4 &gt; 3 &gt; 2 &gt; A</p>
                <h3 style={{ color: '#64b5f6' }}>下注与赔率</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 15, fontSize: '0.9rem' }}>
                    <thead><tr style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                        <th style={{ textAlign: 'left', padding: 8, color: '#aaa' }}>下注</th>
                        <th style={{ textAlign: 'center', padding: 8, color: '#ffd700' }}>赔率</th>
                        <th style={{ textAlign: 'center', padding: 8, color: '#aaa' }}>赌场优势</th>
                    </tr></thead>
                    <tbody>
                        {[['龙/虎', '1:1', '3.73%'], ['和', '8:1', '32.77%']].map(([t, o, e], i) => (
                            <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: 8, fontWeight: 'bold' }}>{t}</td>
                                <td style={{ padding: 8, textAlign: 'center', color: '#ffd700' }}>{o}</td>
                                <td style={{ padding: 8, textAlign: 'center' }}>{e}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div style={{ background: 'rgba(33,150,243,0.1)', borderRadius: 10, padding: 15, border: '1px solid rgba(33,150,243,0.3)' }}>
                    <strong>💡 教育提示：</strong>和局时押龙/虎退回一半赌注（而非全输），这使赌场优势降低到 3.73%。但押和的赌场优势高达 32.77%，是最差的下注之一。
                </div>
            </div>
        </div>
    );
};
