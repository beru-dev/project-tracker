import { createSearchParamsFormatter, string, digits, commaDelimited, json, columnSort } from "../../../src/ui-lib/utils/createSearchParamsFormatter";

describe("createSearchParamsFormatter", () => {
    it("should return a function", () => {
        const searchParamsFormatter = createSearchParamsFormatter({});

        expect(searchParamsFormatter).toEqual(expect.any(Function));
    });
});

describe("searchParamsFormatter", () => {
    const searchParamsFormatter = createSearchParamsFormatter({
        name: string,
        age: digits,
        tags: commaDelimited,
        data: json,
        sort: columnSort
    });
    const searchParams = {
        name: "Bob",
        age: "101",
        tags: "guitar,piano, violin",
        data: `{"favoriteFood":"spam"}`,
        sort: "name|asc"
    }

    it("should ignore searchParams that are not included in the config", () => {
        const formattedParams = searchParamsFormatter({
            ...searchParams,
            nope: "ignore this"
        });
        //@ts-ignore
        expect(formattedParams.nope).toBeUndefined();
    });

    it("should ignore searchParams with array values", () => {
        const formattedParams = searchParamsFormatter({
            ...searchParams,
            name: ["ignore this"]
        });

        expect(formattedParams.name).toBeUndefined();
    });

    it("should do nothing to strings", () => {
        const formattedParams = searchParamsFormatter(searchParams);

        expect(formattedParams.name).toEqual("Bob");
    });

    it("should convert numbers", () => {
        const formattedParams = searchParamsFormatter(searchParams);

        expect(formattedParams.age).toEqual(101);
    });

    it("should split comma delimited values into an array with trimmed whitespace", () => {
        const formattedParams = searchParamsFormatter(searchParams);

        expect(formattedParams.tags).toEqual(["guitar", "piano", "violin"]);
    });

    it("should json parse valid values", () => {
        const formattedParams = searchParamsFormatter(searchParams);

        expect(formattedParams.data).toEqual({ favoriteFood: "spam" });
    });

    it("should parse sort strings into column and direction", () => {
        const formattedParams = searchParamsFormatter(searchParams);

        expect(formattedParams.sort).toEqual({ column: "name", direction: "asc" });
    });

    it("should return undefined column and direction when no sort query is provided", () => {
        const formattedParams = searchParamsFormatter({});

        expect(formattedParams.sort).toEqual({ column: undefined, direction: undefined });
    });

    it("should return an empty object when json is not valid", () => {
        const formattedParams = searchParamsFormatter({
            ...searchParams,
            data: `{noquotekey:"error"}`
        });

        expect(formattedParams.data).toEqual({});
    });

    it("should return undefined when a value is not in the searchParams", () => {
        const formattedParams = searchParamsFormatter({});

        expect(formattedParams.name).toBeUndefined();
    });
});