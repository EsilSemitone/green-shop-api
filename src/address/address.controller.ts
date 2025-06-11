import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { Controller } from '../common/abstract.controller.ts';
import { IController } from '../common/interfaces/controller.interface.ts';
import { AuthGuardFactory } from '../common/middlewares/auth.guard.factory.ts';
import { APP_TYPES } from '../types.ts';
import { ValidateMiddleware } from '../common/middlewares/validate.middleware.ts';
import {
    CreateAddressRequestDto,
    CreateAddressRequestSchema,
    DeleteAddressRequestParamsDto,
    DeleteAddressRequestParamsSchema,
} from 'contracts-green-shop';
import { Request, Response } from 'express';
import { IAddressService } from './interfaces/address.service.interface.ts';

@injectable()
export class AddressController extends Controller implements IController {
    constructor(
        @inject(APP_TYPES.AUTH_GUARD_FACTORY) private authGuardFactory: AuthGuardFactory,
        @inject(APP_TYPES.ADDRESS_SERVICE) private addressService: IAddressService,
    ) {
        super();
        this.bindRouts([
            {
                path: '/',
                method: 'post',
                func: this.createAddress,
                middlewares: [
                    this.authGuardFactory.create(),
                    new ValidateMiddleware([{ key: 'body', schema: CreateAddressRequestSchema }]),
                ],
            },
            {
                path: '/:addressUuid',
                method: 'delete',
                func: this.deleteAddress,
                middlewares: [
                    this.authGuardFactory.create(),
                    new ValidateMiddleware([{ key: 'params', schema: DeleteAddressRequestParamsSchema }]),
                ],
            },
            {
                path: '/all',
                method: 'get',
                func: this.getAll,
                middlewares: [this.authGuardFactory.create()],
            },
        ]);
    }

    async createAddress({ user, body }: Request<object, object, CreateAddressRequestDto>, res: Response) {
        const userId = user?.userId;
        const result = await this.addressService.create(userId!, body);
        this.ok(res, result);
    }

    async deleteAddress({ params }: Request<DeleteAddressRequestParamsDto>, res: Response) {
        const result = await this.addressService.delete(params.addressUuid);
        this.ok(res, result);
    }

    async getAll({ user }: Request, res: Response) {
        const userId = user?.userId;
        const result = await this.addressService.getAll(userId!);
        this.ok(res, result);
    }
}