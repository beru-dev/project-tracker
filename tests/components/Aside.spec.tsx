import { Aside } from "../../src/components";
import { render, screen } from "@testing-library/react";

describe("Aside", () => {
    it("should render a single link to Dashboard if no project specified", () => {
        render(<Aside />);

        const links = screen.getAllByRole<HTMLLinkElement>("link");

        expect(links.length).toEqual(1);
        expect(links[0].href).toEqual("http://localhost/dashboard");
    });

    it("should render link to Backlog page when project is specified", () => {
        render(<Aside project="PROJ" />);

        const links = screen.getAllByRole<HTMLLinkElement>("link");

        expect(links.length).toEqual(3);
        expect(links[1].href).toEqual("http://localhost/tickets?projects=PROJ");
    });

    it("should render link to Board page when project is specified", () => {
        render(<Aside project="PROJ" />);

        const links = screen.getAllByRole<HTMLLinkElement>("link");

        expect(links.length).toEqual(3);
        expect(links[2].href).toEqual("http://localhost/board?name=PROJ");
    });
});