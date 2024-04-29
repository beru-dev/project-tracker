import React, { ReactNode } from "react";

export const Comment = ({ id, userName, content, edit, createdAt, updatedAt }: CommentProps) => {
    const created = createdAt?.toDateString();
    const updated = updatedAt?.toDateString();
    const date = !updated || created === updated
        ? created
        : `Edited: ${updated}`;

    return <article className="comment" key={id}>
        {edit}
        <span className="user">{userName}</span>
        <span className="date">{date}</span>
        <div className="content">{content}</div>
    </article>
}

type CommentProps = {
    id: number
    userName: string | null
    content: string | null
    edit?: ReactNode
    createdAt: Date | null
    updatedAt: Date | null
}