import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { IProductService } from './interfaces/product.service.interface.ts';
import { ILogger } from '../core/logger/logger.service.interface.ts';
import { APP_TYPES } from '../types';
import { CreateProductRequestDto, CreateProductResponseDto } from 'contracts-green-shop/product/create-product';
import { IProductRepository } from './interfaces/product.repository.interface.ts';
import {
    CreateProductVariantRequestDto,
    CreateProductVariantResponseDto,
    DeleteProductResponseDto,
    DeleteProductVariantResponseDto,
    GetProductByUuidResponseDto,
    GetProductFilterResponseDto,
    GetProductVariantsByCriteriaRequestQueryDto,
    GetProductVariantsByCriteriaResponseDto,
    GetProductVariantsByProductResponseDto,
    GetProductVariantByUuidResponseDto,
    GetSimilarProductVariantsRequestDto,
    GetSimilarProductVariantsResponseDto,
    UpdateProductRequestDto,
    UpdateProductResponseDto,
    UpdateProductVariantRequestDto,
    UpdateProductVariantResponseDto,
    GetAllProductsRequestQueryDto,
    GetAllProductsResponseDto,
    ORDER_BY_PRODUCT_VARIANTS_ENUM,
} from 'contracts-green-shop';
import { HttpException } from '../common/exceptionFilter/http.exception';
import { ERROR } from '../common/error/error';

@injectable()
export class ProductService implements IProductService {
    constructor(
        @inject(APP_TYPES.LOGGER_SERVICE) private loggerService: ILogger,
        @inject(APP_TYPES.PRODUCT_REPOSITORY) private productRepository: IProductRepository,
    ) {
        this.loggerService.setServiceName(ProductService.name);
    }

    async getAllProducts(query: GetAllProductsRequestQueryDto): Promise<GetAllProductsResponseDto> {
        this.loggerService.log(`Start service getAllProducts with params ${JSON.stringify(query)}`);

        const { products, count } = await this.productRepository.getAllProducts(query);

        const page = Math.floor(query.offset / query.limit) + (count > 0 ? 1 : 0);
        const totalPage = Math.ceil(count / query.limit);

        this.loggerService.log('success service getAllProducts');
        return {
            products,
            page,
            totalPage,
        };
    }

    async create(data: CreateProductRequestDto): Promise<CreateProductResponseDto> {
        this.loggerService.log(`Start service create product with params: ${JSON.stringify({ ...data })}`);

        const newProduct = await this.productRepository.create(data);

        this.loggerService.log('Success service create product');
        return newProduct;
    }

    async getByUuid(uuid: string): Promise<GetProductByUuidResponseDto> {
        this.loggerService.log(`Start service getByUuid product with params: ${JSON.stringify({ uuid })}`);

        const product = await this.productRepository.getByUuid(uuid);

        if (!product) {
            throw new HttpException(ERROR.PRODUCT_NOT_FOUND, 404);
        }
        this.loggerService.log('Success service getByUuid product');
        return product;
    }

    async update(uuid: string, data: UpdateProductRequestDto): Promise<UpdateProductResponseDto> {
        this.loggerService.log(`Start service update product with params: ${JSON.stringify(data)}`);
        const product = await this.productRepository.getByUuid(uuid);

        if (!product) {
            throw new HttpException(ERROR.PRODUCT_NOT_FOUND, 404);
        }

        const updatedProduct = await this.productRepository.update({ uuid, data });

        this.loggerService.log('Success service update product');
        return updatedProduct;
    }

    async delete(uuid: string): Promise<DeleteProductResponseDto> {
        this.loggerService.log(`Start service delete product with params: ${JSON.stringify({ uuid })}`);

        const product = await this.productRepository.getByUuid(uuid);

        if (!product) {
            throw new HttpException(ERROR.PRODUCT_NOT_FOUND, 404);
        }

        await this.productRepository.delete(uuid);
        this.loggerService.log('Success service delete product');
        return {
            isSuccess: true,
        };
    }

    //PRODUCT VARIANT

    async createProductVariant(
        productId: string,
        data: CreateProductVariantRequestDto,
    ): Promise<CreateProductVariantResponseDto> {
        this.loggerService.log(
            `Start service create product variant with params: ${JSON.stringify({ productId, ...data })}`,
        );

        const product = await this.productRepository.getByUuid(productId);

        if (!product) {
            throw new HttpException(ERROR.PRODUCT_NOT_FOUND, 404);
        }

        const { tags, ...createData } = data;
        const currentCreateData = { ...createData, rating: 0 };

        const newProduct = await this.productRepository.createProductVariant({
            product_id: productId,
            ...currentCreateData,
        });

        if (tags && tags.length > 0) {
            await this.productRepository.assignTagsForProductVariant(
                tags.map((t) => {
                    return { product_variant_id: newProduct.uuid, tag_id: t };
                }),
            );
        }
        this.loggerService.log('Success service create product variant ');
        return newProduct;
    }

