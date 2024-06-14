import { SearchBar } from "../../../src/ui-lib/Table/SearchBar";
import { fireEvent, render, screen } from "@testing-library/react";

jest.mock("../../../src/ui-lib/utils", () => ({
    ...jest.requireActual("../../../src/ui-lib/utils"),
    getSearchParams: () => ({ search: "waldo" })
}));

describe("SearchBar", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it("should render an input of type search with the value from the 'search' query parameter", () => {
        render(<SearchBar />);

        const input = screen.getByRole<HTMLInputElement>("searchbox");

        expect(input).toBeInTheDocument();
        expect(input.value).toEqual("waldo")
    });

    it("should update the search value in the url on pressing enter", () => {
        render(<SearchBar />);

        const input = screen.getByRole<HTMLInputElement>("searchbox");
        fireEvent.change(input, { target: { value: "carmensandiego" }});
        fireEvent.keyDown(input, { key: "Enter" });

        expect(mockRouter.push).toHaveBeenCalledWith("?search=carmensandiego");
    });
});