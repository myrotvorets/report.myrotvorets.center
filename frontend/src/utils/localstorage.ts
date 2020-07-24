export function lsGet(key: string): string {
    // #10 - Failed to read the 'localStorage' property from 'Window': Access is denied for this document.
    try {
        return self.localStorage.getItem(key) || '';
    } catch (e) {
        return '';
    }
}

export function lsSet(key: string, value: string): void {
    try {
        if (value) {
            self.localStorage.setItem(key, value);
        } else {
            self.localStorage.removeItem(key);
        }
    } catch (e) {
        // Do nothing
    }
}
