import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { configDotenv, DotenvParseOutput } from 'dotenv';
import { ERROR } from '../common/error/error';
import { ILogger } from '../logger/logger.service.interface';
import { APP_TYPES } from '../types';
import { IConfigService } from './config.service.interface';

@injectable()
export class ConfigService implements IConfigService {
    configData: DotenvParseOutput;

    constructor(@inject(APP_TYPES.LOGGER_SERVICE) private loggerService: ILogger) {
        this.loggerService.setServiceName(ConfigService.name);
        const config = configDotenv();
        if (config.error) {
            this.loggerService.error(config.error.message);
            throw new Error(config.error.message);
        }

        this.configData = config.parsed as DotenvParseOutput;
    }

    get(key: string): string | null {
        const res = this.configData[key];
        return res ?? null;
    }
    getOrThrow(key: string): string {
        const res = this.configData[key];

        if (!res) {
            throw new Error(ERROR.ERROR_GET_ENV_PARAM(key));
        }
        return res;
    }
}
