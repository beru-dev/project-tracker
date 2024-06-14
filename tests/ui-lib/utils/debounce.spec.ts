import { debounce } from "../../../src/ui-lib/utils";

describe("debounce", () => {
    jest.useFakeTimers();
    const callback = jest.fn();

    it("should return a function that passes arguments to the provided callback function", () => {
        const debouncedFunction = debounce(callback);

        debouncedFunction(1, "a string");

        expect(callback).not.toHaveBeenCalled();

        jest.runAllTimers();

        expect(callback).toHaveBeenCalledWith(1,  "a string");
    });

    xit("should not repeat the callback until after the timer runs out", () => {
        const debouncedFunction = debounce(callback);

        debouncedFunction();
        debouncedFunction();
        jest.runAllTimers();
        expect(callback).toHaveBeenCalledTimes(1);

        debouncedFunction();
        jest.runAllTimers();
        expect(callback).toHaveBeenCalledTimes(2);
    });
});