import 'reflect-metadata';
import express, { Express } from 'express';
import { inject, injectable } from 'inversify';
import { IConfigService } from './configService/config.service.interface';
import { ILogger } from './logger/logger.service.interface';
import { APP_TYPES } from './types';

@injectable()
export class App {
    app: Express;
    domain: string;
    port: number;

    constructor(
        @inject(APP_TYPES.CONFIG_SERVICE) private configService: IConfigService,
        @inject(APP_TYPES.LOGGER_SERVICE) private loggerService: ILogger,
    ) {
        this.app = express();
        this.port = parseInt(this.configService.getOrThrow('PORT'));
        this.domain = this.configService.getOrThrow('DOMAIN');
        this.loggerService.setServiceName(App.name);
    }

    init() {
        this.app.listen(this.port, () => {
            this.loggerService.log(`Start server on  ${this.domain}:${this.port}`);
        });
    }
}
