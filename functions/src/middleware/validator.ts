import { Result, type ValidationChain, type ValidationError, body, param, validationResult } from 'express-validator';
import type { NextFunction, Request, Response } from 'express';
import { getSubmissionId } from '../lib/upload-path';

const uploadPathValidator = (): ValidationChain =>
    body('path', 'BAD_REQUEST')
        .isString()
        .bail()
        .custom(
            (value: string, { req }) => value === '' || getSubmissionId(value, (req as Request).user?.uid) !== null,
        );

export const reportAddValidator = [
    body('name', 'BAD_REQUEST').exists().trim().isLength({ min: 5 }).withMessage('TOO_SHORT'),
    body('dob', 'BAD_REQUEST').optional({ checkFalsy: true }).isISO8601().withMessage('INVALID').toDate(),
    body('country', 'BAD_REQUEST').exists().trim(),
    body('address', 'BAD_REQUEST').exists().trim(),
    body('phone', 'BAD_REQUEST').exists().trim(),
    body('description', 'BAD_REQUEST').exists().trim().isLength({ min: 10 }).withMessage('TOO_SHORT'),
    body('note', 'BAD_REQUEST').exists().trim(),
    uploadPathValidator(),
];

export const reportUpdateValidator = [
    param('id').exists().isUUID('loose').withMessage('INVALID'),
    body('name', 'BAD_REQUEST').exists().trim(),
    body('dob', 'BAD_REQUEST').optional({ checkFalsy: true }).isISO8601().withMessage('INVALID').toDate(),
    body('country', 'BAD_REQUEST').exists().trim(),
    body('address', 'BAD_REQUEST').exists().trim(),
    body('phone', 'BAD_REQUEST').exists().trim(),
    body('description', 'BAD_REQUEST').exists().trim().isLength({ min: 10 }).withMessage('TOO_SHORT'),
    body('note', 'BAD_REQUEST').exists().trim(),
    uploadPathValidator(),
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
