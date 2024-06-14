import { EditSelect } from "../../../src/ui-lib";
import { fireEvent, render, screen } from "@testing-library/react";

describe("EditSelect", () => {
    const action = jest.fn();
    const props = {
        name: "color",
        label: "Color",
        editable: true,
        value: "red",
        options: [
            {
                value: "red",
                display: "Red"
            },
            {
                value: "green",
                display: "Green"
            },
            {
                value: "blue",
                display: "Blue"
            }
        ],
        action
    };

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it("should render the inactive field by default", () => {
        const { baseElement } = render(<EditSelect {...props} />);

        const inactiveField = baseElement.querySelector(".field-inactive");

        expect(inactiveField).toBeInTheDocument();
    });

    it("should render the editable select box on doubleclicking the inactive field", () => {
        const { baseElement } = render(<EditSelect {...props} />);

        const inactiveField = baseElement.querySelector(".field-inactive");
        fireEvent.doubleClick(inactiveField as HTMLElement);

        const selectBox = screen.getByRole("combobox");

        expect(selectBox).toBeInTheDocument();
    });

    it("should render the editable select box on doubleclicking the inactive field", () => {
        const { baseElement } = render(<EditSelect {...props} />);

        const inactiveField = baseElement.querySelector(".field-inactive");
        fireEvent.doubleClick(inactiveField as HTMLElement);

        const selectBox = screen.getByRole("combobox");
        const options = selectBox.querySelectorAll("option");

        expect(selectBox).toBeInTheDocument();
        expect(options.length).toEqual(3);
    });

    it("should not render the editable select box on doubleclicking the inactive field when 'editable' prop is false", () => {
        const { baseElement } = render(<EditSelect {...{...props, editable: false }} />);

        const inactiveField = baseElement.querySelector(".field-inactive");
        fireEvent.doubleClick(inactiveField as HTMLElement);

        const selectBox = screen.queryByRole("combobox");

        expect(selectBox).not.toBeInTheDocument();
        expect(inactiveField).toBeInTheDocument();
    });

    it("should return to inactive field on clicking cancel button", () => {
        const { baseElement } = render(<EditSelect {...props} />);

        const inactiveFieldStart = baseElement.querySelector(".field-inactive");
        fireEvent.doubleClick(inactiveFieldStart as HTMLElement);

        const buttons = screen.getAllByRole("button");
        fireEvent.click(buttons[0] as HTMLButtonElement);

        const inactiveFieldEnd = baseElement.querySelector(".field-inactive");

        expect(inactiveFieldEnd).toBeInTheDocument();
    });

    it("should call the 'action' prop on clicking the submit button", () => {
        const { baseElement } = render(<EditSelect {...props} />);

        const inactiveField = baseElement.querySelector(".field-inactive");
        fireEvent.doubleClick(inactiveField as HTMLElement);

        const selectBox = screen.getByRole("combobox");
        fireEvent.change(selectBox, { target: { value: "blue" }});

        const buttons = screen.getAllByRole("button");
        fireEvent.click(buttons[1]);

        expect(action).toHaveBeenCalledWith("color", "blue");
    });

    it("should handle errors on submitting", () => {
        jest.spyOn(console, "error");
        action.mockImplementationOnce(() => {
            throw Error("mock submit error");
        });
        const { baseElement } = render(<EditSelect {...props} />);

        const inactiveField = baseElement.querySelector(".field-inactive");
        fireEvent.doubleClick(inactiveField as HTMLElement);

        const selectBox = screen.getByRole("combobox");
        fireEvent.change(selectBox, { target: { value: "blue" }});

        const buttons = screen.getAllByRole("button");
        fireEvent.click(buttons[1]);

        expect(console.error).toHaveBeenCalled();
    });
});