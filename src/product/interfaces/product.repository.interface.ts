import { CreateProductRequestDto } from 'contracts/product/create-product';
import { ProductModel } from '../../common/models/product-model.interface';
import { IUpdateProduct } from './update-product.interface';
import { ICreateProductVariant } from './create-product-variant.interface';
import { ProductVariantModel } from '../../common/models/product-variant-model';
import { IUpdateProductVariant } from './update-product-variant.interface';
import {
    IGetProductVariantsByCriteriaExtendedData,
    IGetProductVariantsByCriteriaExtendedReturnType,
} from './get-product-variants-by-criteria.interface';
import { IProductFilter } from './product-filter.interface';
import { CustomProductVariantExtended } from './custom-product-variant.interface';

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
}
