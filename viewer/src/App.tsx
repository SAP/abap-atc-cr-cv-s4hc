import { AnalyticalTable, AnalyticalTableColumnDefinition, AnalyticalTablePropTypes, FlexibleColumnLayout, Icon, IllustratedMessage, Title, Toolbar } from "@ui5/webcomponents-react";
import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { BaseObjectElementSuccessor, DataContext, Editions, ObjectElement, ReleaseInfoElementOther } from "./providers/DataProvider";
import { FilterContext } from "./providers/FilterProvider";

import classes from "./App.module.css";
import ElementTab from "./components/ElementTab";
import StateStatus from "./components/StateStatus";

const DefaultIndex = 25;

export type SortDirection =  "asc" | "desc";

export type Sort = {
    column: AnalyticalTableColumnDefinition;
    sortDirection: SortDirection;
}

export type CombinedElement = BaseObjectElementSuccessor | ObjectElement;

type IconClickFunction = (element: ObjectElement | undefined) => void;

export function GetArrowElement(elements: (BaseObjectElementSuccessor | ReleaseInfoElementOther)[], iconClick: IconClickFunction): AnalyticalTableColumnDefinition {
    return {
        accessor: (_, rowIndex) => elements[rowIndex],
        Cell: ({ value }: { value?: ReleaseInfoElementOther }) => {

            function handleIconClick() {
                iconClick(value);
            }

            const hasSuccessors = value?.successors && value?.successors.length > 0;

            if (!hasSuccessors) {
                return <Icon name="navigation-right-arrow" onClick={handleIconClick} />;
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
    const { fileContent, edition, selectedFile } = useContext(DataContext);

    const [ query ] = useSearchParams();
    const [ index, setIndex ] = useState(DefaultIndex);

    const [ sort, setSort ] = useState<Sort>();
    const [ selected, setSelected ] = useState<CombinedElement>();
    const [ successor, setSuccessor ] = useState<CombinedElement>();

    const searchQuery = query.get("q");

    useEffect(() => {
        setIndex(DefaultIndex);
        setSelected(undefined);
    }, [fileContent])

    useEffect(() => setSuccessor(undefined), [selected])

    useEffect(() => {
        const regex = new RegExp((searchQuery ?? "").replace(/\*/g, '.*'), "i");
        
        setSearchValues([...fileContent!].filter(element =>
            regex.test(element.applicationComponent) ||
            regex.test(element.objectKey) ||
            regex.test(element.tadirObjName)
        ));
    }, [fileContent, query, searchQuery, setSearchValues])

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

        if (edition.startsWith("objectClassification")) {
            currentSort.sortDirection = currentSort.sortDirection === "asc" ? "desc" : "asc"
        } 

        return searchValues.sort((a, b) => {
            const key = currentSort.column.id as keyof ObjectElement;
            if ((typeof a[key] === "string" && typeof b[key] === "string")
                || (typeof a[key] === "number" && typeof b[key] === "number")) {

                const aValue: string | number = a[key] as string | number;
                const bValue: string | number = b[key] as string | number;

                let compare = 0;

                if (aValue > bValue) {
                    compare = 1;
                } else if (aValue < bValue) {
                    compare = -1;
                }

                return currentSort.sortDirection === "desc" ? compare * -1 : compare;
            }
            return 0
        })
    }

    const filtered = handleFilter(sortValues());
    const spliced = filtered.slice(0, index) || [];

    const containsClassicAPIs = Editions[edition as keyof typeof Editions].private;

    /*
    When attempting to implement additional table columns based on versions (Name, Cloud Type, ...),
    refer to this commit that also had a similar implementation.

    https://github.com/SAP/abap-atc-cr-cv-s4hc/commit/22d9d04513f36817aa30c3e411e57544d9739f7e
    */
    return (
        <div className={classes.scrollContainer}>
            <Toolbar style={{ margin: "1rem 0 1rem 0.5rem" }}>
                <Title level="H4">{Editions[edition as keyof typeof Editions].name} {selectedFile?.release} {containsClassicAPIs ? " + Classic APIs" : ""} ({filtered.length})</Title>
            </Toolbar>
            {spliced.length > 0 ? <FlexibleColumnLayout style={{
                position: "relative",
                height: "calc(100vh - 17rem)",
            }}
                startColumn={<AnalyticalTable
                    style={{ height: "100%" }}
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
