import type { NextFunction, Request, Response } from 'express';
import { body, validationResult, ValidationError, Result, param } from 'express-validator';

export const reportAddValidator = [
    body('name', 'BAD_REQUEST').exists().trim().isLength({ min: 5 }).withMessage('TOO_SHORT'),
    body('dob', 'BAD_REQUEST').optional({ checkFalsy: true }).isISO8601().withMessage('INVALID').toDate(),
    body('country', 'BAD_REQUEST').exists().trim(),
    body('address', 'BAD_REQUEST').exists().trim(),
    body('phone', 'BAD_REQUEST').exists().trim(),
    body('description', 'BAD_REQUEST').exists().trim().isLength({ min: 10 }).withMessage('TOO_SHORT'),
    body('note', 'BAD_REQUEST').exists().trim(),
    body('gfsrv', 'BAD_REQUEST').exists().trim(),
    body('gfac', 'BAD_REQUEST').exists().trim(),
    body('gfrc', 'BAD_REQUEST').exists().trim(),
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
    body('gfsrv', 'BAD_REQUEST').exists().trim(),
    body('gfac', 'BAD_REQUEST').exists().trim(),
    body('gfrc', 'BAD_REQUEST').exists().trim(),
];

export function commonValidationHandler(req: Request, res: Response, next: NextFunction): void {
    const errors: Result<ValidationError> = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }

    const list: ValidationError[] = errors.array();
    const fields: Record<string, string> = {};
    list.forEach((item) => {
        fields[item.param] = item.msg as string;
    });

    next({
        success: false,
        status: 422,
        code: 'VALIDATION_FAILED',
        message: 'Request validation failed',
        fields,
    });
}
