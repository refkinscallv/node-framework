'use strict';

/**
 * @module node-framework
 * @description A lightweight, opinionated, and modular TypeScript-based backend framework built on top of Express.js, TypeORM, Socket.IO
 * @author Refkinscallv
 * @repository https://github.com/refkinscallv/node-framework
 * @version 3.0.0
 * @date 2025
 */

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
    static entityClass: new () => any;
    protected static idKey: string = 'id';

    public static get entity(): TypeOrmRepository<any> {
        if (!this.entityClass) {
            throw new Error('Missing entityClass in subclass');
        }
        return Database.instance.getRepository(this.entityClass);
    }

    private static normalizeRelations(relations?: string | string[]): string[] {
        if (!relations) return [];

        if (Array.isArray(relations)) {
            return relations.map((r) => r.trim()).filter(Boolean);
        }

        return relations
            .split(',')
            .map((r) => r.trim())
            .filter(Boolean);
    }

    static async pagination<T extends ObjectLiteral>(
        this: typeof Repository<T>,
        params: PaginateParams<T>,
    ): Promise<PaginateResult<T>> {
        return Paginate.make(this.entity, params);
    }

    static async all<T extends ObjectLiteral>(
        this: typeof Repository<T>,
        relations: string | string[] = [],
    ): Promise<T[]> {
        return this.entity.find({
            relations: this.normalizeRelations(relations),
        });
    }

    static async by<T extends ObjectLiteral>(
        this: typeof Repository<T>,
        index: string | number | Record<string, any> | string[],
        value?: string | number | string[] | null,
        relations: string | string[] = [],
    ): Promise<T[]> {
        const where = this.buildWhere(index, value);
        if (!where) return [];
        return this.entity.find({
            where,
            relations: this.normalizeRelations(relations),
        });
    }

    private static buildWhere<T extends ObjectLiteral>(
        index: string | number | Record<string, any> | string[],
        value?: string | number | string[] | null,
    ): FindOptionsWhere<T> | undefined {
        if (Array.isArray(index)) {
            return Object.fromEntries(
                index.map((key) => {
                    if (Array.isArray(value)) return [key, In(value)];
                    if (isString(value) || isNumber(value))
                        return [key, Like(`%${value}%`)];
                    return [key, value];
                }),
            ) as FindOptionsWhere<T>;
        }

        if (isObject(index)) {
            return Object.fromEntries(
                Object.entries(index).map(([key, val]) => {
                    if (Array.isArray(val)) return [key, In(val)];
                    if (isString(val) || isNumber(val))
                        return [key, Like(`%${val}%`)];
                    return [key, val];
                }),
            ) as FindOptionsWhere<T>;
        }

        if (typeof index === 'string') {
            return {
                [index]: Array.isArray(value) ? In(value) : Like(`%${value}%`),
            } as FindOptionsWhere<T>;
        }

        return undefined;
    }

    static async store<T extends ObjectLiteral>(
        this: typeof Repository<T>,
        data: DeepPartial<T>,
    ): Promise<T> {
        const created = this.entity.create(data);
        return this.entity.save(created);
    }

    static async bulkStore<T extends ObjectLiteral>(
        this: typeof Repository<T>,
        data: DeepPartial<T>[],
    ): Promise<T[]> {
        const created = this.entity.create(data);
        return this.entity.save(created);
    }

    static async update<T extends ObjectLiteral>(
        this: typeof Repository<T>,
        data: DeepPartial<T>,
        criteria: number | FindOptionsWhere<T>,
    ): Promise<T | null> {
        const where = this.resolveCriteria<T>(criteria);
        const existing = await this.entity.findOne({ where });
        if (!existing) return null;
        const merged = this.entity.merge(existing, data);
        return this.entity.save(merged);
    }

    static async delete<T extends ObjectLiteral>(
        this: typeof Repository<T>,
        criteria: number | FindOptionsWhere<T>,
    ): Promise<boolean> {
        const result = await this.entity.delete(
            this.resolveCriteria<T>(criteria),
        );
        return result.affected !== 0;
    }

    static async softDelete<T extends ObjectLiteral>(
        this: typeof Repository<T>,
        criteria: number | FindOptionsWhere<T>,
    ): Promise<boolean> {
        const result = await this.entity.softDelete(
            this.resolveCriteria<T>(criteria),
        );
        return result.affected !== 0;
    }

    static async restore<T extends ObjectLiteral>(
        this: typeof Repository<T>,
        criteria: number | FindOptionsWhere<T>,
    ): Promise<boolean> {
        const result = await this.entity.restore(
            this.resolveCriteria<T>(criteria),
        );
        return result.affected !== 0;
    }

    private static resolveCriteria<T extends ObjectLiteral>(
        criteria: number | FindOptionsWhere<T>,
    ): FindOptionsWhere<T> {
        return typeof criteria === 'number'
            ? ({ [this.idKey]: criteria } as FindOptionsWhere<T>)
            : criteria;
    }

    static async findOne<T extends ObjectLiteral>(
        this: typeof Repository<T>,
        criteria: number | FindOptionsWhere<T>,
        relations: string | string[] = [],
    ): Promise<T | null> {
        return this.entity.findOne({
            where: this.resolveCriteria(criteria),
            relations: this.normalizeRelations(relations),
        });
    }

    static async findMany<T extends ObjectLiteral>(
        this: typeof Repository<T>,
        criteria: FindOptionsWhere<T>,
        relations: string | string[] = [],
    ): Promise<T[]> {
        return this.entity.find({
            where: criteria,
            relations: this.normalizeRelations(relations),
        });
    }

    static async exists<T extends ObjectLiteral>(
        this: typeof Repository<T>,
        criteria: FindOptionsWhere<T>,
    ): Promise<boolean> {
        return (await this.entity.count({ where: criteria })) > 0;
    }

    static async count<T extends ObjectLiteral>(
        this: typeof Repository<T>,
        where?: FindOptionsWhere<T>,
    ): Promise<number> {
        return this.entity.count({ where });
    }

    static findWithQueryBuilder<T extends ObjectLiteral>(
        this: typeof Repository<T>,
        alias: string,
    ): SelectQueryBuilder<T> {
        return this.entity.createQueryBuilder(alias);
    }

    static async raw<T extends ObjectLiteral>(
        this: typeof Repository<T>,
        query: string,
        params: any[] = [],
    ): Promise<any> {
        return this.entity.query(query, params);
    }
}
