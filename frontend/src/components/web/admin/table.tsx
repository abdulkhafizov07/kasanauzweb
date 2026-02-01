import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    type ColumnDef,
    type ColumnSort,
    type ColumnFiltersState,
} from "@tanstack/react-table";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import {
    ArrowDownWideNarrowIcon,
    ArrowUpDownIcon,
    ArrowUpWideNarrowIcon,
    CheckCheckIcon,
} from "lucide-react";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

export default function DataTable({
    data,
    columns,
    sorting,
    columnFilters,
    pagination,
    totalCount = 0,
    setSorting,
    setColumnFilters,
    setPagination,
    emptyMessage = "No data",
}: {
    data: any[];
    columns: ColumnDef<any>[];
    sorting: ColumnSort[];
    columnFilters: ColumnFiltersState;
    pagination: {
        pageIndex: number;
        pageSize: number;
    };
    totalCount?: number;
    setSorting: React.Dispatch<React.SetStateAction<ColumnSort[]>>;
    setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
    setPagination: React.Dispatch<
        React.SetStateAction<{
            pageIndex: number;
            pageSize: number;
        }>
    >;
    emptyMessage?: string;
}) {
    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnFilters,
            pagination,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        autoResetPageIndex: false,
        rowCount: totalCount,
    });

    return (
        <>
            <Table>
                <TableHeader className="border-1 bg-muted">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead
                                    key={header.id}
                                    className="border-1 cursor-pointer select-none p-4"
                                >
                                    <div className="flex flex-col items-start justify-start">
                                        <div className="w-full flex items-center justify-between">
                                            <span>
                                                {flexRender(
                                                    header.column.columnDef
                                                        .header,
                                                    header.getContext()
                                                )}
                                            </span>

                                            {header.column.getCanSort() && (
                                                <button
                                                    onClick={header.column.getToggleSortingHandler()}
                                                >
                                                    {header.column.getIsSorted() ===
                                                        "asc" && (
                                                        <ArrowUpWideNarrowIcon
                                                            size={14}
                                                        />
                                                    )}
                                                    {header.column.getIsSorted() ===
                                                        "desc" && (
                                                        <ArrowDownWideNarrowIcon
                                                            size={14}
                                                        />
                                                    )}
                                                    {header.column.getIsSorted() !==
                                                        "asc" &&
                                                        header.column.getIsSorted() !==
                                                            "desc" && (
                                                            <ArrowUpDownIcon
                                                                size={14}
                                                            />
                                                        )}
                                                </button>
                                            )}
                                        </div>

                                        {header.column.getCanFilter() ? (
                                            <div>
                                                <input
                                                    type="text"
                                                    value={
                                                        (header.column.getFilterValue() ??
                                                            "") as string
                                                    }
                                                    onChange={(e) =>
                                                        header.column.setFilterValue(
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder={`Filter ${flexRender(
                                                        header.column.columnDef
                                                            .header,
                                                        header.getContext()
                                                    )}`}
                                                    className="w-full border-0 border-b py-1 text-sm outline-none"
                                                />
                                            </div>
                                        ) : null}
                                    </div>
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>

                <TableBody className="border-1">
                    {table.getRowModel().rows.map((row) => {
                        const state = row.original.state;

                        return (
                            <TableRow
                                key={row.id}
                                className={
                                    state === "approved"
                                        ? "bg-emerald-50 hover:bg-emerald-100"
                                        : state === "rejected"
                                        ? "bg-lime-50 hover:bg-lime-100"
                                        : state === "banned"
                                        ? "bg-red-50 hover:bg-red-100"
                                        : ""
                                }
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell
                                        key={cell.id}
                                        className="border-1 p-4 py-2"
                                    >
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        );
                    })}
                    {table.getRowModel().rows.length === 0 && (
                        <>
                            <TableRow>
                                <TableCell
                                    colSpan={table.getAllColumns().length}
                                >
                                    <p className="py-3 font-bold text-gray-400 text-center">
                                        {emptyMessage}
                                    </p>
                                </TableCell>
                            </TableRow>
                        </>
                    )}
                </TableBody>
            </Table>

            <Pagination className="mt-4">
                <PaginationContent>
                    {table.getCanPreviousPage() && (
                        <PaginationItem>
                            <PaginationPrevious
                                className="h-9"
                                onClick={() => table.previousPage()}
                            />
                        </PaginationItem>
                    )}

                    {table.getCanNextPage() && (
                        <PaginationItem>
                            <PaginationNext
                                className="h-9"
                                onClick={() => table.nextPage()}
                            />
                        </PaginationItem>
                    )}
                </PaginationContent>
            </Pagination>
        </>
    );
}
