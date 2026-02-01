import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BanIcon, EyeClosedIcon, VerifiedIcon } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="bg-tbrand">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="text-brand">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className={row.index % 2 === 0 ? "bg-white" : "bg-muted"}
              >
                {row.getVisibleCells().map((cell) => {
                  const isPriceCell =
                    cell.column.columnDef.accessorKey === "price";
                  const isTitleCell =
                    cell.column.columnDef.accessorKey === "title";

                  const isVerified = row.original?.is_verified;
                  const isBanned = row.original?.is_banned;
                  const isInactive = !row.original?.is_active;

                  return (
                    <TableCell
                      key={cell.id}
                      className={cell.column.columnDef.meta?.className ?? ""}
                    >
                      {isPriceCell && (
                        <>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </>
                      )}
                      {isTitleCell && (
                        <>
                          <div className="flex items-center justify-start space-x-2">
                            {isVerified && (
                              <span className="icon text-blue-500 dark:text-blue-600">
                                <VerifiedIcon className="w-3.5" />
                              </span>
                            )}

                            {isInactive && (
                              <span className="icon text-gray-500 dark:text-gray-600">
                                <EyeClosedIcon className="w-3.5" />
                              </span>
                            )}

                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}

                            {isBanned && (
                              <Badge
                                variant={"secondary"}
                                className="bg-red-500 text-white dark:bg-red-600"
                              >
                                <span className="icon">
                                  <BanIcon className="w-3.5" />
                                </span>
                                <span className="text text-xs">Banned</span>
                              </Badge>
                            )}
                          </div>
                        </>
                      )}
                      {!isPriceCell && !isTitleCell && (
                        <>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
