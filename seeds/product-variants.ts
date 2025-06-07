import { Knex } from 'knex';
import { ProductVariantModel } from '../src/common/models/product-variant-model.ts';
import { PRODUCT_VARIANTS } from './constants/product-variants.ts';

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex('product_variants').del();

    // Inserts seed entries
    await knex<ProductVariantModel>('product_variants').insert(PRODUCT_VARIANTS);
}
