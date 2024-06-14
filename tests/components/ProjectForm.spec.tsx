import { ProjectForm } from "../../src/components";
import { fireEvent, render, screen } from "@testing-library/react";
import * as reactToastify from "react-toastify";

jest.mock("react-dom", () => ({
    ...jest.requireActual("react-dom"),
    useFormState: (formAction: any, initialState: any) => {
        return [
            { message: "", isError: false },
            (payload: unknown) => {
                formAction(initialState, payload);
            },
            false
        ]
    }
}));
jest.spyOn(reactToastify, "toast");

describe("ProjectForm", () => {
    const formAction = jest.fn();

    const props = {
        formAction
    };

    it("should render the component", () => {
        render(<ProjectForm {...props} />);

        const addButton = screen.getByText("Add");

        expect(addButton).toBeInTheDocument();
    });

    xit("should call the formAction on clicking submit", () => {
        render(<ProjectForm {...props} />);

        const nameInput = screen.getByPlaceholderText("Project name");
        fireEvent.change(nameInput, { target: {  value: "PROJ" }});

        const addButton = screen.getByText("Add");
        fireEvent.click(addButton);

        expect(formAction).toHaveBeenCalled();
    });

    xit("should display a toast message on clicking submit", () => {
        render(<ProjectForm {...props} />);

        const nameInput = screen.getByPlaceholderText("Project name");
        fireEvent.change(nameInput, { target: {  value: "PROJ" }});

        const addButton = screen.getByText("Add");
        fireEvent.click(addButton);

        expect(reactToastify.toast).toHaveBeenCalled();
    });
});