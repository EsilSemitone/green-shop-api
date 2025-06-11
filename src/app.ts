import 'reflect-metadata';
import express, { Express } from 'express';
import { inject, injectable } from 'inversify';
import { ILogger } from './core/logger/logger.service.interface.ts';
import { APP_TYPES } from './types.ts';
import parser from 'body-parser';
import { IController } from './common/interfaces/controller.interface.ts';
import { IExceptionsFilter } from './common/exceptionFilter/exceptionFilter.interface.ts';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { IConfigService } from './core/configService/config.service.interface.ts';

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
        @inject(APP_TYPES.UPLOAD_CONTROLLER) private uploadController: IController,
        @inject(APP_TYPES.CART_CONTROLLER) private cartController: IController,
        @inject(APP_TYPES.ADDRESS_CONTROLLER) private addressController: IController,
        @inject(APP_TYPES.ORDER_CONTROLLER) private orderController: IController,
        @inject(APP_TYPES.PAYMENT_METHOD_CONTROLLER) private paymentMethodController: IController,
        @inject(APP_TYPES.YOOKASSA_CONTROLLER) private yookassaController: IController,
        @inject(APP_TYPES.FAVORITES_CONTROLLER) private favoritesController: IController,
        @inject(APP_TYPES.REVIEW_CONTROLLER) private reviewController: IController,
        @inject(APP_TYPES.LIKE_CONTROLLER) private likeController: IController,
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
                origin: [this.configService.getOrThrow('CLIENT_URL'), 'http://localhost:80', 'http://localhost:8000'],
                credentials: true,
            }),
        );
        this.app.use(cookieParser());
        this.app.use(parser.json());
    }

    useRoutes(): void {
        this.app.use(this.buildPath('auth'), this.authController.router);
        this.app.use(this.buildPath('product'), this.productController.router);
        this.app.use(this.buildPath('user'), this.userController.router);
        this.app.use(this.buildPath('upload'), this.uploadController.router);
        this.app.use(this.buildPath('cart'), this.cartController.router);
        this.app.use(this.buildPath('address'), this.addressController.router);
        this.app.use(this.buildPath('order'), this.orderController.router);
        this.app.use(this.buildPath('payment-method'), this.paymentMethodController.router);
        this.app.use(this.buildPath('yookassa'), this.yookassaController.router);
        this.app.use(this.buildPath('favorites'), this.favoritesController.router);
        this.app.use(this.buildPath('review'), this.reviewController.router);
        this.app.use(this.buildPath('like'), this.likeController.router);
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
            this.loggerService.log(`${this.configService.getOrThrow('CLIENT_URL')}`);
        });
    }
}
