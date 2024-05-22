import { SearchableResults } from "../../ui-lib";
import { db } from "../../database/connection";
import { ticket, project } from "../../database/schema";
import { sql, eq, like } from "drizzle-orm";
import Link from "next/link";
import { getUser, searchParamsFormatter } from "../../utils";
import "../../styles/ticket-results.scss";
import { Aside } from "../../components";

export default async ({ searchParams }: DashboardProps) => {
    const { search } = searchParamsFormatter(searchParams);
    const tickets = await getTickets(search);

    return <>
        <aside></aside>
        <main>
            <h2>Dashboard</h2>
            <SearchableResults title="Your Assigned Tickets" pageCount={1}>
                {
                    tickets.map(({ projectName, ticketNumber, title, status }) => {
                        const ticketId = `${projectName}-${ticketNumber}`;
                    
                        return <div className={status.replace(" ", "")} key={ticketId}>
                            <Link href={`/ticket?id=${ticketId}`}>{ticketId}</Link>
                            <h3>{title}</h3>
                            <span>{status}</span>
                        </div>
                    })
                }
            </SearchableResults>
        </main>
    </>
}

type DashboardProps = {
    searchParams: Record<string, string | string[] | undefined>
}

const getTickets = async (
    search: string | undefined,
    limit = 20,
    offset = 0
) => {
    const user = await getUser(["user", "admin"]);
    const isGuest = !("role" in user) || user.role === "guest";
    if(isGuest) return [];

    const tickets = db.select({
        ticketNumber: ticket.ticketNumber,
        projectName: project.name,
        title: ticket.title,
        status: ticket.status
    }).from(ticket)
        .leftJoin(project, eq(ticket.projectId, project.id))
        .$dynamic();

    const where = sql`${ticket.assigneeId} = ${user.id}`;

    if(search) {
        where.append(sql` AND `);
        where.append(like(ticket.title, `%${search}%`));
    }

    tickets.where(where);

    return tickets.limit(limit).offset(offset);
}