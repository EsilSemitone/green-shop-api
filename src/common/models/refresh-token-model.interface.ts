export interface RefreshTokenModel {
    uuid: string;
    user_id: string;
    token: string;
    expires_at: Date;
    is_valid: boolean;
    created_at: Date;
    updated_at: Date;
}
