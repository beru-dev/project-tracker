import { db } from "../../../database/connection";
import { project, ticket } from "../../../database/schema";
import { eq, max } from "drizzle-orm";
import { getUser } from "../../../../src/utils";
import { TicketForm } from "src/components";

export default async () => {
    const [user, projects] = await Promise.all([
        getUser(["user", "admin"]),
        getProjects()
    ]);

    if("error" in user) {
        return <div>{user.error}</div>
    }

    const formActionWithUser = formAction.bind(null, user.id);

    return <TicketForm {...{ projects }} formAction={formActionWithUser} />
}

const formAction = async (userId: number, prevState: any, formData: FormData) => {
    "use server"

    try {
        const user = await getUser(["user", "admin"]);
        if("error" in user) {
            console.error(user.error);
        }

        const projectId = parseInt(formData.get("project") as string);
        const maxRow = await db.select({ ticketNumber: max(ticket.ticketNumber) })
            .from(ticket)
            .where(eq(ticket.projectId, projectId));
        const newTicketNumber = (maxRow[0].ticketNumber || 0) + 1;

        const values = {
            ticketNumber: newTicketNumber,
            projectId,
            title: formData.get("title") as string,
            description: formData.get("description") as string,
            points: parseInt(formData.get("points") as string) || null,
            creatorId: userId
        };

        await db.insert(ticket)
            .values(values);

        return { message: "Ticket created" }
    } catch (error) {
        return { message: "Unable to create ticket" }
    }
}

const getProjects = async () => {
    return db.select({
        id: project.id,
        name: project.name
    }).from(project);
}