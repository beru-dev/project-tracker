import { db } from "../../../database/connection";
import { project } from "../../../database/schema";
import { getUser } from "../../../../src/utils";

export default async () => {
    const user = await getUser(["admin"]);
    if("error" in user) {
        return <div>{user.error}</div>
    }

    return <form action={serverAction}>
        <input type="text" name="name" placeholder="Project name" required />
        <button type="submit">Add</button>
    </form>
}

const serverAction = async (formData: FormData) => {
    "use server"

    await db.insert(project).values({
        name: formData.get("name") as string
    });
}