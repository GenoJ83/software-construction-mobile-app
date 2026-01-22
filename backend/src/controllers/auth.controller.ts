import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { dbService } from '../db/database';
import { User } from '../models/user.model';

const SECRET_KEY = process.env.JWT_SECRET || 'fallback_secret_key_change_me';

export class AuthController {

    static async register(req: Request, res: Response): Promise<void> {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            res.status(400).json({ error: 'Username, email, and password are required' });
            return;
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const db = dbService.getDb();

            const sql = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;

            db.run(sql, [username, email, hashedPassword], function (err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        res.status(409).json({ error: 'Username or email already exists' });
                        return;
                    }
                    res.status(500).json({ error: err.message });
                    return;
                }

                res.status(201).json({
                    message: 'User registered successfully',
                    userId: this.lastID
                });
            });
        } catch (error: any) {
            res.status(500).json({ error: 'Server error during registration' });
        }
    }

    static async login(req: Request, res: Response): Promise<void> {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ error: 'Email and password are required' });
            return;
        }

        const db = dbService.getDb();
        const sql = `SELECT * FROM users WHERE email = ?`;

        db.get(sql, [email], async (err, row: User) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }

            if (!row || !row.password) {
                res.status(401).json({ error: 'Invalid credentials' });
                return;
            }

            const isMatch = await bcrypt.compare(password, row.password);

            if (!isMatch) {
                res.status(401).json({ error: 'Invalid credentials' });
                return;
            }

            const token = jwt.sign(
                { id: row.id, username: row.username, email: row.email },
                SECRET_KEY,
                { expiresIn: '24h' }
            );

            res.json({
                message: 'Login successful',
                token: token,
                user: {
                    id: row.id,
                    username: row.username,
                    email: row.email
                }
            });
        });
    }
}
