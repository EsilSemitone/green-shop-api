export interface ICreateReview {
    user_id: string;
    product_id: string;
    product_variant_id: string;
    title: string;
    description: string;
    rating: number;
    verified: boolean;
}
