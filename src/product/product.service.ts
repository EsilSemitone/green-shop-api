import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { IProductService } from './interfaces/product.service.interface';
import { ILogger } from '../core/logger/logger.service.interface';
import { APP_TYPES } from '../types';
import { CreateProductRequestDto, CreateProductResponseDto } from 'contracts/product/create-product';
import { IProductRepository } from './interfaces/product.repository.interface';

@injectable()
export class ProductService implements IProductService {
    constructor(
        @inject(APP_TYPES.LOGGER_SERVICE) private loggerService: ILogger,
        @inject(APP_TYPES.PRODUCT_REPOSITORY) private productRepository: IProductRepository,
    ) {
        this.loggerService.setServiceName(ProductService.name);
    }

    async create(data: CreateProductRequestDto): Promise<CreateProductResponseDto> {
        this.loggerService.log(`Start service create product with params: ${JSON.stringify({ ...data })}`);

        const newProduct = await this.productRepository.create(data);

        this.loggerService.log('Success service create product');
        return newProduct;
    }
}
