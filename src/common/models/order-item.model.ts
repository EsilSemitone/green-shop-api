export interface OrderItemModel {
    uuid: string;
    order_id: string;
    product_variant_id: string;
    quantity: number;
    price: number;
    created_at: Date;
    updated_at: Date;
}
