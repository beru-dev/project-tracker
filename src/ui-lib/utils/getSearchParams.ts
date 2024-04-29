export const getSearchParams = () => {
    const rawSearchParams = new URLSearchParams();
    const searchParams: Record<string, string> = {};

    for(const [key, value] of Array.from(rawSearchParams.entries())) {
        searchParams[key] = value;
    }

    return searchParams;
}