import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('likes', (table) => {
        table.uuid('uuid').primary().defaultTo(knex.raw('gen_random_uuid()'));

        table.uuid('user_id').notNullable();
        table.foreign('user_id').references('users.uuid').onDelete('CASCADE');

        table.uuid('target_id').notNullable();
        table.string('target_type').notNullable();

        table.unique(['user_id', 'target_id', 'target_type']);
        table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    knex.schema.dropTable('likes');
}
