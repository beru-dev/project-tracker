import { eq, sql } from "drizzle-orm";
import { db } from "../database/connection";
import { comment, user } from "../database/schema";
import { Comments } from "ui-lib";
import { getUser } from "src/utils";

export default async ({ ticketNumber, projectId }: CommentsSectionProps) => {
    const user = await getUser(["user", "admin"]);
    const isGuest = "error" in user;

    const comments = await getComments(ticketNumber, projectId);

    const addCommentWithIds = addComment.bind(null, !isGuest && user.id || NaN, !isGuest && user.name || "", ticketNumber, projectId)

    return <Comments comments={comments} canAddComment={!isGuest} addComment={addCommentWithIds} />
}

type CommentsSectionProps = {
    ticketNumber: number
    projectId: number
}

const getComments = async (ticketNumber: number, projectId: number) => {
    return db.select({
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        userName: user.name
    }).from(comment)
        .leftJoin(user, eq(comment.userId, user.id))
        .where(sql`${comment.ticketNumber} = ${ticketNumber} AND ${comment.ticketProjectId} = ${projectId}`);
}

const addComment = async (userId: number, userName: string, ticketNumber: number, ticketProjectId: number, content: string): Promise<{ id: number, userName: string, content: string, createdAt: Date, updatedAt: Date}> => {
    "use server"

    if(!userId) throw new Error("Unable to add comment due to insufficient access.");

    const response = await db.insert(comment)
        .values({
            userId,
            content,
            ticketNumber,
            ticketProjectId
        })
        .returning({
            id: comment.id,
            content: comment.content,
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt
        });
    const addedComment = response[0];

    if(!addedComment) throw new Error("Unable to add comment");

    return {
        id: addedComment.id,
        userName,
        content: addedComment.content || "",
        createdAt: addedComment.createdAt || new Date(),
        updatedAt: addedComment.updatedAt || new Date()
    }
}