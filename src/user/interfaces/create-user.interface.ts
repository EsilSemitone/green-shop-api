import { ROLES } from "contracts-green-shop";

export interface ICreateUser {
    name: string,
    email: string,
    role?: ROLES,
    password_hash: string,
    phone_number?: string | null,
    photo_image?: string | null,
}