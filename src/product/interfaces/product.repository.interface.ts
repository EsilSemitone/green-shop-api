import { CreateProductRequestDto } from 'contracts-green-shop/product/create-product.ts';
import { ProductModel } from '../../common/models/product-model.interface.ts';
import { IUpdateProduct } from './update-product.interface.ts';
import { ICreateProductVariant } from './create-product-variant.interface.ts';
import { ProductVariantModel } from '../../common/models/product-variant-model.ts';
import { IUpdateProductVariant } from './update-product-variant.interface.ts';
import {
    IGetProductVariantsByCriteriaExtendedData,
    IGetProductVariantsByCriteriaExtendedReturnType,
} from './get-product-variants-by-criteria.interface.ts';
import { IProductFilter } from './product-filter.interface.ts';
import { CustomProductVariant, CustomProductVariantExtended } from './custom-product-variant.interface.ts';
import { IGetProductVariantExtended } from './get-product-cariant-extended.interface.ts';

export interface IProductRepository {
    create(data: CreateProductRequestDto): Promise<ProductModel>;
    getByUuid(uuid: string): Promise<ProductModel | null>;
    update({ uuid, data }: IUpdateProduct): Promise<ProductModel>;
    delete(uuid: string): Promise<void>;

    createProductVariant(data: ICreateProductVariant): Promise<ProductVariantModel>;
    updateProductVariant({ uuid, ...data }: IUpdateProductVariant): Promise<ProductVariantModel>;
    getProductVariantByUuid(uuid: string): Promise<ProductVariantModel | null>;
    deleteProductVariant(uuid: string): Promise<void>;
    getProductVariantsByProduct(productId: string): Promise<CustomProductVariantExtended[]>;
    getProductVariantsByCriteriaExtended({
        limit,
        offset,
        priceFrom,
        priceTo,
        category,
        size,
        search,
    }: IGetProductVariantsByCriteriaExtendedData): Promise<IGetProductVariantsByCriteriaExtendedReturnType>;
    getProductFilter(): Promise<IProductFilter>;
    getProductVariantExtended(query: IGetProductVariantExtended): Promise<CustomProductVariant | null>;
}
