import { Knex } from 'knex';
import { getProductVariantTags } from './helpers/get-product-variants-tags.ts';
import { TAGS } from './constants/tags.ts';

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex('product_variant_tags').del();

    // Inserts seed entries
    const result: any = await knex.raw('select distinct(uuid) from product_variants');
    const rows: { uuid: string }[] = result.rows;

    await knex('product_variant_tags').insert(
        getProductVariantTags(
            TAGS,
            rows.map((obj) => obj.uuid),
        ),
    );
}
