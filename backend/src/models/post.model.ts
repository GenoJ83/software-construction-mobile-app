export interface Post {
    id?: number;
    user_id: number;
    caption: string;
    image_url?: string;
    created_at?: string;
    // Optional architecture: join with user to get username
    username?: string;
}
