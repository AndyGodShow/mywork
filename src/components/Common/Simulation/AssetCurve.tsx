
import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine
} from 'recharts';
import styles from './AssetCurve.module.css';

interface AssetCurveProps {
    data: number[];
    startBalance: number;
}

export const AssetCurve: React.FC<AssetCurveProps> = ({ data, startBalance }) => {
    // Determine color based on final result vs start
    const final = data[data.length - 1];
    const isProfit = final >= startBalance;
    const strokeColor = isProfit ? '#2ecc71' : '#e74c3c';

    // Downsample data if too large for performance
    const chartData = React.useMemo(() => {
        if (data.length <= 2000) {
            return data.map((val, idx) => ({ round: idx, balance: val }));
        }

        // Simple downsampling: take every Nth point
        const step = Math.ceil(data.length / 2000);
        return data.filter((_, i) => i % step === 0).map((val, idx) => ({ round: idx * step, balance: val }));
    }, [data]);

    return (
        <div className={styles.chartContainer}>
            <h3>资金曲线 (Asset Curve)</h3>
            <div className={styles.wrapper}>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid stroke="#333" strokeDasharray="3 3" />
                        <XAxis
                            dataKey="round"
                            stroke="#666"
                            tick={{ fill: '#666' }}
                            tickFormatter={(val) => val === 0 ? 'Start' : val}
                        />
                        <YAxis
                            domain={['auto', 'auto']}
                            stroke="#666"
                            tick={{ fill: '#666' }}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#222', borderColor: '#444', color: '#fff' }}
                            itemStyle={{ color: '#fff' }}
                            labelStyle={{ color: '#aaa' }}
                        />
                        <ReferenceLine y={startBalance} stroke="#666" strokeDasharray="5 5" />
                        <Line
                            type="monotone"
                            dataKey="balance"
                            stroke={strokeColor}
                            strokeWidth={2}
                            dot={false}
                            animationDuration={500}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className={styles.legend}>
                <span style={{ color: '#2ecc71' }}>● 此线之上盈利</span>
                <span style={{ color: '#e74c3c', marginLeft: '20px' }}>● 此线之下亏损</span>
            </div>
        </div>
    );
};
