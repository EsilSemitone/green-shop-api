import {
    CreateProductVariantRequestDto,
    CreateProductVariantResponseDto,
    DeleteProductResponseDto,
    DeleteProductVariantResponseDto,
    GetProductByUuidResponseDto,
    GetProductFilterResponseDto,
    GetProductVariantsByCriteriaRequestQueryDto,
    GetProductVariantsByCriteriaResponseDto,
    GetProductVariantsByProductResponseDto,
    GetProductVariantByUuidResponseDto,
    GetSimilarProductVariantsRequestDto,
    GetSimilarProductVariantsResponseDto,
    UpdateProductRequestDto,
    UpdateProductResponseDto,
    UpdateProductVariantRequestDto,
    UpdateProductVariantResponseDto,
    GetAllProductsResponseDto,
    GetAllProductsRequestQueryDto,
} from 'contracts-green-shop';
import { CreateProductRequestDto, CreateProductResponseDto } from 'contracts-green-shop/product/create-product.ts';

export interface IProductService {
    create(data: CreateProductRequestDto): Promise<CreateProductResponseDto>;
    getByUuid(uuid: string): Promise<GetProductByUuidResponseDto>;
    update(uuid: string, data: UpdateProductRequestDto): Promise<UpdateProductResponseDto>;
    delete(uuid: string): Promise<DeleteProductResponseDto>;
    createProductVariant(
        productId: string,
        data: CreateProductVariantRequestDto,
    ): Promise<CreateProductVariantResponseDto>;
    updateProductVariant(
        productId: string,
        uuid: string,
        data: UpdateProductVariantRequestDto,
    ): Promise<UpdateProductVariantResponseDto>;
    deleteProductVariant(productId: string, uuid: string): Promise<DeleteProductVariantResponseDto>;
    getProductVariantsByProduct(productId: string): Promise<GetProductVariantsByProductResponseDto>;
    getProductVariantsByCriteria(
        query: GetProductVariantsByCriteriaRequestQueryDto,
    ): Promise<GetProductVariantsByCriteriaResponseDto>;
    getProductFilter(): Promise<GetProductFilterResponseDto>;
    getSimilarProductVariants(dto: GetSimilarProductVariantsRequestDto): Promise<GetSimilarProductVariantsResponseDto>;
    getProductVariantByUuid(uuid: string): Promise<GetProductVariantByUuidResponseDto>;
    getAllProducts(query: GetAllProductsRequestQueryDto): Promise<GetAllProductsResponseDto>;
}
