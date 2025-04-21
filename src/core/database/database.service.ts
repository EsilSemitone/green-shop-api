import 'reflect-metadata';
import knex, { Knex } from 'knex';
import { inject, injectable } from 'inversify';
import { APP_TYPES } from '../../types';
import { IConfigService } from '../configService/config.service.interface';
import { getDatabaseConfig } from '../../common/config/database.config';
import { IDatabaseService } from './database.service.interface';

@injectable()
export class DatabaseService implements IDatabaseService {
    db: Knex;
    constructor(@inject(APP_TYPES.CONFIG_SERVICE) private configService: IConfigService) {
        this.db = knex(getDatabaseConfig(configService));
    }
}
