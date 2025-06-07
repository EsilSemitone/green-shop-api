import { Knex } from 'knex';
import { PAYMENT_METHODS } from './constants/payment_methods.ts';

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex('payment_methods').del();

    // Inserts seed entries
    await knex('payment_methods').insert(PAYMENT_METHODS);
}
