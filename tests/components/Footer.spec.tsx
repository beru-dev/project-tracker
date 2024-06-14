import { Footer } from "../../src/components";
import { render, screen } from "@testing-library/react";

describe("Footer", () => {
    it("should render the component", () => {
        render(<Footer />);

        expect(screen.getByText("Copyright: Josh 2024")).toBeInTheDocument();
    });
});