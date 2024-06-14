import { searchParamsFormatter } from "../../src/utils";

describe("searchParamsFormatter", () => {
    it("should parse the 'due' value to a date when possible", () => {
        const { due } = searchParamsFormatter({ due: "2023-12-25" });

        expect(due).toEqual(new Date("2023-12-25"));
    });

    it("should return undefined if the 'due' value is not defined", () => {
        const { due } = searchParamsFormatter({});

        expect(due).toEqual(undefined);
    });

    it("should return undefined if the 'due' value fails to parse", () => {
        const { due } = searchParamsFormatter({ due: "nope" });

        expect(due).toEqual(undefined);
    });
});