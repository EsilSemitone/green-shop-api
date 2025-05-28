import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { IAddressService } from './interfaces/address.service.interface';
import { ILogger } from '../core/logger/logger.service.interface';
import { APP_TYPES } from '../types';
import {
    CreateAddressRequestDto,
    CreateAddressResponseDto,
    DeleteAddressResponseDto,
    GetAllAddressesResponseDto,
} from 'contracts';
import { IAddressRepository } from './interfaces/address.repository.interface';
import { HttpException } from '../common/exceptionFilter/http.exception';
import { ERROR } from '../common/error/error';

@injectable()
export class AddressService implements IAddressService {
    constructor(
        @inject(APP_TYPES.LOGGER_SERVICE) private loggerService: ILogger,
        @inject(APP_TYPES.ADDRESS_REPOSITORY) private addressRepository: IAddressRepository,
    ) {
        this.loggerService.setServiceName(AddressService.name);
    }

    async create(userId: string, createData: CreateAddressRequestDto): Promise<CreateAddressResponseDto> {
        this.loggerService.log(
            `Start service create address with params: ${JSON.stringify({ userId, ...createData })}`,
        );

        const address = await this.addressRepository.create({ user_id: userId, ...createData });

        this.loggerService.log('Success service create address');
        return address;
    }

    async delete(addressId: string): Promise<DeleteAddressResponseDto> {
        this.loggerService.log(`Start service delete address with params: ${JSON.stringify({ addressId })}`);

        const address = await this.addressRepository.getByUuid(addressId);

        if (!address) {
            throw new HttpException(ERROR.ADDRESS_IS_NOT_FOUND, 404);
        }

        await this.addressRepository.delete(addressId);

        this.loggerService.log('Success service delete address');
        return {
            isSuccess: true,
        };
    }

    async getAll(userId: string): Promise<GetAllAddressesResponseDto> {
        this.loggerService.log(`Start service get all addresses with params: ${JSON.stringify({ userId })}`);

        const addresses = await this.addressRepository.getAll(userId);
        return {addresses};
    }
}
