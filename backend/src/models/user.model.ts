export interface User {
    id?: number;
    username: string;
    email: string;
    password?: string; // Optional for response objects
    created_at?: string;
}
