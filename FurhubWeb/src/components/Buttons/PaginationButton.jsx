import React from "react";

export const PaginationButton = ({ page, setPage, data }) => {
  return (
    <div className="space-x-5">
      <button
        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        disabled={!data.previous}
        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-500">
        Previous
      </button>
      <span>Page {page}</span>
      <button
        onClick={() => setPage((prev) => prev + 1)}
        disabled={!data.next}
        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-500">
        Next
      </button>
    </div>
  );
};
