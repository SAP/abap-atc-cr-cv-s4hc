import { AnalyticalTable, AnalyticalTablePropTypes, Button, DynamicPage, DynamicPageHeader, DynamicPageTitle, FlexBox, IllustratedMessage, Label, Text, Title } from "@ui5/webcomponents-react";
import { DataContext, CloudType, Files, ObjectElement, ReleaseInfoElementConcept, ReleaseInfoElementOther, BaseObjectElementSuccessor } from "../providers/DataProvider";
import { Dispatch, HTMLAttributes, PropsWithChildren, SetStateAction, useContext } from "react";
import { useI18nBundle } from '@ui5/webcomponents-react-base';
import { BundleID } from "..";

import StateStatus from "./StateStatus";

import "@ui5/webcomponents-icons-tnt/dist/AllIcons.js";
import ApiHubButton from "./ApiHubButton";

const types: Record<string, string> = require("../types.json");

type SuccessorAction = Dispatch<SetStateAction<ObjectElement | undefined>>;

export default function ElementTab({ slot, object, action, successorAction }: {
    object?: ObjectElement;
    action: Dispatch<SetStateAction<ObjectElement | undefined>>;
    successorAction: SuccessorAction;
} & HTMLAttributes<unknown>) {
    const { version } = useContext(DataContext);
    const cloudType = Files[version];

    const typeLabel = types[object?.objectType ?? ""];

    return (
        <DynamicPage
            slot={slot}
            headerTitle={<DynamicPageTitle
                    header={object?.objectKey}
                    subHeader={typeLabel ? `${typeLabel} (${object?.objectType})` : object?.objectType}
                    actions={<>
                        <ApiHubButton object={object} />
                        <Button design="Transparent" icon="decline" onClick={() => action(undefined)} />
                    </>}
                >
                    <StateStatus object={object} />
                </DynamicPageTitle>
            }
            headerContent={<DynamicPageHeader>
                <HeaderInformation label="Application Component">{object?.applicationComponent}</HeaderInformation>
                <HeaderInformation label="Software Component">{object?.softwareComponent}</HeaderInformation>
                <HeaderInformation label="Object Name">{object?.tadirObjName}</HeaderInformation>
                <HeaderInformation label="Main Object Type">{object?.tadirObject}</HeaderInformation>
                <HeaderInformation label="Object Type">{object?.objectType}</HeaderInformation>
            </DynamicPageHeader>}
        >
            {<SuccessorElement object={object} cloudType={cloudType} successorAction={successorAction}/>}
        </DynamicPage>
    )
}

export function HeaderInformation({ label, children }: {
    label?: string;
} & PropsWithChildren) {
    return label && children ? <FlexBox>
        <Label showColon>{label}</Label>  
        <Text style={{
            marginLeft: '2px'
        }}>{children}</Text>
    </FlexBox> : <></>
}

export function SuccessorElement({ object, cloudType, successorAction }: {
    object?: ObjectElement;
    cloudType: CloudType;
    successorAction: SuccessorAction;
}) {
    const i18nBundle = useI18nBundle(BundleID);
    const { value } = useContext(DataContext);

    const handleRowSelect: AnalyticalTablePropTypes["onRowSelect"] = function (event) {
        const successorElement = event?.detail.row?.original as BaseObjectElementSuccessor;
        const element = value?.find(element => element.objectKey === successorElement.objectKey)

        successorAction(element)
    }

    switch (cloudType.format) {
        case "1":
            object = object as ReleaseInfoElementConcept | ReleaseInfoElementOther | undefined;

            if (object?.successorClassification === "concept") {
                return <IllustratedMessage
                    name="TntNoApplications"
                    titleText={i18nBundle.getText("CONCEPT_REGISTERED")}
                    subtitleText={i18nBundle.getText("CONCEPT_NAME", (object as ReleaseInfoElementConcept).successorConceptName)}
                />
            } else if (object?.successors) {
                return <>
                    <Title level="H4" style={{
                        marginBottom: 16
                    }}>Successors</Title>
                    <AnalyticalTable
                        onRowSelect={handleRowSelect}
                        selectionMode="SingleSelect"
                        data={object.successors}
                        columns={[
                            {
                                Header: "Object Key",
                                accessor: "objectKey",
                                headerTooltip: "Object Key"
                            },
                            {
                                Header: "Object Type",
                                accessor: "objectType",
                                headerTooltip: "Object Type"
                            }
                        ]}
                    />
                </>
            }

            return <IllustratedMessage
                name="NoData"
                titleText={i18nBundle.getText("NO_SUCCESSOR_FOUND")}
                subtitleText={i18nBundle.getText("NO_REGISTERED_SUCCESSORS")}
            />
        default:
            return <IllustratedMessage
                name="NoTasks"
                titleText={i18nBundle.getText("INVALID_FORMAT")}
                subtitleText={i18nBundle.getText("NOT_IMPLEMENTED_FORMAT")}
            />
    }
}