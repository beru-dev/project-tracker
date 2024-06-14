import AuthButton from "../../src/components/AuthButton";
import { fireEvent, render, screen } from "@testing-library/react";

declare var global: typeof globalThis & {
    useSession: jest.Mock
    signIn: jest.Mock
    signOut: jest.Mock
}

describe("AuthButton", () => {
    it("should add a 'sign in' button when there's no session", () => {

        global.useSession.mockImplementation(() => ({ data: null }));
        render(<AuthButton />);

        const signInButton = screen.getByText("Sign In");

        expect(signInButton).toBeInTheDocument();
    });

    it("should add a 'sign in' button when there's no session", () => {
        global.useSession.mockImplementation(() => ({ data: null }));
        render(<AuthButton />);

        const signInButton = screen.getByText("Sign In");
        fireEvent.click(signInButton);

        expect(global.signIn).toHaveBeenCalled();
    });

    it("should add a 'sign out' button when there's a valid session", () => {
        global.useSession.mockImplementation(() => ({ data: { user: { name: "Bob" }}}));
        render(<AuthButton />);

        const signOutButton = screen.getByText("Sign Out");

        expect(signOutButton).toBeInTheDocument();
    });

    it("should add a 'sign out' button when there's a valid session", () => {
        global.useSession.mockImplementation(() => ({ data: { user: { name: "Bob" }}}));
        render(<AuthButton />);

        const signOutButton = screen.getByText("Sign Out");
        fireEvent.click(signOutButton);

        expect(global.signOut).toHaveBeenCalled();
    });
});