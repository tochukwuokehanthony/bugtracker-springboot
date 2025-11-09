import { Pagination, PaginationItem, PaginationLink } from 'reactstrap'

const PaginationComponent = ({ currentPage, totalPages, onPageChange }) => {
  const pages = []
  const maxPagesToShow = 5

  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2))
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1)

  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  if (totalPages <= 1) return null

  return (
    <nav aria-label="Page navigation">
      <Pagination className="pagination justify-content-end mb-0">
        <PaginationItem disabled={currentPage === 1}>
          <PaginationLink
            first
            onClick={() => onPageChange(1)}
            style={{ cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
          />
        </PaginationItem>
        <PaginationItem disabled={currentPage === 1}>
          <PaginationLink
            previous
            onClick={() => onPageChange(currentPage - 1)}
            style={{ cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
          />
        </PaginationItem>

        {startPage > 1 && (
          <>
            <PaginationItem>
              <PaginationLink onClick={() => onPageChange(1)}>
                1
              </PaginationLink>
            </PaginationItem>
            {startPage > 2 && (
              <PaginationItem disabled>
                <PaginationLink>...</PaginationLink>
              </PaginationItem>
            )}
          </>
        )}

        {pages.map((page) => (
          <PaginationItem active={page === currentPage} key={page}>
            <PaginationLink onClick={() => onPageChange(page)}>
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <PaginationItem disabled>
                <PaginationLink>...</PaginationLink>
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink onClick={() => onPageChange(totalPages)}>
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        <PaginationItem disabled={currentPage === totalPages}>
          <PaginationLink
            next
            onClick={() => onPageChange(currentPage + 1)}
            style={{ cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
          />
        </PaginationItem>
        <PaginationItem disabled={currentPage === totalPages}>
          <PaginationLink
            last
            onClick={() => onPageChange(totalPages)}
            style={{ cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
          />
        </PaginationItem>
      </Pagination>
    </nav>
  )
}

export default PaginationComponent
