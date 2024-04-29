"use client";

import React, { useState, useEffect, ReactNode } from "react";
import { Comment } from "./Comment";
import "./comments.scss";

export const Comments = ({ comments, addComment, canAddComment = false }: CommentsProps) => {
    const [comments_, setComments] = useState(comments);
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        setComments(comments);
    }, [comments]);

    return <section className="comments">
        {
            canAddComment && <>
                <textarea value={newComment} onChange={e => setNewComment(e.target.value)} />
                <button
                disabled={!Boolean(newComment.length)}
                onClick={async () => {
                    try {
                        const responseComment = await addComment(newComment);
                        setComments(prev => {
                            return [
                                ...prev,
                                responseComment
                            ]
                        });
                    } catch (error) {
                        console.error(error)
                        //
                    }
                }}
            >Add</button>
            </>
        }
        
        {
            comments_.map(({ id, userName, content, edit, createdAt, updatedAt }) => <Comment {...{ id, userName, content, edit, createdAt, updatedAt }} key={id} />)
        }
    </section>
}

type CommentsProps = {
    comments: (LocalComment & { edit?: ReactNode })[]
    addComment: (content: string) => Promise<LocalComment>
    canAddComment: boolean
}

type LocalComment = {
    id: number
    userName: string | null
    content: string | null
    createdAt: Date | null
    updatedAt: Date | null
}