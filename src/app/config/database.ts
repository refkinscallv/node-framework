import Common from '@core/common';

const DatabaseConfig = {
    common: {
        entities: [
            Common.env<string>('APP_ENV', 'development') === 'development'
                ? 'src/app/database/entities/*.{ts,js}'
                : 'dist/app/database/entities/*.js',
        ],
        synchronize: Common.env<string>('DB_SYNC', 'off') === 'on',
        logging: Common.env<string>('DB_LOGGING', 'off') === 'on',
        charset: Common.env<string>('DB_CHARSET', 'utf8mb4_general_ci'),
    },

    mysql: {
        host: Common.env<string>('DB_HOST', 'localhost'),
        port: Common.env<number>('DB_PORT', 3306),
        username: Common.env<string>('DB_USER', 'root'),
        password: Common.env<string>('DB_PASS', ''),
        database: Common.env<string>('DB_NAME', ''),
    },

    postgres: {
        host: Common.env<string>('DB_HOST', 'localhost'),
        port: Common.env<number>('DB_PORT', 5432),
        username: Common.env<string>('DB_USER', 'postgres'),
        password: Common.env<string>('DB_PASS', ''),
        database: Common.env<string>('DB_NAME', ''),
        schema: Common.env<string>('DB_SCHEMA', 'public'),
    },

    sqlite: {
        database: Common.env<string>('DB_PATH', 'database.sqlite'),
    },

    mongodb: {
        url: Common.env<string>('DB_URL', 'mongodb://localhost:27017'),
        useUnifiedTopology: true,
    },

    oracle: {
        host: Common.env<string>('DB_HOST', 'localhost'),
        port: Common.env<number>('DB_PORT', 1521),
        username: Common.env<string>('DB_USER', 'system'),
        password: Common.env<string>('DB_PASS', ''),
        sid: Common.env<string>('DB_SID', 'xe'),
        connectString: Common.env<string>('DB_CONNECT_STRING', ''),
    },
};

export default DatabaseConfig;
