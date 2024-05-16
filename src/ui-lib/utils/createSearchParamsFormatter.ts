import { jsonParseSafe } from "./jsonParseSafe";

export const createSearchParamsFormatter = <T extends FormatterConfig>(config: T) =>
    (searchParams: SearchParams): FormattedParams<typeof config> => {
        return Object.entries(config).reduce((out, [param, cb]) => {
            const paramValue = searchParams[param];

            if(Array.isArray(paramValue)) {
                return out
            }

            return { ...out, [param]: cb(paramValue) }
        }, <FormattedParams<T>>{})
    }

type SearchParams = Record<string, string | string[] | undefined>
type FormatterConfig = Record<string, (searchParam: string | undefined) => unknown>
type FormattedParams<Type extends FormatterConfig> = {
    [Property in keyof Type]: ReturnType<Type[Property]>
}

export const digits = (searchParam?: string): number => Number(searchParam)
export const string = (searchParam?: string): string | undefined => searchParam
export const commaDelimited = (searchParam?: string): string[] | undefined => {
    return searchParam
        ? searchParam.split(",").map(val => val.trim())
        : undefined
}
export const json = (searchParam?: string): any => jsonParseSafe(searchParam)
export const columnSort = (searchParam?: string): { column?: string, direction?: string } => {
    if(!searchParam) {
        return { column: undefined, direction: undefined };
    }
    const [column, direction] = searchParam.split("|");
    return { column, direction }
}