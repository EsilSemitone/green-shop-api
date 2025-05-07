import { ProductVariantModel } from '../../common/models/product-variant-model';

export interface CustomProductVariant {
    uuid: string;
    price: string;
    name: string;
    product_variant_id: string;
    images: string[];
}

export interface CustomProductVariantExtended extends ProductVariantModel {
    tags: string[];
    tags_id: string[]
}
