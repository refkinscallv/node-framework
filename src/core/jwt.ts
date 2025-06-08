'use strict';

/**
 * @module node-framework
 * @description A lightweight, opinionated, and modular TypeScript-based backend framework built on top of Express.js, TypeORM, Socket.IO
 * @author Refkinscallv
 * @repository https://github.com/refkinscallv/node-framework
 * @version 2.9.0
 * @date 2025
 */

import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';
import Common from '@core/common';

class JWT {
    private static secretKey: string =
        Common.env<string>('JWT_SECRET_KEY') ||
        (() => {
            throw new Error('JWT_SECRET_KEY is not defined');
        })();

    private static expireIn: number = (() => {
        const raw = Common.env('JWT_EXPIRE_IN', '86400');
        const parsed = Number(raw);
        if (isNaN(parsed)) throw new Error('JWT_EXPIRE_IN must be a number');
        return parsed;
    })();

    static sign<T extends JwtPayload>(
        payload: T,
        options: SignOptions = {},
    ): string {
        return jwt.sign(payload, this.secretKey, {
            expiresIn: this.expireIn,
            ...options,
        });
    }

    static verify<T = any>(
        token: string | null | undefined,
    ): { status: boolean; result: T | string } {
        if (!token) {
            return {
                status: false,
                result: 'Token is missing',
            };
        }

        try {
            const decoded = jwt.verify(token, this.secretKey) as T;
            return { status: true, result: decoded };
        } catch (err: any) {
            console.warn(`[JWT] Token verification failed: ${err.message}`);
            return {
                status: false,
                result: `Token verification failed: ${err.message}`,
            };
        }
    }

    static encode<T extends object>(payload: T): string {
        return jwt.sign(payload, this.secretKey, {
            algorithm: 'HS256',
            noTimestamp: true,
        });
    }

    static decode<T = any>(token: string): T | null {
        try {
            return jwt.decode(token) as T;
        } catch (err: any) {
            console.warn(`Token decoding failed: ${err.message}`);
            return null;
        }
    }
}

export default JWT;
