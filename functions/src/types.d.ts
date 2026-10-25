import type { DecodedIdToken } from 'firebase-admin/auth';
import type { Criminal } from './middleware/fetchcriminal';

declare module 'express' {
    interface Request {
        criminal?: Criminal;
        user?: DecodedIdToken;
        storageLink?: string;
        archivePassword?: string;
    }
}

declare module 'archiver' {
    interface CoreOptions {
        password?: string;
    }
}

export interface AddUpdateRequestBody {
    name: string;
    dob: Date | null;
    country: string;
    address: string;
    phone: string;
    description: string;
    note: string;
    path: string;
}

export interface ReportEntry {
    uploaderUid?: string;
    name: string;
    dob: string;
    country: string;
    address: string;
    phone: string;
    description: string;
    note: string;
    path: string;
    clink: string;
    cname: string;
    ips: string;
    email: string;
    ua: string;
    dt: number;
}
