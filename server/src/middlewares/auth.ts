import {NextFunction, Request, Response} from 'express';
import jwt from 'jsonwebtoken';

interface JWTPayload {
    id: number;
    role: string;
}

export interface AuthRequest extends Request {
    user?: JWTPayload;
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const auth_header = req.headers['authorization'];
    const token = auth_header && auth_header.split(' ')[1];

    if (!token) {
        console.warn('Authentication failed: No token provided');
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const secret_key = process.env.JWT_SECRET || 'default_secret_key';

        req.user = jwt.verify(token, secret_key) as JWTPayload;

        next();
    } catch (error) {
        console.error('Authentication failed: Invalid token');
        return res.status(403).json({ error: 'Forbidden' });
    }
};