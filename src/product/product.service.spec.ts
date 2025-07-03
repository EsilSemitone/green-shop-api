import { Container } from 'inversify';
import { IProductService } from './interfaces/product.service.interface';
import { APP_TYPES } from '../types';
import { ILogger } from '../core/logger/logger.service.interface';
import { IProductRepository } from './interfaces/product.repository.interface';
import { ProductService } from './product.service';
import { ProductModel, ProductVariantModel } from '../common/models';
import { randomUUID } from 'crypto';
import {
    GetSimilarProductVariantsRequestDto,
    ORDER_BY_PRODUCT_VARIANTS_ENUM,
    PRODUCT_CATEGORY_ENUM,
    SIZE,
} from 'contracts-green-shop';
import { ERROR } from '../common/error/error';
import { CustomProductVariant, CustomProductVariantExtended } from './interfaces/custom-product-variant.interface';
import { IProductFilter } from './interfaces/product-filter.interface';
import { IGetProductVariantsByCriteriaExtendedReturnType } from './interfaces/get-product-variants-by-criteria.interface';

const PRODUCT: ProductModel = {
    uuid: randomUUID(),
    name: 'Продукт',
    short_description: 'Короткое описание',
    description: 'Описание',
    category: PRODUCT_CATEGORY_ENUM.ACCESSORIES,
    images: ['http://link1...', 'http://link2...'],
    created_at: new Date(),
    updated_at: new Date(),
};

const PRODUCT_VARIANT: ProductVariantModel = {
    uuid: randomUUID(),
    product_id: PRODUCT.uuid,
    rating: 0,
    price: 199,
    size: SIZE.LARGE,
    stock: 1,
    created_at: new Date(),
    updated_at: new Date(),
};

const loggerServiceMock: ILogger = {
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    setServiceName: jest.fn(),
};

const productRepositoryMock: jest.Mocked<IProductRepository> = {
    create: jest.fn(),
    getByUuid: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    createProductVariant: jest.fn(),
    updateProductVariant: jest.fn(),
    getProductVariantByUuid: jest.fn(),
    deleteProductVariant: jest.fn(),
    getProductVariantsByProduct: jest.fn(),
    getProductVariantsByCriteriaExtended: jest.fn(),
    getProductFilter: jest.fn(),
    getProductVariantExtended: jest.fn(),
    getAllProducts: jest.fn(),
    assignTagsForProductVariant: jest.fn(),
};

let productService: IProductService;

beforeAll(() => {
    const container = new Container();
    container.bind<ILogger>(APP_TYPES.LOGGER_SERVICE).toConstantValue(loggerServiceMock);
    container.bind<IProductRepository>(APP_TYPES.PRODUCT_REPOSITORY).toConstantValue(productRepositoryMock);
    container.bind<IProductService>(APP_TYPES.PRODUCT_SERVICE).to(ProductService);

    productService = container.get(APP_TYPES.PRODUCT_SERVICE);
});

