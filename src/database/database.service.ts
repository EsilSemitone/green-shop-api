import 'reflect-metadata';
import knex from 'knex';
import { inject, injectable } from 'inversify';
import { APP_TYPES } from '../types';
import { IConfigService } from '../configService/config.service.interface';
import { getDatabaseConfig } from '../common/config/database.config';

@injectable()
export class DatabaseService {
    constructor(@inject(APP_TYPES.CONFIG_SERVICE) private configService: IConfigService) {
        const db = knex(getDatabaseConfig(configService));
    }
}
