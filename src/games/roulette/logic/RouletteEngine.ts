import type { RouletteBet } from '../types';


export const getNumberInfo = (num: number) => {
    if (num === 0) return { color: 'green', isEven: false, isLow: false, dozen: 0, column: 0 };

    const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    const color = redNumbers.includes(num) ? 'red' : 'black';
    const isEven = num % 2 === 0;
    const isLow = num <= 18;
    const dozen = Math.ceil(num / 12);
    const column = ((num - 1) % 3) + 1;

    return { color, isEven, isLow, dozen, column };
};

export const calculateRoulettePayout = (bet: RouletteBet, resultNum: number): number => {
    const info = getNumberInfo(resultNum);

    switch (bet.type) {
        case 'straight':
            return bet.value === resultNum ? bet.amount * 36 : 0;
        case 'split': {
            // bet.value stores the encoded pair: [num1, num2] as num1 * 100 + num2
            const nums = decodeBetNumbers(bet.value);
            return nums.includes(resultNum) ? bet.amount * 18 : 0;
        }
        case 'street': {
            // bet.value stores the starting number of the row (1, 4, 7, etc.)
            const start = bet.value ?? 1;
            const nums = [start, start + 1, start + 2];
            return nums.includes(resultNum) ? bet.amount * 12 : 0;
        }
        case 'corner': {
            // bet.value encodes 4 numbers
            const nums = decodeBetNumbers(bet.value);
            return nums.includes(resultNum) ? bet.amount * 9 : 0;
        }
        case 'line': {
            // bet.value stores starting number of first row
            const start = bet.value ?? 1;
            const nums = [start, start + 1, start + 2, start + 3, start + 4, start + 5];
            return nums.includes(resultNum) ? bet.amount * 6 : 0;
        }
        case 'red':
            return info.color === 'red' ? bet.amount * 2 : 0;
        case 'black':
            return info.color === 'black' ? bet.amount * 2 : 0;
        case 'even':
            return resultNum !== 0 && info.isEven ? bet.amount * 2 : 0;
        case 'odd':
            return resultNum !== 0 && !info.isEven ? bet.amount * 2 : 0;
        case 'low':
            return resultNum !== 0 && info.isLow ? bet.amount * 2 : 0;
        case 'high':
            return resultNum !== 0 && !info.isLow ? bet.amount * 2 : 0;
        case 'dozen1':
            return info.dozen === 1 ? bet.amount * 3 : 0;
        case 'dozen2':
            return info.dozen === 2 ? bet.amount * 3 : 0;
        case 'dozen3':
            return info.dozen === 3 ? bet.amount * 3 : 0;
        case 'column1':
            return info.column === 1 ? bet.amount * 3 : 0;
        case 'column2':
            return info.column === 2 ? bet.amount * 3 : 0;
        case 'column3':
            return info.column === 3 ? bet.amount * 3 : 0;
        default:
            return 0;
    }
};

/**
 * 解码投注涉及的数字
 * 对于分牌 (Split): value = num1 * 100 + num2
 * 对于角注 (Corner): value 是左上角的数字，覆盖 [n, n+1, n+3, n+4]
 */
const decodeBetNumbers = (value: number | undefined): number[] => {
    if (value === undefined) return [];

    // 分牌投注：编码为 num1 * 100 + num2
    if (value >= 100) {
        const num1 = Math.floor(value / 100);
        const num2 = value % 100;
        return [num1, num2];
    }

    // 角注投注：value 是左上角的数字
    // 在标准 3 列布局中，角注覆盖 [n, n+1, n+3, n+4]
    // 边界检查：n 不能在第 3 列 (n % 3 === 0)，也不能在最后一行 (n > 33)
    if (value % 3 === 0 || value > 33) {
        // 理论上 UI 不应允许此类点击，但后端需保持健壮
        // 如果是非法位置，尝试只返回自身或空，防止错误赔付扩展到无关数字
        return [value];
    }

    return [value, value + 1, value + 3, value + 4];
};


