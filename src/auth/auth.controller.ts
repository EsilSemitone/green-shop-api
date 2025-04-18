import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { Controller } from '../common/abstract.controller';
import { IController } from '../common/interfaces/controller.interface';
import { ILogger } from '../logger/logger.service.interface';
import { APP_TYPES } from '../types';
import { Request, Response } from 'express';
import { RegisterSchemaRequest, RegisterSchemaRequestDto } from 'contracts';
import { ValidateMiddleware } from '../common/middlewares/validate.middleware';
import { AuthService } from './auth.service';

@injectable()
export class AuthController extends Controller implements IController {
    constructor(
        @inject(APP_TYPES.LOGGER_SERVICE) private loggerService: ILogger,
        @inject(APP_TYPES.AUTH_SERVICE) private authService: AuthService,
    ) {
        super();
        this.loggerService.setServiceName(AuthController.name);

        this.bindRouts([
            {
                path: '/register',
                method: 'post',
                func: this.register,
                middlewares: [new ValidateMiddleware(RegisterSchemaRequest)],
            },
        ]);
    }

    async register({ body }: Request<object, object, RegisterSchemaRequestDto, object, object>, res: Response) {
        const result = await this.authService.register(body)

        
        this.ok(res, {name, email, password})
    }
}
