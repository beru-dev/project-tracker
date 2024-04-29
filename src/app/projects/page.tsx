import { SearchableResults } from "ui-lib";
import { db } from "../../database/connection";
import { project } from "../../database/schema";
import Link from "next/link";

export default async () => {
    const projects = await getProjects();

    return <SearchableResults title="Projects" pageCount={1}>
        {
            projects.map(({ id, name }) => <Link href={`/tickets?projects=${name}`} key={id}>{name}</Link>)
        }
    </SearchableResults>
}

const getProjects = async (search?: string, limit = 20, offset = 0) => {
    const projects = await db.select({
        id: project.id,
        name: project. name
    }).from(project)
        .limit(limit)
        .offset(offset);

    return projects;
}