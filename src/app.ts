import 'reflect-metadata';
import express, { Express } from 'express';
import { inject, injectable } from 'inversify';
import { IConfigService } from './core/configService/config.service.interface';
import { ILogger } from './core/logger/logger.service.interface';
import { APP_TYPES } from './types';
import { json } from 'body-parser';
import { IController } from './common/interfaces/controller.interface';
import { IExceptionsFilter } from './common/exceptionFilter/exceptionFilter.interface';
import cors from 'cors';
import cookieParser from 'cookie-parser';

@injectable()
export class App {
    app: Express;
    domain: string;
    port: number;
    apiPrefix: string;

    constructor(
        @inject(APP_TYPES.CONFIG_SERVICE) private configService: IConfigService,
        @inject(APP_TYPES.LOGGER_SERVICE) private loggerService: ILogger,
        @inject(APP_TYPES.EXCEPTION_FILTER) private exceptionFilter: IExceptionsFilter,
        @inject(APP_TYPES.AUTH_CONTROLLER) private authController: IController,
        @inject(APP_TYPES.PRODUCT_CONTROLLER) private productController: IController,
        @inject(APP_TYPES.USER_CONTROLLER) private userController: IController,
    ) {
        this.app = express();

        this.loggerService.setServiceName(App.name);

        this.port = parseInt(this.configService.getOrThrow('PORT'));
        this.domain = this.configService.getOrThrow('DOMAIN');
        this.apiPrefix = this.configService.get('API_PREFIX') ?? '/api';
    }

    private buildPath(path: string): string {
        return `/${this.apiPrefix}/${path}`;
    }

    useMiddlewares(): void {
        this.app.use(
            cors({
                origin: this.configService.getOrThrow('CLIENT_URL'),
                credentials: true,
            }),
        );
        this.app.use(cookieParser());
        this.app.use(json());
    }

    useRoutes(): void {
        this.app.use(this.buildPath('auth'), this.authController.router);
        this.app.use(this.buildPath('product'), this.productController.router);
        this.app.use(this.buildPath('user'), this.userController.router);
    }

    private useExceptionFilters(): void {
        this.app.use(this.exceptionFilter.execute.bind(this.exceptionFilter));
    }

    init() {
        this.useMiddlewares();
        this.useRoutes();
        this.useExceptionFilters();
        this.app.listen(this.port, () => {
            this.loggerService.log(`Start server on ${this.domain}:${this.port}/${this.apiPrefix}/`);
        });
    }
}
