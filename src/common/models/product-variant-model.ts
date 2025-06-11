import { SIZE } from 'contracts-green-shop';

export interface ProductVariantModel {
    uuid: string;
    product_id: string;
    rating: number;
    price: number;
    size: SIZE;
    stock: number;
    created_at: Date;
    updated_at: Date;
}
