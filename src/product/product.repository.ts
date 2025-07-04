import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { APP_TYPES } from '../types';
import { IDatabaseService } from '../core/database/database.service.interface';
import { IProductRepository } from './interfaces/product.repository.interface';
import { CreateProductRequestDto } from 'contracts-green-shop/product/create-product';
import { ProductModel } from '../common/models/product-model.interface';
import { IUpdateProduct } from './interfaces/update-product.interface';
import { ICreateProductVariant } from './interfaces/create-product-variant.interface';
import { ProductVariantModel } from '../common/models/product-variant-model';
import { IUpdateProductVariant } from './interfaces/update-product-variant.interface';
import {
    IGetProductVariantsByCriteriaExtendedData,
    IGetProductVariantsByCriteriaExtendedReturnType,
} from './interfaces/get-product-variants-by-criteria.interface';
import { IProductFilter } from './interfaces/product-filter.interface';
import { CustomProductVariant, CustomProductVariantExtended } from './interfaces/custom-product-variant.interface';
import { ProductVariantTagsModel } from '../common/models/product-variant-tags-model.interface';
import { IGetProductVariantExtended } from './interfaces/get-product-cariant-extended.interface';
import { IGetAllProductsQuery, IGetAllProductsReturn } from './interfaces/get-all-products-query.interface';
import { IAssignTagsForProductVariantQuery } from './interfaces/assign-tags-for-product-variant';
import { orderByProductVariantMap } from './constants/order-by-product-variants-map';

@injectable()
export class ProductRepository implements IProductRepository {
    constructor(@inject(APP_TYPES.DATABASE_SERVICE) private databaseService: IDatabaseService) {}

    async getAllProducts(query: IGetAllProductsQuery): Promise<IGetAllProductsReturn> {
        const { limit, offset, search } = query;

        const buildQuery = () => {
            const query = this.databaseService.db<ProductModel>('products');

            if (search) {
                query.where((builder) => {
                    builder.whereLike('name', `%${search}%`);
                    builder.orWhereLike('short_description', `%${search}%`);
                    builder.orWhereLike('description', `%${search}%`);
                });
            }
            query.orderBy('updated_at', 'desc');

            return query;
        };

        const [products, count] = await Promise.all([
            await buildQuery().limit(limit).offset(offset),
            await this.databaseService.db.from(buildQuery()).count<{ count: string }[]>('* as count'),
        ]);

        return {
            products,
            count: Number(count[0].count),
        };
    }

    async create(data: CreateProductRequestDto): Promise<ProductModel> {
        const newProduct = await this.databaseService.db<ProductModel>('products').insert(data).returning('*');
        return newProduct[0];
    }

    async getByUuid(uuid: string): Promise<ProductModel | null> {
        const product = await this.databaseService.db<ProductModel>('products').where({ uuid }).first();
        return product || null;
    }

    async update({ uuid, data }: IUpdateProduct): Promise<ProductModel> {
        const [updatedProduct] = await this.databaseService
            .db<ProductModel>('products')
            .update({ ...data, updated_at: new Date() })
            .where({ uuid })
            .returning('*');
        return updatedProduct;
    }

    async delete(uuid: string): Promise<void> {
        await this.databaseService.db<ProductModel>('products').delete().where({ uuid });
    }

    //PRODUCT VARIANT

    async createProductVariant(data: ICreateProductVariant): Promise<ProductVariantModel> {
        const newProduct = await this.databaseService
            .db<ProductVariantModel>('product_variants')
            .insert(data)
            .returning('*');
        return newProduct[0];
    }

    async updateProductVariant({ uuid, ...data }: IUpdateProductVariant): Promise<ProductVariantModel> {
        const updatedProduct = await this.databaseService
            .db<ProductVariantModel>('product_variants')
            .update({ ...data, updated_at: new Date() })
            .where({ uuid })
            .returning('*');
        return updatedProduct[0];
    }

    async getProductVariantByUuid(uuid: string): Promise<ProductVariantModel | null> {
        const product = await this.databaseService.db<ProductVariantModel>('product_variants').where({ uuid }).first();
        return product || null;
    }

    async getProductVariantsByProduct(productId: string): Promise<CustomProductVariantExtended[]> {
        const productVariants = await this.databaseService.db
            .with(
                'product_tags',
                this.databaseService
                    .db<ProductVariantTagsModel>('product_variant_tags')
                    .select('product_variant_id', 'tag_id'),
            )
            .select([
                'pv.*',
                this.databaseService.db.raw('array_agg(t.name) as tags'),
                this.databaseService.db.raw('array_agg(t.uuid) as tags_id'),
            ])
            .from({ pv: 'product_variants' })
            .join({ pt: 'product_tags' }, 'pv.uuid', 'pt.product_variant_id')
            .join({ t: 'tags' }, 'pt.tag_id', 't.uuid')
            .where({ product_id: productId })
            .groupBy('pv.uuid');

        return productVariants;
    }

