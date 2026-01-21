import { getAuth } from 'firebase-admin/auth';
import type { NextFunction, Request, Response } from 'express';

interface AuthError extends Error {
    code: string;
}

export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
    if (process.env.FUNCTIONS_EMULATOR === 'true') {
        next();
        return;
    }

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

    getAuth()
        .verifyIdToken(idToken)
        .then((decoded) => {
            req.user = decoded;
            return setImmediate<[]>(next);
        })
        .catch((err: unknown) => {
            const e = err as AuthError;
            setImmediate<[Record<string, unknown>]>(next, {
                success: false,
                status: 401,
                code: 'AUTH_FAILED',
                message: e.message,
                errcode: e.code,
            });
        });
}
