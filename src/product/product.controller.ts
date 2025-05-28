import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { Controller } from '../common/abstract.controller';
import { ValidateMiddleware } from '../common/middlewares/validate.middleware';
import { Request, Response } from 'express';
import { APP_TYPES } from '../types';
import { AuthGuardFactory } from '../common/middlewares/auth.guard.factory';
import { CreateProductRequestSchema, CreateProductRequestDto } from 'contracts/product/create-product.js';
import { IController } from '../common/interfaces/controller.interface';
import { IProductService } from './interfaces/product.service.interface';
import {
    CreateProductVariantRequestDto,
    CreateProductVariantRequestParamsDto,
    CreateProductVariantRequestParamsSchema,
    CreateProductVariantRequestSchema,
    DeleteProductRequestParamsDto,
    DeleteProductRequestParamsSchema,
    DeleteProductVariantRequestParamsDto,
    DeleteProductVariantRequestParamsSchema,
    GetProductByUuidRequestParamsDto,
    GetProductByUuidRequestParamsSchema,
    GetProductVariantsByCriteriaRequestQueryDto,
    GetProductVariantsByCriteriaRequestQuerySchema,
    GetProductVariantsByProductRequestParamsDto,
    GetProductVariantsByProductRequestParamsSchema,
    GetProductVariantByUuidRequestParamsDto,
    GetProductVariantByUuidRequestParamsSchema,
    GetSimilarProductVariantsRequestDto,
    GetSimilarProductVariantsRequestSchema,
    UpdateProductRequestDto,
    UpdateProductRequestParamsDto,
    UpdateProductRequestParamsSchema,
    UpdateProductRequestSchema,
    UpdateProductVariantRequestDto,
    UpdateProductVariantRequestParamsDto,
    UpdateProductVariantRequestParamsSchema,
    UpdateProductVariantRequestSchema,
} from 'contracts';

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
                path: '/variants',
                method: 'get',
                func: this.getProductVariantsByCriteria,
                middlewares: [
                    new ValidateMiddleware([{ key: 'query', schema: GetProductVariantsByCriteriaRequestQuerySchema }]),
                ],
            },
            {
                path: '/variants/:uuid',
                method: 'get',
                func: this.getProductVariantByUuid,
                middlewares: [
                    new ValidateMiddleware([{ key: 'params', schema: GetProductVariantByUuidRequestParamsSchema }]),
                ],
            },
            {
                path: '/variants/similar',
                method: 'post',
                func: this.getSimilarProductVariants,
                middlewares: [
                    new ValidateMiddleware([{ key: 'body', schema: GetSimilarProductVariantsRequestSchema }]),
                ],
            },
            {
                path: '/filter',
                method: 'get',
                func: this.getProductFilter,
                middlewares: [],
            },
            {
                path: '/:uuid',
                method: 'get',
                func: this.getByUuid,
                middlewares: [new ValidateMiddleware([{ key: 'params', schema: GetProductByUuidRequestParamsSchema }])],
            },
            {
                path: '/:uuid',
                method: 'patch',
                func: this.update,
                middlewares: [
                    this.authGuardFactory.create(),
                    new ValidateMiddleware([
                        { key: 'params', schema: UpdateProductRequestParamsSchema },
                        { key: 'body', schema: UpdateProductRequestSchema },
                    ]),
                ],
            },
            {
                path: '/:uuid',
                method: 'delete',
                func: this.delete,
                middlewares: [
                    this.authGuardFactory.create(),
                    new ValidateMiddleware([{ key: 'params', schema: DeleteProductRequestParamsSchema }]),
                ],
            },
            {
                path: '/:productId/variant',
                method: 'post',
                func: this.createProductVariant,
                middlewares: [
                    this.authGuardFactory.create(),
                    new ValidateMiddleware([
                        { key: 'params', schema: CreateProductVariantRequestParamsSchema },
                        { key: 'body', schema: CreateProductVariantRequestSchema },
                    ]),
                ],
            },
            {
                path: '/:productId/variant/:uuid',
                method: 'patch',
                func: this.updateProductVariant,
                middlewares: [
                    this.authGuardFactory.create(),
                    new ValidateMiddleware([
                        { key: 'params', schema: UpdateProductVariantRequestParamsSchema },
                        { key: 'body', schema: UpdateProductVariantRequestSchema },
                    ]),
                ],
            },
            {
                path: '/:productId/variant/:uuid',
                method: 'delete',
                func: this.deleteProductVariant,
                middlewares: [
                    this.authGuardFactory.create(),
                    new ValidateMiddleware([{ key: 'params', schema: DeleteProductVariantRequestParamsSchema }]),
                ],
            },
            {
                path: '/:productId/variant',
                method: 'get',
                func: this.getProductVariantsByProduct,
                middlewares: [
                    new ValidateMiddleware([{ key: 'params', schema: GetProductVariantsByProductRequestParamsSchema }]),
                ],
            },
        ]);
    }

    async create({ body }: Request<object, object, CreateProductRequestDto, object, object>, res: Response) {
        const result = await this.productService.create(body);
        this.ok(res, result);
    }

    async update(
        { body, params }: Request<UpdateProductRequestParamsDto, object, UpdateProductRequestDto, object, object>,
        res: Response,
    ) {
        const result = await this.productService.update(params.uuid, body);
        this.ok(res, result);
    }

    async getByUuid(
        { params }: Request<GetProductByUuidRequestParamsDto, object, object, object, object>,
        res: Response,
    ) {
        const result = await this.productService.getByUuid(params.uuid);
        this.ok(res, result);
    }

    async delete({ params }: Request<DeleteProductRequestParamsDto, object, object, object, object>, res: Response) {
        const result = await this.productService.delete(params.uuid);
        this.ok(res, result);
    }

    //PRODUCT VARIANT

    async createProductVariant(
        {
            body,
            params,
        }: Request<CreateProductVariantRequestParamsDto, object, CreateProductVariantRequestDto, object, object>,
        res: Response,
    ) {
        const result = await this.productService.createProductVariant(params.productId, body);
        this.ok(res, result);
    }

    async updateProductVariant(
        {
            body,
            params,
        }: Request<UpdateProductVariantRequestParamsDto, object, UpdateProductVariantRequestDto, object, object>,
        res: Response,
    ) {
        const result = await this.productService.updateProductVariant(params.productId, params.uuid, body);
        this.ok(res, result);
    }

    async deleteProductVariant(
        { params }: Request<DeleteProductVariantRequestParamsDto, object, object, object, object>,
        res: Response,
    ) {
        const result = await this.productService.deleteProductVariant(params.productId, params.uuid);
        this.ok(res, result);
    }

    async getProductVariantsByProduct(
        { params }: Request<GetProductVariantsByProductRequestParamsDto, object, object, object, object>,
        res: Response,
    ) {
        const result = await this.productService.getProductVariantsByProduct(params.productId);
        this.ok(res, result);
    }

    async getProductVariantsByCriteria(
        { query }: Request<object, object, object, GetProductVariantsByCriteriaRequestQueryDto, object>,
        res: Response,
    ) {
        const result = await this.productService.getProductVariantsByCriteria(query);
        this.ok(res, result);
    }

    async getProductFilter(req: Request, res: Response) {
        const result = await this.productService.getProductFilter();
        this.ok(res, result);
    }

    async getSimilarProductVariants(
        { body }: Request<object, object, GetSimilarProductVariantsRequestDto>,
        res: Response,
    ) {
        const result = await this.productService.getSimilarProductVariants(body);
        this.ok(res, result);
    }

    async getProductVariantByUuid({ params }: Request<GetProductVariantByUuidRequestParamsDto>, res: Response) {
        const result = await this.productService.getProductVariantByUuid(params.uuid);
        this.ok(res, result);
    }
}
