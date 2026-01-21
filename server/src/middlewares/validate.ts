import {Request, Response, NextFunction} from 'express';
import {ZodError, ZodObject} from "zod";

interface Validation {
    body?: ZodObject;
    params?: ZodObject;
    query?: ZodObject;
}

export const validate = (schemas: Validation) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (schemas.params) {
                req.params = await schemas.params.parseAsync(req.params) as any;
            }

            if (schemas.query) {
                req.query = await schemas.query.parseAsync(req.query) as any;
            }

            if (schemas.body) {
                req.body = await schemas.body.parseAsync(req.body);
            }

            return next();

        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    message: "Validation failed",
                    errors: error.issues.map(issue => ({
                        path: issue.path.join('.'),
                        message: issue.message
                    }))
                });
            }

            return res.status(500).json({ message: "Internal server error during validation" });
        }
    };
};