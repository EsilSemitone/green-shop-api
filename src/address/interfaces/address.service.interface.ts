import {
    CreateAddressRequestDto,
    CreateAddressResponseDto,
    DeleteAddressResponseDto,
    GetAllAddressesResponseDto,
} from 'contracts';

export interface IAddressService {
    create(userId: string, createData: CreateAddressRequestDto): Promise<CreateAddressResponseDto>;
    delete(addressId: string): Promise<DeleteAddressResponseDto>;
    getAll(userId: string): Promise<GetAllAddressesResponseDto>;
}
