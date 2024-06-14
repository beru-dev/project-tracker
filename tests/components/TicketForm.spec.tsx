import { TicketForm } from "../../src/components";
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

describe("TicketForm", () => {
    const formAction = jest.fn();

    const props = {
        projects: [
            { id: 1, name: "MACHL" },
            { id: 2, name: "SVG" }
        ],
        users: [
            { id: 1, name: "Max" },
            { id: 2, name: "Chloe" }
        ],
        formAction
    };

    it("should render the component", () => {
        render(<TicketForm {...props} />);

        const addButton = screen.getByText("Project:");

        expect(addButton).toBeInTheDocument();
    });

    xit("should call the formAction on clicking submit", () => {
        render(<TicketForm {...props} />);

        const nameInput = screen.getByPlaceholderText("Project name");
        fireEvent.change(nameInput, { target: {  value: "PROJ" }});

        const addButton = screen.getByText("Add");
        fireEvent.click(addButton);

        expect(formAction).toHaveBeenCalled();
    });

    xit("should display a toast message on clicking submit", () => {
        render(<TicketForm {...props} />);

        const nameInput = screen.getByPlaceholderText("Project name");
        fireEvent.change(nameInput, { target: {  value: "PROJ" }});

        const addButton = screen.getByText("Add");
        fireEvent.click(addButton);

        expect(reactToastify.toast).toHaveBeenCalled();
    });
});