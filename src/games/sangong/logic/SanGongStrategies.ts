// ===== 三公策略 =====
import type { SanGongBet } from '../types';

interface SGStrategy {
    name: string;
    description: string;
    getBets: (baseBet: number) => SanGongBet[];
}

export const ALL_SG_STRATEGIES: SGStrategy[] = [
    { name: '固定押闲', description: '每轮押闲赢，赔率 1:1', getBets: (b) => [{ type: 'player_wins', amount: b }] },
    { name: '固定押庄', description: '每轮押庄赢，赔率 0.95:1（抽佣5%）', getBets: (b) => [{ type: 'banker_wins', amount: b }] },
    { name: '固定押和', description: '每轮押和局，赔率 8:1，赌场优势极高', getBets: (b) => [{ type: 'tie', amount: b }] },
    { name: '庄闲交替', description: '随机押庄或闲', getBets: (b) => [{ type: Math.random() > 0.5 ? 'player_wins' : 'banker_wins', amount: b }] },
];
