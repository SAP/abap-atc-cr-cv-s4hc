import { Icon, Input, InputPropTypes, ResponsivePopoverDomRef, ShellBar, ShellBarItem, ShellBarItemPropTypes } from "@ui5/webcomponents-react";
import { RefObject, useContext, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { AtcContext } from "../providers/AtcProvider";

export default function PageBar({ themeRef }: {
    themeRef: RefObject<ResponsivePopoverDomRef>
}) {
    const { value } = useContext(AtcContext);
    const [ query, setQuery ] = useSearchParams();

    const timeOutRef = useRef<NodeJS.Timeout>();
    const searchQuery = query.get("q");

    const callThemePopover: ShellBarItemPropTypes["onClick"] = function(event) {
        if (themeRef.current?.isOpen()) {
            themeRef.current.close();
        } else {
            themeRef.current?.showAt(event.detail.targetRef);
        }
    }
    
    const handleSearchChange: InputPropTypes["onInput"] = function (event) {
        const value = event.target.value;

        if (value) {
            clearTimeout(timeOutRef.current);

            timeOutRef.current = setTimeout(() => {
                query.set("q", value)
                setQuery(query)
            }, 250);
        } else {
            query.delete("q");
            setQuery(query)
        }
    }

    return <ShellBar
        logo={<img alt="SAP Logo" src={process.env.PUBLIC_URL + "/logo.svg"} />}
        primaryTitle="Cloudification"
        searchField={value && <Input placeholder={value[0].tadirObjName} icon={<Icon name="search" />} value={searchQuery || ""} onInput={handleSearchChange} showClearIcon/>}
        secondaryTitle="Object Search - BETA"
        showSearchField
    >
        <ShellBarItem
            icon="palette"
            text="Themes"
            onClick={callThemePopover}
        />
    </ShellBar>
}