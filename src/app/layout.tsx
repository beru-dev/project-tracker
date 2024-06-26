import "../styles/main.scss";
import "../ui-lib/styles.css";
import { getServerSession } from "next-auth";
import { Footer, Header, SessionProvider } from "../components";

export const metadata = {
    title: "Project Tracker",
    description: "An application for tracking projects",
}

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getServerSession();

    return (
        <html lang="en">
            <body className="dark-theme">
                <SessionProvider {...{ session }}>
                    <Header />
                    {children}
                    <Footer />
                </SessionProvider>
            </body>
        </html>
    )
}
