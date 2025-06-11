import { SIZE } from 'contracts-green-shop';

export interface ICreateProductVariant {
    product_id: string;
    rating: number;
    price: number;
    size: SIZE;
    stock: number;
}
