"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default () => {
    const { data: session } = useSession();

    if(session) {
        return <>
            {session.user?.name}
            <button onClick={() => signOut()}>Sign Out</button>
        </>
    }

    return <>
        Not signed in 
        <button onClick={() => signIn()}>Sign In</button>
    </>
}