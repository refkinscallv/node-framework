'use strict';

/**
 * @module node-framework
 * @description A lightweight, opinionated, and modular TypeScript-based backend framework built on top of Express.js, TypeORM, Socket.IO
 * @author Refkinscallv
 * @repository https://github.com/refkinscallv/node-framework
 * @version 2.9.0
 * @date 2025
 */

import { HookFn, HookType, Subsystem } from '@type/core';

class Hooks {
    private static hooks: Record<
        Subsystem,
        Partial<Record<HookType, HookFn[]>>
    > = {
        system: {},
    };

    public static register(subsystem: Subsystem, type: HookType, fn: HookFn) {
        if (!this.hooks[subsystem][type]) {
            this.hooks[subsystem][type] = [];
        }
        this.hooks[subsystem][type]!.push(fn);
    }

    public static async init(subsystem: Subsystem, type: HookType) {
        const fns = this.hooks[subsystem][type];
        if (!fns) return;

        for (const fn of fns) {
            try {
                await fn();
            } catch (err) {
                console.error(`[HOOK] Error in ${subsystem}:${type}`, err);
                if (type === 'shutdown') continue;
                throw err;
            }
        }
    }

    public static async shutdown() {
        for (const system of Object.keys(this.hooks) as Subsystem[]) {
            await this.init(system, 'shutdown');
        }
    }
}

export default Hooks;
