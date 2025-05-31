export interface ReviewModel {
    uuid: string;
    user_id: string;
    product_id: string;
    title: string;
    description: string;
    rating: number;
    created_at: Date;
    updated_at: Date;
}
