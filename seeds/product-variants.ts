import { Knex } from 'knex';
import { ProductVariantModel } from '../src/common/models/product-variant-model';
import { PRODUCT_VARIANTS } from './constants/product-variants';

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex('product_variants').del();

    // Inserts seed entries
    await knex<ProductVariantModel>('product_variants').insert(PRODUCT_VARIANTS);
}
