import { db } from "../../../database/connection";
import { project, ticket, user } from "../../../database/schema";
import { eq, max } from "drizzle-orm";
import { getUser } from "../../../../src/utils";
import { TicketForm } from "src/components";
import { revalidatePath } from "next/cache";

export default async () => {
    const [user, projects, users] = await Promise.all([
        getUser(["user", "admin"]),
        getProjects(),
        getUsers()
    ]);

    if("error" in user) {
        return <div>{user.error}</div>
    }

    const formActionWithUser = formAction.bind(null, user.id);

    return <TicketForm {...{ projects, users }} formAction={formActionWithUser} />
}

const formAction = async (userId: number, prevState: any, formData: FormData) => {
    "use server"

    try {
        const user = await getUser(["user", "admin"]);
        if("error" in user) {
            console.error(user.error);
        }

        const projectId = parseInt(formData.get("project") as string);
        const assigneeId = parseInt(formData.get("user") as string);
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
            creatorId: userId,
            assigneeId
        };

        await db.insert(ticket)
            .values(values);

        revalidatePath("/tickets", "layout");

        return { message: "Ticket created", projectId, newTicketNumber }
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

const getUsers = async () => {
    "use server"

    return db.select({
        id: user.id,
        name: user.name
    }).from(user);
}