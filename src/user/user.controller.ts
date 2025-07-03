import { inject } from 'inversify';
import { Controller } from '../common/abstract.controller';
import { IController } from '../common/interfaces/controller.interface';
import { AuthGuardFactory } from '../common/middlewares/auth.guard.factory';
import { ValidateMiddleware } from '../common/middlewares/validate.middleware';
import { APP_TYPES } from '../types';
import { Request, Response } from 'express';
import { IUserService } from './interfaces/user.service.interface';
import {
    AddAdminUserRequestDto,
    AddAdminUserRequestSchema,
    DeleteUserAdminRequestParamsDto,
    DeleteUserAdminRequestParamsSchema,
    GetAllUsersRequestQueryDto,
    GetAllUsersRequestQuerySchema,
    GetStatsUsersRequestParamsDto,
    GetUserRequestParamsDto,
    GetUserRequestParamsSchema,
    ROLES,
    UpdateUserAdminRequestDto,
    UpdateUserAdminRequestParamsDto,
    UpdateUserAdminRequestParamsSchema,
    UpdateUserAdminRequestSchema,
    UpdateUserRequestDto,
    UpdateUserRequestSchema,
} from 'contracts-green-shop';
import { RoleGuard } from '../common/middlewares/role.guard';

export class UserController extends Controller implements IController {
    constructor(
        @inject(APP_TYPES.AUTH_GUARD_FACTORY) private authGuardFactory: AuthGuardFactory,
        @inject(APP_TYPES.USER_SERVICE) private userService: IUserService,
    ) {
        super();

        this.bindRouts([
            {
                path: '/',
                method: 'get',
                func: this.getAll,
                middlewares: [
                    this.authGuardFactory.create(),
                    new RoleGuard([ROLES.ADMIN]),
                    new ValidateMiddleware([{ key: 'query', schema: GetAllUsersRequestQuerySchema }]),
                ],
            },
            {
                path: '/me',
                method: 'get',
                func: this.me,
                middlewares: [this.authGuardFactory.create()],
            },
            {
                path: '/stats',
                method: 'get',
                func: this.getStats,
                middlewares: [
                    this.authGuardFactory.create(),
                    new RoleGuard([ROLES.ADMIN]),
                    new ValidateMiddleware([{ key: 'query', schema: GetStatsUsersRequestParamsDto }]),
                ],
            },
            {
                path: '/:userUuid',
                method: 'get',
                func: this.getUser,
                middlewares: [
                    this.authGuardFactory.create(),
                    new RoleGuard([ROLES.ADMIN]),
                    new ValidateMiddleware([{ key: 'params', schema: GetUserRequestParamsSchema }]),
                ],
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
                path: '/add-admin',
                method: 'post',
                func: this.addAdminUser,
                middlewares: [
                    this.authGuardFactory.create(),
                    new RoleGuard([ROLES.ADMIN]),
                    new ValidateMiddleware([{ key: 'body', schema: AddAdminUserRequestSchema }]),
                ],
            },
            {
                path: '/:userUuid',
                method: 'patch',
                func: this.updateUserAdmin,
                middlewares: [
                    this.authGuardFactory.create(),
                    new RoleGuard([ROLES.ADMIN]),
                    new ValidateMiddleware([
                        { key: 'params', schema: UpdateUserAdminRequestParamsSchema },
                        { key: 'body', schema: UpdateUserAdminRequestSchema },
                    ]),
                ],
            },
            {
                path: '/',
                method: 'delete',
                func: this.delete,
                middlewares: [this.authGuardFactory.create()],
            },
            {
                path: '/:userUuid',
                method: 'delete',
                func: this.deleteUserAdmin,
                middlewares: [
                    this.authGuardFactory.create(),
                    new RoleGuard([ROLES.ADMIN]),
                    new ValidateMiddleware([{ key: 'params', schema: DeleteUserAdminRequestParamsSchema }]),
                ],
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

    async getAll({ query }: Request<object, object, object, GetAllUsersRequestQueryDto>, res: Response) {
        const result = await this.userService.getAll(query);
        this.ok(res, result);
    }

    async getUser({ params }: Request<GetUserRequestParamsDto>, res: Response) {
        const result = await this.userService.getUser(params.userUuid);
        this.ok(res, result);
    }

    async updateUserAdmin(
        { params, body }: Request<UpdateUserAdminRequestParamsDto, object, UpdateUserAdminRequestDto>,
        res: Response,
    ) {
        const result = await this.userService.update(params.userUuid, body);
        this.ok(res, result);
    }

    async deleteUserAdmin({ params }: Request<DeleteUserAdminRequestParamsDto>, res: Response) {
        const result = await this.userService.delete(params.userUuid);
        this.ok(res, result);
    }

    async addAdminUser({ body }: Request<object, object, AddAdminUserRequestDto>, res: Response) {
        const result = await this.userService.addAdminUser(body.email);
        this.ok(res, result);
    }

    async getStats({ query }: Request<object, object, object, GetStatsUsersRequestParamsDto>, res: Response) {
        const result = await this.userService.getStats(query);
        this.ok(res, result);
    }
}
