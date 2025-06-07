import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('reviews', (table) => {
        table.uuid('uuid').primary().defaultTo(knex.raw('gen_random_uuid()'));

        table.uuid('user_id').notNullable();
        table.foreign('user_id').references('users.uuid').onDelete('SET NULL');

        table.uuid('product_id').notNullable();
        table.foreign('product_id').references('products.uuid').onDelete('CASCADE');

        table.uuid('product_variant_id').notNullable();
        table.foreign('product_variant_id').references('product_variants.uuid').onDelete('CASCADE');

        table.string('title').notNullable();
        table.string('description').notNullable();
        table.integer('rating').checkBetween([1, 5]).notNullable();
        table.integer('likes_count').notNullable().defaultTo(0);
        table.boolean('verified').notNullable();

        table.unique(['user_id', 'product_variant_id']);
        table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('reviews');
}
