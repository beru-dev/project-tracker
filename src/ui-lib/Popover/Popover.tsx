"use client"

import React, { ReactNode, useState, useRef } from "react";
import { createPortal } from "react-dom";
import "./popover.scss";

export const Popover = ({ trigger, position = "below", children, id, className }: PopoverProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    return (
        <>
            <div
                className={"popover-trigger" + (className ? ` ${className}` : "")}
                onClick={() => setIsOpen(!isOpen)}
                {...{ ref, id }}
            >
                { trigger }
            </div>
            {
                isOpen && ref.current && <>
                    {
                        createPortal(
                            <div
                                className={`popover ${position}`}
                                onClick={e => e.stopPropagation()}
                            >
                                {children}
                            </div>,
                            ref.current
                        )
                    }
                    {
                        createPortal(
                            <div
                                className="popover-underlay"
                                onClick={() => setIsOpen(false)}
                                style={{ position: "absolute", width: "100%", height: "100%" }}
                            ></div>,
                            document.body
                        )
                    }
                </> || null
            }
        </>
    )
}

type PopoverProps = {
    trigger: ReactNode
    children: ReactNode
    position?: "above" | "below" | "left" | "right" | "nw" | "ne" | "se" | "sw"
    className?: string
    id?: string
}