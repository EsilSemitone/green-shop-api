import { SIZE } from 'contracts-green-shop';
import { randomUUID } from 'crypto';
import { ProductModel } from '../../src/common/models/product-model.interface.ts';
import { ProductVariantModel } from '../../src/common/models/product-variant-model.ts';

export function getProductVariants(products: ProductModel[]): ProductVariantModel[] {
    const sizes = [SIZE.LARGE, SIZE.MEDIUM, SIZE.SMALL];
    const result = products
        .map((product) => {
            const variantAmount = Math.floor(Math.random() * 3);
            const res: ProductVariantModel[] = [];
            for (let i = 0; i <= variantAmount; i++) {
                res.push({
                    uuid: randomUUID(),
                    product_id: product.uuid,
                    rating: Number.parseFloat(`${Math.floor(Math.random() * 4) + 1}.${Math.floor(Math.random() * 99)}`),
                    price: Number.parseFloat(
                        `${Math.floor(Math.random() * 1000) + 50}.${Math.floor(Math.random() * 99)}`,
                    ),
                    size: sizes[i],
                    stock: Math.floor(Math.random() * 100) + 1,
                    created_at: product.created_at,
                    updated_at: product.created_at,
                });
            }
            return res;
        })
        .flat(1);

    return result;
}
