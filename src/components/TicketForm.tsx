"use client"

import { useFormState } from "react-dom";

export default ({ projects, formAction }: TicketFormProps) => {
    const [state, createTicketAction] = useFormState(formAction, { message: "" })

    return <form action={createTicketAction}>
        {
            state?.message ? <div>{state.message}</div> : null
        }
        <label>
            <select name="project">
                {
                    projects.map(({ id, name }) => (
                        <option value={id} key={id}>{name}</option>
                    ))
                }
            </select>
        </label>

        <input type="text" name="title" placeholder="Enter title" required />
        <textarea name="description" placeholder="Enter description" />
        <input type="number" name="points" placeholder="Enter points" />
        <input type="text" name="Enter assignee" />
        <input type="date" name="due" />

        <button type="submit">Add</button>
    </form>
}

type TicketFormProps = {
    projects: { id: number, name: string | null }[]
    formAction: (prevState: any, formData: FormData) => Promise<{ message: string }>
}