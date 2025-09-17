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
  const generatePages = () => {
    const pages = [];
    const pagesPerGroup = 3; // Show 3 pages at a time

    if (data <= pagesPerGroup) {
      // Show all pages if total is small
      for (let i = 1; i <= data; i++) {
        pages.push(i);
      }
    } else {
      // Calculate which group of 3 pages to show
      const currentGroup = Math.ceil(page / pagesPerGroup);
      const startPage = (currentGroup - 1) * pagesPerGroup + 1;
      const endPage = Math.min(startPage + pagesPerGroup - 1, data);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    return pages;
  };

  return (
    <Pagination className="justify-end">
      <PaginationContent>
        {/* Previous */}
        <PaginationItem>
          <PaginationPrevious
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className={
              page === 1 ? "pointer-events-none opacity-50 " : "cursor-pointer"
            }
          />
        </PaginationItem>

        {/* Pages without ellipsis - always show 3 numbers */}
        {generatePages().map((p, idx) => (
          <PaginationItem key={idx}>
            <PaginationLink
              href="#"
              isActive={p === page}
              onClick={(e) => {
                e.preventDefault();
                setPage(p);
              }}>
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* Next */}
        <PaginationItem>
          <PaginationNext
            onClick={() => setPage((prev) => Math.min(prev + 1, data))}
            className={
              page === data
                ? "pointer-events-none opacity-50 "
                : "cursor-pointer"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
