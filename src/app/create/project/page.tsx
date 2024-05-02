import { db } from "../../../database/connection";
import { project } from "../../../database/schema";
import { getUser } from "../../../../src/utils";
import { ProjectForm } from "src/components";

export default async () => {
    const user = await getUser(["admin"]);
    if("error" in user) {
        return <div>{user.error}</div>
    }

    return <ProjectForm formAction={formAction} />
}

const formAction = async (prevState: any, formData: FormData) => {
    "use server"
    try {
        const user = await getUser(["user", "admin"]);
        if("error" in user) {
            console.error(user.error);
        }
throw new Error("nope")
        await db.insert(project).values({
            name: formData.get("name") as string
        });

        return { message: "Ticket created" }
    } catch (error) {
        return { message: "Unable to create project" };
    }
}