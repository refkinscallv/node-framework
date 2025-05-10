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
