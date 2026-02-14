import React from 'react';

const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  const pageNumbers = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    if (currentPage <= 4) {
      for (let i = 1; i <= 5; i++) pageNumbers.push(i);
      pageNumbers.push('...');
      pageNumbers.push(totalPages);
    } else if (currentPage >= totalPages - 3) {
      pageNumbers.push(1);
      pageNumbers.push('...');
      for (let i = totalPages - 4; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      pageNumbers.push(1);
      pageNumbers.push('...');
      pageNumbers.push(currentPage - 1);
      pageNumbers.push(currentPage);
      pageNumbers.push(currentPage + 1);
      pageNumbers.push('...');
      pageNumbers.push(totalPages);
    }
  }

  const handlePaginate = (e, number) => {
    e.preventDefault();
    if (number >= 1 && number <= totalPages) {
      paginate(number);
    }
  };

  return (
    <nav>
      <ul className="pagination" style={{ justifyContent: 'center', display: 'flex', listStyle: 'none', padding: 0, gap: '5px' }}>
        {/* First & Prev Buttons */}
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <a onClick={(e) => handlePaginate(e, 1)} href="#" className="page-link">First</a>
        </li>
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <a onClick={(e) => handlePaginate(e, currentPage - 1)} href="#" className="page-link">Prev</a>
        </li>

        {pageNumbers.map((number, index) => (
          <li key={index} className={`page-item ${currentPage === number ? 'active' : ''} ${number === '...' ? 'disabled' : ''}`}>
            {number === '...' ? (
              <span className="page-link">...</span>
            ) : (
              <a onClick={(e) => handlePaginate(e, number)} href="#" className="page-link">
                {number}
              </a>
            )}
          </li>
        ))}

        {/* Next & Last Buttons */}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <a onClick={(e) => handlePaginate(e, currentPage + 1)} href="#" className="page-link">Next</a>
        </li>
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <a onClick={(e) => handlePaginate(e, totalPages)} href="#" className="page-link">Last</a>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;