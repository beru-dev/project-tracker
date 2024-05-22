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
            <h4>Something went wrong viewing your board. Please verify that the project name is correct.</h4>
            <Link href="/projects">Back to projects</Link>
        </main>
    </>
}