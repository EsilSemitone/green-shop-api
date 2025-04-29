import { SIZE } from 'contracts';

export interface ICreateProductVariant {
    product_id: string;
    rating: number;
    price: number;
    size: SIZE;
    stock: number;
}
