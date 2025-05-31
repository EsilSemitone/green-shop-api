import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('favorites', (table) => {
        table.unique(['user_id', 'product_variant_id'], { indexName: 'favorites_user_variant_unique' });
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('favorites', (table) => {
        table.dropUnique(['user_id', 'product_variant_id'], 'favorites_user_variant_unique');
    });
}
