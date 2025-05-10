import { Request, Response } from 'express';
import crypto from 'crypto';
import FWCommon from '@core/common';
import { CookieOptions } from '@type/core';

class FWCookie {
    private static req: Request;
    private static res: Response;
    private static cache: Record<string, any> | null = null;
    private static readonly cookieName = FWCommon.env<string>(
        'COOKIE_NAME',
        'warf_token',
    );
    private static readonly secret = FWCommon.env<string>(
        'COOKIE_SECRET',
        'default_cookie_secret',
    );

    static init(req: Request, res: Response) {
        this.req = req;
        this.res = res;
        this.cache = null;
    }

    static all<T = Record<string, any>>(): T | null {
        if (!this.req) return null;
        return this.#readCookie() as T;
    }

    static get<T = any>(keys: string | string[]): T | undefined {
        if (!this.req) return undefined;
        const full = this.#readCookie();

        if (Array.isArray(keys)) {
            return keys.reduce((result: Record<string, any>, key) => {
                if (full?.[key] !== undefined) {
                    result[key] = full[key];
                }
                return result;
            }, {}) as T;
        }

        return full?.[keys];
    }

    static set(
        key: string | Record<string, any>,
        value?: any,
        options: Partial<CookieOptions> = {},
    ): boolean {
        if (!this.res) return false;

        const current = this.#readCookie() || {};

        if (typeof key === 'string' && value !== undefined) {
            current[key] = value;
        } else if (typeof key === 'object') {
            Object.entries(key).forEach(([k, v]) => {
                current[k] = v;
            });
        }

        return this.#writeCookie(current, options);
    }

    static remove(
        keys: string | string[],
        options: Partial<CookieOptions> = {},
    ): boolean {
        if (!this.res) return false;

        const current = this.#readCookie() || {};

        if (Array.isArray(keys)) {
            keys.forEach((key) => {
                delete current[key];
                if (this.cache) {
                    delete this.cache[key];
                }
            });
        } else {
            delete current[keys];
            if (this.cache) {
                delete this.cache[keys];
            }
        }

        return this.#writeCookie(current, options);
    }

    static clear(): boolean {
        if (!this.res) return false;
        this.res.clearCookie(this.cookieName);
        this.cache = null;
        return true;
    }

    static #readCookie(): Record<string, any> | null {
        if (this.cache) return this.cache;

        try {
            const enc = this.req.cookies?.[this.cookieName];
            if (!enc) return null;
            const dec = this.#decrypt(enc);
            const parsed = JSON.parse(dec);
            this.cache = parsed;
            return parsed;
        } catch {
            return null;
        }
    }

    static #writeCookie(
        data: object,
        options: Partial<CookieOptions> = {},
    ): boolean {
        try {
            const enc = this.#encrypt(JSON.stringify(data));

            const config: CookieOptions = {
                path: FWCommon.env('COOKIE_PATH', '/'),
                maxAge: parseInt(FWCommon.env('COOKIE_EXPIRE', '86400000')),
                secure: FWCommon.env('COOKIE_SECURE', 'false') === 'true',
                httpOnly: FWCommon.env('COOKIE_HTTP_ONLY', 'true') === 'true',
                ...options,
            };

            this.res.cookie(this.cookieName, enc, config);
            this.cache = data;
            return true;
        } catch {
            return false;
        }
    }

    static #encrypt(text: string): string {
        const iv = crypto.randomBytes(16);
        const key = crypto.createHash('sha256').update(this.secret).digest();
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        const encrypted = Buffer.concat([
            cipher.update(text, 'utf8'),
            cipher.final(),
        ]);
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    }

    static #decrypt(encrypted: string): string {
        const [ivHex, encHex] = encrypted.split(':');
        const iv = Buffer.from(ivHex, 'hex');
        const encryptedText = Buffer.from(encHex, 'hex');
        const key = crypto.createHash('sha256').update(this.secret).digest();
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        const decrypted = Buffer.concat([
            decipher.update(encryptedText),
            decipher.final(),
        ]);
        return decrypted.toString('utf8');
    }
}

export default FWCookie;
