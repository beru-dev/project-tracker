"use client"

import { useEffect } from "react";

export default ({ error, reset }: { error: Error & { digest?: string }, reset: () => void}) => {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return <>
        <h2>Something went wrong viewing your board. Please verify that the project name is correct.</h2>
        <button onClick={() => reset()}>Back to projects</button>
    </>
}