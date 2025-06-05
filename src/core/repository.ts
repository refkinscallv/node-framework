import Database from '@core/typeorm';
import {
    Repository as TypeOrmRepository,
    FindOptionsWhere,
    DeepPartial,
    Like,
    In,
    ObjectLiteral,
    SelectQueryBuilder,
} from 'typeorm';
import { isObject, isString, isNumber } from 'lodash';
import { PaginateParams, PaginateResult } from '@type/core';
import Paginate from '@core/paginate';

export default abstract class Repository<T extends ObjectLiteral> {
    // Subclass harus override ini
    static entityClass: new () => any;

    protected static idKey: string = 'id';

    protected static get entity(): TypeOrmRepository<any> {
        if (!this.entityClass) {
            throw new Error('entityClass not set in subclass');
        }
        return Database.instance.getRepository(this.entityClass);
    }

    static async pagination<T extends ObjectLiteral>(
        this: typeof Repository<T>,
        params: PaginateParams<T>
    ): Promise<PaginateResult<T>> {
        return Paginate.make(this.entity, params);
    }

    static async all<T extends ObjectLiteral>(
        this: typeof Repository<T>,
        relations: string[] = []
    ): Promise<T[]> {
        return this.entity.find({ relations });
    }

    static async by<T extends ObjectLiteral>(
        this: typeof Repository<T>,
        index: string | number | Record<string, any> | string[],
        value?: string | number | string[] | null,
        relations: string[] = [],
    ): Promise<T[]> {
        const whereBuilder = (): FindOptionsWhere<T> | undefined => {
            if (Array.isArray(index)) {
                return index.reduce((acc, key) => {
                    if (Array.isArray(value)) acc[key] = In(value);
                    else if (isString(value) || isNumber(value)) acc[key] = Like(`%${value}%`);
                    return acc;
                }, {} as any);
            }

            if (isObject(index)) {
                return Object.fromEntries(Object.entries(index).map(([key, val]) => {
                    if (Array.isArray(val)) return [key, In(val)];
                    if (isString(val) || isNumber(val)) return [key, Like(`%${val}%`)];
                    return [key, val];
                })) as FindOptionsWhere<T>;
            }

            if (typeof index === 'string') {
                return {
                    [index]: Array.isArray(value) ? In(value) : Like(`%${value}%`),
                } as FindOptionsWhere<T>;
            }

            return undefined;
        };

        const where = whereBuilder();
        if (!where) return [];
        return this.entity.find({ where, relations });
    }

    static async store<T extends ObjectLiteral>(
        this: typeof Repository<T>,
        data: DeepPartial<T>
    ): Promise<T> {
        const created = this.entity.create(data);
        return this.entity.save(created);
    }

    static async bulkStore<T extends ObjectLiteral>(
        this: typeof Repository<T>,
        data: DeepPartial<T>[]
    ): Promise<T[]> {
        const created = this.entity.create(data);
        return this.entity.save(created);
    }

    static async update<T extends ObjectLiteral>(
        this: typeof Repository<T>,
        data: DeepPartial<T>,
        criteria: number | FindOptionsWhere<T>
    ): Promise<T | null> {
        const where = typeof criteria === 'number'
            ? { [this.idKey]: criteria } as any
            : criteria;

        const existing = await this.entity.findOne({ where });
        if (!existing) return null;

        const merged = this.entity.merge(existing, data);
        return this.entity.save(merged);
    }

    static async delete<T extends ObjectLiteral>(
        this: typeof Repository<T>,
        criteria: number | FindOptionsWhere<T>
    ): Promise<boolean> {
        const where = typeof criteria === 'number'
            ? { [this.idKey]: criteria } as any
            : criteria;

        const result = await this.entity.delete(where);
        return result.affected !== 0;
    }

    static async softDelete<T extends ObjectLiteral>(
        this: typeof Repository<T>,
        criteria: number | FindOptionsWhere<T>
    ): Promise<boolean> {
        const where = typeof criteria === 'number'
            ? { [this.idKey]: criteria } as any
            : criteria;

        const result = await this.entity.softDelete(where);
        return result.affected !== 0;
    }

    static async restore<T extends ObjectLiteral>(
        this: typeof Repository<T>,
        criteria: number | FindOptionsWhere<T>
    ): Promise<boolean> {
        const where = typeof criteria === 'number'
            ? { [this.idKey]: criteria } as any
            : criteria;

        const result = await this.entity.restore(where);
        return result.affected !== 0;
    }

    static async findOne<T extends ObjectLiteral>(
        this: typeof Repository<T>,
        criteria: number | FindOptionsWhere<T>,
        relations: string[] = []
    ): Promise<T | null> {
        const where = typeof criteria === 'number'
            ? { [this.idKey]: criteria } as any
            : criteria;

        return this.entity.findOne({ where, relations });
    }

    static async findMany<T extends ObjectLiteral>(
        this: typeof Repository<T>,
        criteria: FindOptionsWhere<T>,
        relations: string[] = []
    ): Promise<T[]> {
        return this.entity.find({ where: criteria, relations });
    }

    static async exists<T extends ObjectLiteral>(
        this: typeof Repository<T>,
        criteria: FindOptionsWhere<T>
    ): Promise<boolean> {
        const count = await this.entity.count({ where: criteria });
        return count > 0;
    }

    static async count<T extends ObjectLiteral>(
        this: typeof Repository<T>,
        where?: FindOptionsWhere<T>
    ): Promise<number> {
        return this.entity.count({ where });
    }

    static findWithQueryBuilder<T extends ObjectLiteral>(
        this: typeof Repository<T>,
        alias: string
    ): SelectQueryBuilder<T> {
        return this.entity.createQueryBuilder(alias);
    }

    static async raw<T extends ObjectLiteral>(
        this: typeof Repository<T>,
        query: string,
        params: any[] = []
    ): Promise<any> {
        return this.entity.query(query, params);
    }
}
