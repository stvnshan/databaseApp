import React, { useState } from 'react';
import { Pagination } from 'react-bootstrap';

const PaginationComponent = ({ itemsPerPage, totalItems, paginate }) => {
  const [activePage, setActivePage] = useState(1);

  const pageNumbers = [];
  const lowerPage = Math.max(1, activePage - 5);
  const upperPage = Math.min(Math.ceil(totalItems / itemsPerPage), activePage + 5);
  for (let i = lowerPage; i <= upperPage; i++) {
    pageNumbers.push(i);
  }

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
    paginate(pageNumber);
  };

  return (
    <Pagination>
      {pageNumbers.map((number) => (
        <Pagination.Item
          key={number}
          active={number === activePage}
          onClick={() => handlePageChange(number)}
        >
          {number}
        </Pagination.Item>
      ))}
    </Pagination>
  );
};

export default PaginationComponent;
