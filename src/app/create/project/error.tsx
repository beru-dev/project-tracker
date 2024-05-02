"use client"

import { useEffect } from "react";

export default ({ error, reset }: { error: Error & { digest?: string }, reset: () => void}) => {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return <>
        <h2>Something went wrong creating your project</h2>
        <button onClick={() => reset()}>Back to project creation</button>
    </>
}