import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('cart_items', (table) => {
        table.uuid('uuid').primary().defaultTo(knex.raw('gen_random_uuid()'));

        table.uuid('cart_id').notNullable();
        table.foreign('cart_id').references('carts.uuid').onDelete('CASCADE');

        table.uuid('product_variant_id');
        table.foreign('product_variant_id').references('product_variants.uuid').onDelete('SET NULL');

        table.integer('quantity').notNullable().defaultTo(1);
        table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('cart_items');
}
