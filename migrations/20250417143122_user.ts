import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto";');

    await knex.schema.createTable('users', (table) => {
        table.uuid('uuid').primary().defaultTo(knex.raw('gen_random_uuid()'));
        table.string('name').notNullable();
        table.string('email').notNullable().unique();
        table.string('role').notNullable().defaultTo('user');
        table.string('passwordHash').notNullable();
        table.string('restoreCode');
        table.string('phoneNumber');
        table.string('photo_image');
        table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('users');
}
