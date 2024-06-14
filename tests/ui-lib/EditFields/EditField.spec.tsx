import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { EditField } from "../../../src/ui-lib";

describe("EditField", () => {
    const action = jest.fn();
    const props = {
        label: "First Name",
        name: "firstname",
        value: "Bob",
        route: "user/id/1",
        editable: true,
        action
    };

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it("should render the component in inactive state by default", () => {
        render(<EditField {...props} />);

        const field = screen.getByText("Bob");

        expect(field).toBeInTheDocument();
        expect(field.classList.contains("field-inactive")).toBeTruthy();
    });

    it("should render the editable version on double clicking the inactive field", () => {
        render(<EditField {...props} />);

        const field = screen.getByText("Bob");
        fireEvent.doubleClick(field);

        expect(field.classList.contains("field-inactve")).toBeFalsy();
        expect(field.classList.contains("field-editing")).toBeTruthy();
    });

    it("should not render the editable version on double clicking the inactive field when editable prop is false", () => {
        render(<EditField {...{ ...props, editable: false }} />);

        const field = screen.getByText("Bob");
        fireEvent.doubleClick(field);

        expect(field.classList.contains("field-editing")).toBeFalsy();
    });

    it("should return to the inactive state on clicking the cancel button", () => {
        const { baseElement } = render(<EditField {...props} />);

        const inactiveFieldStart = baseElement.querySelector(".field-inactive");
        fireEvent.doubleClick(inactiveFieldStart as HTMLElement);

        const buttons = screen.getAllByRole("button");
        fireEvent.click(buttons[0]);

        const inactiveFieldEnd = baseElement.querySelector(".field-inactive");

        expect(inactiveFieldEnd).toBeInTheDocument();
    });

    it("should call the action prop on clicking the submit button", () => {
        const { baseElement } = render(<EditField {...props} />);

        const inactiveFieldStart = baseElement.querySelector(".field-inactive");
        fireEvent.doubleClick(inactiveFieldStart as HTMLElement);

        const input = screen.getByRole("textbox");
        fireEvent.change(input, { target: { value: "Joe" }});

        const buttons = screen.getAllByRole("button");
        fireEvent.click(buttons[1]);

        expect(action).toHaveBeenCalledWith("firstname", "Joe");
    });

    it("should handle errors on submitting", () => {
        action.mockImplementationOnce(() => {
            throw new Error("mock submit error");
        });
        jest.spyOn(console, "error");
        const { baseElement } = render(<EditField {...props} />);

        const inactiveFieldStart = baseElement.querySelector(".field-inactive");
        fireEvent.doubleClick(inactiveFieldStart as HTMLElement);

        const input = screen.getByRole("textbox");
        fireEvent.change(input, { target: { value: "Joe" }});

        const buttons = screen.getAllByRole("button");
        fireEvent.click(buttons[1]);

        expect(console.error).toHaveBeenCalledTimes(1);
    });

    it("should call the action prop on pressing 'Enter' key", () => {
        const { baseElement } = render(<EditField {...props} />);

        const inactiveFieldStart = baseElement.querySelector(".field-inactive");
        fireEvent.doubleClick(inactiveFieldStart as HTMLElement);

        const input = screen.getByRole("textbox");
        fireEvent.change(input, { target: { value: "Joe" }});
        fireEvent.keyDown(input, { key: "Enter" });

        expect(action).toHaveBeenCalledWith("firstname", "Joe");
    });

    it("should return to inactive state on pressing 'Esc' key", () => {
        const { baseElement } = render(<EditField {...props} />);

        const inactiveFieldStart = baseElement.querySelector(".field-inactive");
        fireEvent.doubleClick(inactiveFieldStart as HTMLElement);

        const input = screen.getByRole("textbox");
        fireEvent.change(input, { target: { value: "Joe" }});
        fireEvent.keyDown(input, { key: "Esc" });

        const inactiveFieldEnd = baseElement.querySelector(".field-inactive");

        expect(inactiveFieldEnd).toBeInTheDocument();
    });
});