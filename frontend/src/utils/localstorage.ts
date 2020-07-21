export function lsGet(key: string): string {
    return self.localStorage.getItem(key) || '';
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
