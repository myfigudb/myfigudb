import { Request, Response, NextFunction } from 'express';

export const verifyRole = (authorizedRole: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || req.user.role !== authorizedRole) {

            console.warn(`Access denied: User ${req.user?.id} tried to access ${authorizedRole} route`);

            return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
        }
        next();
    };
};