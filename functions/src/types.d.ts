import type admin from 'firebase-admin';
import type { Criminal } from './middleware/fetchcriminal';

declare module 'express' {
    interface Request {
        criminal?: Criminal;
        user?: admin.auth.DecodedIdToken;
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
