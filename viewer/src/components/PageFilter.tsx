import { FilterBar, FilterGroupItem, MultiComboBox, MultiComboBoxItem, MultiComboBoxPropTypes, Option, Select } from "@ui5/webcomponents-react";
import { useContext } from "react";
import { DataContext, Products } from "../providers/DataProvider";
import { FilterContext } from "../providers/FilterProvider";

export default function PageFilter() {
    const { states, stateFilter, setStateFilter,
        setObjectTypesFilter, objectTypes, objectTypesFilter,
        softwareComponents, softwareComponentsFilter, setSoftwareComponentsFilter,
        applicationComponents, applicationComponentsFilter, setApplicationComponentsFilter,
        labels, labelsFilter, setLabelsFilter } = useContext(FilterContext);
    const { product, release: selectedRelease, availableReleases, handleProductChange, handleReleaseChange } = useContext(DataContext);

    const handleStateSelectChange: MultiComboBoxPropTypes["onSelectionChange"] = function (event) {
        setStateFilter(
            Object.entries(states)
                .filter(([_, state]) => event.detail.items.map(item => item.text).includes(state.label))
                .map(([stateId, _]) => stateId)
        )
    }

    const handleObjectTypeFilterChange: MultiComboBoxPropTypes["onSelectionChange"] = function (event) {
        setObjectTypesFilter(event.detail.items.flatMap(item => item.text))
    }

    const handleSoftwareComponentFilterChange: MultiComboBoxPropTypes["onSelectionChange"] = function (event) {
        setSoftwareComponentsFilter(event.detail.items.flatMap(item => item.text))
    }

    const handleApplicationComponentFilterChange: MultiComboBoxPropTypes["onSelectionChange"] = function (event) {
        setApplicationComponentsFilter(event.detail.items.flatMap(item => item.text))
    }

    const handleLabelFilterChange: MultiComboBoxPropTypes["onSelectionChange"] = function (event) {
        setLabelsFilter(event.detail.items.flatMap(item => item.text))
    }

    return <FilterBar>
        <FilterGroupItem key="productFilter" label="SAP Product">
            <Select onChange={handleProductChange} value={product}>
                {Object.entries(Products).map(([key, value]) => (
                    <Option
                        key={key}
                        icon={value.private ? "SAP-icons-TNT/private-cloud" : "cloud"}
                        value={key}
                        selected={product === key}
                    >
                        {value.name}
                    </Option>
                ))}
            </Select>
        </FilterGroupItem>
        {availableReleases.length > 1 &&
            <FilterGroupItem key="releaseFilter" label="Release">
                <Select onChange={handleReleaseChange} value={selectedRelease}>
                    {availableReleases.map(release => (
                        <Option key={release.filename} value={release.release} selected={release.release === selectedRelease}>
                            {release.release}
                        </Option>
                    ))}
                </Select>
            </FilterGroupItem>
        }

        <FilterGroupItem
            key="stateFilter"
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
            label="Application Component"
        >
            <MultiComboBox onSelectionChange={handleApplicationComponentFilterChange} placeholder="Select Application Component" filter="Contains">
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