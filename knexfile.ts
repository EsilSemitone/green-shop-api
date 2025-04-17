import type { Knex } from 'knex';
import { ConfigService } from './src/configService/config.service';
import { LoggerService } from './src/logger/logger.service';

// Update with your config settings.
const configService = new ConfigService(new LoggerService());

const config: { [key: string]: Knex.Config } = {
    development: {
        client: 'postgresql',
        connection: {
            database: configService.getOrThrow('POSTGRES_DB'),
            user: configService.getOrThrow('POSTGRES_USER'),
            password: configService.getOrThrow('POSTGRES_PASSWORD'),
            host: configService.getOrThrow('POSTGRES_HOST'),
            port: 5432,
        },
        migrations: {
            directory: './migrations',
        },
        seeds: {
            directory: './seeds',
        },
    },

    staging: {
        client: 'postgresql',
        connection: {
            database: 'my_db',
            user: 'username',
            password: 'password',
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: 'knex_migrations',
        },
    },

    production: {
        client: 'postgresql',
        connection: {
            database: 'my_db',
            user: 'username',
            password: 'password',
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: 'knex_migrations',
        },
    },
};

module.exports = config;
