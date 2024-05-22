"use client"

import { useEffect } from "react";
import Link from "next/link";

export default ({ error, reset }: { error: Error & { digest?: string }, reset: () => void}) => {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return <>
        <aside></aside>
        <main>
            <h4>Something went wrong viewing your projects.</h4>
            <Link href="/dashboard">Back to Dashboard</Link>
        </main>
    </>
}