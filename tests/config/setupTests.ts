import "@testing-library/jest-dom";

declare global {
    var mockRouter: { push: jest.Mock }
}

global.fetch = jest.fn();
global.mockRouter = { push: jest.fn() };

jest.mock("next/navigation", () => ({
    useRouter: () => global.mockRouter
}));

jest.mock("../../src/database/connection", () => ({
    db: {
        select: jest.fn()
    }
}));