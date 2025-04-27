import { ROLES } from 'contracts';
import { UserModel } from '../common/models/user-model.interface';
import { compareSync, hashSync } from 'bcryptjs';

export class UserEntity {
    uuid: string;
    name: string;
    email: string;
    role: ROLES;
    password_hash: string;
    restore_code: string | null;
    phone_number: string | null;
    photo_image: string | null;
    created_at: Date;
    updated_at: Date;

    constructor(data: UserModel) {
        Object.assign(this, data);
    }

    static hashPassword(password: string, salt: number): string {
        return hashSync(password, salt);
    }

    static validatePassword(password: string, hash: string): boolean {
        return compareSync(password, hash);
    }
}
