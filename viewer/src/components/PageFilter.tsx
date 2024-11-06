import { FilterBar, FilterGroupItem, MultiComboBox, MultiComboBoxItem, MultiComboBoxPropTypes, Option, Select } from "@ui5/webcomponents-react";
import { DataContext, CloudType, Files } from "../providers/DataProvider";
import { FilterContext } from "../providers/FilterProvider";
import { useContext } from "react";

export default function PageFilter() {
    const { states, stateFilter, setStateFilter, 
        setObjectTypesFilter, objectTypes, objectTypesFilter, 
        softwareComponents, softwareComponentsFilter, setSoftwareComponentsFilter, 
        applicationComponents, applicationComponentsFilter, setApplicationComponentsFilter, 
        labels, labelsFilter, setLabelsFilter } = useContext(FilterContext);
    const { version, value, handleSelectChange } = useContext(DataContext);

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

    const handleApplicationComponentFilterChange: MultiComboBoxPropTypes["onSelectionChange"] = function(event) {
        setApplicationComponentsFilter(event.detail.items.flatMap(item => item.text))
    }

    const handleLabelFilterChange: MultiComboBoxPropTypes["onSelectionChange"] = function (event) {
        setLabelsFilter(event.detail.items.flatMap(item => item.text))
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
            key="repositoryFilter"
            label="Repository Selection"
        >
            <Select onChange={handleSelectChange}>
                {selectValues.map(iterator => (
                    <Option
                        key={iterator.name}
                        selected={iterator.name === version}
                        icon={iterator.cloud === "public" ? "cloud" : iterator.cloud === "private" ? "SAP-icons-TNT/private-cloud" : "inspect-down"}
                    >{iterator.name}</Option>
                ))}
            </Select>
        </FilterGroupItem> 
        <FilterGroupItem
            key="stateFilter"
            visible={isValueValid}
            label="State"
        >
            <MultiComboBox onSelectionChange={handleStateSelectChange} placeholder="Select State">
                {Object.entries(states).map(([key, value]) => (
                    <MultiComboBoxItem
                        key={key}
                        text={value.label}
                        selected={stateFilter.includes(key)}
                    />
                ))}
            </MultiComboBox>
        </FilterGroupItem>
        <FilterGroupItem
            key="objectTypeFilter"
            visible={isValueValid}
            label="Object Type"
        >
            <MultiComboBox onSelectionChange={handleObjectTypeFilterChange} placeholder="Select Object Type">
                {objectTypes.map(data => (
                    <MultiComboBoxItem
                        key={data}
                        text={data}
                        selected={objectTypesFilter.includes(data)}
                    />
                ))}
            </MultiComboBox>
        </FilterGroupItem>
        <FilterGroupItem
            key="softwareComponentFilter"
            visible={isValueValid}
            label="Software Component"
        >
            <MultiComboBox onSelectionChange={handleSoftwareComponentFilterChange} placeholder="Select Software Component">
                {softwareComponents.map(data => (
                    <MultiComboBoxItem
                        key={data}
                        text={data}
                        selected={softwareComponentsFilter.includes(data)}
                    />
                ))}
            </MultiComboBox>
        </FilterGroupItem>
        <FilterGroupItem
            key="applicationComponentFilter"
            visible={isValueValid}
            label="Application Component"
        >
            <MultiComboBox onSelectionChange={handleApplicationComponentFilterChange} placeholder="Select Application Component">
                {applicationComponents.map(data => (
                    <MultiComboBoxItem
                        key={data}
                        text={data}
                        selected={applicationComponentsFilter.includes(data)}
                    />
                ))}
            </MultiComboBox>
        </FilterGroupItem>
        <FilterGroupItem
            key="labelFilter"
            visible={isValueValid && labels.length > 0}
            label="Label"
        >
            <MultiComboBox onSelectionChange={handleLabelFilterChange} placeholder="Select Label">
                {labels.map(data => (
                    <MultiComboBoxItem
                        key={data}
                        text={data}
                        selected={labelsFilter.includes(data)}
                    />
                ))}
            </MultiComboBox>
        </FilterGroupItem>
    </FilterBar>
}