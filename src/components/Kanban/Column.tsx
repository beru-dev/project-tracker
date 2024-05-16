"use client"

import React from "react";
import { useDroppable } from "@dnd-kit/core";
import DraggableTicketTile from "./DraggableTicketTile";
import { Ticket } from "src/database/schema/ticket";

export default ({ tickets, name }: ColumnsProps) => {
    const { isOver, setNodeRef } = useDroppable({ id: name });
    const style = { color: isOver ? "green": undefined };

    return (
        <section data-status={name}>
            <h3>{name}</h3>
            <div ref={setNodeRef} {...{ style }}>
                {
                    tickets.map((ticket, index) => (
                        <DraggableTicketTile
                            key={`${ticket.projectName}-${ticket.ticketNumber}`}
                            {...{ ticket, index }}
                        />
                    ))
                }
            </div>
        </section>
    )
}

type ColumnsProps = {
    tickets: (Ticket & { projectName: string })[]
    name: string
}
