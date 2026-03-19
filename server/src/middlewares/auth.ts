import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

export type AuthRequest = Request

function getBearerToken(authorizationHeader?: string) {
    if (!authorizationHeader) {
        return null
    }

    const [scheme, token] = authorizationHeader.split(' ')
    return scheme === 'Bearer' && token ? token : null
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = getBearerToken(req.headers.authorization)

    if (!token) {
        console.warn('Authentication failed: No token provided')
        return res.status(401).json({ error: 'Unauthorized' })
    }

    try {
        const secretKey = process.env.JWT_SECRET || 'default_secret_key'
        req.user = jwt.verify(token, secretKey) as Express.User
        next()
    } catch {
        console.error('Authentication failed: Invalid token')
        return res.status(403).json({ error: 'Forbidden' })
    }
}
