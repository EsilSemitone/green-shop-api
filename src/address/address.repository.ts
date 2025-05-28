import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { IAddressRepository } from './interfaces/address.repository.interface';
import { APP_TYPES } from '../types';
import { IDatabaseService } from '../core/database/database.service.interface';
import { ICreateAddress } from './interfaces/create-address.interface';
import { AddressModel } from '../common/models/address-model';

@injectable()
export class AddressRepository implements IAddressRepository {
    constructor(@inject(APP_TYPES.DATABASE_SERVICE) private db: IDatabaseService) {}

    async create(data: ICreateAddress): Promise<AddressModel> {
        const address = await this.db.db<AddressModel>('addresses').insert(data).returning('*');
        return address[0];
    }

    async delete(uuid: string): Promise<void> {
        await this.db.db<AddressModel>('addresses').delete().where({ uuid });
    }

    async getByUuid(uuid: string): Promise<AddressModel | null> {
        const result = await this.db.db<AddressModel>('addresses').where({ uuid }).first();
        return result || null;
    }

    async getAll(user_id: string): Promise<AddressModel[]> {
        const result = await this.db.db<AddressModel>('addresses').where({ user_id });
        return result;
    }
}
