import { db } from "../../src/database/connection";
import { user } from "../../src/database/schema";
import { eq, sql } from "drizzle-orm";
import { getServerSession } from "next-auth";

export default async (/*name: string, */roles?: string[]): Promise<UserOrError> => {
    const session = await getServerSession();
    if(!session?.user?.name) {
        return { error: "Please log in to perform this operation" }
    }

    const name = session?.user?.name

    const where = roles && roles.length
        ? sql`${user.name} = ${name} AND ${user.role} IN ${roles}`
        : eq(user.name, name);

    const userArray = await db.select({ id: user.id, name: user.name, role: user.role })
        .from(user)
        .where(where);

    return userArray[0]
        ? userArray[0]
        : { error: "You do not have access to perform this operation" };
}

type UserOrError = {
    id: number;
    name: string | null;
    role: "user" | "guest" | "admin";
} | {
    error: string
}