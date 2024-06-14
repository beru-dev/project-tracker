import { jsonParseSafe } from "../../../src/ui-lib/utils/jsonParseSafe";

describe("jsonParseSafe", () => {
    it("should return the specified fallback value when a falsy value is passed for the string to parse", () => {
        const parsed = jsonParseSafe(undefined);

        expect(parsed).toEqual({});
    });

    it("should return the specified fallback value when the provided string fails to parse", () => {
        const parsed = jsonParseSafe("}{", "array");

        expect(parsed).toEqual([]);
    });

    it("should return the parsed value when successful", () => {
        const parsed = jsonParseSafe(`{"name":"Bob"}`, "array");

        expect(parsed).toEqual({name:"Bob"});
    });
});