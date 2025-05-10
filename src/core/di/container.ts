import { Constructor } from '@type/core';
import path from 'path';
import fs from 'fs';
import { pathToFileURL } from 'url';

class FWContainer {
    private static instances = new Map<string, any>();
    private static providers = new Map<string, Constructor>();

    static register(
        deps: Record<string, Constructor> | [string, Constructor][],
    ): void {
        if (Array.isArray(deps)) {
            for (const [key, value] of deps) this.providers.set(key, value);
        } else {
            for (const key in deps) this.providers.set(key, deps[key]);
        }
    }

    static autoRegister(token: string, ctor: Constructor) {
        this.providers.set(token, ctor);
    }

    static async registerProviders(providerLocation: string = '') {
        if (providerLocation) {
            const files = fs.readdirSync(providerLocation);

            for (const file of files) {
                if (
                    file === 'register.ts' ||
                    file === 'register.js' ||
                    file.startsWith('.') ||
                    !file.match(/\.(ts|js)$/)
                )
                    continue;

                const fullPath = path.join(providerLocation, file);
                const url = pathToFileURL(fullPath).href;
                await import(url);
            }

            console.log('[PROVIDERS] Auto-register providers');
        }
    }

    static init() {
        for (const [token, ctor] of this.providers.entries()) {
            if (!this.instances.has(token)) {
                const paramTypes =
                    Reflect.getMetadata('design:paramtypes', ctor) || [];
                const dependencies = paramTypes.map((dep: Constructor) =>
                    this.resolveByType(dep),
                );
                this.instances.set(token, new ctor(...dependencies));
            }
        }
    }

    static resolve<T = any>(token: string): T {
        const instance = this.instances.get(token);
        if (!instance)
            throw new Error(`[DI] Dependency '${token}' not resolved`);
        return instance;
    }

    static resolveByType<T = any>(target: Constructor<T>): T {
        for (const [token, ctor] of this.providers.entries()) {
            if (ctor === target) return this.resolve(token);
        }
        throw new Error(`[DI] No provider found for ${target.name}`);
    }
}

export default FWContainer;
