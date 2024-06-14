import { SearchableResults } from "../../../src/ui-lib";
import { render, screen } from "@testing-library/react";

describe("SearchableResults", () => {
    const props = {
        title: "Animals",
        pageCount: 1,
        children: <>
            <div>Dog</div>
            <div>Cat</div>
            <div>Horse</div>
        </>
    };

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it("should render with provided title", () => {
        render(<SearchableResults {...props} />);

        const title = screen.getByText("Animals");

        expect(title).toBeInTheDocument();
    });

    it("should render with provided children", () => {
        render(<SearchableResults {...props} />);

        const childElement = screen.getByText("Cat");

        expect(childElement).toBeInTheDocument();
    });

    it("should render with search bar", () => {
        render(<SearchableResults {...props} />);

        const searchBar = screen.getByRole("searchbox");

        expect(searchBar).toBeInTheDocument();
    });

    it("should render with pagination", () => {
        const { baseElement } = render(<SearchableResults {...props} />);

        const pagination = baseElement.querySelector(".pagination");

        expect(pagination).toBeInTheDocument();
    });
});