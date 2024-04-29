export const getUpdatedUrl = (page: Record<string, string>, searchParams: Record<string, string>) => {
    return `?${new URLSearchParams({ ...searchParams, ...page })}`;
}