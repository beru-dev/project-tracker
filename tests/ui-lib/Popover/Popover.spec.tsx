import { Popover } from "../../../src/ui-lib";
import { fireEvent, getQueriesForElement, render, screen } from "@testing-library/react";

describe("Popover", () => {
    const props = {
        trigger: <button data-testid="trigger">Trigger</button>,
        children: <div data-testid="children">Content</div>,
        position: undefined,
        className: "custom-class",
        id: "custom-id"
    };

    it("should render the trigger button", () => {
        render(<Popover {...props} />);

        const trigger = screen.getByTestId("trigger");

        expect(trigger).toBeInTheDocument();
    });

    it("should open the modal on clicking the trigger", async () => {
        const { baseElement } = render(<Popover {...props} />);

        expect(getQueriesForElement(baseElement).queryByTestId("children")).not.toBeInTheDocument();

        const trigger = screen.getByTestId("trigger");
        fireEvent.click(trigger);

        const popover = getQueriesForElement(baseElement).queryByTestId("children");

        expect(popover).toBeInTheDocument();
    });

    it("should close the modal on clicking outside the popover", () => {
        const { baseElement } = render(<Popover {...props} />);

        expect(getQueriesForElement(baseElement).queryByTestId("children")).not.toBeInTheDocument();

        const trigger = screen.getByTestId("trigger");
        fireEvent.click(trigger);

        const underlay = baseElement.querySelector(".popover-underlay");
        fireEvent.click(underlay as HTMLElement);

        expect(getQueriesForElement(baseElement).queryByTestId("children")).not.toBeInTheDocument();
    });
});