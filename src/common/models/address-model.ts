export interface AddressModel {
    uuid: string;
    user_id: string;
    city: string;
    street_address: string;
    phone_number: string | null;
    created_at: Date;
    updated_at: Date;
}
