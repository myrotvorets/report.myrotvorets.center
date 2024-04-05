import admin from 'firebase-admin';
import type { NextFunction, Request, Response } from 'express';

interface AuthError extends Error {
    code: string;
}

export default function authMiddleware(req: Request, res: Response, next: NextFunction): void {
    if (!req.headers.authorization?.startsWith('Bearer ')) {
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
            return setImmediate(next);
        })
        .catch((err: unknown) => {
            const e = err as AuthError;
            setImmediate<Record<string, unknown>[]>(next, {
                success: false,
                status: 401,
                code: 'AUTH_FAILED',
                message: e.message,
                errcode: e.code,
            });
        });
}
