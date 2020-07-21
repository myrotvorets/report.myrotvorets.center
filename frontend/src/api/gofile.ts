// eslint-disable-next-line @typescript-eslint/no-explicit-any
function responseToJSON(r: Response): Promise<any> {
    if (r.ok) {
        return r.json();
    }

    return Promise.reject(new Error(`HTTP Error ${r.status}`));
}

export function getServerForUpload(): Promise<string> {
    return fetch('https://apiv2.gofile.io/getServer')
        .then(responseToJSON)
        .then((j) => {
            if ('status' in j && j.status === 'ok' && 'data' in j) {
                return j.data.server;
            }

            return Promise.reject(new Error(`Unexpected response from gofile: ${JSON.stringify(j)}`));
        });
}

export function uploadFiles(server: string, files: FileList, expiry?: Date): Promise<[string, string]> {
    const fd = new FormData();
    for (let i = 0; i < files.length; ++i) {
        const entry: File = files[i];
        fd.append('filesUploaded', entry, entry.name);
    }

    if (expiry) {
        fd.set('expire', expiry.getTime() + '');
    }

    return fetch(`https://${server}.gofile.io/upload`, {
        method: 'POST',
        body: fd,
    })
        .then(responseToJSON)
        .then((j) => {
            if ('status' in j && j.status === 'ok' && 'data' in j) {
                return [j.data.code, j.data.removalCode];
            }

            return Promise.reject(new Error(`Unexpected response from gofile: ${JSON.stringify(j)}`));
        });
}

export function deleteFiles(server: string, id: string, code: string): Promise<boolean> {
    const url = `https://${server}.gofile.io/deleteUpload?c=${id}&rc=${code}&removeAll=true`;
    return fetch(url)
        .then(responseToJSON)
        .then((j) => {
            if ('status' in j) {
                return j.status === 'ok';
            }

            return Promise.reject(new Error(`Unexpected response from gofile: ${JSON.stringify(j)}`));
        });
}

export function createZip(server: string, id: string): Promise<string> {
    const url = `https://${server}.gofile.io/createZip?c=${id}`;
    return fetch(url)
        .then(responseToJSON)
        .then((j) => {
            if ('status' in j && j.status === 'ok') {
                return `https://${server}.gofile.io/download/${id}/files-${id}.zip`;
            }

            return Promise.reject(new Error(`Unexpected response from gofile: ${JSON.stringify(j)}`));
        });
}
