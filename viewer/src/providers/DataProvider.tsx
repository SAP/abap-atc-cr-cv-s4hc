import { Context, PropsWithChildren, createContext, createRef, useEffect, useState } from "react";
import { IllustratedMessage, ResponsivePopoverDomRef, SelectPropTypes, ValueState } from "@ui5/webcomponents-react";
import { useSearchParams } from "react-router-dom";
import { FilterProvider } from "./FilterProvider";
import { useI18nBundle } from "@ui5/webcomponents-react-base";
import { BundleID } from "..";

import files from "../data/contents.json";
import PageBar from "../components/PageBar";
import PageFilter from "../components/PageFilter";
import ThemePopover from "../components/ThemePopover";

/**
 * @interface ObjectRelease
 * @description The parent object object elements
 * 
 * @property {string} formatVersion The format version of the json file
 * @property {ObjectElement[]} objectReleaseInfo An array of all elements (Objects)
 * @property {ObjectElement[]} objectClassifications An array of all elements when the version is classficiations
 */
export interface ObjectRelease {
    formatVersion: string;
    objectReleaseInfo: ObjectElement[];
    objectClassifications: ObjectElement[];
}

export type Classification = "concept" | "oneObject" | "multipleObjects" | "";

export type ElementState = keyof typeof States;

export type FileName = keyof typeof files;

/**
 * @interface BaseObjectElement
 * @description The Base Element with informations about ABAP Objects
 * 
 * @property {string} softwareComponent The software component where the ABAP Object is part of
 * @property {string} applicationComponent The application component where the ABAP Object is part of
 * @property {string} state The state of the ABAP Object e.g. deprecated
 */
export interface BaseObjectElement extends BaseObjectElementSuccessor {
    softwareComponent: string;
    applicationComponent: string;
    state: ElementState;
    labels?: string[];
}

/**
 * @interface BaseObjectElementSuccessor
 * @description The Base Successor Element which is used in a Base Element and Release Info
 *              It represents all base properties of every Element in the Cloudification Repository
 * 
 * @property {string} tadirObject The TADIR Object
 * @property {string} tadirObjName The TADIR Object Name
 * @property {string} objectType The Object Type
 * @property {string} objectKey The Object Key
 */
export interface BaseObjectElementSuccessor {
    tadirObject: string;
    tadirObjName: string;
    objectType: string;
    objectKey: string;
}

/**
 * @interface ReleaseInfoElement
 * @description The Release Info Element which is an Base Element with the classification of an succesor
 * 
 * @property {Classification} successorClassification The classification of an successor
 * 
 * @extends BaseObjectElement
 */
export interface ReleaseInfoElement extends BaseObjectElement {
    successorClassification: Classification;
}

/**
 * @interface ReleaseInfoElementConcept
 * @description When successorClassification is set to "concept" the successorConceptName is required
 * 
 * @property {string} successorConceptName The concept name of the ABAP Object
 * 
 * @extends ReleaseInfoElement
 */
export interface ReleaseInfoElementConcept extends ReleaseInfoElement {
    successorClassification: "concept",
    successorConceptName: string;
}

/**
 * @interface ReleaseInfoElementOther
 * @description The Release Info Element which has Successors in it
 * 
 * @property {BaseObjectElementSuccessor[]} succesors The successors of the Release Info Element
 * 
 * @extends ReleaseInfoElement
 */
export interface ReleaseInfoElementOther extends ReleaseInfoElement {
    successors: BaseObjectElementSuccessor[];
}

export type ObjectElement = ReleaseInfoElementConcept | ReleaseInfoElementOther;

/**
 * @interface DataContextProps
 * @description The props for the DataContext
 * 
 * @param {ObjectElement | null} value The values of the target json (latest...)
 * @param {string} version The current version (file)
 * @param {void} handleSelectChange The function to handle select change
 */
export interface DataContextProps {
    value: ObjectElement[] | null;
    version: string;
    handleSelectChange: SelectPropTypes["onChange"];
}

export interface State {
    label: string;
    state: keyof typeof ValueState;
}

export interface CloudType {
    name: FileName;
    cloud: "public" | "private" | "invalid",
    format: "1"
}

export const Files: Record<string, CloudType> = files as any;

export const DataContext: Context<DataContextProps> = createContext({} as DataContextProps);

export const defaultVersion: FileName = "objectReleaseInfoLatest.json";

export const States: Record<string, State> = {
    deprecated: {
        label: "Deprecated",
        state: "Error"
    },
    notToBeReleased: {
        label: "Not To Be Released",
        state: "Warning"
    },
    notToBeReleasedStable: {
        label: "Not To Be Released Stable",
        state: "Information"
    },
    released: {
        label: "Released",
        state: "Success"
    },
    classicAPI: {
        label: "Classic API",
        state: "Success"
    },
    noClassicAPI: {
        label: "No Classic API",
        state: "Error"
    },
    unknown: {
        label: "Unknown",
        state: "None"
    },
    noAPI: {
        label: "No API",
        state: "Warning",
    },
    internalAPI: {
        label: "Internal API",
        state: "Warning",
    },
}

export function LoadObjectRelease(name: string): ObjectElement[] | null {
    try {
        const data = require("../data/contents/" + name) as ObjectRelease;
        return data.objectReleaseInfo || data.objectClassifications;
    } catch (error) {
        return null
    }
}

export function DataProvider({ children }: PropsWithChildren) {
    const i18nBundle = useI18nBundle(BundleID);

    const [ query, setQuery ] = useSearchParams();

    const [ version, setVersion ] = useState<string>(query.get("version") || defaultVersion);
    const [ value, setValue ] = useState<ObjectElement[] | null>(LoadObjectRelease(version));

    const themeRef = createRef<ResponsivePopoverDomRef>();

    useEffect(() => {
        if (version === defaultVersion) {
            query.delete("version");
        } else {
            query.set("version", version);
        }

        setQuery(query)
    }, [query, setQuery, version])

    useEffect(() => setValue(LoadObjectRelease(version)), [version])

    const handleSelectChange: DataContextProps["handleSelectChange"] = function(event) {
        const value = event.target.value;

        if (value) {
            setVersion(value);
            return;
        }

        event.preventDefault();
    }

    return (
        <DataContext.Provider value={{
            value,
            version,
            handleSelectChange
        }}>
            <FilterProvider>
                <PageBar themeRef={themeRef} />
                <ThemePopover ref={themeRef} />
                <PageFilter />

                {value ? children : <IllustratedMessage
                    name="TntUnableToLoad"
                    titleText={i18nBundle.getText("VERSION_NOT_FOUND")}
                    subtitleText={i18nBundle.getText("FILE_NOT_FOUND", version)}
                />}
            </FilterProvider>
        </DataContext.Provider>
    )
}