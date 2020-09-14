import type { NextFunction, Request, Response } from 'express';

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction): void {
    if (res.headersSent) {
        return next(err);
    }

    if (err && typeof err === 'object' && 'code' in err) {
        const status = err.status as number;
        res.status(status);
        if (status === 401) {
            res.header('WWW-Authenticate', 'Bearer');
        }

        res.json(err);
        return;
    }

    next(err);
}
