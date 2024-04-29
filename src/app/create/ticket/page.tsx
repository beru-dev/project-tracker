import { db } from "../../../database/connection";
import { project, ticket } from "../../../database/schema";
import { eq, max } from "drizzle-orm";
import { getUser } from "../../../../src/utils";

export default async () => {
    const [user, projects] = await Promise.all([
        getUser(["user", "admin"]),
        getProjects()
    ]);

    if("error" in user) {
        return <div>{user.error}</div>
    }

    const formActionWithUser = formAction.bind(null, user.id);

    return <form action={formActionWithUser}>
        <label>
            <select name="project">
                {
                    projects.map(({ id, name }) => (
                        <option value={id} key={id}>{name}</option>
                    ))
                }
            </select>
        </label>

        <input type="text" name="title" placeholder="Enter title" />
        <textarea name="description" placeholder="Enter description" />
        <input type="number" name="points" placeholder="Enter points" />
        <input type="text" name="Enter assignee" />
        <input type="date" name="due" />

        <button type="submit">Add</button>
    </form>
}

const formAction = async (userId: number, formData: FormData) => {
    "use server"

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
        points: parseInt(formData.get("points") as string),
        creatorId: userId
    };

    await db.insert(ticket)
        .values(values);
}

const getProjects = async () => {
    return db.select({
        id: project.id,
        name: project.name
    }).from(project);
}