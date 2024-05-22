import { SearchableResults } from "../../ui-lib";
import { db } from "../../database/connection";
import { sql, like } from "drizzle-orm";
import { project } from "../../database/schema";
import Link from "next/link";
import { Aside } from "../../components";
import { searchParamsFormatter } from "../../utils";
import "../../styles/project-results.scss";

export default async ({ searchParams }: ProjectsProps) => {
    const { search } = searchParamsFormatter(searchParams);
    const projects = await getProjects(search);

    return <>
        <Aside />
        <main>
            <SearchableResults title="Projects" pageCount={1}>
                {
                    projects.map(({ id, name }) =>
                        <div className="project-listing">
                            <Link href={`/project?name=${name}`} key={id}>
                                {name}
                            </Link>
                        </div>
                    )
                }
            </SearchableResults>
        </main>
    </>
}

type ProjectsProps = {
    searchParams: Record<string, string | string[] | undefined>
}

const getProjects = async (search?: string, limit = 20, offset = 0) => {
    const projects = db.select({
        id: project.id,
        name: project. name
    }).from(project)
        .$dynamic();

    const where = sql``;

    if(search) {
        where.append(like(project.name, `%${search}%`));
        projects.where(where);
    }

    return projects.limit(limit).offset(offset);;
}