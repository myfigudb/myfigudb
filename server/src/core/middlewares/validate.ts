import {NextFunction, Request, Response} from 'express';
import {ZodError, ZodType} from "zod";

interface Validation {
    body?: ZodType;
    params?: ZodType;
    query?: ZodType;
}

export const validate = (schemas: Validation) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            res.locals.dtos = {};

            if (schemas.params) {
                res.locals.dtos.params = await schemas.params.parseAsync(req.params);
            }

            if (schemas.query) {
                res.locals.dtos.query = await schemas.query.parseAsync(req.query);
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
            console.error("Validation error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    };
};