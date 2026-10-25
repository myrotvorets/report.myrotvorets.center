export function getSubmissionId(uploadPath: unknown, uploaderUid: unknown): string | null {
    if (typeof uploadPath !== 'string' || typeof uploaderUid !== 'string') {
        return null;
    }

    const match = /^([^/\\]+)\/([a-z0-9]{1,13})$/u.exec(uploadPath);
    if (match?.[1] !== uploaderUid || match[1] === '.' || match[1] === '..') {
        return null;
    }

    return match[2];
}
