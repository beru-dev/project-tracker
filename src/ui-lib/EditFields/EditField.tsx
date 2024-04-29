"use client"

import React, { useState, useRef } from "react";
import { FaCircleCheck, FaCircleStop } from "react-icons/fa6";
import "./edit-field.scss";

export default ({ type = "text", name, label, value, action, editable = false }: EditFieldProps) => {
    const [editing, setEditing] = useState(false);
    const [currentValue, setCurrentValue] = useState(value);
    const inputRef = useRef<any>(null);

    const activateEditing = () => {
        if(!editable) return;

        setEditing(true);
    }

    const submit = async () => {
        try {
            await action(inputRef?.current?.name, inputRef?.current?.value);
        } catch (error) {
            console.error(error)
            // TOAST!!!
        } finally {
            setEditing(false);
        }
    }

    const InputElement = {
        text: "input",
        date: "input",
        textarea: "textarea",
    }[type] as "input" | "textarea";

    return editing
        ? (
            <div className={`field-editing${type === "textarea" ? " break" : ""}`}>
                <label htmlFor={name}>
                    <span>{`${label}:`}</span>
                    <InputElement
                        ref={inputRef}
                        type={type}
                        value={currentValue}
                        {...{ name }}
                        onChange={(e) => setCurrentValue(e.target.value)}
                        onKeyDown={(e: React.KeyboardEvent) => {
                            if(e.key === "Enter") {
                                e.preventDefault();
            
                                submit();
                            }

                            if(e.key === "Escape") {
                                setEditing(false);
                            }
                        }}
                    />
                    <button className="cancel" onClick={() => setEditing(false)}><FaCircleStop /></button>
                    <button className="submit" onClick={submit}><FaCircleCheck /></button>
                </label>
            </div>
        )
        : (
            <div className={`field-inactive${type === "textarea" ? " break" : ""}`} onDoubleClick={activateEditing}>
                <span>{`${label}:`}</span>
                {currentValue}
            </div>
        )
}

type EditFieldProps = {
    type?: "text"| "textarea" | "date"
    name: string
    label: string
    value: string
    editable: boolean
    action: (column: string | undefined, value: string | undefined) => Promise<void>
}