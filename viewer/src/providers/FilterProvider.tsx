import { Context, Dispatch, PropsWithChildren, SetStateAction, createContext, useContext, useEffect, useState } from "react";
import { DataContext, ElementState, ObjectElement, State, States } from "./DataProvider";
import { SetURLSearchParams, useSearchParams } from "react-router-dom";

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
    softwareComponents: string[];
    softwareComponentsFilter: string[];
    setSoftwareComponentsFilter: Dispatch<SetStateAction<string[]>>;
}

export const FilterContext: Context<FilterContextProps> = createContext({} as FilterContextProps);

export function ExtrudeObjectTypes(objectElements?: ObjectElement[]): string[] {
    return Array.from(new Set(objectElements?.flatMap(value => value.objectType)))
}

export function ExtrudeObjectStates(objectElements?: ObjectElement[]) {
    const uniqueStates = new Set(objectElements?.flatMap(value => value.state));
    return Object.fromEntries(Object.entries(States).filter(([key]) => uniqueStates.has(key as ElementState)));
}

export function ExtrudeSoftwareComponents(objectElements?: ObjectElement[]): string[] {
    return Array.from(new Set(objectElements?.flatMap(value => value.softwareComponent)))
}

export function HandleVersionFilter(key: string, filters: string[], setFilters: Dispatch<SetStateAction<string[]>>, values: string[], query: URLSearchParams, setQuery: SetURLSearchParams) {
    let copyFilter = []

    for (const element of filters) {
        if (values.includes(element)) {
            copyFilter.push(element)
        }
    }

    if (copyFilter.length === 0) {
        query.delete(key);
    } else {
        query.set(key, copyFilter.join(","))
    }

    setQuery(query);

    if (filters.length === copyFilter.length) return;
    setFilters(copyFilter);
}

export function FilterProvider({ children }: PropsWithChildren) {
    const { value } = useContext(DataContext);

    const [ query, setQuery ] = useSearchParams();

    const [ states, setStates ] = useState(ExtrudeObjectStates(value!));
    const [ stateFilter, setStateFilter ] = useState<string[]>(query.get("states")?.split(",") ?? []);

    const [ objectTypes, setObjectTypes ] = useState(ExtrudeObjectTypes(value!));
    const [ objectTypesFilter, setObjectTypesFilter ] = useState<string[]>(query.get("objectTypes")?.split(",") ?? []);

    const [ softwareComponents, setSoftwareComponents ] = useState(ExtrudeSoftwareComponents(value!));
    const [ softwareComponentsFilter, setSoftwareComponentsFilter ] = useState<string[]>(query.get("softwareComponents")?.split(",") ?? []);

    const [ searchValues, setSearchValues ] = useState<ObjectElement[]>([]);

    useEffect(() => {
        setObjectTypes(ExtrudeObjectTypes(value!));
        setStates(ExtrudeObjectStates(value!));
        setSoftwareComponents(ExtrudeSoftwareComponents(value!));
    }, [value])

    useEffect(() => HandleVersionFilter(
        "states",
        stateFilter,
        setStateFilter,
        Object.keys(states),
        query,
        setQuery
    ), [stateFilter, states, query, setQuery])

    useEffect(() =>  HandleVersionFilter(
        "objectTypes",
        objectTypesFilter,
        setObjectTypesFilter,
        objectTypes,
        query,
        setQuery
    ), [objectTypesFilter, objectTypes, query, setQuery])

    useEffect(() =>  HandleVersionFilter(
        "softwareComponents",
        softwareComponentsFilter,
        setSoftwareComponentsFilter,
        softwareComponents,
        query,
        setQuery
    ), [softwareComponentsFilter, softwareComponents, query, setQuery])

    function handleFilter(values: ObjectElement[]): ObjectElement[] {
        return values
            .filter(value => {
                const hasStateFilter = stateFilter.length !== 0
                const hasObjectTypeFilter = objectTypesFilter.length !== 0
                const hasSoftwareComponents = softwareComponentsFilter.length !== 0

                return  (hasStateFilter ? stateFilter : Object.keys(states)).includes(value.state as string) &&
                        (hasObjectTypeFilter ? objectTypesFilter : objectTypes).includes(value.objectType) &&
                        (hasSoftwareComponents ? softwareComponentsFilter : softwareComponents).includes(value.softwareComponent)
            })
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
            setObjectTypesFilter,
            softwareComponents,
            softwareComponentsFilter,
            setSoftwareComponentsFilter
        }}>
            {children}
        </FilterContext.Provider>
    )
}