import { FilterBar, FilterGroupItem, MultiComboBox, MultiComboBoxItem, MultiComboBoxPropTypes, Option, Select } from "@ui5/webcomponents-react";
import { AtcContext, CloudType, Files } from "../providers/AtcProvider";
import { FilterContext } from "../providers/FilterProvider";
import { useContext } from "react";

export default function PageFilter() {
    const { states, stateFilter, setStateFilter, setObjectTypesFilter, objectTypes, objectTypesFilter, softwareComponents, softwareComponentsFilter, setSoftwareComponentsFilter } = useContext(FilterContext);
    const { version, value, handleSelectChange } = useContext(AtcContext);

    const handleStateSelectChange: MultiComboBoxPropTypes["onSelectionChange"] = function(event) {
        setStateFilter(
            Object.entries(states)
                .filter(([_, state]) => event.detail.items.map(item => item.text).includes(state.label))
                .map(([stateId, _]) => stateId)
        )
    }

    const handleObjectTypeFilterChange: MultiComboBoxPropTypes["onSelectionChange"] = function(event) {
        setObjectTypesFilter(event.detail.items.flatMap(item => item.text))
    }

    const handleSoftwareComponentFilterChange: MultiComboBoxPropTypes["onSelectionChange"] = function(event) {
        setSoftwareComponentsFilter(event.detail.items.flatMap(item => item.text))
    }

    const selectValues = Object.values(Files);
    const isValueValid = value !== null;

    if (!isValueValid) {
        selectValues.push({
            name: version as CloudType["name"],
            cloud: "invalid",
            format: "1"
        })
    }

    return <FilterBar>
        <FilterGroupItem
            label="Respository Selection"
        >
            <Select onChange={handleSelectChange}>
                {selectValues.map(iterator => (
                    <Option
                        selected={iterator.name === version}
                        icon={iterator.cloud === "public" ? "cloud" : iterator.cloud === "private" ? "locked" : "inspect-down"}
                    >{iterator.name}</Option>
                ))}
            </Select>
        </FilterGroupItem> 
        <FilterGroupItem
            visible={isValueValid}
            label="State"
        >
            <MultiComboBox onSelectionChange={handleStateSelectChange} placeholder="Select State">
                {Object.entries(states).map(([key, value]) => (
                    <MultiComboBoxItem
                        text={value.label}
                        selected={stateFilter.includes(key)}
                    />
                ))}
            </MultiComboBox>
        </FilterGroupItem>
        <FilterGroupItem
            visible={isValueValid}
            label="Object Type"
        >
            <MultiComboBox onSelectionChange={handleObjectTypeFilterChange} placeholder="Select Object Type">
                {objectTypes.map(data => (
                    <MultiComboBoxItem
                        text={data}
                        selected={objectTypesFilter.includes(data)}
                    />
                ))}
            </MultiComboBox>
        </FilterGroupItem>
        <FilterGroupItem
            visible={isValueValid}
            label="Software Component"
        >
            <MultiComboBox onSelectionChange={handleSoftwareComponentFilterChange} placeholder="Select Software Component">
                {softwareComponents.map(data => (
                    <MultiComboBoxItem
                        text={data}
                        selected={softwareComponentsFilter.includes(data)}
                    />
                ))}
            </MultiComboBox>
        </FilterGroupItem>
    </FilterBar>
}