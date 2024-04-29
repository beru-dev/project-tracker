"use client"

import React, { useState, useEffect, useRef } from "react";
import { debounce } from "../utils";
import { FaCircleCheck, FaCircleStop } from "react-icons/fa6";
import "./edit-field.scss";

export default ({ name, label, value, listId, initialOptions = [], getOptions, submit, editable }: SearchListProps) => {
    const [options, setOptions] = useState<any[]>(initialOptions);
    const [editing, setEditing] = useState(false);
    const [currentValue, setCurrentValue] = useState(value);
    const ref = useRef<HTMLInputElement>(null);

    const updateList = debounce(async (e: React.ChangeEvent<HTMLInputElement>) => {
        setOptions(await getOptions(e.target.value));
    }, 500);

    const activateEditing = () => {
        if(!editable) return;
    
        setEditing(true);
    }

    const findMatchAndSubmit = async () => {
        const match = options.find(option => option.name === ref?.current?.value);
        if(!match) {
            // TOAST MESSAGE
            console.error("YOU REALLY SHOULD CONSIDER FINDING AN ACTUAL MATCH")
            return
        }

        try {
            await submit(name, match);
        } catch {
            // TOAST ERROR
        } finally {
            setCurrentValue(ref?.current?.value || "");
            setEditing(false);
        }
    }

    useEffect(() => {
        setOptions(initialOptions);
    }, initialOptions);

    useEffect(() => {
        setCurrentValue(value);
    }, [value]);

    return editing
        ? (
            <div className="field-editing">
                <label htmlFor={name}>
                    {label}
                    <input
                        type="search"
                        value={currentValue}
                        list={listId}
                        onChange={(e) => {
                            setCurrentValue(e.target.value);
                            updateList(e);
                        }}
                        onKeyDown={(e: React.KeyboardEvent) => {
                            if(e.key === "Enter") {
                                e.preventDefault();
            
                                findMatchAndSubmit();
                            }

                            if(e.key === "Escape") {
                                setEditing(false);
                            }
                        }}
                        {...{ name, ref }}
                    />
                    <datalist id={listId}>
                        {
                            options.map((option) => {
                                if(!option.id || !option.name) return null;

                                return <option value={option.name} key={option.id} />
                            })
                        }
                    </datalist>
                    <button className="cancel" onClick={() => setEditing(false)}><FaCircleStop /></button>
                    <button className="submit" onClick={findMatchAndSubmit}><FaCircleCheck /></button>
                </label>
            </div>
        )
    : (
        <div className="field-inactive" onDoubleClick={activateEditing}>
            <span>{`${label}:`}</span>
            {currentValue}
        </div>
    )
}

type SearchListProps = {
    name: string
    label: string
    value: string
    listId: string
    initialOptions: any[]
    getOptions: (search: string) => Promise<any[]>
    submit: (name: string, value: any) => Promise<void>
    editable: boolean
}