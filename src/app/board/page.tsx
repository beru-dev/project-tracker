import { db } from "../../database/connection";
import { eq, sql } from "drizzle-orm";
import { project, ticket } from "../../database/schema";
import { searchParamsFormatter, getNextDayDate } from "../../utils";
import { Kanban } from "src/components/Kanban"; 
import "../../styles/kanban.scss";

export default async ({ searchParams }: ProjectsProps) => {
    const { name } = searchParamsFormatter(searchParams);
    if(!name) throw new Error("Project name missing from URL parameters");
    const tickets = await getTickets(name);

    return <Kanban {...{ tickets, updateStatus }} />
}

type ProjectsProps = {
    searchParams: Record<string, string | string[] | undefined>
}

const getTickets = async (name: string) => {
    const nextFridayDate = getNextDayDate("friday");

    const tickets = db.select({
        ticketNumber: ticket.ticketNumber,
        projectName: project.name,
        title: ticket.title,
        status: ticket.status
    }).from(ticket)
        .leftJoin(project, eq(project.name, name))
        .where(sql`${project.id} = ${ticket.projectId} AND ${ticket.due} <= ${nextFridayDate}`);

    return tickets
}

const updateStatus = async (status: string, projectName: string, ticketNumber: string) => {
    "use server"

    try {
        const parentProject = db.$with("parent_project").as(
            db.select({ pid: sql`${project.id}`.as("pid") })
                .from(project)
                .where(eq(project.name, projectName))
        );

        await db.with(parentProject)
            .update(ticket)
            .set({ status: status as any })
            .where(sql`${ticket.projectId} = (select pid from ${parentProject}) AND ${ticket.ticketNumber} = ${ticketNumber}`);
    } catch (error) {
        console.error("Unable to update ticket status", error)
    }
}