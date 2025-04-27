import { PRODUCT_CATEGORY } from 'contracts/enums/product-category';

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
