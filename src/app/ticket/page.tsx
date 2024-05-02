import { EditField, EditSelect, SearchList } from "../../ui-lib";
import { CommentsSection } from "../../components";
import { db } from "../../database/connection";
import { ticket, project, user } from "../../database/schema";
import { eq, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { getUser, searchParamsFormatter } from "../../utils";
import { Suspense } from "react";
import "../../styles/ticket.scss";

export default async ({ searchParams }: TicketProps) => {
    const user = await getUser(["user", "admin"]);
    const isGuest = !("role" in user) || user.role === "guest";

    const { id } = searchParamsFormatter(searchParams);
    if(!id) return <div>Ticket id missing from URL</div>

    const [data, users] = await Promise.all([getTicket(id), getUsers()])
    if(!data) return <div>Ticket not found</div>
    const {
        ticketNumber, projectId, title, description, status, points,
        due, creator, assignee
    } = data;

    const updateTicketWithId = updateTicket.bind(null, id);

    return <>
        <section className="ticket-info">
            <section className="ticket-main">
                <h2>{id}</h2>
                <EditField
                    name="title"
                    label="Title"
                    value={title}
                    editable={!isGuest}
                    action={updateTicketWithId}
                />
                <EditField
                    name="description"
                    label="Description"
                    type="textarea"
                    value={description || ""}
                    editable={!isGuest}
                    action={updateTicketWithId}
                />
            </section>
            <section className="ticket-side">
                <EditSelect
                    name="status"
                    label="Status"
                    value={status}
                    editable={!isGuest}
                    action={updateTicketWithId}
                    options={[
                        { value: "to do", display: "To Do" },
                        { value: "working", display: "Working" },
                        { value: "done", display: "Done" },
                        { value: "abandoned", display: "Abandoned" },
                        { value: "blocked", display: "Blocked" }
                    ]}
                />
                <SearchList
                    name="assignee"
                    label="Assignee"
                    value={assignee || ""}
                    listId="assignee-list"
                    getOptions={getUsers}
                    submit={async (_, selected_assignee) => {
                        "use server"
                        updateTicketWithId("assigneeId", selected_assignee.id)
                    }}
                    initialOptions={users}
                    editable={!isGuest}
                />
                <EditField
                    name="points"
                    label="Points"
                    value={points?.toString() || ""}
                    editable={!isGuest}
                    action={updateTicketWithId}
                />
                <div>Created By: {creator}</div>
                <EditField
                    name="due"
                    label="Due"
                    type="date"
                    value={due || "-"}
                    editable={!isGuest}
                    action={updateTicketWithId}
                />
            </section>
        </section>
        <Suspense>
            <CommentsSection {...{ ticketNumber, projectId }} />
        </Suspense>
    </>
}

type TicketProps = {
    searchParams: Record<string, string | string[] | undefined>
}

const getTicket = async (id: string) => {
    const creator = alias(user, "creator");
    const assignee = alias(user, "assignee");

    const [projectName, ticketNumber] = id.split("-");

    const tickets = await db.select({
        ticketNumber: ticket.ticketNumber,
        projectId: ticket.projectId,
        title: ticket.title,
        description: ticket.description,
        points: ticket.points,
        status: ticket.status,
        due: ticket.due,
        creator: creator.name,
        assignee:  assignee.name
    }).from(ticket)
        .leftJoin(project, eq(ticket.projectId, project.id))
        .leftJoin(creator, eq(ticket.creatorId, creator.id))
        .leftJoin(assignee, eq(ticket.assigneeId, assignee.id))
        .where(sql`${project.name} = ${projectName} AND ${ticket.ticketNumber} = ${ticketNumber || ""}`);

    return tickets[0];
}

const getUsers = async () => {
    "use server"

    return db.select({
        id: user.id,
        name: user.name
    }).from(user);
}

const updateTicket = async (id: string, column: string | undefined, value: any) => {
    "use server"

    try {
        const user = await getUser(["user", "admin"]);
        const isGuest = !("role" in user) || user.role === "guest";
        if(isGuest) throw new Error("Insufficient access to perform this operation");

        const [projectName, ticketNumber] = id.split("-");
        if(!column || !projectName || !ticketNumber) return;

        const parentProject = db.$with("parent_project").as(
            db.select({ pid: sql`${project.id}`.as("pid") })
                .from(project)
                .where(eq(project.name, projectName))
        );

        await db.with(parentProject)
            .update(ticket)
            .set({ [column]: value })
            .where(sql`${ticket.projectId} = (select pid from ${parentProject}) AND ${ticket.ticketNumber} = ${ticketNumber}`);
    } catch (error) {
        console.error("Unable to update ticket", error);
        // return {
        //     message: "Unable to update ticket"
        // }
    }
}