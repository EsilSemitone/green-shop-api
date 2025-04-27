import { CreateProductRequestDto, CreateProductResponseDto } from 'contracts/product/create-product';

export interface IProductService {
    create(data: CreateProductRequestDto): Promise<CreateProductResponseDto>;
}
