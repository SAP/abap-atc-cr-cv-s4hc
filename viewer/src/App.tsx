import { AnalyticalTable, AnalyticalTableColumnDefinition, AnalyticalTablePropTypes, FlexibleColumnLayout, Icon, IllustratedMessage } from "@ui5/webcomponents-react";
import { useContext, useEffect, useState } from "react";
import { AtcContext, ObjectElement } from "./providers/AtcProvider";
import { useSearchParams } from "react-router-dom";
import { FilterContext } from "./providers/FilterProvider";

import StateStatus from "./components/StateStatus";
import ElementTab from "./components/ElementTab";
import classes from  "./App.module.css";

const DefaultIndex = 25;

export type Sort = {
    column: AnalyticalTableColumnDefinition;
    sortDirection: string;
}

function App() {
    const { handleFilter, setSearchValues, searchValues } = useContext(FilterContext);
    const { value, version } = useContext(AtcContext);

    const [ query ] = useSearchParams();
    const [ index, setIndex ] = useState(DefaultIndex);

    const [ sort, setSort ] = useState<Sort>();
    const [ selected, setSelected ] = useState<ObjectElement>();

    const searchQuery = query.get("q");

    useEffect(() => {
        setIndex(DefaultIndex);
        setSelected(undefined);
    }, [value])

    useEffect(() => {
        const regex = new RegExp((searchQuery ?? "").replace(/\*/g, '.*'), "i");
        
        setSearchValues([...value!].filter(element =>
            regex.test(element.applicationComponent) ||
            regex.test(element.objectKey)
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
                sortDirection,
                column
            })
        }
    }

    function sortValues(): ObjectElement[] {
        const currentSort: Sort = sort || {
            column: {
                id: "state"
            },
            sortDirection: version.startsWith("objectClassification") ? "asc": "desc"
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
                            {
                                accessor(_, rowIndex) {
                                    return spliced[rowIndex]
                                },
                                Cell: ({ value }: {
                                    value?: ObjectElement
                                }) => {
                                    function handleIconClick() {
                                        setSelected(value)
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
                        ]
                    }
                />}
                midColumn={<ElementTab object={selected} action={setSelected} />}
                layout={selected ? "TwoColumnsStartExpanded" : "OneColumn"}
            /> : <IllustratedMessage />}
        </div>
    );
}

export default App;
