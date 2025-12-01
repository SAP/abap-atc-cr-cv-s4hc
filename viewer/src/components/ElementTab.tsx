import { AnalyticalTable, AnalyticalTablePropTypes, Button, DynamicPage, DynamicPageHeader, DynamicPageTitle, FlexBox, IllustratedMessage, Label, Text, Title } from "@ui5/webcomponents-react";
import { useI18nBundle } from '@ui5/webcomponents-react-base';
import { Dispatch, HTMLAttributes, PropsWithChildren, SetStateAction, useContext } from "react";
import { BundleID } from "..";
import { CombinedElement, GetArrowElement } from "../App";
import { BaseObjectElementSuccessor, DataContext, ObjectElement, ReleaseInfoElementConcept, ReleaseInfoElementOther } from "../providers/DataProvider";

import StateStatus from "./StateStatus";

import "@ui5/webcomponents-icons-tnt/dist/AllIcons.js";

const types: Record<string, string> = require("../types.json");

type SuccessorAction = Dispatch<SetStateAction<CombinedElement | undefined>>;

export default function ElementTab({ slot, object, action, successorAction }: {
    object?: CombinedElement;
    action: Dispatch<SetStateAction<CombinedElement | undefined>>;
    successorAction: SuccessorAction;
} & HTMLAttributes<unknown>) {
    const typeLabel = types[object?.objectType ?? ""];
    const castedObjectElement = object as ObjectElement | undefined;

    return (
        <DynamicPage
            slot={slot}
            headerTitle={<DynamicPageTitle
                header={object?.objectKey}
                subHeader={typeLabel ? `${typeLabel} (${object?.objectType})` : object?.objectType}
                actions={<Button design="Transparent" icon="decline" onClick={() => action(undefined)} />}
            >
                {<StateStatus object={castedObjectElement} />}
            </DynamicPageTitle>
            }
            headerContent={<DynamicPageHeader>
                {castedObjectElement?.applicationComponent && <HeaderInformation label="Application Component">{castedObjectElement.applicationComponent}</HeaderInformation>}
                {castedObjectElement?.softwareComponent && <HeaderInformation label="Software Component">{castedObjectElement.softwareComponent}</HeaderInformation>}
                <HeaderInformation label="Main Object Name">{object?.tadirObjName}</HeaderInformation>
                <HeaderInformation label="Main Object Type">{object?.tadirObject}</HeaderInformation>
                <HeaderInformation label="Object Type">{object?.objectType}</HeaderInformation>
            </DynamicPageHeader>}
        >
            {<LabelElement object={castedObjectElement} />}
            {<SuccessorElement object={castedObjectElement} successorAction={successorAction} />}
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

export function LabelElement({ object }: { object?: ObjectElement }) {
    if (!object?.labels) {
        return <></>;
    }

    return <>
        <Title level="H4" style={{
            marginBottom: 16
        }}>Labels</Title>
        <AnalyticalTable
            minRows={1}
            style={{ marginBottom: 16 }}
            selectionMode="None"
            data={object.labels.map(label => ({ label }))}
            columns={[
                {
                    Header: "Label",
                    accessor: "label",
                    headerTooltip: "Label"
                },
            ]}
        />
    </>
}

export function SuccessorElement({ object, successorAction }: {
    object?: ObjectElement;
    successorAction: SuccessorAction;
}) {
    const i18nBundle = useI18nBundle(BundleID);
    const { fileContent: value } = useContext(DataContext);

    const handleRowSelect: AnalyticalTablePropTypes["onRowSelect"] = function (event) {
        const successorElement = event?.detail.row?.original as BaseObjectElementSuccessor;
        const element = value?.find(element => element.objectKey === successorElement.objectKey)

        successorAction(element || successorElement)
    }

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
                    },
                    GetArrowElement(object.successors, successorAction)
                ]}
            />
        </>
    }

    return <IllustratedMessage
        name="NoData"
        titleText={i18nBundle.getText("NO_SUCCESSOR_FOUND")}
        subtitleText={i18nBundle.getText("NO_REGISTERED_SUCCESSORS")}
    />
}