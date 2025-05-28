import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('orders', (table) => {
        table.uuid('uuid').primary().defaultTo(knex.raw('gen_random_uuid()'));

        table.uuid('user_id').notNullable();
        table.foreign('user_id').references('users.uuid').onDelete('CASCADE');

        table.string('status').notNullable();
        table.decimal('shipping_price', 10, 2).notNullable();
        table.decimal('total_price', 10, 2).notNullable();
        table.string('payment_method').notNullable();
        table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('orders');
}
