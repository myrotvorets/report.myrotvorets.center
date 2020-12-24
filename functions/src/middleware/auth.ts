import type { NextFunction, Request, Response } from 'express';
import admin from 'firebase-admin';

interface AuthError extends Error {
    code: string;
}

export default function authMiddleware(req: Request, res: Response, next: NextFunction): void {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        next({
            success: false,
            status: 401,
            code: 'AUTH_REQUIRED',
            message: 'Not authorized',
        });

        return;
    }

    const [, idToken] = req.headers.authorization.split('Bearer ');

    admin
        .auth()
        .verifyIdToken(idToken)
        .then((decoded) => {
            req.user = decoded;
            next();
        })
        .catch((e: AuthError) =>
            next({
                success: false,
                status: 401,
                code: 'AUTH_FAILED',
                message: e.message,
                errcode: e.code,
            }),
        );
}
