'use strict';

/**
 * @module node-framework
 * @description A lightweight, opinionated, and modular TypeScript-based backend framework built on top of Express.js, TypeORM, Socket.IO 
 * @author Refkinscallv
 * @repository https://github.com/refkinscallv/node-framework
 * @version 2.9.0
 * @date 2025
 */

import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export default async function Validator<T extends object>(
    dtoClass: ClassConstructor<T>,
    plain: object,
): Promise<{ valid: true; data: T } | { valid: false; errors: any[] }> {
    const instance = plainToInstance(dtoClass, plain);
    const errors = await validate(instance);

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
}
