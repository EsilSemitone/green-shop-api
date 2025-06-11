import { PRODUCT_CATEGORY, SIZE } from 'contracts-green-shop';
import { CustomProductVariant } from './custom-product-variant.interface.ts';

export interface IGetProductVariantsByCriteriaExtendedData {
    limit: number;
    offset: number;
    category?: PRODUCT_CATEGORY;
    size?: SIZE;
    tags_id?: string[];
    priceFrom?: number;
    priceTo?: number;
    search?: string;
}

export interface IGetProductVariantsByCriteriaExtendedReturnType {
    products: CustomProductVariant[];
    count: number;
}
