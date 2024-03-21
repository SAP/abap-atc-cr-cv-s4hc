import { ObjectElement, States } from "../providers/DataProvider";
import { ObjectStatus } from "@ui5/webcomponents-react";

export default function StateStatus({ object }: {
    object?: ObjectElement
}) {
    const state = States[object?.state ?? "released"];
    return <ObjectStatus state={state?.state ?? "None"}>{state?.label ?? object?.state}</ObjectStatus>
}