import { ROLES } from "contracts-green-shop";

export interface IUpdateUser {
    name?: string,
    email?: string,
    role?: ROLES,
    password_hash?: string,
    restore_code?: string | null,
    phone_number?: string | null,
    photo_image?: string | null,
}