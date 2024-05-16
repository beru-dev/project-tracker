export type StringIndexed = { [index: string | number]: any };

type StringIndexedArrays<T> = { [index: string | number]: T[] };

export default <T extends StringIndexed>(arrayToGroup: T[], keyToGroupBy: string | number): StringIndexedArrays<T> => {
    return arrayToGroup.reduce((groupedArrays: StringIndexedArrays<T>, groupableObject) => {
        const key = groupableObject[keyToGroupBy];

        if(!key) {
            if(!groupedArrays["undefined"]) groupedArrays["undefined"] = [];
            groupedArrays["undefined"].push(groupableObject);
            return groupedArrays
        }

        if(!groupedArrays[key]) groupedArrays[key] = [];
        groupedArrays[key].push(groupableObject);

        return groupedArrays;
    }, {});
}