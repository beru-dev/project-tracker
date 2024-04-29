export const jsonParseSafe = (str?: string, expectedType: "array" | "object" = "object") => {
    if(!str) return expectedType === "object" ? {}: [];

    try {
        return JSON.parse(str);
    } catch (_error) {
        return expectedType === "object" ? {}: [];
    }
}