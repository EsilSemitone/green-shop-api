import { ORDER_BY_PRODUCT_VARIANTS, PRODUCT_CATEGORY, SIZE } from 'contracts-green-shop';
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
    orderBy: ORDER_BY_PRODUCT_VARIANTS;
}

export interface IGetProductVariantsByCriteriaExtendedReturnType {
    products: CustomProductVariant[];
    count: number;
}
