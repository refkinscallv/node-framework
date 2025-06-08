'use strict';

/**
 * @module node-framework
 * @description A lightweight, opinionated, and modular TypeScript-based backend framework built on top of Express.js, TypeORM, Socket.IO
 * @author Refkinscallv
 * @repository https://github.com/refkinscallv/node-framework
 * @version 2.9.0
 * @date 2025
 */

import { Repository, ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { PaginateParams, PaginateResult } from '@type/core';

class Paginate {
    public static async make<T extends ObjectLiteral>(
        repo: Repository<T>,
        params: PaginateParams<T>,
    ): Promise<PaginateResult<T>> {
        const page = Number(params.page ?? 1);
        const limit = Number(params.limit ?? 10);
        const offset = (page - 1) * limit;
        const filter = params.filter;
        const relations =
            params.with
                ?.split(',')
                .map((rel) => rel.trim())
                .filter(Boolean) || [];

        let queryBuilder: SelectQueryBuilder<T> =
            repo.createQueryBuilder('entity');

        for (const relation of relations) {
            queryBuilder = queryBuilder.leftJoinAndSelect(
                `entity.${relation}`,
                relation,
            );
        }

        if (filter) {
            Object.entries(filter).forEach(([key, value], i) => {
                const paramKey = `filter_${i}`;
                const aliasPath = key.includes('.') ? key : `entity.${key}`;

                queryBuilder = queryBuilder.andWhere(
                    `${aliasPath} LIKE :${paramKey}`,
                    {
                        [paramKey]: `%${value}%`,
                    },
                );
            });
        }

        const total = await queryBuilder.getCount();
        const data = await queryBuilder.skip(offset).take(limit).getMany();

        return {
            limit,
            page,
            total,
            max_page: Math.ceil(total / limit),
            data,
            filter,
        };
    }
}

export default Paginate;
