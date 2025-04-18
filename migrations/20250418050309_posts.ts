import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('posts', (table) => {
        table.uuid('uuid').primary().defaultTo(knex.raw('gen_random_uuid()'));
        table.string('title').notNullable();
        table.string('description').notNullable();
        table.string('image').notNullable();
        table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('posts');
}
