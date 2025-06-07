export interface ReviewCommentModel {
    uuid: string;
    user_id: string;
    review_id: string;
    content: string;
    likes_count: number;
    created_at: Date;
    updated_at: Date;
}
