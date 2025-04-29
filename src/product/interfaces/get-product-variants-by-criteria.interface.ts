import { SIZE } from 'contracts';
import { CustomProductVariant } from './custom-product-variant.interface';

export interface IGetProductVariantsByCriteria {
    product_id?: string;
    size?: SIZE;
}

export interface IGetProductVariantsByCriteriaExtendedReturnType {
    products: CustomProductVariant[];
    count: number;
}
