export interface ReviewModel {
    uuid: string;
    user_id: string;
    product_id: string;
    product_variant_id: string;
    title: string;
    description: string;
    rating: number;
    likes_count: number;
    verified: boolean;
    created_at: Date;
    updated_at: Date;
}
