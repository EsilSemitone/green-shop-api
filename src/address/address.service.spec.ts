import { Container } from 'inversify';
import { IAddressRepository } from './interfaces/address.repository.interface';
import { AddressService } from './address.service';
import { APP_TYPES } from '../types';
import { IAddressService } from './interfaces/address.service.interface';
import { ILogger } from '../core/logger/logger.service.interface';
import { randomUUID } from 'crypto';
import { AddressModel } from '../common/models';
import { ERROR } from '../common/error/error';

const ADDRESS: AddressModel = {
    uuid: randomUUID(),
    user_id: randomUUID(),
    city: 'город',
    street_address: 'ул. Улица',
    phone_number: '+33333333333',
    created_at: new Date(),
    updated_at: new Date(),
};

const addressRepositoryMock: jest.Mocked<IAddressRepository> = {
    create: jest.fn(),
    delete: jest.fn(),
    getByUuid: jest.fn(),
    getAll: jest.fn(),
};

const loggerServiceMock: ILogger = {
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    setServiceName: jest.fn(),
};

let addressService: IAddressService;

beforeAll(() => {
    const container = new Container();
    container.bind<IAddressService>(APP_TYPES.ADDRESS_SERVICE).to(AddressService);
    container.bind<IAddressRepository>(APP_TYPES.ADDRESS_REPOSITORY).toConstantValue(addressRepositoryMock);
    container.bind<ILogger>(APP_TYPES.LOGGER_SERVICE).toConstantValue(loggerServiceMock);

    addressService = container.get(APP_TYPES.ADDRESS_SERVICE);
});

describe('Address service', () => {
    describe('create', () => {
        const createData = {
            city: ADDRESS.city,
            street_address: ADDRESS.street_address,
            ...(ADDRESS.phone_number ? { phone_number: ADDRESS.phone_number } : {}),
        };
        const userId = randomUUID();

        it('should create address and return', async () => {
            addressRepositoryMock.create.mockResolvedValueOnce(ADDRESS);

            const result = await addressService.create(userId, createData);

            expect(addressRepositoryMock.create).toHaveBeenCalledWith({ ...createData, user_id: userId });
            expect(result).toEqual(ADDRESS);
        });
    });

    describe('delete', () => {
        it('delete address and return success', async () => {
            addressRepositoryMock.getByUuid.mockResolvedValueOnce(ADDRESS);

            const result = await addressService.delete(ADDRESS.uuid);
            expect(addressRepositoryMock.delete).toHaveBeenCalledWith(ADDRESS.uuid);
            expect(result).toEqual({ isSuccess: true });
        });

        it('throw error (address not found)', async () => {
            addressRepositoryMock.getByUuid.mockResolvedValueOnce(null);
            await expect(addressService.delete(ADDRESS.uuid)).rejects.toThrow(ERROR.ADDRESS_IS_NOT_FOUND);
        });
    });

    describe('getAll', () => {
        it('get all addresses and return', async () => {
            const userId = randomUUID();
            const returnValue = [ADDRESS, ADDRESS];
            addressRepositoryMock.getAll.mockResolvedValueOnce(returnValue);

            const result = await addressService.getAll(userId);

            expect(addressRepositoryMock.getAll).toHaveBeenCalledWith(userId);
            expect(result).toEqual({ addresses: returnValue });
        });
    });
});
