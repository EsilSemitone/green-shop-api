import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { Controller } from '../common/abstract.controller';
import { ValidateMiddleware } from '../common/middlewares/validate.middleware';
import { Request, Response } from 'express';
import { APP_TYPES } from '../types';
import { AuthGuardFactory } from '../common/middlewares/auth.guard.factory';
import { CreateProductRequestSchema, CreateProductRequestDto } from 'contracts/product/create-product.js';
// import { UpdateProductRequestDto } from 'contracts/product/update-product.js';
import { IController } from '../common/interfaces/controller.interface';
import { IProductService } from './interfaces/product.service.interface';
import { GetProductByUuidRequestParamsDto, GetProductByUuidRequestParamsSchema } from 'contracts';
// import { GetProductByUuid } from 'contracts/product/get-product-by-uuid.js';

@injectable()
export class ProductController extends Controller implements IController {
    constructor(
        @inject(APP_TYPES.AUTH_GUARD_FACTORY) private authGuardFactory: AuthGuardFactory,
        @inject(APP_TYPES.PRODUCT_SERVICE) private productService: IProductService,
    ) {
        super();

        this.bindRouts([
            {
                path: '/',
                method: 'post',
                func: this.create,
                middlewares: [
                    this.authGuardFactory.create(),
                    new ValidateMiddleware([{ key: 'body', schema: CreateProductRequestSchema }]),
                ],
            },
            {
                path: '/:uuid',
                method: 'get',
                func: this.getByUuid,
                middlewares: [new ValidateMiddleware([{ key: 'params', schema: GetProductByUuidRequestParamsSchema }])],
            },
        ]);
    }

    async create({ body }: Request<object, object, CreateProductRequestDto, object, object>, res: Response) {
        const result = await this.productService.create(body);
        this.ok(res, result);
    }

    // async update({ body }: Request<object, object, UpdateProductRequestDto, object, object>, res: Response) {}

    async getByUuid(
        req: Request<Partial<GetProductByUuidRequestParamsDto>, object, object, object, object>,
        res: Response,
    ) {
        this.ok(res, req.params.uuid!);
    }

    // async delete(req: Request<{ uuid: string }, object, object, object, object>, res: Response) {}
}
