import type { Request, Response } from 'express';

export function finalOK(req: Request, res: Response): void {
    res.json({ success: true });
}
