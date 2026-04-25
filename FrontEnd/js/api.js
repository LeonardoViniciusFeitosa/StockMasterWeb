const browserHost = window.location.hostname;
const defaultApiBase = browserHost
    ? `${window.location.protocol}//${browserHost}:8080`
    : "http://localhost:8080";

const API_BASE = window.STOCKMASTER_API_BASE || defaultApiBase;

async function request(path, options = {}) {
    const headers = { ...(options.headers || {}) };
    const hasBody = options.body !== undefined;

    if (hasBody && !headers["Content-Type"]) {
        headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${API_BASE}${path}`, {
        ...options,
        credentials: "include",
        headers
    });

    const text = await response.text();
    let data = null;

    if (text) {
        try {
            data = JSON.parse(text);
        } catch {
            data = text;
        }
    }

    if (!response.ok) {
        const message =
            (data && typeof data === "object" && data.message) ||
            (typeof data === "string" && data) ||
            `Erro HTTP ${response.status}`;

        throw new Error(message);
    }

    return data;
}

export function getJSON(path) {
    return request(path, { method: "GET" });
}

export function postJSON(path, body) {
    return request(path, {
        method: "POST",
        body: JSON.stringify(body)
    });
}

export function putJSON(path, body) {
    return request(path, {
        method: "PUT",
        body: JSON.stringify(body)
    });
}

export function deleteJSON(path) {
    return request(path, { method: "DELETE" });
}
