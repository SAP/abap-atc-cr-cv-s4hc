import { AnalyticalTable, AnalyticalTableColumnDefinition, AnalyticalTablePropTypes, FlexibleColumnLayout, Icon, IllustratedMessage } from "@ui5/webcomponents-react";
import { useContext, useEffect, useState } from "react";
import { BaseObjectElementSuccessor, DataContext, ObjectElement } from "./providers/DataProvider";
import { useSearchParams } from "react-router-dom";
import { FilterContext } from "./providers/FilterProvider";

import StateStatus from "./components/StateStatus";
import ElementTab from "./components/ElementTab";
import classes from  "./App.module.css";

const DefaultIndex = 25;

export type SortDirection =  "asc" | "desc";

export type Sort = {
    column: AnalyticalTableColumnDefinition;
    sortDirection: SortDirection;
}

export type CombinedElement = BaseObjectElementSuccessor | ObjectElement;

type IconClickFunction = (element: ObjectElement | undefined) => void;

export function GetArrowElement(elements: BaseObjectElementSuccessor[], iconClick: IconClickFunction): AnalyticalTableColumnDefinition {
    return {
        accessor(_, rowIndex) {
            return elements[rowIndex]
        },
        Cell: ({ value }: {
            value?: ObjectElement
        }) => {
            function handleIconClick() {
                iconClick(value)
            }

            if (value?.successorClassification === undefined ||
                value?.successorClassification === "") {
                return <Icon name="navigation-right-arrow" onClick={handleIconClick} />
            }

            return <Icon name="open-command-field" onClick={handleIconClick} />
        },
        disableFilters: true,
        disableGroupBy: true,
        disableResizing: true,
        disableSortBy: true,
        id: 'arrow',
        width: 75
    }
}

function App() {
    const { handleFilter, setSearchValues, searchValues } = useContext(FilterContext);
    const { value, version } = useContext(DataContext);

    const [ query ] = useSearchParams();
    const [ index, setIndex ] = useState(DefaultIndex);

    const [ sort, setSort ] = useState<Sort>();
    const [ selected, setSelected ] = useState<CombinedElement>();
    const [ successor, setSuccessor ] = useState<CombinedElement>();

    const searchQuery = query.get("q");

    useEffect(() => {
        setIndex(DefaultIndex);
        setSelected(undefined);
    }, [value])

    useEffect(() => setSuccessor(undefined), [selected])

    useEffect(() => {
        const regex = new RegExp((searchQuery ?? "").replace(/\*/g, '.*'), "i");
        
        setSearchValues([...value!].filter(element =>
            regex.test(element.applicationComponent) ||
            regex.test(element.objectKey) ||
            regex.test(element.tadirObjName)
        ));
    }, [value, query, searchQuery, setSearchValues])

    function handleLoadMore() {
        setIndex(index + DefaultIndex)
    }

    const handleRowSelect: AnalyticalTablePropTypes["onRowSelect"] = function(event) {
        setSelected(event?.detail.row?.original as ObjectElement);
    }

    const handleSort: AnalyticalTablePropTypes["onSort"] = function (event) {
        const sortDirection = event.detail.sortDirection;

        if (event.detail.sortDirection === "clear") {
            setSort(undefined);
        } else {
            const column = event.detail.column as AnalyticalTableColumnDefinition

            setSort({
                sortDirection: sortDirection as SortDirection,
                column
            })
        }
    }

    function sortValues(): ObjectElement[] {
        const currentSort: Sort = sort ? {...sort} : {
            column: {
                id: "state"
            },
            sortDirection: "desc"
        }

        if (version.startsWith("objectClassification")) {
            currentSort.sortDirection = currentSort.sortDirection === "asc" ? "desc" : "asc"
        } 

        return searchValues.sort((a, b) => {
            const key = currentSort.column.id as keyof ObjectElement;
            const aValue: string | number = a[key];
            const bValue: string | number = b[key];

            let compare = 0;
            
            if(aValue > bValue) {
                compare = 1;
            } else if(aValue < bValue) {
                compare = -1;
            }

            return currentSort.sortDirection === "desc" ? compare * -1 : compare;
        })
    }

    const spliced = handleFilter(sortValues()).splice(0, index) || [];

    /*
    When attempting to implement additional table columns based on versions (Name, Cloud Type, ...),
    refer to this commit that also had a similar implementation.

    https://github.com/SAP/abap-atc-cr-cv-s4hc/commit/22d9d04513f36817aa30c3e411e57544d9739f7e
    */
    return (
        <div className={classes.scrollContainer}>
            {spliced.length > 0 ? <FlexibleColumnLayout style={{
                position: "relative",
                height: "100%"
            }}
                startColumn={<AnalyticalTable
                    selectionMode="SingleSelect"
                    onLoadMore={handleLoadMore}
                    onRowSelect={handleRowSelect}
                    visibleRowCountMode="Auto"
                    infiniteScroll={true}
                    data={spliced}
                    onSort={handleSort}
                    reactTableOptions={{
                        autoResetSortBy: false
                    }}
                    columns={
                        [
                            {
                                Header: "Application Component",
                                accessor: "applicationComponent",
                                headerTooltip: "Application Component"
                            },
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
                            {
                                Header: "State",
                                id: "state",
                                accessor(_, rowIndex) {
                                    return spliced[rowIndex]
                                },
                                Cell: ({ value }: {
                                    value?: ObjectElement
                                }) => {
                                    return <StateStatus object={value} />
                                },
                                headerTooltip: "State"
                            },
                            GetArrowElement(spliced, setSelected)
                        ]
                    }
                />}
                midColumn={<ElementTab object={selected} action={setSelected} successorAction={setSuccessor} />}
                endColumn={<ElementTab object={successor} action={setSuccessor} successorAction={setSuccessor} />}
                layout={selected ? successor ? "ThreeColumnsMidExpanded" : "TwoColumnsStartExpanded" : "OneColumn"}
            /> : <IllustratedMessage />}
        </div>
    );
}

export default App;
