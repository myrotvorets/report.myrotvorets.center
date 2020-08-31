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

export async function uploadFiles(server: string, files: FileList, expiry?: Date): Promise<[string, string]> {
    let adminCode: string | undefined;
    let code: string | undefined;
    for (let i = 0; i < files.length; ++i) {
        const fd = new FormData();
        const entry: File = files[i];
        fd.append('file', entry, entry.name);

        if (expiry) {
            fd.set('expire', `${expiry.getTime() / 1000}`);
        }

        if (adminCode) {
            fd.set('ac', adminCode);
        }

        const response = await fetch(`https://${server}.gofile.io/uploadFile`, {
            method: 'POST',
            body: fd,
        });

        const json = await responseToJSON(response);
        if ('status' in json && json.status === 'ok' && 'data' in json) {
            if (!adminCode) {
                adminCode = json.data.adminCode;
                code = json.data.code;
            }
        } else {
            throw new Error(`Unexpected response from gofile: ${JSON.stringify(json)}`);
        }
    }

    if (code && adminCode) {
        return [code, adminCode];
    }

    throw new Error('Unable to upload files to GoFile');
}

export function deleteFiles(server: string, id: string, code: string): Promise<boolean> {
    const url = `https://${server}.gofile.io/deleteUpload?c=${id}&ac=${code}&removeAll=true`;
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
