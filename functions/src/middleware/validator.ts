import { Result, ValidationError, body, param, validationResult } from 'express-validator';
import type { NextFunction, Request, Response } from 'express';

export const reportAddValidator = [
    body('name', 'BAD_REQUEST').exists().trim().isLength({ min: 5 }).withMessage('TOO_SHORT'),
    body('dob', 'BAD_REQUEST').optional({ checkFalsy: true }).isISO8601().withMessage('INVALID').toDate(),
    body('country', 'BAD_REQUEST').exists().trim(),
    body('address', 'BAD_REQUEST').exists().trim(),
    body('phone', 'BAD_REQUEST').exists().trim(),
    body('description', 'BAD_REQUEST').exists().trim().isLength({ min: 10 }).withMessage('TOO_SHORT'),
    body('note', 'BAD_REQUEST').exists().trim(),
    body('path', 'BAD_REQUEST').exists().trim(),
];

export const reportUpdateValidator = [
    param('id').exists().isNumeric().withMessage('INVALID').toInt(),
    body('name', 'BAD_REQUEST').exists().trim(),
    body('dob', 'BAD_REQUEST').optional({ checkFalsy: true }).isISO8601().withMessage('INVALID').toDate(),
    body('country', 'BAD_REQUEST').exists().trim(),
    body('address', 'BAD_REQUEST').exists().trim(),
    body('phone', 'BAD_REQUEST').exists().trim(),
    body('description', 'BAD_REQUEST').exists().trim().isLength({ min: 10 }).withMessage('TOO_SHORT'),
    body('note', 'BAD_REQUEST').exists().trim(),
    body('path', 'BAD_REQUEST').exists().trim(),
];

export function commonValidationHandler(req: Request, res: Response, next: NextFunction): void {
    const errors: Result<ValidationError> = validationResult(req);
    if (errors.isEmpty()) {
        next();
        return;
    }

    const list: Record<string, ValidationError> = errors.mapped();
    const fields: Record<string, string> = {};
    Object.keys(list).forEach((key) => {
        fields[key] = list[key].msg as string;
    });

    next({
        success: false,
        status: 422,
        code: 'VALIDATION_FAILED',
        message: 'Request validation failed',
        fields,
    });
}
