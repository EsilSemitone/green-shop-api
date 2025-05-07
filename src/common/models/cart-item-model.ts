export interface CartItemModel {
    uuid: string;
    cart_id: string;
    product_variant_id: string;
    quantity: number;
    created_at: Date;
    updated_at: Date;
}
