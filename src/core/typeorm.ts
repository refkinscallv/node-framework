'use strict';

/**
 * @module node-framework
 * @description A lightweight, opinionated, and modular TypeScript-based backend framework built on top of Express.js, TypeORM, Socket.IO
 * @author Refkinscallv
 * @repository https://github.com/refkinscallv/node-framework
 * @version 3.0.0
 * @date 2025
 */

import { DataSource, DataSourceOptions } from 'typeorm';
import Common from '@core/common';
import DatabaseConfig from '@app/config/database';
import runSeeders from '@app/database/seeders/register';
import { TypeOrmDialect, RunSeederType } from '@type/core';

class Database {
    private static instanceRef: DataSource;
    private static dbType: TypeOrmDialect;

    /** Get TypeORM DataSource instance */
    public static get instance(): DataSource {
        if (!this.instanceRef) {
            throw new Error(
                '[DATABASE] Not initialized. Call Database.init() first.',
            );
        }
        return this.instanceRef;
    }

    /** Compose TypeORM config dynamically */
    public static get config(): DataSourceOptions {
        this.dbType = Common.env<TypeOrmDialect>('DB_TYPE', 'mysql');

        if (!DatabaseConfig[this.dbType]) {
            console.error(`[DATABASE] Unsupported DB_TYPE: '${this.dbType}'`);
            process.exit(1);
        }

        return {
            type: this.dbType as any,
            ...DatabaseConfig.common,
            ...DatabaseConfig[this.dbType],
        };
    }

    /** Initialize connection + optional seeder */
    public static async init(): Promise<void> {
        if (this.instanceRef?.isInitialized) {
            console.log('[DATABASE] Already initialized');
            return;
        }

        this.instanceRef = new DataSource(this.config);

        try {
            await this.instanceRef.initialize();
            console.log('[DATABASE] Connected successfully');
            console.log(`[DATABASE] Type: ${this.dbType}`);

            const runSeeder = Common.env<string>('DB_SEEDER', 'off') === 'on';
            if (runSeeder) {
                await this.runSeederSafely();
            }
        } catch (err) {
            console.error('[DATABASE] Connection failed:', err);
            process.exit(1);
        }
    }

    /** Optional seeder execution with safe wrapper */
    private static async runSeederSafely() {
        try {
            await runSeeders();
            console.log('[SEEDER] Seeder execution completed');
        } catch (err) {
            console.error('[SEEDER] Seeder failed:', err);
            process.exit(1);
        }
    }

    /** Utility for manual seeding with upsert */
    static async executeSeed<T>({ entity, data }: RunSeederType<T>) {
        const Database = (await import('@core/typeorm')).default;
        const repository = Database.instance.getRepository(entity);
        const entityName = entity.name.replace(/(Entity)?$/i, '');

        if (!Array.isArray(data) || !data.length) {
            console.log(`[SEEDER] No data for ${entityName}, skipping`);
            return;
        }

        const allColumns = Object.keys(data[0]);

        await repository
            .createQueryBuilder()
            .insert()
            .into(entity)
            .values(data)
            .orUpdate(allColumns, allColumns)
            .execute();

        console.log(`[SEEDER] '${entityName}' seeded successfully`);
    }
}

export default Database;
