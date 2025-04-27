import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { APP_TYPES } from '../types';
import { IDatabaseService } from '../core/database/database.service.interface';
import { IProductRepository } from './interfaces/product.repository.interface';
import { CreateProductRequestDto } from 'contracts/product/create-product';
import { ProductModel } from '../common/models/product-model.interface';

@injectable()
export class ProductRepository implements IProductRepository {
    constructor(@inject(APP_TYPES.DATABASE_SERVICE) private databaseService: IDatabaseService) {}

    async create(data: CreateProductRequestDto): Promise<ProductModel> {
        const newProduct = await this.databaseService.db<ProductModel>('products').insert(data).returning('*');
        return newProduct[0];
    }
}
