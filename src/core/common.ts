'use strict';

/**
 * @module node-framework
 * @description A lightweight, opinionated, and modular TypeScript-based backend framework built on top of Express.js, TypeORM, Socket.IO
 * @author Refkinscallv
 * @repository https://github.com/refkinscallv/node-framework
 * @version 3.0.0
 * @date 2025
 */

import 'reflect-metadata';
import 'dotenv/config';
import { createHash, randomBytes } from 'crypto';

class Common {
    public static env<T = any>(key: string, defaultValue: any = null): T {
        return (process.env[key] ?? defaultValue) as T;
    }

    public static baseUrl(segment = ''): string {
        const baseUrl = this.env<string>(
            'APP_URL',
            'http://localhost:3000',
        ).replace(/\/+$/, '');
        const cleanSegment = segment.replace(/^\/+/, '');
        return `${baseUrl}${cleanSegment ? '/' + cleanSegment : ''}`;
    }

    public static extractUrl(
        fullUrl: string,
        get: Exclude<keyof URL, 'toJSON'>,
    ): string | URL[keyof URL] {
        try {
            const url = new URL(fullUrl);
            return url[get];
        } catch {
            return fullUrl;
        }
    }

    public static json(
        status = true,
        code = 200,
        message = '',
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
        } catch (err) {
            if (shouldThrow) {
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
        return Array.from(bytes)
            .slice(0, length)
            .map((byte) => chars[byte % chars.length])
            .join('');
    }
}

export default Common;
