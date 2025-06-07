import 'reflect-metadata';
import knex, { Knex } from 'knex';
import { inject, injectable } from 'inversify';
import { APP_TYPES } from '../../types.ts';
import { getDatabaseConfig } from '../../common/config/database.config.ts';
import { IDatabaseService } from './database.service.interface.ts';
import { IConfigService } from '../configService/config.service.interface.ts';

@injectable()
export class DatabaseService implements IDatabaseService {
    db: Knex;
    constructor(@inject(APP_TYPES.CONFIG_SERVICE) private configService: IConfigService) {
        this.db = knex(getDatabaseConfig(configService));
    }
}
