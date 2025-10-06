import React from 'react';
import { usePagination, DOTS } from '../hooks/usePagination';
import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from 'react-icons/md';

const Pagination = (props) => {
  const { onPageChange, totalPageCount, siblingCount = 1, currentPage } = props;

  const paginationRange = usePagination({
    currentPage,
    totalPageCount,
    siblingCount,
  });

  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  let lastPage = paginationRange[paginationRange.length - 1];

  return (
    <ul className="flex list-none items-center gap-2">
      <li
        className={`flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 transition-colors hover:bg-gray-100 ${
          currentPage === 1
            ? 'pointer-events-none bg-gray-100 text-gray-400'
            : 'cursor-pointer bg-white text-gray-700'
        }`}
        onClick={onPrevious}
      >
        <MdOutlineNavigateBefore />
      </li>

      {paginationRange.map((pageNumber, index) => {
        if (pageNumber === DOTS) {
          return (
            <li
              key={index}
              className="flex h-8 w-8 items-center justify-center text-gray-500"
            >
              &#8230;
            </li>
          );
        }

        return (
          <li
            key={index}
            className={`flex h-8 min-w-[2rem] cursor-pointer items-center justify-center rounded-lg border bg-white px-3 transition-colors hover:bg-gray-100 ${
              pageNumber === currentPage
                ? 'border-blue-600 text-blue-700 font-bold'
                : 'border-gray-300 text-gray-700'
            }`}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </li>
        );
      })}

      <li
        className={`flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 transition-colors hover:bg-gray-100 ${
          currentPage === lastPage
            ? 'pointer-events-none bg-gray-100 text-gray-400'
            : 'cursor-pointer bg-white text-gray-700'
        }`}
        onClick={onNext}
      >
        <MdOutlineNavigateNext />
      </li>
    </ul>
  );
};

export default Pagination;
