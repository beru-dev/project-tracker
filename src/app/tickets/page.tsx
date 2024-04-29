import { SearchableResults } from "../../ui-lib";
import { db } from "../../database/connection";
import { ticket, project } from "../../database/schema";
import { sql, eq, inArray } from "drizzle-orm";
import Link from "next/link";
import { searchParamsFormatter } from "../../utils";
import "../../styles/ticket-results.scss";

export default async ({ searchParams }: TicketsProps) => {
    const { projects, due } = searchParamsFormatter(searchParams);
    const tickets = await getTickets(projects, due);

    return <SearchableResults title="Tickets" pageCount={1}>
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
}

type TicketsProps = {
    searchParams: Record<string, string | string[] | undefined>
}

const getTickets = async (
    projects: string[] | undefined,
    due: Date | undefined,
    limit = 20,
    offset = 0
) => {
    const tickets = db.select({
        ticketNumber: ticket.ticketNumber,
        projectName: project.name,
        title: ticket.title,
        status: ticket.status
    }).from(ticket)
        .leftJoin(project, eq(ticket.projectId, project.id))
        .$dynamic();

    const where = sql``;

    if(projects) {
        where.append(inArray(project.name, projects));
    }

    if(projects || due) {
        tickets.where(where);
    }

    return tickets.limit(limit).offset(offset);
}