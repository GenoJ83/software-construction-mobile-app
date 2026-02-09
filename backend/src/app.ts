import express, { Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import postRoutes from './routes/post.routes';

const app = express();

// Middleware
app.use(cors()); // Allow cross-origin requests (useful if testing from web browser too)
app.use(express.json()); // Parse JSON bodies (Critical for Mobile APIs)

// Mount Routes
app.use('/auth', authRoutes);
app.use('/posts', postRoutes);

// Health Check Endpoint
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', message: 'Backend is running' });
});

// Root Endpoint
app.get('/', (req: Request, res: Response) => {
    res.json({
        project: 'Software Construction Mobile App Backend',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            auth: {
                register: '/auth/register',
                login: '/auth/login'
            },
            posts: {
                create: 'POST /posts',
                feed: 'GET /posts'
            }
        }
    });
});

export default app;
