import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('payment_methods', (table) => {
        table.string('description').notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('payment_methods', (table) => {
        table.dropColumn('description');
    });
}
