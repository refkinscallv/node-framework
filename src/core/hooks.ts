import { HookFn, HookType, Subsystem } from '@type/core';

class FWHooks {
    private static hooks: Record<
        Subsystem,
        Partial<Record<HookType, HookFn[]>>
    > = {
        system: {}
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

export default FWHooks;
