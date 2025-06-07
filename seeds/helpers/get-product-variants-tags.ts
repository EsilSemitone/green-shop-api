import { randomUUID } from 'crypto';
import { ProductVariantTagsModel } from '../../src/common/models/product-variant-tags-model.interface.ts';
import { TagsModel } from '../../src/common/models/tags-model.interface.ts';

export function getProductVariantTags(tags: TagsModel[], product_variant_uuids: string[]): ProductVariantTagsModel[] {
    const resArr: ProductVariantTagsModel[] = [];
    product_variant_uuids.forEach((uuid) => {
        const amountTags = Math.floor(Math.random() * 5) + 1;

        for (let i = 0; i < amountTags; i++) {
            const date = new Date();
            const result = {
                uuid: randomUUID(),
                tag_id: tags[Math.floor(Math.random() * tags.length)].uuid,
                product_variant_id: uuid,
                created_at: date,
                updated_at: date,
            };
            resArr.push(result);
        }
    });
    return resArr;
}
