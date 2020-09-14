import type { NextFunction, Request, Response } from 'express';

export function notFoundHandler(req: Request, res: Response, next: NextFunction): void {
    next({
        success: false,
        status: 404,
        code: 'NOT_FOUND',
        message: 'Not found',
    });
}
