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
import { ComponentIcon, TerminalIcon, VerifiedIcon } from "lucide-react";

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
                  const isFullNameCell =
                    cell.column.columnDef.accessorKey === "full_name";
                  const role = row.original.role;

                  return (
                    <TableCell
                      key={cell.id}
                      className={cell.column.columnDef.meta?.className ?? ""}
                    >
                      {isFullNameCell ? (
                        <>
                          <div className="flex items-center justify-start space-x-2">
                            {role === "admin" && (
                              <Badge
                                variant={"secondary"}
                                className="bg-blue-500 text-white dark:bg-blue-600"
                              >
                                <span className="icon">
                                  <TerminalIcon className="w-3.5" />
                                </span>
                                <span className="text text-xs">Admin</span>
                              </Badge>
                            )}
                            {role === "moderator" && (
                              <Badge
                                variant={"secondary"}
                                className="bg-gray-500 text-white dark:bg-gray-600"
                              >
                                <span className="icon">
                                  <ComponentIcon className="w-3.5" />
                                </span>
                                <span className="text text-xs">Moderator</span>
                              </Badge>
                            )}

                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}

                            {role === "housemaker" && (
                              <Badge
                                variant={"secondary"}
                                className="bg-brand text-white"
                              >
                                <span className="icon">
                                  <VerifiedIcon className="w-3.5" />
                                </span>
                                <span className="text text-xs">Kasanachi</span>
                              </Badge>
                            )}
                          </div>
                        </>
                      ) : (
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
