import { ColumnFiltersState, ColumnSort } from "@tanstack/react-table";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function buildQueryParams(
    columnSort: ColumnSort[] | undefined,
    columnFilters: ColumnFiltersState | undefined,
    pagination: any
) {
    const params = new URLSearchParams();

    columnSort?.forEach((sort) => {
        const field = sort.desc ? `-${sort.id}` : sort.id;
        params.append("sorting", field);
    });

    columnFilters?.forEach((filter) => {
        if (filter.value) {
            if (typeof filter.value === "string") {
                params.append(filter.id, filter.value);
            }
        }
    });

    const page = (pagination.pageIndex || 0) + 1;
    params.append("page", String(page));

    if (pagination.pageSize) {
        params.append("size", String(pagination.pageSize));
    }

    return params.toString();
}
