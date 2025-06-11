import { PRODUCT_CATEGORY, SIZE } from 'contracts-green-shop';

export interface IProductFilter {
    categories: { category: PRODUCT_CATEGORY; count: number }[];
    sizes: { size: SIZE; count: number }[];
    prices: { min: number; max: number };
}
