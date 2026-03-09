export const waitForNextFrame = () =>
    new Promise<void>((resolve) => {
        if (typeof window === 'undefined' || typeof window.requestAnimationFrame !== 'function') {
            setTimeout(resolve, 0);
            return;
        }

        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => resolve());
        });
    });
