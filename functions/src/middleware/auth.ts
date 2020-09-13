import type { NextFunction, Request, RequestHandler, Response } from 'express';
import admin from 'firebase-admin';

export default function authMiddleware(): RequestHandler {
    return function (req: Request, res: Response, next: NextFunction): void {
        if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
            return next({
                success: false,
                status: 401,
                code: 'AUTH_REQUIRED',
                message: 'Not authorized',
            });
        }

        const [, idToken] = req.headers.authorization.split('Bearer ');

        admin
            .auth()
            .verifyIdToken(idToken)
            .then((decoded) => {
                req.user = decoded;
                next();
            })
            .catch((e) =>
                next({
                    success: false,
                    status: 401,
                    code: 'AUTH_FAILED',
                    message: e.message,
                    errcode: e.code,
                }),
            );
    };
}
