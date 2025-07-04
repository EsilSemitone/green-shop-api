import type { Knex } from 'knex';
// import { ConfigService } from './src/core/configService/config.service.js';
// import { LoggerService } from './src/core/logger/logger.service.js';

// Update with your config settings.
// const configService = new ConfigService(new LoggerService());

const config: { [key: string]: Knex.Config } = {
    development: {
        client: 'postgresql',
        // connection: {
        //     database: configService.getOrThrow('POSTGRES_DB'),
        //     user: configService.getOrThrow('POSTGRES_USER'),
        //     password: configService.getOrThrow('POSTGRES_PASSWORD'),
        //     host: configService.getOrThrow('POSTGRES_HOST'),
        //     port: 5432,
        // },
        connection: {
            database: process.env.POSTGRES_DB,
            user: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            host: process.env.POSTGRES_HOST,
            port: 5432,
        },
        migrations: {
            directory: './migrations',
        },
        seeds: {
            directory: './seeds',
            extension: 'ts',
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
