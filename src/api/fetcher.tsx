import Cookies from "js-cookie";
// import { saveAs } from "file-saver"; // not installed yet, install later if needed

type requestOptionsType = {
    headers?: HeadersInit,
    method?: string,
    body?: string|FormData,
    emptyResponse?: boolean,
    download?: boolean,
};

function fetcher(url: string, options:requestOptionsType = {}) {
    return fetch(process.env.REACT_APP_NODE_API_URL + url, {
        credentials: "same-origin",
        ...options,
        headers: {
            ...getDefaultHeaders(),
            ...(options.headers || {}),
        },
    }).then((response) => handleResponse(response, options))
        .catch(error => error);
}

fetcher.get = fetcher;

fetcher.post = (url: string, body: {}, emptyResponse = false) => {
    return fetcher(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        emptyResponse,
    });
};

fetcher.put = (url: string, body: {}) => {
    return fetcher(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
};
//
fetcher.delete = (url: string, body: {} = {}) => {
    return fetcher(url, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        emptyResponse: true,
        body: JSON.stringify(body),
    });
};

fetcher.upload = (url: string, body: FormData) => {
    return fetcher(url, {
        method: "POST",
        headers: {
            Accept: "application/json, text/plain, */*",
        },
        body,
    });
};

fetcher.download = (url: string) => {
    return fetcher(url, {
        headers: {
            Accept: "text/csv",
        },
        download: true,
    });
};

function handleResponse(response: Response, options:requestOptionsType) {
    if (!response.ok) {
        return getErrorPayload(response).then((error) => Promise.reject(error));
    }
    if (options.download) {
        return downloadPayload(response);
    }
    if (options.emptyResponse) {
        return Promise.resolve();
    }
    return response.json();
}

function getDefaultHeaders() {
    const token = Cookies.get('token');
    if (token)
        return {
            Authorization: token,
        };
}

function getErrorPayload(response: Response) {
    return hasJson(response) ? response.json() : response.text();
}

function downloadPayload(response: Response) {
    // return response.blob().then((blob) => saveAs(blob, getResponseFileName(response)));
}

function getResponseFileName(response: Response) {
    const encodedDisposition = response.headers.get("content-disposition");
    const disposition = decodeURIComponent(encodedDisposition!);
    if (disposition && disposition.includes("attachment")) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(disposition);
        return matches?.[1]?.replace(/['"]/g, "");
    }
}

function hasJson(response: Response) {
    return response.headers.get("Content-Type")?.includes("application/json");
}

export default fetcher;
