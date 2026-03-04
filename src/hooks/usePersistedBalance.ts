// ===== 通用余额持久化 Hook =====

import { useState, useCallback, useEffect, useRef } from 'react';

const STORAGE_PREFIX = 'casino_sim_';

/**
 * 与 useState 行为相同，但值会自动同步到 localStorage。
 * 页面刷新后自动恢复上一次的余额。
 */
export const usePersistedBalance = (gameKey: string, defaultValue: number) => {
    const storageKey = `${STORAGE_PREFIX}${gameKey}_balance`;
    const skipNextPersistRef = useRef(false);

    const [balance, setBalance] = useState<number>(() => {
        try {
            const stored = localStorage.getItem(storageKey);
            if (stored !== null) {
                const parsed = Number(stored);
                if (!isNaN(parsed) && parsed >= 0) return parsed;
            }
        } catch {
            // localStorage 不可用时使用默认值
        }
        return defaultValue;
    });

    // 余额变化时自动保存
    useEffect(() => {
        if (skipNextPersistRef.current) {
            skipNextPersistRef.current = false;
            return;
        }
        try {
            localStorage.setItem(storageKey, String(balance));
        } catch {
            // 静默处理写入失败
        }
    }, [balance, storageKey]);

    // 重置余额时清除存储
    const resetBalance = useCallback(() => {
        skipNextPersistRef.current = true;
        setBalance(defaultValue);
        try {
            localStorage.removeItem(storageKey);
        } catch {
            // ignore
        }
    }, [defaultValue, storageKey]);

    return { balance, setBalance, resetBalance };
};
