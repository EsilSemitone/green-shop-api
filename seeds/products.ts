import { Knex } from 'knex';
import { ProductModel } from '../src/common/models/product-model.interface.ts';
import { PRODUCTS } from './constants/products.ts';

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex('products').del();

    // Inserts seed entries
    await knex<ProductModel>('products').insert(PRODUCTS);
}
