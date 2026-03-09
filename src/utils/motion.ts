const SPEED_FACTOR = 0.68;

const scaled = (baseMs: number, minMs: number) => Math.max(minMs, Math.round(baseMs * SPEED_FACTOR));

export const APP_PRELOAD_DELAY_MS = scaled(1200, 280);

export const DEAL_STEP_MS = scaled(800, 220);
export const REVEAL_ROUND_MS = scaled(1500, 420);
export const SICBO_ROLL_MS = scaled(2000, 700);
export const CRAPS_ROLL_MS = scaled(1200, 480);

export const ROULETTE_SPIN_MS = scaled(4200, 1800);
export const ROULETTE_WHEEL_TRANSITION_MS = scaled(4000, 1600);
export const ROULETTE_RESULT_HOLD_MS = scaled(2000, 700);
export const ROULETTE_CLOSE_MS = scaled(500, 180);

export const SLOT_SPIN_MS = scaled(2400, 1000);
export const SLOT_AUTO_RETURN_MS = scaled(2200, 900);
export const SLOT_REEL_TICK_MS = scaled(80, 40);
export const SLOT_REEL_BASE_STOP_MS = scaled(800, 320);
export const SLOT_REEL_STEP_STOP_MS = scaled(400, 140);
export const SLOT_REEL_BOUNCE_MS = scaled(300, 140);
export const SLOT_COUNT_UP_MS = scaled(1500, 550);
