import { getSearchParams } from "../../../src/ui-lib/utils/getSearchParams";

describe("getSearchParams", () => {
    jest.spyOn(URLSearchParams.prototype, "entries").mockImplementation(() => [
        ["sort", "name|asc"],
        ["limit", "20"]
    ] as any);

    it("should reformat values from URLSearchParams as an object shaped {param: value}", () => {
        expect(getSearchParams()).toEqual({
            sort: "name|asc",
            limit: "20"
        })
    });
});