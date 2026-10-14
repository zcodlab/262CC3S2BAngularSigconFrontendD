import { ClassGeneric } from "./ClassGeneric";

export function setListRow(list: ClassGeneric[] | null) {
    if (list) {
        return list.map((item: any, index: number) => ({
            ...item,
            row: index + 1
        }));
    }
    return [];
}
