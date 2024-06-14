import { Comments } from "../../../src/ui-lib";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

describe("Comments", () => {
    const props = {
        comments: [
            {
                id: 4,
                userName: "brooks",
                content: "brooks was here",
                createdAt: new Date("12/25/23"),
                updatedAt: new Date("12/25/23")
            }
        ],
        addComment: jest.fn(),
        canAddComment: true
    };

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it("should have an empty text input when commenting is enabled", () => {
        render(<Comments {...props}  />);

        const commentInput = screen.getByRole<HTMLTextAreaElement>("textbox");

        expect(commentInput.value).toEqual("");
    });

    it("should have not a text input when commenting is disabled", () => {
        render(<Comments {...{ ...props, canAddComment: false }}  />);

        const commentInput = screen.queryByRole<HTMLTextAreaElement>("textbox");

        expect(commentInput).toBeNull();
    });

    it("should treat commenting as disabled by default", () => {
        render(<Comments {...{ ...props, canAddComment: undefined }}  />);

        const commentInput = screen.queryByRole<HTMLTextAreaElement>("textbox");

        expect(commentInput).toBeNull();
    });

    it("should display existing comments", () => {
        render(<Comments {...props}  />);

        const existingComment = screen.queryByText("brooks was here");

        expect(existingComment).toBeDefined();
    });

    it("should add a comment when clicking the 'Add' button", async () => {
        props.addComment.mockImplementationOnce(async (content: string) => ({
            id: 5,
            userName: "red",
            content,
            createdAt: new Date("12/26/23"),
            updatedAt: new Date("12/26/23")
        }));
        render(<Comments {...props}  />);

        const commentInput = screen.getByRole<HTMLTextAreaElement>("textbox");
        fireEvent.change(commentInput, { target: { value: "so was red" }});

        await waitFor(async () => {
            const addButton = screen.getByRole("button");
            fireEvent.click(addButton);
        });

        expect(props.addComment).toHaveBeenCalledWith("so was red");
        const addedComment = screen.queryAllByText("so was red");

        expect(addedComment.length).toEqual(2);
        expect(addedComment[1].classList).toContain("content");
    });
});