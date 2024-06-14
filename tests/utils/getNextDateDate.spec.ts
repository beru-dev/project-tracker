import { getNextDayDate } from "../../src/utils";

describe("getNextDayDate", () => {
    it("should return the date of the next occurance of the specified weekday", () => {
        expect(getNextDayDate("friday", new Date("2024-06-07T10:20:30Z"))).toEqual("2024-06-07");
    });

    it("should handle the case that the target day is next week", () => {
        expect(getNextDayDate("monday", new Date("2024-06-07T10:20:30Z"))).toEqual("2024-06-10");
    });
});