import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { Controller } from '../common/abstract.controller';
import { IController } from '../common/interfaces/controller.interface';
import { APP_TYPES } from '../types';
import { Request, Response } from 'express';
import { LoginSchemaRequest, LoginSchemaRequestDto } from 'contracts/auth/login.schema.js';
// import { RegisterSchemaRequest, RegisterSchemaRequestDto } from 'contracts/auth/register.schema.js';
import { ResetPasswordRequestDto, ResetPasswordSchemaRequest } from 'contracts/auth/reset-password.schema.js';
import { RestorePasswordRequestDto, RestorePasswordSchemaRequest } from 'contracts/auth/restore-password.schema.js';
import { ValidateMiddleware } from '../common/middlewares/validate.middleware';
import { IAuthService } from './interfaces/auth.service.interface';
import { AuthGuardFactory } from '../common/middlewares/auth.guard.factory';
import { RegisterSchemaRequest, RegisterSchemaRequestDto } from 'contracts';

@injectable()
export class AuthController extends Controller implements IController {
    constructor(
        @inject(APP_TYPES.AUTH_SERVICE) private authService: IAuthService,
        @inject(APP_TYPES.AUTH_GUARD_FACTORY) private authGuardFactory: AuthGuardFactory,
    ) {
        super();

        this.bindRouts([
            {
                path: '/register',
                method: 'post',
                func: this.register,
                middlewares: [new ValidateMiddleware([{ key: 'body', schema: RegisterSchemaRequest }])],
            },
            {
                path: '/login',
                method: 'post',
                func: this.login,
                middlewares: [new ValidateMiddleware([{ key: 'body', schema: LoginSchemaRequest }])],
            },
            {
                path: '/restore',
                method: 'post',
                func: this.restorePassword,
                middlewares: [new ValidateMiddleware([{ key: 'body', schema: RestorePasswordSchemaRequest }])],
            },
            {
                path: '/reset',
                method: 'post',
                func: this.resetPassword,
                middlewares: [new ValidateMiddleware([{ key: 'body', schema: ResetPasswordSchemaRequest }])],
            },
            {
                path: '/logout',
                method: 'post',
                func: this.logout,
                middlewares: [this.authGuardFactory.create()],
            },
        ]);
    }

    async register(req: Request<object, object, RegisterSchemaRequestDto, object, object>, res: Response) {
        console.log(req.cookies);
        const { accessToken, refreshToken } = await this.authService.register(req.body);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 24 * 30,
        });
        this.ok(res, { accessToken });
    }

    async login(req: Request<object, object, LoginSchemaRequestDto, object, object>, res: Response) {
        const { accessToken, refreshToken } = await this.authService.login(req.body);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 24 * 30,
        });
        this.ok(res, { accessToken });
    }

    async logout({ user, cookies }: Request, res: Response) {
        const result = await this.authService.logout(cookies['refreshToken'], user!);
        res.clearCookie('refreshToken');
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
