/**
 * packages
 */
import FWCommon from '@core/common';

const DatabaseConfig = {
    common: {
        entities: [
            FWCommon.env<string>('APP_ENV', 'development') === 'development'
                ? 'src/app/database/entities/*.{ts,js}'
                : 'dist/app/database/entities/*.js',
        ],
        synchronize: FWCommon.env<string>('DB_SYNC', 'off') === 'on',
        logging: FWCommon.env<string>('DB_LOGGING', 'off') === 'on',
        charset: FWCommon.env<string>('DB_CHARSET', 'utf8mb4_general_ci'),
    },
    mysql: {
        host: FWCommon.env<string>('DB_HOST', 'localhost'),
        port: FWCommon.env<number>('DB_PORT', 3306),
        username: FWCommon.env<string>('DB_USER', 'root'),
        password: FWCommon.env<string>('DB_PASS', ''),
        database: FWCommon.env<string>('DB_NAME', ''),
    },
    postgres: {
        host: FWCommon.env<string>('DB_HOST', 'localhost'),
        port: FWCommon.env<number>('DB_PORT', 5432),
        username: FWCommon.env<string>('DB_USER', 'postgres'),
        password: FWCommon.env<string>('DB_PASS', ''),
        database: FWCommon.env<string>('DB_NAME', ''),
        schema: FWCommon.env<string>('DB_SCHEMA', 'public'),
    },
    sqlite: {
        database: FWCommon.env<string>('DB_PATH', 'database.sqlite'),
    },
    mongodb: {
        url: FWCommon.env<string>('DB_URL', 'mongodb://localhost:27017'),
        useUnifiedTopology: true,
    },
    oracle: {
        host: FWCommon.env<string>('DB_HOST', 'localhost'),
        port: FWCommon.env<number>('DB_PORT', 1521),
        username: FWCommon.env<string>('DB_USER', 'system'),
        password: FWCommon.env<string>('DB_PASS', ''),
        sid: FWCommon.env<string>('DB_SID', 'xe'),
        connectString: FWCommon.env<string>('DB_CONNECT_STRING', ''),
    },
};

export default DatabaseConfig;
