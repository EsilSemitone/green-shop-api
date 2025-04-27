import { CreateProductRequestDto } from 'contracts/product/create-product';
import { ProductModel } from '../../common/models/product-model.interface';

export interface IProductRepository {
    create(data: CreateProductRequestDto): Promise<ProductModel>;
}
