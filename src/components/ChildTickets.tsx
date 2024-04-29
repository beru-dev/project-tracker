import { sql } from "drizzle-orm";
import { db } from "../database/connection";
import { ticket, project } from "../database/schema";

export default async ({ ticketNumber, projectId }: ChildTicketsProps) => {
    const childTickets = await getChildTickets(ticketNumber, projectId);

    return <section className="child-tickets">
        {
            childTickets.map(({ ticketNumber, projectName, title }) => (
                <div key={`${projectName}-${ticketNumber}`}>
                    <span>{`${projectName}-${ticketNumber}`}</span>
                    <span>{title}</span>
                </div>
            ))
        }
    </section>
}

type ChildTicketsProps = {
    ticketNumber: number
    projectId: number
}

const getChildTickets = async (ticketNumber: number, projectId: number) => {
    return db.select({
        ticketNumber: ticket.ticketNumber,
        projectName: project.name,
        title: ticket.title
    }).from(ticket)
        .leftJoin(project, sql`${ticket.projectId} = ${project.id}`)
        .where(sql`${ticket.ticketNumber} = ${ticketNumber} AND ${ticket.projectId} = ${projectId}`);
}