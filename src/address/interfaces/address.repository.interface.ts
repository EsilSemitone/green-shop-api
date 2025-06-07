import { AddressModel } from '../../common/models/address-model.ts';
import { ICreateAddress } from './create-address.interface.ts';

export interface IAddressRepository {
    create(data: ICreateAddress): Promise<AddressModel>;
    delete(uuid: string): Promise<void>;
    getByUuid(uuid: string): Promise<AddressModel | null>;
    getAll(user_id: string): Promise<AddressModel[]>;
}