    async getProductVariantsByCriteriaExtended({
        limit,
        offset,
        priceFrom,
        tags_id,
        priceTo,
        category,
        size,
        search,
        orderBy,
    }: IGetProductVariantsByCriteriaExtendedData): Promise<IGetProductVariantsByCriteriaExtendedReturnType> {
        const buildProductQuery = () => {
            const query = this.databaseService.db<ProductModel>('products').select('uuid', 'name', 'images');
            if (category) {
                query.where({ category });
            }
            if (search) {
                query.andWhereILike('name', `%${search}%`);
            }
            return query;
        };

        const buildTagsQuery = () => {
            const query = this.databaseService
                .db<ProductVariantTagsModel>('product_variant_tags')
                .select('product_variant_id', 'tag_id');
            if (tags_id) {
                query.whereIn('tag_id', tags_id);
            }
            return query;
        };

        const query = () => {
            const q = this.databaseService.db
                .with('product_filter', buildProductQuery())
                .with('product_tags', buildTagsQuery())
                .select(
                    this.databaseService.db.raw('DISTINCT product_variants.uuid as product_variant_id'),
                    'pf.uuid as uuid',
                    'product_variants.price as price',
                    'pf.name as name',
                    'pf.images as images',
                    'product_variants.created_at as created_at',
                )
                .from('product_variants')
                .whereBetween('price', [priceFrom ? Number(priceFrom) : 0, priceTo ? Number(priceTo) : 100000])
                .where(this.databaseService.db.raw('product_variants.stock > 0'))
                .join('product_filter as pf', 'product_variants.product_id', 'pf.uuid')
                .join('product_tags as pt', 'product_variants.uuid', 'pt.product_variant_id');
            if (size) {
                q.andWhere({ size });
            }

            const res = orderByProductVariantMap.get(orderBy);
            const currentOrderBy: [string, string] = res ? res : ['product_variants.created_at', 'desc'];

            q.orderBy(...currentOrderBy);

            return q;
        };

        const baseQuery = query();

        const [products, count] = await Promise.all([
            baseQuery.clone().limit(limit).offset(offset),
            this.databaseService.db.from(baseQuery.clone().as('subquery')).count<{ count: string }[]>('* as count'),
        ]);
        console.log(products);

        return { products: products, count: Number(count[0].count) };
    }

    async deleteProductVariant(uuid: string): Promise<void> {
        await this.databaseService.db<ProductVariantModel>('product_variants').delete().where({ uuid });
    }

    async getProductFilter(): Promise<IProductFilter> {
        const result = await this.databaseService.db.raw(`
            select json_build_object (
                'categories', (
                    select json_agg(
                        json_build_object(
                            'category', category,
                            'count', count_category
                        )) from (
                                select category, count(*) as count_category from products
                                group by category
                        ) as categories
                ),
                'sizes', (
                    select json_agg(
                        json_build_object(
                            'size', size,
                            'count', count_size
                        )) from (
                                select size, count(*) as count_size from product_variants
                                group by size
                        ) as sizes
                ),
                    'prices', (
                    select json_build_object(
                            'min', min(price),
                            'max', max(price)
                        ) from product_variants
                )
            );
        `);

        const filter = result.rows[0].json_build_object;

        return {
            ...filter,
            prices: {
                min: Number.parseFloat(filter.prices.min),
                max: Number.parseFloat(filter.prices.max),
            },
        };
    }

    async getProductVariantExtended({ uuid }: IGetProductVariantExtended): Promise<CustomProductVariant | null> {
        const buildProductQuery = () => {
            const query = this.databaseService.db<ProductModel>('products').select('uuid', 'name', 'images');
            return query;
        };
        const buildProductVariantTagsQuery = () => {
            const query = this.databaseService
                .db<ProductVariantTagsModel>('product_variant_tags')
                .select('tag_id', 'product_variant_id');
            return query;
        };
        const result: CustomProductVariant | null = await this.databaseService.db
            .with('product', buildProductQuery())
            .with('pv_tags', buildProductVariantTagsQuery())
            .select(
                'pv.uuid as product_variant_id',
                'pd.uuid as uuid',
                'pv.price as price',
                'pd.name as name',
                'pd.images as images',
                this.databaseService.db.raw('array_agg(pv_tags.tag_id) as tags_id'),
            )
            .from({ pv: 'product_variants' })
            .where({ 'pv.uuid': uuid })
            .join('product as pd', 'pv.product_id', 'pd.uuid')
            .join('pv_tags', 'pv_tags.product_variant_id', 'pv.uuid')
            .groupBy('pv.uuid', 'pd.uuid', 'pv.price', 'pd.name', 'pd.images')
            .first();

        return result || null;
    }

    async assignTagsForProductVariant(query: IAssignTagsForProductVariantQuery): Promise<void> {
        await this.databaseService.db<ProductVariantTagsModel>('product_variant_tags').insert(query);
    }
}
