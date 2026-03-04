export const formatPercent = (value: number, total: number, digits: number = 2): string => {
    if (total <= 0) return (0).toFixed(digits);
    return ((value / total) * 100).toFixed(digits);
};
