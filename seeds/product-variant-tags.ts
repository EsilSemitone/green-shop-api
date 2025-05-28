import { Knex } from 'knex';
// import { PRODUCT_VARIANT_TAGS } from './constants/product-variants-tags';
import { getProductVariantTags } from './helpers/get-product-variants-tags';
import { TAGS } from './constants/tags';

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
