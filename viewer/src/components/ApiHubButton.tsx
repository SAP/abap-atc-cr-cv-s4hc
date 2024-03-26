import { BaseObjectElementSuccessor, DataContext, Files } from "../providers/DataProvider";
import { useContext, useEffect, useState } from "react";
import { Button } from "@ui5/webcomponents-react";

const APIHubURL = "https://api.sap.com/odata/1.0/catalog.svc/";

export function BuildApiHubUrl(version: string, object?: BaseObjectElementSuccessor): [
    url: string,
    objectName: string,
    urlType: string
] | null {
    const file = Files[version];

    let objectType;
    let urlType;

    switch (object?.objectType) {
        case "BADI_DEF":
            objectType = "BADI"
            urlType = "badi"
            break;
        case "BDEF":
            objectType = "BOInterface"
            urlType = "bointerface"
            break;
        case "CDS_STOB":
            objectType = "CDSVIEW"
            urlType = "cdsviews"
            break;
        default:
            return null;
    }

    if (file.cloud === "invalid") return null;

    const objectName =
        (file.cloud === "private" ? "PCE_" : "") +
        object.objectKey.replace("/", "_")

    return [
        APIHubURL + `Artifacts(Name='${objectName}',Type='${objectType}')?$format=json`,
        objectName,
        urlType
    ];
}

export default function ApiHubButton({ object }: {
    object?: BaseObjectElementSuccessor
}) {
    const { version } = useContext(DataContext);
    const [ apiHub, setApiHub ] = useState<string>();

    useEffect(() => {
        setApiHub(undefined)

        const response = BuildApiHubUrl(version, object);

        if (response) {
            const [ url, objectName, urlType ] = response;

            fetch(url).then(result => {
                if (result.status === 200) {
                    setApiHub(`https://api.sap.com/${urlType}/${objectName}`)
                }
            })
        }
    }, [object, version])

    function handleApiHub() {
        if (apiHub) {
            window.location.href = apiHub
        }
    }

    return apiHub ? 
        <Button design="Transparent" icon="learning-assistant" onClick={handleApiHub} /> :
        <></>
}