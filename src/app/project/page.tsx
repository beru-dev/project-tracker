import { EditField } from "../../ui-lib";
import { SearchableResults } from "../../ui-lib";
import { db } from "../../database/connection";
import { ticket, project } from "../../database/schema";
import { eq, sql } from "drizzle-orm";
import { getUser, searchParamsFormatter } from "../../utils";
import { Suspense } from "react";
import Link from "next/link";
import "../../styles/ticket.scss";

export default async ({ searchParams }: ProjectProps) => {
    const user = await getUser(["user", "admin"]);
    const isGuest = !("role" in user) || user.role === "guest";

    const { name } = searchParamsFormatter(searchParams);
    if(!name) return <div>Project name missing from URL</div>

    const [project_, tickets] = await Promise.all([getProject(name), getTickets(name)]);

    const updateProjectDescriptionWithId = updateProjectDescription.bind(null, project_.id);

    return <>
        <section className="project-info">
            <h2>{name}</h2>
            <EditField
                name="description"
                label="Description"
                type="textarea"
                value={project_.description || ""}
                editable={!isGuest}
                action={updateProjectDescriptionWithId}
            />
        </section>
        <Suspense>
            <SearchableResults title="Tickets" pageCount={1}>
                {
                    tickets.map(({ projectName, ticketNumber, title, status }) => (
                        <div className={status.replace(" ", "")} key={`${projectName}-${ticketNumber}`}>
                            <Link href={`/ticket?id=${projectName}-${ticketNumber}`}>{`${projectName}-${ticketNumber}`}</Link>
                            <h3>{title}</h3>
                            <span>{status}</span>
                        </div>
                    ))
                }
            </SearchableResults>
        </Suspense>
    </>
}

type ProjectProps = {
    searchParams: Record<string, string | string[] | undefined>
}

const getProject = async (name: string) => {
    const project_ = await db.select({
        id: project.id,
        name: project.name,
        description: project.description
    }).from(project)
        .where(sql`${project.name} = ${name}`);

    return project_[0];
}

const getTickets = async (name: string) => {
    const tickets = db.select({
        ticketNumber: ticket.ticketNumber,
        projectName: project.name,
        title: ticket.title,
        status: ticket.status
    }).from(ticket)
        .leftJoin(project, eq(project.name, name))
        .where(sql`${project.id} = ${ticket.projectId}`)
        .orderBy(ticket.createdAt);

    return tickets;
}

const updateProjectDescription = async (id: number, _column: string | undefined, value: any) => {
    "use server"

    try {
        const user = await getUser(["user", "admin"]);
        const isGuest = !("role" in user) || user.role === "guest";
        if(isGuest) throw new Error("Insufficient access to perform this operation");

        await db.update(project)
            .set({ "description": value })
            .where(sql`${project.id} = ${id}`);
    } catch (error) {
        console.error("Unable to update project description", error);
    }
}