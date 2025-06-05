'use strict';

/**
 * @module node-framework
 * @description A lightweight, opinionated, and modular TypeScript-based backend framework built on top of Express.js, TypeORM, Socket.IO 
 * @author Refkinscallv
 * @repository https://github.com/refkinscallv/node-framework
 * @version 2.9.0
 * @date 2025
 */

import 'reflect-metadata';
import 'dotenv/config';
import { createHash, randomBytes } from 'crypto';

class Common {
    public static env<T = any>(key: string, defaultValue: any = null): T {
        return (
            process.env[key] !== undefined ? process.env[key] : defaultValue
        ) as T;
    }

    public static baseUrl(segment: string = ''): string {
        const baseUrl = this.env<string>(
            'APP_URL',
            'http://localhost:3000',
        ).replace(/\/+$/, '');
        return `${baseUrl}${segment ? `/${segment.replace(/^\/+/, '')}` : ''}`;
    }

    public static extractUrl(
        fullUrl: string,
        get: Exclude<keyof URL, 'toJSON'>,
    ): any | URL {
        try {
            return new URL(fullUrl)[get];
        } catch {
            return fullUrl;
        }
    }

    public static json(
        status: boolean = true,
        code: number = 200,
        message: string = '',
        result: object | any[] | null = {},
        custom: Partial<Record<string, any>> = {},
    ) {
        return { status, code, message, result, ...custom };
    }

    public static async handler<T>(
        callback: () => Promise<T>,
        shouldThrow?: (err: any) => T | Promise<T> | void,
    ): Promise<T> {
        try {
            return await callback();
        } catch (err: any) {
            if (typeof shouldThrow === 'function') {
                const result = await shouldThrow(err);
                if (result !== undefined) return result;
            }
            throw err;
        }
    }

    public static md5(input: string): string {
        return createHash('md5').update(input).digest('hex');
    }

    public static randomAlphaNumeric(length: number): string {
        const chars =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const bytes = randomBytes(length);

        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars[bytes[i] % chars.length];
        }

        return result;
    }
}

export default Common;
