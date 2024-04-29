"use client"

import { useState, useEffect } from "react";
import { makeRequest } from "./makeRequest";

export const useFetch = <T,>({ url, route }: UseGetCallProps): [T | null, boolean, string | null] => {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [pending, setPending] = useState(false);

    useEffect(() => {
        setPending(true);
        const controller = new AbortController();
        makeRequest<T>({ url, route, signal: controller.signal })
            .then((data) => {
                setData(data)
            })
            .catch(err => {
                setError(err.message)
            })
            .finally(() => setPending(false));

        return () => {
            controller.abort();
        };
    }, []);

    return [data, pending, error];
}

type UseGetCallProps = {
    url?: string
    route?: string
}