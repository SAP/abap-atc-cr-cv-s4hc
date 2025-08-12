import { IllustratedMessage, ResponsivePopoverDomRef, SelectPropTypes, ValueState } from "@ui5/webcomponents-react";
import { useI18nBundle } from "@ui5/webcomponents-react-base";
import { Context, PropsWithChildren, createContext, createRef, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { BundleID } from "..";
import { FilterProvider } from "./FilterProvider";

import PageBar from "../components/PageBar";
import PageFilter from "../components/PageFilter";
import ThemePopover from "../components/ThemePopover";
import files from "../data/contents.json";

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

export interface ABAPRelease {
    filename: string;
    release: string;
}
export type ABAPContents = {
    s4public: ABAPRelease[];
    s4private: ABAPRelease[];
    btp: ABAPRelease[];
};
export const Files: ABAPContents = files as any;

export const Editions = {
    s4public: { private: false, name: "S/4 HANA Cloud Public Edition" },
    s4private: { private: true, name: "S/4 HANA Cloud Private Edition" },
    btp: { private: false, name: "SAP BTP ABAP Environment" }
}

export type Classification = "concept" | "oneObject" | "multipleObjects" | "";

export type ElementState = keyof typeof States;

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
    fileContent: ObjectElement[] | null;
    selectedFile: ABAPRelease | undefined;
    edition: string;
    release: string;
    availableReleases: ABAPRelease[];
    handleEditionChange: SelectPropTypes["onChange"];
    handleReleaseChange: SelectPropTypes["onChange"];
}

export interface State {
    label: string;
    state: keyof typeof ValueState;
}

export const DataContext: Context<DataContextProps> = createContext({} as DataContextProps);

export const States: Record<string, State> = {
    deprecated: {
        label: "Deprecated",
        state: "Error"
    },
    notToBeReleased: {
        label: "Not To Be Released",
        state: "Warning"
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
        state: "Error",
    },
    internalAPI: {
        label: "Internal API",
        state: "Warning",
    },
}

export function loadFile(filename: string): ObjectElement[] | null {
    try {
        const data = require("../data/contents/" + filename) as ObjectRelease;
        return data.objectReleaseInfo || data.objectClassifications;
    } catch (error) {
        return null
    }
}

export function DataProvider({ children }: PropsWithChildren) {
    const i18nBundle = useI18nBundle(BundleID);

    const [query, setQuery] = useSearchParams();

    const defaultEdition = "s4private";
    const defaultRelease = "Latest";

    const [classicAPIs] = useState<ObjectElement[] | null>(loadFile("objectClassifications_SAP.json"));

    const [edition, setEdition] = useState<string>(query.get("edition") || defaultEdition);
    const [release, setRelease] = useState<string>(query.get("release") || defaultRelease);
    const [fileContent, setFileContent] = useState<ObjectElement[] | null>(null);

    const availableReleases = useMemo(() => {
        const editionKey = edition as keyof typeof Files;
        return Files[editionKey];
    }, [edition]);

    const selectedFile = useMemo(() => {
        const editionKey = edition as keyof typeof Files;
        return Files[editionKey]?.find((item: any) => item.release === release)
    }, [edition, release]);

    useEffect(() => {
        const isCurrentReleaseAvailable = availableReleases.some(some => some.release === release);
        if (!isCurrentReleaseAvailable) {
            setRelease(defaultRelease);
        }
    }, [availableReleases])

    useEffect(() => {
        console.log("File Content updated", fileContent?.length);
    }, [fileContent])

    useEffect(() => {
        if (edition === defaultEdition) {
            query.delete("edition");
        } else {
            query.set("edition", edition);
        }
        if (release === defaultRelease) {
            query.delete("release");
        } else {
            query.set("release", release);
        }

        setQuery(query);
    }, [edition, release, query, setQuery]);

    useEffect(() => {
        if (selectedFile) {
            const releasedAPIs = loadFile(selectedFile.filename);
            console.log("Released APIs: ", releasedAPIs?.length);
            console.log("Classic APIs: ", classicAPIs?.length);
            if (Editions[edition as keyof typeof Editions].private && releasedAPIs && classicAPIs) {
                console.log("Loaded file content with classic APIs", releasedAPIs.length, classicAPIs.length);
                setFileContent([...releasedAPIs, ...classicAPIs])
            } else {
                console.log("Loaded file content without classic APIs", releasedAPIs?.length);
                setFileContent(releasedAPIs);
            }
        }
    }, [selectedFile, classicAPIs]);

    const handleEditionChange: DataContextProps["handleEditionChange"] = function (event) {
        const value = event.target.value;

        if (value) {
            setEdition(value);
            return;
        }

        event.preventDefault();
    }
    const handleReleaseChange: DataContextProps["handleReleaseChange"] = function (event) {
        const value = event.target.value;

        if (value) {
            setRelease(value);
            return;
        }

        event.preventDefault();
    }

    const themeRef = createRef<ResponsivePopoverDomRef>();
    return (
        <DataContext.Provider value={{
            fileContent: fileContent,
            selectedFile: selectedFile,
            edition: edition,
            release: release,
            availableReleases: availableReleases,
            handleEditionChange: handleEditionChange,
            handleReleaseChange: handleReleaseChange
        }}>
            <FilterProvider>
                <PageBar themeRef={themeRef} />
                <ThemePopover ref={themeRef} />
                <PageFilter />

                {fileContent ? children : <IllustratedMessage
                    name="TntUnableToLoad"
                    titleText={i18nBundle.getText("VERSION_NOT_FOUND")}
                    subtitleText={i18nBundle.getText("FILE_NOT_FOUND", edition)}
                />}
            </FilterProvider>
        </DataContext.Provider>
    )
}