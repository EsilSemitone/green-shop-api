import { Knex } from 'knex';
import { TAGS } from './constants/tags';

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex('tags').del();

    // Inserts seed entries
    await knex('tags').insert(TAGS);
}
