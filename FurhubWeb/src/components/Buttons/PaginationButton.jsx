import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

export const PaginationButton = ({ page, setPage, data }) => {
  return (
    <Pagination className="justify-end">
      <PaginationContent>
        {/* Previous */}
        <PaginationItem>
          <PaginationPrevious
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className={
              !data?.previous
                ? "cursor-not-allowed border border-[#E0E0E0]"
                : ""
            }
          />
        </PaginationItem>

        {/* Current Page */}
        <PaginationItem>
          <PaginationLink isActive>{page}</PaginationLink>
        </PaginationItem>

        {/* Next */}
        <PaginationItem>
          <PaginationNext
            onClick={() => setPage((prev) => prev + 1)}
            className={
              !data?.next ? "cursor-not-allowed border border-[#E0E0E0]" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
