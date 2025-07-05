'use strict';

/**
 * @module node-framework
 * @description A lightweight, opinionated, and modular TypeScript-based backend framework built on top of Express.js, TypeORM, Socket.IO
 * @author Refkinscallv
 * @repository https://github.com/refkinscallv/node-framework
 * @version 3.1.0
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

    static register(subsystem: Subsystem, type: HookType, fn: HookFn) {
        if (!this.hooks[subsystem]) this.hooks[subsystem] = {};
        this.hooks[subsystem][type] ??= [];
        this.hooks[subsystem][type]!.push(fn);
    }

    static async init(subsystem: Subsystem, type: HookType) {
        const fns = this.hooks[subsystem]?.[type];
        if (!fns?.length) return;

        for (const fn of fns) {
            try {
                await fn();
            } catch (err) {
                console.error(`[HOOK] Error in ${subsystem}:${type}`, err);
                if (type !== 'shutdown') throw err;
            }
        }
    }

    static async shutdown() {
        for (const subsystem of Object.keys(this.hooks) as Subsystem[]) {
            await this.init(subsystem, 'shutdown');
        }
    }
}

export default Hooks;
