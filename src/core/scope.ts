'use strict';

/**
 * @module node-framework
 * @description Lightweight modular TypeScript framework based on Express.js, TypeORM, Socket.IO
 * @author Refkinscallv
 * @repository https://github.com/refkinscallv/node-framework
 * @version 3.1.0
 * @date 2025
 */

import Common from '@core/common';
import Hooks from '@core/hooks';

/** Set global timezone */
process.env.TZ = Common.env<string>('APP_TIMEZONE', 'UTC');

/** Helper: check if current env is development */
const isDev = (): boolean => {
    return ['development', 'develop', 'dev'].includes(
        Common.env<string>('APP_ENV', 'production').toLowerCase(),
    );
};

/** Override console logging in non-dev mode */
const suppressLog =
    (original: (...args: any[]) => void) =>
    (...args: any[]) => {
        if (isDev()) original(...args);
    };

console.error = suppressLog(console.error);
console.warn = suppressLog(console.warn);

/** Handle process events */
process.on('unhandledRejection', (reason) => {
    console.error('[SCOPE] Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err: Error) => {
    console.error('[SCOPE] Uncaught Exception:', err.stack || err.message);
    process.exit(1);
});

process.on('warning', (warning) => {
    console.warn('[SCOPE] Process Warning:', warning);
});

process.on('rejectionHandled', (promise) => {
    console.error('[SCOPE] Late Rejection Handled:', promise);
});

process.on('SIGINT', async () => {
    try {
        await Hooks.shutdown();
    } catch (e) {
        console.error('[SCOPE] Shutdown Hook Error:', e);
    } finally {
        console.log('[SCOPE] Process terminated (SIGINT)');
        process.exit(0);
    }
});

process.on('SIGTERM', () => {
    console.log('[SCOPE] Process terminated (SIGTERM)');
    process.exit(0);
});

process.on('beforeExit', (code) => {
    console.log('[SCOPE] Before Exit with code:', code);
});

process.on('exit', (code) => {
    console.log('[SCOPE] Process exited with code:', code);
});
