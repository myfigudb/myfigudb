import { Request, Response, NextFunction } from 'express';
import { ZodObject } from "zod";

export const validate = (schema: ZodObject) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const result = await schema.safeParseAsync(req.body);

        if (!result.success) {
            return res.status(400).json({
                message: "Validation failed",
                errors: result.error.issues.map(i => ({
                    path: i.path.join('.'),
                    message: i.message
                }))
            });
        }

        req.body = result.data;
        return next();
    };
};