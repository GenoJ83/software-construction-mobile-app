
export const config = {
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET || 'fallback_secret_key_change_me'
};
