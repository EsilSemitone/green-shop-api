import { ROLES } from 'contracts/enums/roles.js';

export interface UserModel {
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
}
