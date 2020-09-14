import authMiddleware from '../middleware/auth';
import { saveToDatabase } from '../middleware/savetodb';
import { commonValidationHandler, reportAddValidator, reportUpdateValidator } from '../middleware/validator';
import { finalOK } from '../middleware/finalok';
import { fetchCriminal } from '../middleware/fetchcriminal';

export const reportNewCriminal = [
    authMiddleware(),
    reportAddValidator,
    commonValidationHandler,
    saveToDatabase,
    finalOK,
];

export const reportUpdateCriminal = [
    authMiddleware(),
    reportUpdateValidator,
    commonValidationHandler,
    fetchCriminal,
    saveToDatabase,
    finalOK,
];
