import { ProductModel } from '../../common/models';

export interface IGetAllProductsQuery {
    limit: number;
    offset: number;
    search?: string;
}

export interface IGetAllProductsReturn {
    products: ProductModel[];
    count: number;
}
