"use client"

import React, { useState } from "react";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import Column from "./Column";
import { Ticket } from "src/database/schema/ticket";
import groupArrayElsByKey from "../../utils/groupArrayElsByKey";
import { STATUSES } from ".";

export default ({ tickets, updateStatus }: StatusColumnsProps) => {
    const [ticketsNotGrouped, setTickets] = useState(tickets);
    const ticketsGroupedByStatus = groupArrayElsByKey(ticketsNotGrouped, "status");
    const onDragEnd = async (event: DragEndEvent) => {
        const { over, active } = event;

        if(!ticketsNotGrouped || !over) return;

        const [projectName, ticketNumber] = (active.id as string).split("-");
        await updateStatus(over.id as string, projectName, ticketNumber);

        setTickets(prev => {
            return prev.map(ticket => {
                if(ticket.ticketNumber !== parseInt(ticketNumber)) return ticket;
    
                return { ...ticket, status: over.id as any }
            });
        });
    };

    return (
        <DndContext {...{ onDragEnd }}>
            <div className="board">
                {
                    ticketsNotGrouped &&
                        STATUSES.map(column =>
                            <Column key={column} tickets={ticketsGroupedByStatus[column] as any[] || []} name={column} />
                        )
                }
            </div>
        </DndContext>
    )
}

type StatusColumnsProps = {
    tickets: (Partial<Ticket & { projectName: string | null }>)[]
    updateStatus: (status: string, projectName: string, ticketNumber: string) => Promise<void>
}