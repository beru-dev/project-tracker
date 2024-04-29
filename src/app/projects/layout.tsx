import { ReactNode } from "react";

export default ({ children }: { children: ReactNode }) => {
    return <>
        <aside></aside>
        <main>
            {children}
        </main>
    </>
}