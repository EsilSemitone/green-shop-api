import { CreateProductRequestDto } from 'contracts/product/create-product';
import { ProductModel } from '../../common/models/product-model.interface';
import { IUpdateProduct } from './update-product.interface';
import { ICreateProductVariant } from './create-product-variant.interface';
import { ProductVariantModel } from '../../common/models/product-variant-model';
import { IUpdateProductVariant } from './update-product-variant.interface';
import {
    IGetProductVariantsByCriteria,
    IGetProductVariantsByCriteriaExtendedReturnType,
} from './get-product-variants-by-criteria.interface';
import { GetProductVariantsByCriteriaRequestQueryDto } from 'contracts';

export interface IProductRepository {
    create(data: CreateProductRequestDto): Promise<ProductModel>;
    getByUuid(uuid: string): Promise<ProductModel | null>;
    update({ uuid, data }: IUpdateProduct): Promise<ProductModel>;
    delete(uuid: string): Promise<void>;

    createProductVariant(data: ICreateProductVariant): Promise<ProductVariantModel>;
    updateProductVariant({ uuid, ...data }: IUpdateProductVariant): Promise<ProductVariantModel>;
    getProductVariantByUuid(uuid: string): Promise<ProductVariantModel | null>;
    deleteProductVariant(uuid: string): Promise<void>;
    getProductVariantsByCriteria(filter: IGetProductVariantsByCriteria): Promise<ProductVariantModel[]>;
    getProductVariantsByCriteriaExtended({
        limit,
        offset,
        price,
        category,
        size,
        search,
    }: GetProductVariantsByCriteriaRequestQueryDto): Promise<IGetProductVariantsByCriteriaExtendedReturnType>;
}
