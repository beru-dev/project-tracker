"use client"

import { useRef, useEffect } from "react";
import { useFormState } from "react-dom";
import { ToastContainer, toast } from "react-toastify";
import Link from "next/link";
import "react-toastify/dist/ReactToastify.css";

export default ({ projects, users, formAction }: TicketFormProps) => {
    const [state, createTicketAction] = useFormState(formAction, { message: "" });
    const ref = useRef<HTMLFormElement>(null);

    useEffect(() => {
        const project = projects.find(({ id }) => id === state.projectId);

        if(state?.message && state?.newTicketNumber && project) {
            toast(
                <Link href={`/ticket?id=${project.name}-${state.newTicketNumber}`}>{`${state.message}: ${project.name}-${state.newTicketNumber}`}</Link>,
                { type: "success" }
            );
            return
        }

        if(state?.message) {
            toast(
                state.message,
                { type: "warning" }
            );
        }
    }, [state?.message]);

    return <>
        <form
            action={(formData) => {
                createTicketAction(formData);
                ref.current?.reset();
            }}
            {...{ ref }}
        >
            <label>
                <span>Project:</span>
                <select name="project">
                    {
                        projects.map(({ id, name }) => (
                            <option value={id} key={id}>{name}</option>
                        ))
                    }
                </select>
            </label>

            <label>
                <span>Title:</span>
                <input type="text" name="title" placeholder="Enter title" required />
            </label>

            <label className="stack">
                <span>Description:</span>
                <textarea name="description" placeholder="Enter description" />
            </label>

            <label>
                <span>Level of Effort:</span>
                <input type="number" name="points" placeholder="Enter points" />
            </label>

            <label>
                <span>Assignee:</span>
                <select name="user">
                    {
                        users.map(({ id, name }) => (
                            <option value={id} key={id}>{name}</option>
                        ))
                    }
                </select>
            </label>

            <label>
                <span>Due Date:</span>
                <input type="date" name="due" />
            </label>

            <button type="submit">Add</button>
        </form>
        <ToastContainer position="bottom-center" theme="dark" />
    </>
}

type TicketFormProps = {
    projects: { id: number, name: string | null }[]
    users: { id: number, name: string }[]
    formAction: (prevState: any, formData: FormData) => Promise<{ message: string, projectId?: number, newTicketNumber?: number }>
}