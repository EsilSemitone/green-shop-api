import { ProductVariantModel } from '../../common/models/product-variant-model.ts';

export interface CustomProductVariant {
    uuid: string;
    price: string;
    name: string;
    product_variant_id: string;
    images: string[];
    tags_id: string[];
    created_at: Date
}

export interface CustomProductVariantExtended extends ProductVariantModel {
    tags: string[];
    tags_id: string[];
}