    async updateProductVariant(
        productId: string,
        uuid: string,
        data: UpdateProductVariantRequestDto,
    ): Promise<UpdateProductVariantResponseDto> {
        this.loggerService.log(
            `Start service update product variant with params: ${JSON.stringify({ productId, ...data })}`,
        );

        const product = await this.productRepository.getByUuid(productId);

        if (!product) {
            throw new HttpException(ERROR.PRODUCT_NOT_FOUND, 404);
        }

        const productVariant = await this.productRepository.getProductVariantByUuid(uuid);

        if (!productVariant) {
            throw new HttpException(ERROR.PRODUCT_VARIANT_NOT_FOUND, 404);
        }

        const updatedProduct = await this.productRepository.updateProductVariant({ uuid: uuid, ...data });

        this.loggerService.log('Success service update product variant ');
        return updatedProduct;
    }

    async deleteProductVariant(productId: string, uuid: string): Promise<DeleteProductVariantResponseDto> {
        this.loggerService.log(
            `Start service delete product variant with params: ${JSON.stringify({ productId, uuid })}`,
        );

        const product = await this.productRepository.getByUuid(productId);

        if (!product) {
            throw new HttpException(ERROR.PRODUCT_NOT_FOUND, 404);
        }

        const productVariant = await this.productRepository.getProductVariantByUuid(uuid);

        if (!productVariant) {
            throw new HttpException(ERROR.PRODUCT_VARIANT_NOT_FOUND, 404);
        }

        await this.productRepository.deleteProductVariant(uuid);

        this.loggerService.log('Success service delete product variant ');
        return {
            isSuccess: true,
        };
    }

    async getProductVariantsByProduct(productId: string): Promise<GetProductVariantsByProductResponseDto> {
        this.loggerService.log(
            `Start service get product variants by product with params: ${JSON.stringify({ productId })}`,
        );

        const product = await this.productRepository.getByUuid(productId);

        if (!product) {
            throw new HttpException(ERROR.PRODUCT_NOT_FOUND, 404);
        }

        const variants = await this.productRepository.getProductVariantsByProduct(productId);

        this.loggerService.log('Success service get product variants by product');
        return { ...product, variants };
    }

    async getProductVariantsByCriteria(
        query: GetProductVariantsByCriteriaRequestQueryDto,
    ): Promise<GetProductVariantsByCriteriaResponseDto> {
        this.loggerService.log(
            `Start service get product variants by criteria with params: ${JSON.stringify({ query })}`,
        );

        const { products, count } = await this.productRepository.getProductVariantsByCriteriaExtended(query);
        const page = Math.floor(query.offset / query.limit) + (count > 0 ? 1 : 0);
        const totalPage = Math.ceil(count / query.limit);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const currentProducts = products.map(({ price, images, created_at, ...otherProps }) => {
            return {
                ...otherProps,
                price: Number(Number(price).toFixed(2)),
                image: images[0] || null,
            };
        });

        this.loggerService.log('Success service get product criteria by product');
        return {
            products: currentProducts,
            totalPage,
            page,
        };
    }

    async getProductFilter(): Promise<GetProductFilterResponseDto> {
        this.loggerService.log(`Start service get product filter`);

        const filter = await this.productRepository.getProductFilter();

        this.loggerService.log('Success service get product filter');
        return filter;
    }

    async getSimilarProductVariants(
        dto: GetSimilarProductVariantsRequestDto,
    ): Promise<GetSimilarProductVariantsResponseDto> {
        this.loggerService.log(`Start service get product filter`);

        const { products } = await this.productRepository.getProductVariantsByCriteriaExtended({
            ...dto,
            offset: 0,
            orderBy: ORDER_BY_PRODUCT_VARIANTS_ENUM.FIRST_NEW,
        });

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const currentProducts = products.map(({ price, images, created_at, ...otherProps }) => {
            return {
                ...otherProps,
                price: Number(price).toFixed(2),
                image: images[0] || null,
            };
        });
        this.loggerService.log('Success service get product filter');
        return currentProducts;
    }

    async getProductVariantByUuid(uuid: string): Promise<GetProductVariantByUuidResponseDto> {
        this.loggerService.log(`Start service get product variant by uuid ${JSON.stringify({ uuid })}`);

        const variant = await this.productRepository.getProductVariantExtended({ uuid });

        if (!variant) {
            throw new HttpException(ERROR.PRODUCT_VARIANT_NOT_FOUND, 404);
        }

        const { images, price, ...otherProps } = variant;

        this.loggerService.log('Success service get product variant by uuid');
        return { ...otherProps, image: images[0] || null, price: Number(Number(price).toFixed(2)) };
    }
}
