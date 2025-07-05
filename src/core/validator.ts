'use strict';

/**
 * @module node-framework
 * @description A lightweight, opinionated, and modular TypeScript-based backend framework built on top of Express.js, TypeORM, Socket.IO
 * @author Refkinscallv
 * @repository https://github.com/refkinscallv/node-framework
 * @version 3.1.0
 * @date 2025
 */

import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export default async function Validator<T extends object>(
    dtoClass: ClassConstructor<T>,
    plain: Record<string, any>,
): Promise<
    | { valid: true; data: T }
    | {
          valid: false;
          errors: { property: string; constraints?: Record<string, string> }[];
      }
> {
    try {
        const instance = plainToInstance(dtoClass, plain);
        const errors = await validate(instance, {
            whitelist: true,
            forbidNonWhitelisted: true,
        });

        if (errors.length > 0) {
            return {
                valid: false,
                errors: errors.map((err) => ({
                    property: err.property,
                    constraints: err.constraints,
                })),
            };
        }

        return { valid: true, data: instance };
    } catch (error) {
        console.error('[VALIDATOR] Unexpected validation error:', error);
        return {
            valid: false,
            errors: [
                {
                    property: 'internal',
                    constraints: {
                        internal: 'Unexpected error during validation.',
                    },
                },
            ],
        };
    }
}
