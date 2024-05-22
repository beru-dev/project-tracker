import Link from "next/link";

export default ({ project }: AsideProps) => {
    return <aside>
        <Link href={"/dashboard"}>Dashboard</Link>
        {
            project && (
                <>
                    <Link href={`/tickets?projects=${project}`}>Backlog</Link>
                    <Link href={`/board?name=${project}`}>Board</Link>
                </>
            )
        }
    </aside>
}

type AsideProps = {
    project?: string
}