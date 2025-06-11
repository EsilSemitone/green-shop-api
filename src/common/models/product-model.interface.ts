import { PRODUCT_CATEGORY } from 'contracts-green-shop/enums/product-category.ts';

export interface ProductModel {
    uuid: string;
    name: string;
    short_description: string;
    description: string;
    category: PRODUCT_CATEGORY;
    images: string[];
    created_at: Date;
    updated_at: Date;
}
