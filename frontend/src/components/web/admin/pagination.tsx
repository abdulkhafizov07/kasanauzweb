import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { getPageNumbers } from "@/utils";

type Props = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

export function AdminPagination({
    currentPage,
    totalPages,
    onPageChange,
}: Props) {
    const pageNumbers = getPageNumbers(currentPage, totalPages);

    return (
        <>
            <div className="w-min mt-4 ml-auto">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={() =>
                                    onPageChange(Math.max(currentPage - 1, 1))
                                }
                            />
                        </PaginationItem>

                        {pageNumbers.map((page: number) => (
                            <PaginationItem key={page}>
                                <PaginationLink
                                    href="#"
                                    isActive={page === currentPage}
                                    onClick={() => onPageChange(page)}
                                >
                                    {page}
                                </PaginationLink>
                            </PaginationItem>
                        ))}

                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={() =>
                                    onPageChange(
                                        Math.min(currentPage + 1, totalPages)
                                    )
                                }
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </>
    );
}
