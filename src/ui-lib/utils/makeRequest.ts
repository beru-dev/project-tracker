export const makeRequest = async <T,>({
    url,
    route,
    method = "GET",
    body,
    contentType = "application/json",
    signal
}: RequestConfig): Promise<T> => {
    if(!url && !route) throw new Error("Request must have either url or route");

    const requestUrl = url ? url : `/api/${route}`;
    const options: RequestInit = {
        headers: { "Content-Type": contentType },
        method
    };

    if(body) options.body = JSON.stringify(body);
    if(signal) options.signal = signal;

    const response = await fetch(requestUrl, options);

    return await response.json();
}

type RequestConfig = {
    url?: string
    route?: string
    method?: HTTPMethod
    body?: any
    contentType?: string
    signal?: AbortSignal
}

type HTTPMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"