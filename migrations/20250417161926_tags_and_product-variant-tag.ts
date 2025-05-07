import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('tags', (table) => {
        table.uuid('uuid').primary().defaultTo(knex.raw('gen_random_uuid()'));
        table.string('name').notNullable();
        table.timestamps(true, true);
    });

    await knex.schema.createTable('product_variant_tags', (table) => {
        table.uuid('uuid').primary().defaultTo(knex.raw('gen_random_uuid()'));

        table.uuid('tag_id').notNullable();
        table.foreign('tag_id').references('tags.uuid').onDelete('CASCADE');

        table.uuid('product_variant_id').notNullable();
        table.foreign('product_variant_id').references('product_variants.uuid').onDelete('CASCADE');

        table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('product_variant_tags');
    await knex.schema.dropTable('tags');
}