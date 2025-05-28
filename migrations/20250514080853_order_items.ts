import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('order_items', (table) => {
        table.uuid('uuid').primary().defaultTo(knex.raw('gen_random_uuid()'));

        table.uuid('order_id').notNullable();
        table.foreign('order_id').references('orders.uuid').onDelete('CASCADE');

        table.uuid('product_variant_id').notNullable();
        table.foreign('product_variant_id').references('product_variants.uuid').onDelete('SET NULL');

        table.integer('quantity', 10).notNullable();
        table.decimal('price', 10, 2).notNullable();
        table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('order_items');
}
