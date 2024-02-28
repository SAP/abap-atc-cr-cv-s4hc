import { List, ListPropTypes, ResponsivePopover, ResponsivePopoverDomRef, StandardListItem } from "@ui5/webcomponents-react";
import { forwardRef, useEffect, useState } from "react";
import { getTheme, setTheme } from '@ui5/webcomponents-base/dist/config/Theme.js';
import { useI18nBundle } from "@ui5/webcomponents-react-base";
import { BundleID } from "..";

export enum Themes {
    sap_horizon = "Morning Horizon (Light)",
    sap_horizon_dark = "Evening Horizon (Dark)",
    sap_horizon_hcb = "Horizon High Contrast Black",
    sap_horizon_hcw = "Horizon High Contrast White"
}

export default forwardRef<ResponsivePopoverDomRef>(function (_, ref) {
    const i18nBundle = useI18nBundle(BundleID);
    
    const [ currentTheme, setCurrentTheme ] = useState(localStorage.getItem("theme") || getTheme);

    const handleThemeSwitch: ListPropTypes['onSelectionChange'] = function(event) {
        const { targetItem } = event.detail;
        setCurrentTheme(targetItem.dataset.key!);
    }

    useEffect(() => {
        setTheme(currentTheme)
        localStorage.setItem("theme", currentTheme)
    }, [currentTheme])

    return <ResponsivePopover ref={ref}>
        <List onSelectionChange={handleThemeSwitch} headerText={i18nBundle.getText("CHANGE_THEME")} mode="SingleSelect">
            {Object.entries(Themes).map(([key, value]) => (
                <StandardListItem key={key} selected={currentTheme === key} data-key={key}>
                    {value}
                </StandardListItem>
            ))}
        </List>
    </ResponsivePopover>
})