import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('review_comments', (table) => {
        table.uuid('uuid').primary().defaultTo(knex.raw('gen_random_uuid()'));

        table.uuid('user_id').notNullable();
        table.foreign('user_id').references('users.uuid').onDelete('CASCADE');

        table.uuid('review_id').notNullable();
        table.foreign('review_id').references('reviews.uuid').onDelete('CASCADE');

        table.text('content').notNullable();
        table.integer('likes_count').notNullable().defaultTo(0);

        table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('review_comments');
}
