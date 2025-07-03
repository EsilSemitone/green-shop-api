import { ORDER_BY_PRODUCT_VARIANTS, ORDER_BY_PRODUCT_VARIANTS_ENUM } from 'contracts-green-shop';

export const orderByProductVariantMap = new Map<ORDER_BY_PRODUCT_VARIANTS, [string, string]>([
    [ORDER_BY_PRODUCT_VARIANTS_ENUM.FIRST_NEW, ['product_variants.created_at', 'desc']],
    [ORDER_BY_PRODUCT_VARIANTS_ENUM.FIRST_OLD, ['product_variants.created_at', 'asc']],
    [ORDER_BY_PRODUCT_VARIANTS_ENUM.FIRST_CHEAP, ['product_variants.price', 'asc']],
    [ORDER_BY_PRODUCT_VARIANTS_ENUM.FIRST_EXPENSIVE, ['product_variants.price', 'desc']],
]);
