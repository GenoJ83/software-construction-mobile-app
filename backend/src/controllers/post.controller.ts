import { Request, Response } from 'express';
import { dbService } from '../db/database';
import { AuthRequest } from '../middleware/auth.middleware';
import { Post } from '../models/post.model';

export class PostController {

    static createPost(req: AuthRequest, res: Response): void {
        const { caption, image_url } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: 'User not authenticated' });
            return;
        }

        if (!image_url) {
            res.status(400).json({ error: 'Image URL is required' });
            return;
        }

        const db = dbService.getDb();
        const sql = `INSERT INTO posts (user_id, caption, image_url) VALUES (?, ?, ?)`;

        db.run(sql, [userId, caption, image_url], function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.status(201).json({
                message: 'Post created successfully',
                postId: this.lastID
            });
        });
    }

    static getFeed(req: Request, res: Response): void {
        const db = dbService.getDb();
        // Join with users to get the author's username
        const sql = `
      SELECT posts.*, users.username 
      FROM posts 
      JOIN users ON posts.user_id = users.id 
      ORDER BY posts.created_at DESC
    `;

        db.all(sql, [], (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json(rows);
        });
    }
}
