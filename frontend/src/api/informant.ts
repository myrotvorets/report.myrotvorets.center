import Bugsnag from '@bugsnag/js';
import type { Criminal } from './myrotvorets';

export interface ReportData {
    name: string;
    dob: string;
    country: string;
    address: string;
    phone: string;
    description: string;
    note: string;
}

export interface GSData {
    path: string;
}

const baseURL = 'https://us-central1-report-to-myrotvorets.cloudfunctions.net/api/informant/v1';

export interface SuccessfulResponse {
    success: true;
}

export interface ErrorResponse {
    success: false;
    status: number;
    code: string;
    message: string;
}

export interface ErrorResponseAuthFailed extends ErrorResponse {
    status: 401;
    code: 'AUTH_FAILED';
    // Error code from Firebase
    errcode: string;
}

export interface ErrorResponseValidationFailed extends ErrorResponse {
    status: 422;
    code: 'VALIDATION_FAILED';
    fields: Record<string, string>;
}

export type InformantApiResponse =
    | SuccessfulResponse
    | ErrorResponse
    | ErrorResponseAuthFailed
    | ErrorResponseValidationFailed;

const communicationError: ErrorResponse = {
    success: false,
    status: 500,
    code: 'COMM_ERROR',
    message: 'Помилка зв’язку з сервером',
};

function sendResponse(url: string, token: string, body: Record<string, string>): Promise<InformantApiResponse> {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
    })
        .then((response) => response.json() as Promise<InformantApiResponse>)
        .catch((e) => {
            Bugsnag.notify(e);
            return communicationError;
        });
}

export function addSuspect(token: string, report: ReportData, files?: GSData): Promise<InformantApiResponse> {
    const request = {
        ...report,
        path: files ? files.path : '',
    };

    return sendResponse(`${baseURL}/report`, token, request);
}

export function updateCriminal(
    token: string,
    criminal: Criminal,
    report: ReportData,
    files?: GSData,
): Promise<InformantApiResponse> {
    const request = {
        ...report,
        path: files ? files.path : '',
    };

    return sendResponse(`${baseURL}/report/${criminal.id}`, token, request);
}
