"use client"

import { useFormState } from "react-dom";

export default ({ formAction }: ProjectFormProps) => {
    const [state, createProjectAction] = useFormState(formAction, { message: "" })

    return <form action={createProjectAction}>
        {
            state?.message ? <div>{state.message}</div> : null
        }
        <input type="text" name="name" placeholder="Project name" required />
        <button type="submit">Add</button>
    </form>
}

type ProjectFormProps = {
    formAction: (prevState: any, formData: FormData) => Promise<{ message: string }>
}