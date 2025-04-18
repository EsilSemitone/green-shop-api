import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('categories', (table) => {
        table.uuid('uuid').primary().defaultTo(knex.raw('gen_random_uuid()'));
        table.string('name').notNullable();
        table.timestamps(true, true);
    });

    await knex.schema.createTable('product_categories', (table) => {
        table.uuid('uuid').primary().defaultTo(knex.raw('gen_random_uuid()'));

        table.uuid('category_id').notNullable();
        table.foreign('category_id').references('categories.uuid').onDelete('CASCADE');

        table.uuid('product_id').notNullable();
        table.foreign('product_id').references('products.uuid').onDelete('CASCADE');

        table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('product_categories');
    await knex.schema.dropTable('categories');
}
