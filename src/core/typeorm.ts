/**
 * packages
 */
import { DataSource, DataSourceOptions } from 'typeorm';
import FWCommon from '@core/common';
import DBConfig from '@app/config/database';
import { TypeOrmDialect, RunSeederType } from '@type/core';
import runSeeders from '@app/database/seeders/register';

class Database {
    private static _instance: DataSource;
    private static dbType: TypeOrmDialect;

    public static get instance(): DataSource {
        if (!this._instance) {
            throw new Error(
                '[DATABASE] Instance not initialized. Call Database.init() first.',
            );
        }
        return this._instance;
    }

    public static get config(): DataSourceOptions {
        this.dbType = FWCommon.env<TypeOrmDialect>('DB_TYPE', 'mysql');

        if (!DBConfig[this.dbType]) {
            console.error(`[DATABASE] Unsupported DB_TYPE: '${this.dbType}`);
            process.exit(1);
        }

        return {
            type: this.dbType as any,
            ...DBConfig.common,
            ...DBConfig[this.dbType],
        };
    }

    public static async init(): Promise<void> {
        if (this._instance?.isInitialized) {
            console.log(`[DATABASE] Already initialized`);
            return;
        }

        const config = this.config;
        this._instance = new DataSource(config);

        try {
            await this._instance.initialize();
            console.log(`[DATABASE] Database connected successfully`);
            console.log(`[DATABASE] Database type is: ${this.dbType}`);
            setTimeout(async () => {
                try {
                    await runSeeders();
                } catch (seederError) {
                    console.error(
                        `[DATABASE] Failed to runing seeder: ${seederError}`,
                    );
                    process.exit();
                }
            }, 100);
        } catch (err) {
            console.error(`[DATABASE] Failed to connect: ${err}}`);
            throw err;
        }
    }

    static async executeSeed<T>({ entity, data }: RunSeederType<T>) {
        const Database = (await import('@core/typeorm')).default;
        const repository = Database.instance.getRepository(entity);
        const entityName = entity.name.replace(/(Entity|entity)$/i, '');

        if (!data.length) {
            console.log(`No data provided for ${entityName}, seeding skipped`);
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

        console.log(
            `[SEEDER] Seeder for '${entityName}' executed successfully. Records created/updated.`,
        );
    }
}

export default Database;
