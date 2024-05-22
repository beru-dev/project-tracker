"use client"

import { useEffect } from "react";

export default ({ error, reset }: { error: Error & { digest?: string }, reset: () => void}) => {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return <>
        <aside></aside>
        <main>
            <h4>Something went wrong viewing your assigned tickets.</h4>
        </main>
    </>
}