import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { APP_TYPES } from '../types';
import { IDatabaseService } from '../core/database/database.service.interface';
import { IProductRepository } from './interfaces/product.repository.interface';
import { CreateProductRequestDto } from 'contracts/product/create-product';
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
import { CustomProductVariantExtended } from './interfaces/custom-product-variant.interface';
import { ProductVariantTagsModel } from '../common/models/product-variant-tags-model.interface';

@injectable()
export class ProductRepository implements IProductRepository {
    constructor(@inject(APP_TYPES.DATABASE_SERVICE) private databaseService: IDatabaseService) {}

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
            .update({ ...data })
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
            .update(data)
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
                )
                .from('product_variants')
                .whereBetween('price', [priceFrom ? Number(priceFrom) : 0, priceTo ? Number(priceTo) : 100000])
                .join('product_filter as pf', 'product_variants.product_id', 'pf.uuid')
                .join('product_tags as pt', 'product_variants.uuid', 'pt.product_variant_id');
            if (size) {
                q.andWhere({ size });
            }
            return q;
        };

        const baseQuery = query();

        const [products, count] = await Promise.all([
            baseQuery.clone().limit(limit).offset(offset),
            this.databaseService.db.from(baseQuery.clone().as('subquery')).count<{ count: string }[]>('* as count'),
        ]);

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
}
