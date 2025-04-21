import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { Controller } from '../common/abstract.controller';
import { IController } from '../common/interfaces/controller.interface';
import { ILogger } from '../core/logger/logger.service.interface';
import { APP_TYPES } from '../types';
import { Request, Response } from 'express';
import {
    LoginSchemaRequest,
    LoginSchemaRequestDto,
    LogoutRequestDto,
    RegisterSchemaRequest,
    RegisterSchemaRequestDto,
    ResetPasswordRequestDto,
    RestorePasswordRequestDto,
    RestorePasswordSchemaRequest,
} from 'contracts';
import { ValidateMiddleware } from '../common/middlewares/validate.middleware';
import { IAuthService } from './interfaces/auth.service.interface';
import { AuthGuardFactory } from '../common/middlewares/auth.guard.factory';

@injectable()
export class AuthController extends Controller implements IController {
    constructor(
        @inject(APP_TYPES.LOGGER_SERVICE) private loggerService: ILogger,
        @inject(APP_TYPES.AUTH_SERVICE) private authService: IAuthService,
        @inject(APP_TYPES.AUTH_GUARD_FACTORY) private authGuardFactory: AuthGuardFactory,
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
            {
                path: '/login',
                method: 'post',
                func: this.login,
                middlewares: [new ValidateMiddleware(LoginSchemaRequest)],
            },
            {
                path: '/restore',
                method: 'post',
                func: this.restorePassword,
                middlewares: [new ValidateMiddleware(RestorePasswordSchemaRequest)],
            },
            {
                path: '/logout',
                method: 'post',
                func: this.logout,
                middlewares: [this.authGuardFactory.create(), new ValidateMiddleware(RestorePasswordSchemaRequest)],
            },
        ]);
    }

    async register({ body }: Request<object, object, RegisterSchemaRequestDto, object, object>, res: Response) {
        const result = await this.authService.register(body);
        this.ok(res, result);
    }

    async login({ body }: Request<object, object, LoginSchemaRequestDto, object, object>, res: Response) {
        const result = await this.authService.login(body);
        this.ok(res, result);
    }

    async logout({ user, body }: Request<object, object, LogoutRequestDto, object, object>, res: Response) {
        const result = await this.authService.logout(body, user!);
        this.ok(res, result);
    }

    async restorePassword({ body }: Request<object, object, RestorePasswordRequestDto, object, object>, res: Response) {
        const result = await this.authService.restorePassword(body.email);
        this.ok(res, result);
    }

    async resetPassword({ body }: Request<object, object, ResetPasswordRequestDto, object, object>, res: Response) {
        const result = await this.authService.resetPassword(body);
        this.ok(res, result);
    }
}
