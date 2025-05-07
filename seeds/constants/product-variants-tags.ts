import { getProductVariantTags } from '../helpers/get-product-variants-tags';
import { PRODUCT_VARIANTS } from './product-variants';
import { TAGS } from './tags';

export const PRODUCT_VARIANT_TAGS = getProductVariantTags(TAGS, PRODUCT_VARIANTS);