describe('Product service', () => {
    describe('create', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { uuid, created_at, updated_at, ...createData } = PRODUCT;

        it('should create product', async () => {
            await productService.create(createData);
            expect(productRepositoryMock.create).toHaveBeenCalledWith(createData);
        });

        it('should return product', async () => {
            productRepositoryMock.create.mockResolvedValueOnce(PRODUCT);
            const result = await productService.create(createData);
            expect(result).toEqual(PRODUCT);
        });
    });

    describe('getByUuid', () => {
        it('should find product and return', async () => {
            productRepositoryMock.getByUuid.mockResolvedValueOnce(PRODUCT);
            const res = await productService.getByUuid(PRODUCT.uuid);
            expect(res).toEqual(PRODUCT);
            expect(productRepositoryMock.getByUuid).toHaveBeenCalledWith(PRODUCT.uuid);
        });

        it('should throw error', async () => {
            productRepositoryMock.getByUuid.mockResolvedValue(null);
            await expect(productService.getByUuid(PRODUCT.uuid)).rejects.toThrow();
        });
    });

    describe('update', () => {
        const updateData = {
            name: 'другое имя',
            short_description: 'другое короткое описание',
            description: 'другое описание',
            category: PRODUCT_CATEGORY_ENUM.BIG_PLANTS,
            images: ['http://linkOther...'],
        };

        it('should update product and return', async () => {
            const updatedProduct = { ...PRODUCT, ...updateData };

            productRepositoryMock.getByUuid.mockResolvedValueOnce(PRODUCT);
            productRepositoryMock.update.mockResolvedValueOnce(updatedProduct);

            const res = await productService.update(PRODUCT.uuid, updateData);
            expect(res).toEqual(updatedProduct);
            expect(productRepositoryMock.update).toHaveBeenCalledWith({ uuid: PRODUCT.uuid, data: updateData });
        });

        it('should throw error', async () => {
            productRepositoryMock.getByUuid.mockResolvedValue(null);
            await expect(productService.update(PRODUCT.uuid, updateData)).rejects.toThrow();
        });
    });

    describe('delete', () => {
        it('should delete product and return success', async () => {
            productRepositoryMock.getByUuid.mockResolvedValueOnce(PRODUCT);
            const res = await productService.delete(PRODUCT.uuid);

            expect(productRepositoryMock.delete).toHaveBeenCalledWith(PRODUCT.uuid);
            expect(res).toEqual({ isSuccess: true });
        });

        it('should throw error', async () => {
            productRepositoryMock.getByUuid.mockResolvedValue(null);
            await expect(productService.delete(PRODUCT.uuid)).rejects.toThrow();
        });
    });

    describe('createProductVariant', () => {
        const createData = { rating: 0, price: 199, size: SIZE.LARGE, stock: 1 };

        it('should create product variant and return', async () => {
            productRepositoryMock.getByUuid.mockResolvedValueOnce(PRODUCT);
            productRepositoryMock.createProductVariant.mockResolvedValueOnce(PRODUCT_VARIANT);

            const res = await productService.createProductVariant(PRODUCT.uuid, createData);

            expect(productRepositoryMock.createProductVariant).toHaveBeenCalledWith({
                product_id: PRODUCT.uuid,
                ...createData,
            });
            expect(res).toEqual(PRODUCT_VARIANT);
        });

        it('should throw error', async () => {
            productRepositoryMock.getByUuid.mockResolvedValue(null);

            await expect(productService.createProductVariant(PRODUCT.uuid, createData)).rejects.toThrow();
        });
    });

    describe('updateProductVariant', () => {
        const updateData = {
            rating: 2,
            price: 100,
            size: SIZE.MEDIUM,
            stock: 2,
        };

        it('should update product variant and return', async () => {
            productRepositoryMock.getByUuid.mockResolvedValueOnce(PRODUCT);
            productRepositoryMock.getProductVariantByUuid.mockResolvedValueOnce(PRODUCT_VARIANT);

            const updatedProduct = { ...PRODUCT_VARIANT, ...updateData };
            productRepositoryMock.updateProductVariant.mockResolvedValueOnce(updatedProduct);

            const res = await productService.updateProductVariant(PRODUCT.uuid, PRODUCT_VARIANT.uuid, updateData);
            expect(res).toBe(updatedProduct);
            expect(productRepositoryMock.updateProductVariant).toHaveBeenCalledWith({
                uuid: PRODUCT_VARIANT.uuid,
                ...updateData,
            });
        });

        it('should throw error (product not found)', async () => {
            productRepositoryMock.getByUuid.mockResolvedValueOnce(null);
            await expect(
                productService.updateProductVariant(PRODUCT.uuid, PRODUCT_VARIANT.uuid, updateData),
            ).rejects.toThrow(ERROR.PRODUCT_NOT_FOUND);
        });

        it('should throw error (product variant not found)', async () => {
            productRepositoryMock.getByUuid.mockResolvedValueOnce(PRODUCT);
            productRepositoryMock.getProductVariantByUuid.mockResolvedValueOnce(null);
            await expect(
                productService.updateProductVariant(PRODUCT.uuid, PRODUCT_VARIANT.uuid, updateData),
            ).rejects.toThrow(ERROR.PRODUCT_VARIANT_NOT_FOUND);
        });
    });

    describe('deleteProductVariant', () => {
        it('should delete product variant and return success', async () => {
            productRepositoryMock.getByUuid.mockResolvedValueOnce(PRODUCT);
            productRepositoryMock.getProductVariantByUuid.mockResolvedValueOnce(PRODUCT_VARIANT);

            const res = await productService.deleteProductVariant(PRODUCT.uuid, PRODUCT_VARIANT.uuid);

            expect(res).toEqual({ isSuccess: true });
            expect(productRepositoryMock.deleteProductVariant).toHaveBeenCalledWith(PRODUCT_VARIANT.uuid);
        });

        it('should throw error (product not found)', async () => {
            productRepositoryMock.getByUuid.mockResolvedValueOnce(null);
            await expect(productService.deleteProductVariant(PRODUCT.uuid, PRODUCT_VARIANT.uuid)).rejects.toThrow(
                ERROR.PRODUCT_NOT_FOUND,
            );
        });

        it('should throw error (product variant not found)', async () => {
            productRepositoryMock.getByUuid.mockResolvedValueOnce(PRODUCT);
            productRepositoryMock.getProductVariantByUuid.mockResolvedValueOnce(null);
            await expect(productService.deleteProductVariant(PRODUCT.uuid, PRODUCT_VARIANT.uuid)).rejects.toThrow(
                ERROR.PRODUCT_VARIANT_NOT_FOUND,
            );
        });
    });

    describe('getProductVariantsByProduct', () => {
        const productVariants: CustomProductVariantExtended[] = [
            { ...PRODUCT_VARIANT, tags: ['домашние растения', 'Инструменты для сада'], tags_id: ['1', '2'] },
            { ...PRODUCT_VARIANT, tags: ['домашние растения', 'Инструменты для сада'], tags_id: ['1', '2'] },
        ];

        it('should find product variants and return', async () => {
            productRepositoryMock.getByUuid.mockResolvedValueOnce(PRODUCT);
            productRepositoryMock.getProductVariantsByProduct.mockResolvedValueOnce(productVariants);

            const res = await productService.getProductVariantsByProduct(PRODUCT.uuid);

            expect(productRepositoryMock.getProductVariantsByProduct).toHaveBeenCalledWith(PRODUCT.uuid);
            expect(res).toEqual({
                ...PRODUCT,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                variants: productVariants,
            });
        });

        it('should throw error (product not found)', async () => {
            productRepositoryMock.getByUuid.mockResolvedValueOnce(null);
            await expect(productService.getProductVariantsByProduct(PRODUCT.uuid)).rejects.toThrow(
                ERROR.PRODUCT_NOT_FOUND,
            );
        });
    });

    describe('getProductVariantsByCriteria', () => {
        const productVariants: CustomProductVariant[] = [
            {
                uuid: randomUUID(),
                price: '1',
                name: 'Название',
                product_variant_id: randomUUID(),
                images: ['http://link1...', 'http://link2...'],
                tags_id: ['1', '2'],
                created_at: new Date('2025.10.11'),
            },
            {
                uuid: randomUUID(),
                price: '12',
                name: 'Название',
                product_variant_id: randomUUID(),
                images: ['http://link1...', 'http://link2...'],
                tags_id: ['1', '2'],
                created_at: new Date('2025.10.11'),
            },
        ];

        const query = {
            limit: 2,
            offset: 0,
            category: PRODUCT_CATEGORY_ENUM.ACCESSORIES,
            size: SIZE.LARGE,
            priceFrom: 0,
            priceTo: 1000,
            search: 'Грабли',
            orderBy: ORDER_BY_PRODUCT_VARIANTS_ENUM.FIRST_NEW,
        };

        it('should find product variants and return', async () => {
            productRepositoryMock.getProductVariantsByCriteriaExtended.mockResolvedValueOnce({
                count: 2,
                products: productVariants,
            });

            const result = await productService.getProductVariantsByCriteria(query);

            expect(productRepositoryMock.getProductVariantsByCriteriaExtended).toHaveBeenCalledWith(query);
            expect(result).toEqual({
                page: 1,
                totalPage: 1,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                products: productVariants.map(({ price, images, created_at, ...otherProps }) => {
                    return {
                        ...otherProps,
                        price: Number(Number(price).toFixed(2)),
                        image: images[0] || null,
                    };
                }),
            });
        });

        it('should calculate totalPage correctly when count > limit', async () => {
            productRepositoryMock.getProductVariantsByCriteriaExtended.mockResolvedValueOnce({
                count: 5,
                products: productVariants,
            });

            const newQuery = { ...query, limit: 2, offset: 2 };
            const result = await productService.getProductVariantsByCriteria(newQuery);

            expect(result.page).toBe(2);
            expect(result.totalPage).toBe(3);
        });

        it('should return empty products and correct pagination for empty result', async () => {
            productRepositoryMock.getProductVariantsByCriteriaExtended.mockResolvedValueOnce({
                count: 0,
                products: [],
            });

            const newQuery = { ...query, limit: 2, offset: 2 };

            const result = await productService.getProductVariantsByCriteria(newQuery);

            expect(result.products).toEqual([]);
            expect(result.totalPage).toBe(0);
            expect(result.page).toBe(1);
        });
    });

    describe('getProductFilter', () => {
        it('should find product filter and return', async () => {
            const returnValue: IProductFilter = {
                categories: [{ category: PRODUCT_CATEGORY_ENUM.ACCESSORIES, count: 1 }],
                sizes: [{ size: SIZE.LARGE, count: 1 }],
                prices: { min: 1, max: 1000 },
            };

            productRepositoryMock.getProductFilter.mockResolvedValueOnce(returnValue);

            const result = await productService.getProductFilter();

            expect(productRepositoryMock.getProductFilter).toHaveBeenCalled();
            expect(result).toEqual(returnValue);
        });
    });

    describe('getSimilarProductVariants', () => {
        it('find similar product variants and return', async () => {
            const query: GetSimilarProductVariantsRequestDto = {
                limit: 2,
                category: PRODUCT_CATEGORY_ENUM.ACCESSORIES,
                tags_id: ['1'],
            };

            const repositoryReturn: IGetProductVariantsByCriteriaExtendedReturnType = {
                products: [
                    {
                        uuid: randomUUID(),
                        price: '1',
                        name: 'Название',
                        product_variant_id: randomUUID(),
                        images: ['http://link1...', 'http://link2...'],
                        tags_id: ['1', '2'],
                        created_at: new Date('2025.10.11'),
                    },
                    {
                        uuid: randomUUID(),
                        price: '12',
                        name: 'Название',
                        product_variant_id: randomUUID(),
                        images: [],
                        tags_id: [],
                        created_at: new Date('2025.10.11'),
                    },
                ],
                count: 0,
            };

            productRepositoryMock.getProductVariantsByCriteriaExtended.mockResolvedValueOnce(repositoryReturn);

            const res = await productService.getSimilarProductVariants(query);

            expect(productRepositoryMock.getProductVariantsByCriteriaExtended).toHaveBeenCalledWith({
                ...query,
                orderBy: ORDER_BY_PRODUCT_VARIANTS_ENUM.FIRST_NEW,
                offset: 0,
            });
            expect(res[0].price).toBe('1.00');
            expect(res[0].image).toBe('http://link1...');
        });
    });

    describe('getProductVariantByUuid', () => {
        it('should find product variant and return', async () => {
            const findRepositoryResult = {
                uuid: PRODUCT_VARIANT.uuid,
                price: '1',
                name: 'Название',
                product_variant_id: randomUUID(),
                images: ['http://link1...', 'http://link2...'],
                tags_id: ['1', '2'],
                created_at: new Date('2025.10.11'),
            };
            productRepositoryMock.getProductVariantExtended.mockResolvedValue(findRepositoryResult);

            const result = await productService.getProductVariantByUuid(PRODUCT_VARIANT.uuid);

            expect(productRepositoryMock.getProductVariantExtended).toHaveBeenCalledWith({
                uuid: PRODUCT_VARIANT.uuid,
            });

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { images, price, ...otherProps } = findRepositoryResult;

            expect(result).toEqual({
                ...otherProps,
                price: 1.0,
                name: findRepositoryResult.name,
                image: images[0],
            });
        });

        it('should throw error ', async () => {
            productRepositoryMock.getProductVariantExtended.mockResolvedValue(null);

            await expect(productService.getProductVariantByUuid(PRODUCT_VARIANT.uuid)).rejects.toThrow(
                ERROR.PRODUCT_VARIANT_NOT_FOUND,
            );
        });
    });
});
