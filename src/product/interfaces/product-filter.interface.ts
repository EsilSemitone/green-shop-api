import { PRODUCT_CATEGORY, SIZE } from 'contracts';

export interface IProductFilter {
    categories: { category: PRODUCT_CATEGORY; count: number }[];
    sizes: { size: SIZE; count: number }[];
    prices: { min: number; max: number };
}
