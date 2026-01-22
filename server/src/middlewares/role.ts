import { Response, NextFunction } from 'express';
import {AuthRequest} from "./auth.js";

export const verifyRole = (authorized_role: string) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || req.user.role !== authorized_role) {

            console.warn(`Access denied: User ${req.user?.id} tried to access ${authorized_role} route`);

            return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
        }
        next();
    };
};