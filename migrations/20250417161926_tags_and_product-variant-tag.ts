import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('tags', (table) => {
        table.uuid('uuid').primary().defaultTo(knex.raw('gen_random_uuid()'));
        table.string('name').notNullable();
        table.timestamps(true, true);
    });

    await knex.schema.createTable('tag_to_product_variant', (table) => {
        table.uuid('uuid').primary().defaultTo(knex.raw('gen_random_uuid()'));
        table.foreign('tag_id').references('tags.uuid').onDelete('CASCADE');
        table.foreign('product_variant_id').references('product_variants.uuid').onDelete('CASCADE');
        table.timestamps(true, true);
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('tags');
    await knex.schema.dropTable('tag_to_product_variant');
}

