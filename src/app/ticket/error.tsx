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
            <h4>Something went wrong viewing your ticket. Please verify that the id is correct.</h4>
            <Link href="/tickets">Back to tickets</Link>
        </main>
    </>
}