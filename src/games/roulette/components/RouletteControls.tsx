import React from 'react';
import { RoulettePhase } from '../types';
import styles from './RouletteControls.module.css';

interface RouletteControlsProps {
    phase: RoulettePhase;
    balance: number;
    totalBet: number;
    history: number[];
    selectedChip: number;
    onSelectChip: (amount: number) => void;
    onSpin: () => void;
    onClear: () => void;
    onReset: () => void;
    onResetBalance?: () => void;
}

export const RouletteControls: React.FC<RouletteControlsProps> = ({
    phase,
    balance,
    totalBet,
    history,
    selectedChip,
    onSelectChip,
    onSpin,
    onClear,
    onReset,
    onResetBalance,
}) => {
    const [customAmount, setCustomAmount] = React.useState<string>('');

    const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        // Allow empty string to clear input
        if (val === '') {
            setCustomAmount('');
            return;
        }

        if (/^\d*$/.test(val)) {
            setCustomAmount(val);
            const num = parseInt(val, 10);
            if (!isNaN(num) && num > 0) {
                onSelectChip(num);
            }
        }
    };

    return (
        <div className={styles.controlsContainer}>
            <div className={styles.statsRow}>
                <div className={styles.stat}>
                    余额: <span>${balance.toLocaleString()}</span>
                    {onResetBalance && (
                        <button
                            className={styles.resetBalanceBtn}
                            onClick={onResetBalance}
                            title="重置余额"
                        >
                            ↺
                        </button>
                    )}
                </div>
                <div className={styles.stat}>当前注额: <span>${totalBet.toLocaleString()}</span></div>
                <div className={styles.history}>
                    历史: {history.map((num, i) => (
                        <span key={i} className={styles.histNum}>{num}</span>
                    ))}
                </div>
            </div>

            <div className={styles.actionRow}>
                {phase === RoulettePhase.Betting && (
                    <>
                        <div className={styles.chipsRow}>
                            <div className={styles.presetChips}>
                                {[10, 50, 100, 500, 1000].map(amt => (
                                    <button
                                        key={amt}
                                        className={`${styles.chip} ${selectedChip === amt ? styles.selectedChip : ''}`}
                                        onClick={() => {
                                            onSelectChip(amt);
                                            setCustomAmount('');
                                        }}
                                    >
                                        {amt}
                                    </button>
                                ))}
                            </div>
                            <div className={styles.customChipInputWrapper}>
                                <span className={styles.currencySymbol}>$</span>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="自定义"
                                    value={customAmount}
                                    onChange={handleCustomChange}
                                    className={`${styles.chipInput} ${!([10, 50, 100, 500, 1000].includes(selectedChip)) && selectedChip > 0 ? styles.activeInput : ''}`}
                                />
                            </div>
                        </div>
                        <div className={styles.mainButtons}>
                            <button
                                className={styles.clearBtn}
                                onClick={onClear}
                                disabled={totalBet === 0}
                            >
                                清空下注
                            </button>
                            <button
                                className={styles.spinBtn}
                                onClick={onSpin}
                                disabled={totalBet === 0}
                            >
                                开始支付 / 旋转
                            </button>
                        </div>
                    </>
                )}

                {phase === RoulettePhase.Result && (
                    <button className={styles.resetBtn} onClick={onReset}>继续下注</button>
                )}
            </div>
        </div>
    );
};
