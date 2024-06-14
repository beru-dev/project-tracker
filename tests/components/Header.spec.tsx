import { Header } from "../../src/components";
import { render, screen } from "@testing-library/react";

declare var global: typeof globalThis & {
    useSession: jest.Mock
}

describe("Header", () => {
    it("should render the component", () => {
        global.useSession.mockImplementation(() => ({ data: { user: { name: "Bob" }}}));
        render(<Header />);

        expect(screen.getByText("Project Tracker")).toBeInTheDocument();
    });
});