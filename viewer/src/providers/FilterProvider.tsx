import { Context, Dispatch, PropsWithChildren, SetStateAction, createContext, useContext, useEffect, useState } from "react";
import { AtcContext, ElementState, ObjectElement, State, States } from "./AtcProvider";
import { useSearchParams } from "react-router-dom";

export type KeyValueStates = {
    [k: string]: State;
}

export interface FilterContextProps {
    states: KeyValueStates;
    handleFilter: (values: ObjectElement[]) => ObjectElement[];
    searchValues: ObjectElement[];
    setSearchValues: Dispatch<SetStateAction<ObjectElement[]>>;
    stateFilter: string[];
    setStateFilter: Dispatch<SetStateAction<string[]>>;
    objectTypes: string[];
    objectTypesFilter: string[];
    setObjectTypesFilter: Dispatch<SetStateAction<string[]>>;
}

export const FilterContext: Context<FilterContextProps> = createContext({} as FilterContextProps);

export function ExtrudeObjectTypes(objectElements?: ObjectElement[]): string[] {
    return Array.from(new Set(objectElements?.flatMap(value => value.objectType)))
}

export function ExtrudeObjectStates(objectElements?: ObjectElement[]) {
    const uniqueStates = new Set(objectElements?.flatMap(value => value.state));
    return Object.fromEntries(Object.entries(States).filter(([key]) => uniqueStates.has(key as ElementState)));
}

export function ExtrudeStringFilter(key: string, defaultValues: string[]) {
    const [ query ] = useSearchParams();

    const queryValues = query.get(key)?.split(",");

    if (queryValues) {
        return defaultValues.filter(x => !queryValues.includes(x))
    } else {
        return defaultValues;
    }
}

export function FilterProvider({ children }: PropsWithChildren) {
    const { value } = useContext(AtcContext);

    const [ query, setQuery ] = useSearchParams();

    const [ states, setStates ] = useState(ExtrudeObjectStates(value!));
    const [ stateFilter, setStateFilter ] = useState<string[]>(query.get("states")?.split(",") ?? []);

    const [ objectTypes, setObjectTypes ] = useState(ExtrudeObjectTypes(value!));
    const [ objectTypesFilter, setObjectTypesFilter ] = useState<string[]>(query.get("objectTypes")?.split(",") ?? []);

    const [ searchValues, setSearchValues ] = useState<ObjectElement[]>([]);

    useEffect(() => {
        setObjectTypes(ExtrudeObjectTypes(value!));
        setStates(ExtrudeObjectStates(value!));
    }, [value])
    
    useEffect(() => {
        if (!query.get("objectTypes")) {
            setObjectTypesFilter([]);
        }
    }, [objectTypes, query])

    useEffect(() => {
        if (!query.get("states")) {
            setStateFilter([]);
        }
    }, [states, query])

    useEffect(() => {
        if (stateFilter.length === 0) {
            query.delete("states");
        } else {
            query.set("states", stateFilter.join(","))
        }

        setQuery(query);
    }, [stateFilter, states, query, setQuery])

    useEffect(() => {
        if (objectTypesFilter.length === 0) {
            query.delete("objectTypes");
        } else {
            query.set("objectTypes", objectTypesFilter.join(","))
        }

        setQuery(query);
    }, [objectTypesFilter, objectTypes, query, setQuery])

    function handleFilter(values: ObjectElement[]): ObjectElement[] {
        return values
            .filter(value => !stateFilter.includes(value.state as string) && !objectTypesFilter.includes(value.objectType))
    }

    return (
        <FilterContext.Provider value={{
            states,
            handleFilter,
            searchValues,
            setSearchValues,
            stateFilter,
            setStateFilter,
            objectTypes,
            objectTypesFilter,
            setObjectTypesFilter
        }}>
            {children}
        </FilterContext.Provider>
    )
}