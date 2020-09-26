import type { NextFunction, Request, Response } from 'express';

interface IWithStatus {
    status: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction): void {
    if (res.headersSent) {
        next(err);
        return;
    }

    if (err && typeof err === 'object' && 'status' in err) {
        const status = (err as IWithStatus).status;
        res.status(status);
        if (status === 401) {
            res.header('WWW-Authenticate', 'Bearer');
        }

        res.json(err);
        return;
    }

    next(err);
}
