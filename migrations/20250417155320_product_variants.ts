import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('product_variants', (table) => {
        table.uuid('uuid').primary().defaultTo(knex.raw('gen_random_uuid()'));
        table.foreign('product_id').references('products.uuid').onDelete('CASCADE');
        table.decimal('price', 10, 2).notNullable();
        table.string('size').notNullable();
        table.integer('stock').notNullable().defaultTo(1);
        table.specificType('images', 'text[]');
        table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('product_variants');
}
