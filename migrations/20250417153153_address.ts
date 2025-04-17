import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('addresses', (table) => {
        table.uuid('uuid').primary().defaultTo(knex.raw('gen_random_uuid()'));

        table.foreign('user_id').references('users.uuid').onDelete('CASCADE');
        table.string('city').notNullable();
        table.string('street_address').notNullable();
        table.string('phoneNumber');
        table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('addresses');
}
