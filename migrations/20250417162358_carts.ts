import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('carts', (table) => {
        table.uuid('uuid').primary().defaultTo(knex.raw('gen_random_uuid()'));

        table.uuid('user_id').unique().notNullable();
        table.foreign('user_id').references('users.uuid').onDelete('CASCADE');

        table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('carts');
}
