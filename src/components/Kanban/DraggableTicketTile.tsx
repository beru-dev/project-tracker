"use client"

import React from "react";
import { useDraggable } from "@dnd-kit/core";
import Link from "next/link";
import { Ticket } from "src/database/schema/ticket";

export default ({ ticket: { ticketNumber, projectName, title, status }}: DraggableTileProps) => {
    const ticketId = `${projectName}-${ticketNumber}`;
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: ticketId });
    const style = transform
        ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
        : undefined;

    return (
        <div className={status.replace(" ", "")} ref={setNodeRef} {...{ style }} {...listeners} {...attributes}>
            <Link href={`/ticket?id=${ticketId}`}>{ticketId}</Link>
            <h4>{title}</h4>
        </div>
    )
}

type DraggableTileProps = {
    ticket: Ticket & { projectName: string }
}