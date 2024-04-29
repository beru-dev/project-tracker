import { createSearchParamsFormatter, string, digits, columnSort, commaDelimited } from "ui-lib/src/utils";

export default createSearchParamsFormatter({
    id: string,
    page: digits,
    limit: digits,
    search: string,
    sort: columnSort,
    projects: commaDelimited,
    status: commaDelimited,
    due: (searchParam?: string): Date | undefined => {
        if(!searchParam) return undefined;

        const date = new Date(parseInt(searchParam));
        
        return date.getTime() ? date : undefined;
    }
});