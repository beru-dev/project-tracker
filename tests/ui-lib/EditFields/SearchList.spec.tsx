import { SearchList } from "../../../src/ui-lib";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

describe("SearchList", () => {
    jest.useFakeTimers();

    const getOptions = jest.fn();
    const submit = jest.fn()
    const props = {
        name: "color",
        label: "Color",
        value: "red",
        listId: "color",
        initialOptions: [
            { id: 1, name: "red" },
            { id: 2, name: "green" },
            { id: 3, name: "blue" }
        ],
        getOptions,
        submit,
        editable: true
    };

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it("should render inactive initially", () => {
        render(<SearchList {...props} />);

        const inactiveList = screen.getByText("red");

        expect(inactiveList.classList).toContain("field-inactive");
    });

    it("should activate editable version on doubleclicking the inactive field", () => {
        render(<SearchList {...props} />);

        const inactiveList = screen.getByText("red");

        fireEvent.dblClick(inactiveList);
        const activeListContainer = screen.getByRole("combobox")
            .parentElement?.parentElement;

        expect(activeListContainer?.classList).toContain("field-editing");
    });

    it("should not activate editable version on doubleclicking the inactive field if editable is prop is false", () => {
        render(<SearchList {...{...props, editable: false }} />);

        const inactiveList = screen.getByText("red");
        fireEvent.dblClick(inactiveList);

        expect(inactiveList.classList).toContain("field-inactive");
    });

    it("should retrieve new options on changing the value", async () => {
        getOptions.mockImplementationOnce(() => [{ id: 2, name: "green" }]);
        
        render(<SearchList {...props} />);

        const inactiveList = screen.getByText("red");
        fireEvent.dblClick(inactiveList);

        const activeInput = screen.getByRole("combobox");

        await waitFor(async () => {
            fireEvent.change(activeInput, { target: { value: "gre" }});
        });
        
        jest.runAllTimers();

        expect(getOptions).toHaveBeenCalledWith("gre");
    });

    it("should switch from active to inactive state on clicking cancel", () => {
        render(<SearchList {...props} />);
        fireEvent.dblClick(screen.getByText("red"));

        const cancelButton = screen.getAllByRole("button")[0];
        fireEvent.click(cancelButton);

        const inactiveContainer = screen.getByText("red");

        expect(inactiveContainer.classList).toContain("field-inactive");
    });

    it("should switch from active to inactive state on pressing escape", () => {
        render(<SearchList {...props} />);

        fireEvent.dblClick(screen.getByText("red"));

        const searchBox = screen.getByRole("combobox");
        fireEvent.keyDown(searchBox, { key: "Escape" });

        const inactiveContainer = screen.getByText("red");

        expect(inactiveContainer.classList).toContain("field-inactive");
    });

    it("should submit the change on clicking the check button", () => {
        render(<SearchList {...props} />);
        fireEvent.dblClick(screen.getByText("red"));

        const searchBox = screen.getByRole("combobox");
        fireEvent.change(searchBox, { target: { value: "blue" }});

        fireEvent.click(screen.getAllByRole("button")[1]);

        expect(props.submit).toHaveBeenCalledWith("color", {"id": 3, "name": "blue"});
    });

    it("should submit the change on pressing enter", () => {
        render(<SearchList {...props} />);
        fireEvent.dblClick(screen.getByText("red"));

        const searchBox = screen.getByRole("combobox");
        fireEvent.change(searchBox, { target: { value: "blue" }});

        fireEvent.keyDown(searchBox, { key: "Enter" });

        expect(props.submit).toHaveBeenCalledWith("color", {"id": 3, "name": "blue"});
    });

    it("should not submit the change when the search value is not a valid option", () => {
        render(<SearchList {...props} />);
        fireEvent.dblClick(screen.getByText("red"));

        const searchBox = screen.getByRole("combobox");
        fireEvent.change(searchBox, { target: { value: "orange" }});

        fireEvent.keyDown(searchBox, { key: "Enter" });

        expect(props.submit).not.toHaveBeenCalled();
    });

    it("should handle submit errors", () => {
        props.submit.mockImplementationOnce(() => {
            throw new Error("failed submit");
        });
        jest.spyOn(console, "error");

        render(<SearchList {...props} />);
        fireEvent.dblClick(screen.getByText("red"));

        const searchBox = screen.getByRole("combobox");
        fireEvent.change(searchBox, { target: { value: "blue" }});

        fireEvent.keyDown(searchBox, { key: "Enter" });

        expect(console.error).toHaveBeenCalledWith("Something went wrong submitting a change");
    });
});