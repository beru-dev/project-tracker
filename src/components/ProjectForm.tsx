"use client"

import { useRef, useEffect } from "react";
import { useFormState } from "react-dom";
import { ToastContainer, toast } from "react-toastify";

export default ({ formAction }: ProjectFormProps) => {
    const [state, createProjectAction] = useFormState(formAction, { message: "", isError: false });
    const ref = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if(state?.message) {
            toast(state.message, { type: state.isError ? "warning" : "success" });
        }
    }, [state?.message]);

    return <form
        action={(formData) => {
            createProjectAction(formData);
            ref.current?.reset();
        }}
        {...{ ref }}
    >
        {
            state?.message ? <div>{state.message}</div> : null
        }
        <input type="text" name="name" placeholder="Project name" required />
        <button type="submit">Add</button>
    </form>
}

type ProjectFormProps = {
    formAction: (prevState: any, formData: FormData) => Promise<{ message: string, isError: boolean }>
}