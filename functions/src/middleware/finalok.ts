import type { Request, Response } from 'express';

export function finalOK(_req: Request, res: Response): void {
    res.json({ success: true });
}
