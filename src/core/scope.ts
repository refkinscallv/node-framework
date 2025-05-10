/**
 * packages
 */
import FWCommon from '@core/common';
import FWHooks from '@core/hooks';

/** =======================
 *  Set timezone globally
 *  ======================= */
process.env.TZ = FWCommon.env<string>('APP_TIMEZONE', 'UTC');

/** =======================
 *  Define env check helper
 *  ======================= */
const isDev = (): boolean => {
    const env = FWCommon.env<string>('APP_ENV', 'production')?.toLowerCase();
    return ['development', 'develop', 'dev'].includes(env);
};

/** =======================
 *  Logging Override
 *  ======================= */
const originalError = console.error;
const originalWarn = console.warn;

console.error = (...args: any[]) => {
    if (isDev()) {
        originalError(...args);
    }
};

console.warn = (...args: any[]) => {
    if (isDev()) {
        originalWarn(...args);
    }
};

/** =======================
 *  Process Event Handlers
 *  ======================= */
process.on('unhandledRejection', (reason, promise) => {
    if (isDev()) {
        console.error(`[SCOPE] Unhandled Rejection: ${reason}`);
    }
});

process.on('uncaughtException', (error: Error) => {
    if (isDev()) {
        console.error(`[SCOPE] Unhandled Exception: ${error}`);
    }
    process.exit(1);
});

process.on('warning', (warning) => {
    if (isDev()) {
        console.warn(`[SCOPE] Process Warning: ${warning}`);
    }
});

process.on('rejectionHandled', (promise) => {
    if (isDev()) {
        console.error(`[SCOPE] Rejection Handled Late: ${promise}`);
    }
});

process.on('SIGINT', async () => {
    await FWHooks.shutdown();
    console.log(`[SCOPE] Process terminated (SIGINT)`);
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log(`[SCOPE] Process terminated (SIGTERM)`);
    process.exit(0);
});

process.on('beforeExit', (code) => {
    console.log(`[SCOPE] Process before exit with code: ${code}`);
});

process.on('exit', (code) => {
    console.log(`[SCOPE] Process exited with code: ${code}`);
});
