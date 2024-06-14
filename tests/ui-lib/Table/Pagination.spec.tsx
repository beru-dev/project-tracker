import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Pagination } from "../../../src/ui-lib";

declare global {
    var mockRouter: { push: jest.Mock }
}

jest.mock("../../../src/ui-lib/utils", () => ({
    ...jest.requireActual("../../../src/ui-lib/utils"),
    getSearchParams: () => ({ already: "exists" })
}));

describe("Pagination", () => {
    const { mockRouter } = global;

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it("should update the url page parameter on clicking enter in the number input", () => {
        render(<Pagination pageCount={10} pagePad={3} />);

        const pageInput = screen.getByRole("spinbutton");
        fireEvent.change(pageInput, { target: { value: "5" }});
        fireEvent.keyDown(pageInput, { key: "Enter" });

        expect(mockRouter.push).toHaveBeenCalledWith("?already=exists&page=5");
    });

    it("should not update the url page parameter when a button other than enter is clicked", () => {
        render(<Pagination pageCount={10} pagePad={3} />);

        const pageInput = screen.getByRole("spinbutton");
        fireEvent.keyDown(pageInput, { key: "a" });

        expect(mockRouter.push).not.toHaveBeenCalled();
    });

    it("should not update the url page parameter when a button other than enter is clicked", () => {
        render(<Pagination pageCount={10} pagePad={3} />);

        const pageInput = screen.getByRole("spinbutton");
        fireEvent.keyDown(pageInput, { key: "a" });

        expect(mockRouter.push).not.toHaveBeenCalled();
    });

    it("should add three numbered buttons linked to the next three pages when pagePade is 3 and page is 1", () => {
        render(<Pagination pageCount={10} pagePad={3} />);

        const pageLinks = (screen.getByRole("spinbutton")
            .parentElement as HTMLElement)
            .querySelectorAll("a");

        expect(pageLinks.length).toEqual(5);
        expect(pageLinks[0].href).toEqual("http://localhost/?already=exists&page=2");
        expect(pageLinks[1].href).toEqual("http://localhost/?already=exists&page=3");
        expect(pageLinks[2].href).toEqual("http://localhost/?already=exists&page=4");
    });

    it("should add a next page button", () => {
        render(<Pagination pageCount={10} pagePad={3} />);

        const pageLinks = (screen.getByRole("spinbutton")
            .parentElement as HTMLElement)
            .querySelectorAll("a");

        expect(pageLinks[3].href).toEqual("http://localhost/?already=exists&page=2");
    });

    it("should add a last page button", () => {
        render(<Pagination pageCount={10} pagePad={3} />);

        const pageLinks = (screen.getByRole("spinbutton")
            .parentElement as HTMLElement)
            .querySelectorAll("a");

        expect(pageLinks[4].href).toEqual("http://localhost/?already=exists&page=10");
    });
});