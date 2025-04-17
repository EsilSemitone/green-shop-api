import { Knex } from 'knex';
import { IConfigService } from '../../configService/config.service.interface';

export function getDatabaseConfig(configService: IConfigService): Knex.Config {
    const postgresHost = configService.getOrThrow('POSTGRES_HOST');
    const postgresUser = configService.getOrThrow('POSTGRES_USER');
    const postgresPassword = configService.getOrThrow('POSTGRES_PASSWORD');
    const postgresDB = configService.getOrThrow('POSTGRES_DB');

    const res = `postgresql://${postgresUser}:${postgresPassword}@${postgresHost}:5432/${postgresDB}`;

    return {
        client: 'pg',
        connection: res,
    };
}
