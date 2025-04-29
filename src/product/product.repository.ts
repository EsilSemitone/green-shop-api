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
    IGetProductVariantsByCriteria,
    IGetProductVariantsByCriteriaExtendedReturnType,
} from './interfaces/get-product-variants-by-criteria.interface';
import { GetProductVariantsByCriteriaRequestQueryDto } from 'contracts';

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

    async getProductVariantsByCriteria(filter: IGetProductVariantsByCriteria): Promise<ProductVariantModel[]> {
        const productVariants = await this.databaseService.db<ProductVariantModel>('product_variants').where(filter);
        return productVariants;
    }

    async getProductVariantsByCriteriaExtended({
        limit,
        offset,
        priceFrom,
        priceTo,
        category,
        size,
        search,
    }: GetProductVariantsByCriteriaRequestQueryDto): Promise<IGetProductVariantsByCriteriaExtendedReturnType> {
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

        const query = () => {
            const q = this.databaseService.db
                .with('product_filter', buildProductQuery())
                .select(
                    'pf.uuid as uuid',
                    'product_variants.price as price',
                    'pf.name as name',
                    'product_variants.uuid as product_variant_id',
                    'pf.images as images',
                )
                .from('product_variants')
                .whereBetween('price', [priceFrom ? Number(priceFrom) : 0, priceTo ? Number(priceTo) : 100000])
                .join('product_filter as pf', 'product_variants.product_id', 'pf.uuid');
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
}
