import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { configDotenv } from 'dotenv';
import { ERROR } from '../../common/error/error.ts';
import { ILogger } from '../logger/logger.service.interface.ts';
import { APP_TYPES } from '../../types.ts';
import { Config, ConfigServiceSchema } from './interfaces/config.service.schema.ts';
// import { resolve } from 'path';

@injectable()
export class ConfigService implements ConfigService {
    configData: Config;

    constructor(@inject(APP_TYPES.LOGGER_SERVICE) private loggerService: ILogger) {
        this.loggerService.setServiceName(ConfigService.name);
        // const config = configDotenv({ path: resolve(__dirname, '..', '..', '..', '.env') });
        const config = configDotenv();

        if (config.error) {
            this.loggerService.error(config.error.message);
            throw new Error(config.error.message);
        }
        const res = ConfigServiceSchema.safeParse(config.parsed);

        if (!res.success) {
            throw new Error(res.error.message);
        }
        this.configData = res.data;
    }

    get(key: keyof Config): string | null {
        const res = this.configData[key];
        return res ?? null;
    }
    getOrThrow(key: keyof Config): string {
        const res = this.configData[key];

        if (!res) {
            throw new Error(ERROR.ERROR_GET_ENV_PARAM(key));
        }
        return res;
    }
}
