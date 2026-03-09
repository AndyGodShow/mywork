import React from 'react';
import './Lobby.css';

interface GameInfo {
    id: string;
    name: string;
    description: string;
    icon: string;
    status: 'active' | 'coming_soon';
    color: string;
}

interface LobbyProps {
    onSelectGame: (gameId: string) => void;
    onPreviewGame?: (gameId: string) => void;
    pendingGameId?: string | null;
}

const GAMES: GameInfo[] = [
    {
        id: 'baccarat',
        name: '百家乐',
        description: '经典的赌场游戏，模拟庄闲博弈与路单分析。',
        icon: '🎴',
        status: 'active',
        color: '#1a4e8a'
    },
    {
        id: 'blackjack',
        name: '二十一点',
        description: '策略性极强的扑克游戏，学习基本策略与算牌原理（开发中）。',
        icon: '🃏',
        status: 'active',
        color: '#2e7d32'
    },
    {
        id: 'roulette',
        name: '轮盘',
        description: '概率与运气的极致体现，探索多样化的下注组合。',
        icon: '🎡',
        status: 'active',
        color: '#c62828'
    },
    {
        id: 'slots',
        name: '老虎机',
        description: '经典 5 卷轴老虎机，理解 RTP、符号权重与赌场优势。',
        icon: '🎰',
        status: 'active',
        color: '#b8860b'
    },
    {
        id: 'sicbo',
        name: '骰宝',
        description: '传统中式骰子游戏，探索三颗骰子的概率与赔率体系。',
        icon: '🎲',
        status: 'active',
        color: '#8e24aa'
    },
    {
        id: 'dragontiger',
        name: '龙虎斗',
        description: '最简赌场游戏，龙虎各发一张牌比大小。',
        icon: '🐉',
        status: 'active',
        color: '#00695c'
    },
    {
        id: 'sangong',
        name: '三公',
        description: '传统中式纸牌游戏，三张牌比点数大小。',
        icon: '🃏',
        status: 'active',
        color: '#e65100'
    },
    {
        id: 'craps',
        name: '花旗骰',
        description: '西方经典骰子游戏，两阶段机制与最低赌场优势。',
        icon: '🎲',
        status: 'active',
        color: '#1b5e20'
    }
];

export const Lobby: React.FC<LobbyProps> = ({ onSelectGame, onPreviewGame, pendingGameId = null }) => {
    const handlePreview = (gameId: string, status: GameInfo['status']) => {
        if (status !== 'active' || !onPreviewGame) return;
        onPreviewGame(gameId);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, gameId: string, status: GameInfo['status']) => {
        if (status !== 'active') return;
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onSelectGame(gameId);
        }
    };

    return (
        <div className="lobby-container">
            <div className="lobby-header">
                <h1>赌场教育模拟器</h1>
                <p>探索各种赌场游戏的数学原理与策略</p>
            </div>

            <div className="games-grid">
                {GAMES.map((game) => (
                    <div
                        key={game.id}
                        className={`game-card ${game.status}`}
                        onClick={() => game.status === 'active' && onSelectGame(game.id)}
                        onMouseEnter={() => handlePreview(game.id, game.status)}
                        onFocus={() => handlePreview(game.id, game.status)}
                        onTouchStart={() => handlePreview(game.id, game.status)}
                        onKeyDown={(event) => handleKeyDown(event, game.id, game.status)}
                        role={game.status === 'active' ? 'button' : undefined}
                        tabIndex={game.status === 'active' ? 0 : -1}
                        aria-busy={pendingGameId === game.id}
                        style={{ '--theme-color': game.color } as React.CSSProperties}
                    >
                        <div className="game-icon">{game.icon}</div>
                        <div className="game-info">
                            <h3>{game.name}</h3>
                            <p>{game.description}</p>
                            {game.status === 'coming_soon' && (
                                <span className="status-badge">即将推出</span>
                            )}
                        </div>
                        {game.status === 'active' && (
                            <div className="play-overlay">{pendingGameId === game.id ? '正在进入...' : '开始学习'}</div>
                        )}
                    </div>
                ))}
            </div>

            <div className="lobby-footer">
                <p>💡 本模拟器仅用于数学教育与概率研究，严禁用于任何形式的非法赌博。</p>
            </div>
        </div>
    );
};
