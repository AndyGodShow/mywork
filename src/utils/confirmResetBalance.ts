interface ConfirmResetBalanceOptions {
    pendingStake?: number;
    inProgress?: boolean;
}

export const buildResetBalanceMessage = ({
    pendingStake = 0,
    inProgress = false,
}: ConfirmResetBalanceOptions = {}) => {
    const details: string[] = ['这会将余额重置为初始值'];

    if (pendingStake > 0) {
        details.push(`清空当前下注 $${pendingStake.toLocaleString()}`);
    } else {
        details.push('清空当前局面');
    }

    if (inProgress) {
        details.push('中止当前动画或结算');
    }

    return `${details.join('，')}。是否继续？`;
};

export const confirmResetBalance = (options: ConfirmResetBalanceOptions = {}) => {
    if (typeof window === 'undefined') return true;
    return window.confirm(buildResetBalanceMessage(options));
};
