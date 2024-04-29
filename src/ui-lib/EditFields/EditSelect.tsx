"use client"

import React, { useState, useRef } from "react";
import { FaCircleCheck, FaCircleStop } from "react-icons/fa6";
import "./edit-field.scss";

export default ({ name, label, value, options, editable = false, action }: EditSelectProps) => {
    const [editing, setEditing] = useState(false);
    const [currentValue, setCurrentValue] = useState(value);
    const ref = useRef<HTMLSelectElement>(null);

    const activateEditing = () => {
        if(!editable) return;

        setEditing(true);
    }

    const submit = async () => {
        try {
            await action(name, currentValue);
        } catch (error) {
            console.error(error)
            // TOAST!!!
        } finally {
            setEditing(false);
        }
    }

    const selectedOption = options.find(({ value }) => {
        return value.toString() === currentValue.toString();
    });

    return editing
        ? (
            <div className="field-editing">
                <label htmlFor={name}>
                    {`${label}:`}
                    <select
                        value={currentValue}
                        onChange={(e) => setCurrentValue(e.target.value)}
                        {...{ name, ref }}
                    >
                        {
                            options.map(({ value, display }) => (
                                <option {...{ value }} key={value}>{display}</option>
                            ))
                        }
                    </select>
                    <button className="cancel" onClick={() => setEditing(false)}><FaCircleStop /></button>
                    <button className="submit" onClick={submit}><FaCircleCheck /></button>
                </label>
            </div>
        )
        : (
            <div className="field-inactive" onDoubleClick={activateEditing}>
                <span>{`${label}:`}</span>
                { selectedOption?.display }
            </div>
        )
}

type EditSelectProps = {
    name: string
    label: string
    editable: boolean
    value: any
    options: {
        value: number | string
        display: string
    }[]
    action: (column: string | undefined, value: string | undefined) => Promise<void>
}