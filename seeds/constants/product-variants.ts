import { getProductVariants } from '../helpers/get-product-variants.ts';
import { PRODUCTS } from './products.ts';

export const PRODUCT_VARIANTS = getProductVariants(PRODUCTS);
