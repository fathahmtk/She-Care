import { useState, useMemo } from 'react';

interface UsePaginationReturn<T> {
  currentPageData: T[];
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

/**
 * A custom hook to manage pagination logic for any array of data.
 * @param data The full array of items to be paginated.
 * @param itemsPerPage The number of items to display on each page.
 * @returns An object containing the data for the current page, page numbers, and a function to change the page.
 */
export function usePagination<T>(data: T[], itemsPerPage: number): UsePaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const currentPageData = useMemo(() => {
    const begin = (currentPage - 1) * itemsPerPage;
    const end = begin + itemsPerPage;
    return data.slice(begin, end);
  }, [data, currentPage, itemsPerPage]);

  return { currentPageData, currentPage, totalPages, setCurrentPage };
}
