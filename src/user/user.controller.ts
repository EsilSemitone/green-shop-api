import { inject } from 'inversify';
import { Controller } from '../common/abstract.controller.ts';
import { IController } from '../common/interfaces/controller.interface.ts';
import { AuthGuardFactory } from '../common/middlewares/auth.guard.factory.ts';
import { ValidateMiddleware } from '../common/middlewares/validate.middleware.ts';
import { APP_TYPES } from '../types.ts';
import { Request, Response } from 'express';
import { IUserService } from './interfaces/user.service.interface.ts';
import { UpdateUserRequestDto, UpdateUserRequestSchema } from 'contracts';

export class UserController extends Controller implements IController {
    constructor(
        @inject(APP_TYPES.AUTH_GUARD_FACTORY) private authGuardFactory: AuthGuardFactory,
        @inject(APP_TYPES.USER_SERVICE) private userService: IUserService,
    ) {
        super();

        this.bindRouts([
            {
                path: '/me',
                method: 'get',
                func: this.me,
                middlewares: [this.authGuardFactory.create()],
            },
            {
                path: '/',
                method: 'post',
                func: this.update,
                middlewares: [
                    this.authGuardFactory.create(),
                    new ValidateMiddleware([{ key: 'body', schema: UpdateUserRequestSchema }]),
                ],
            },
            {
                path: '/',
                method: 'delete',
                func: this.delete,
                middlewares: [this.authGuardFactory.create()],
            },
        ]);
    }

    async me({ user }: Request, res: Response) {
        const result = await this.userService.me(user!.userId);
        this.ok(res, result);
    }

    async update({ body, user }: Request<object, object, UpdateUserRequestDto>, res: Response) {
        const result = await this.userService.update(user!.userId, body);
        this.ok(res, result);
    }

    async delete({ user }: Request, res: Response) {
        const result = await this.userService.delete(user!.userId);
        this.ok(res, result);
    }
}
