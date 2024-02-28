import { AnalyticalTable, AnalyticalTableColumnDefinition, AnalyticalTablePropTypes, FlexibleColumnLayout, IllustratedMessage } from "@ui5/webcomponents-react";
import { useContext, useEffect, useState } from "react";
import { AtcContext, ObjectElement } from "./providers/AtcProvider";
import { useSearchParams } from "react-router-dom";
import { FilterContext } from "./providers/FilterProvider";

import StateStatus from "./components/StateStatus";
import ElementTab from "./components/ElementTab";
import classes from  "./App.module.css";
import Fuse from "fuse.js";

const DefaultIndex = 25;

export type Sort = {
    column: AnalyticalTableColumnDefinition;
    sortDirection: string;
}

function App() {
    const { handleFilter, setSearchValues, searchValues } = useContext(FilterContext);
    const { value } = useContext(AtcContext);

    const [ query ] = useSearchParams();
    const [ index, setIndex ] = useState(DefaultIndex);

    const [ selected, setSelected ] = useState<ObjectElement>();
    const [ successor, setSuccessor ] = useState<ObjectElement>();

    const [ sort, setSort ] = useState<Sort>();

    const searchQuery = query.get("q");

    useEffect(() => {
        setIndex(DefaultIndex);
        setSelected(undefined);
    }, [value])

    useEffect(() => {
        const fuse = new Fuse(value!, {
            shouldSort: true,
            keys: [
                "tadirObject",
                "tadirObjName",
                "softwareComponent",
                "applicationComponent",
                "objectKey"
            ],
            threshold: 0.3
        })
        
        setSearchValues(searchQuery ? fuse
            .search(searchQuery)
            .flatMap(result => result.item) : [...value!]);
    }, [value, query, searchQuery, setSearchValues])

    function handleLoadMore() {
        setIndex(index + DefaultIndex)
    }

    const handleRowSelect: AnalyticalTablePropTypes["onRowSelect"] = function(event) {
        setSelected(event?.detail.row?.original as ObjectElement);
        setSuccessor(undefined);
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
        if (sort) {    
            return searchValues.sort((a, b) => {
                const key = sort.column.id as keyof ObjectElement;
                const aValue: string | number = a[key];
                const bValue: string | number = b[key];
    
                let compare = 0;
                
                if(aValue > bValue) {
                    compare = 1;
                } else if(aValue < bValue) {
                    compare = -1;
                }
    
                return sort.sortDirection === "desc" ? compare * -1 : compare;
            })
        }
    
        return searchValues;
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
                    columns={[
                        {
                            Header: "Name",
                            accessor: "tadirObjName",
                            headerTooltip: "Name"
                        },
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
                        }
                    ]}
                />}
                midColumn={<ElementTab object={selected} action={setSelected} successorAction={setSuccessor} />}
                endColumn={<ElementTab object={successor} action={setSuccessor} successorAction={setSuccessor} />}
                layout={selected ? successor ? "ThreeColumnsMidExpanded" : "TwoColumnsStartExpanded" : "OneColumn"}
            /> : <IllustratedMessage />}
        </div>
    );
}

export default App;
