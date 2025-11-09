import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, CardBody, Badge, Row, Col } from 'reactstrap'
import Pagination from '../components/common/Pagination'
import { ticketAPI } from '../api/endpoints'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import { daysSince } from '../utils/timeUtils'

const Tickets = () => {
  const { user, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    fetchTickets()
  }, [user])

  const fetchTickets = async () => {
    try {
      // Admins see all tickets, regular users see only their assigned tickets
      const response = isAdmin()
        ? await ticketAPI.getAllTickets()
        : await ticketAPI.getTicketsByUserId(user.id)
      setTickets(response.data)
    } catch (error) {
      toast.error('Failed to load tickets')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'BUG':
        return <img src="/bug-icon.svg" alt="Bug" style={{ width: '20px', height: '20px' }} />
      case 'FEATURE':
        return '✨'
      case 'ENHANCEMENT':
        return '⚡'
      default:
        return '📋'
    }
  }

  // Pagination logic
  const totalPages = Math.ceil(tickets.length / itemsPerPage)
  const paginatedTickets = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return tickets.slice(startIndex, startIndex + itemsPerPage)
  }, [tickets, currentPage])

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo(0, 0)
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">{isAdmin() ? 'All Tickets' : 'My Assigned Tickets'} {isAdmin() && <span className="badge bg-danger ms-2">Admin</span>}</h1>
        <p className="text-muted">{isAdmin() ? 'View and manage all tickets in the system' : 'Track and manage all tickets assigned to you'}</p>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted mt-3">Loading tickets...</p>
        </div>
      ) : tickets.length === 0 ? (
        <Card className="border-0 shadow">
          <CardBody>
            <div className="empty-state">
              <div className="empty-state-icon">
                <img src="/ticket-icon.svg" alt="No Tickets" style={{ width: '64px', height: '64px', opacity: 0.5 }} />
              </div>
              <h3 className="mb-2">No Tickets Assigned</h3>
              <p className="mb-4">You don't have any tickets assigned to you yet.</p>
            </div>
          </CardBody>
        </Card>
      ) : (
        <>
          <Row className="mb-4">
            <Col>
              <div className="d-flex gap-2 flex-wrap">
                <Badge className="px-3 py-2" style={{ fontSize: '0.875rem' }}>
                  Total: <strong>{tickets.length}</strong>
                </Badge>
                <Badge color="info" className="px-3 py-2" style={{ fontSize: '0.875rem' }}>
                  Open: <strong>{tickets.filter(t => t.status === 'OPEN').length}</strong>
                </Badge>
                <Badge color="warning" className="px-3 py-2" style={{ fontSize: '0.875rem' }}>
                  In Progress: <strong>{tickets.filter(t => t.status === 'IN_PROGRESS').length}</strong>
                </Badge>
                <Badge color="success" className="px-3 py-2" style={{ fontSize: '0.875rem' }}>
                  Closed: <strong>{tickets.filter(t => t.status === 'CLOSED').length}</strong>
                </Badge>
              </div>
            </Col>
          </Row>

          <Card className="shadow">
            <CardBody className="p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="px-4 py-3 text-uppercase text-muted" style={{ fontSize: '0.75rem' }}>Ticket</th>
                      <th className="px-4 py-3 text-uppercase text-muted" style={{ fontSize: '0.75rem' }}>Project</th>
                      <th className="px-4 py-3 text-uppercase text-muted" style={{ fontSize: '0.75rem' }}>Type</th>
                      <th className="px-4 py-3 text-uppercase text-muted" style={{ fontSize: '0.75rem' }}>Priority</th>
                      <th className="px-4 py-3 text-uppercase text-muted" style={{ fontSize: '0.75rem' }}>Status</th>
                      <th className="px-4 py-3 text-uppercase text-muted" style={{ fontSize: '0.75rem' }}>Days Outstanding</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedTickets.map((ticket) => (
                      <tr key={ticket.id} onClick={() => navigate(`/tickets/${ticket.id}`)} style={{ cursor: 'pointer' }}>
                        <td className="px-4 py-3">
                          <div className="d-flex align-items-center gap-2">
                            <span style={{ fontSize: '1.25rem' }}>{getTypeIcon(ticket.type)}</span>
                            <Link
                              to={`/tickets/${ticket.id}`}
                              className="text-decoration-none text-dark fw-600"
                            >
                              {ticket.title}
                            </Link>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-muted">{ticket.projectName}</span>
                        </td>
                        <td className="px-4 py-3">
                          <Badge color="secondary" className="text-uppercase">
                            {ticket.type}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`badge priority-badge priority-${ticket.priority?.toLowerCase()}`}>
                            {ticket.priority}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`badge status-badge status-${ticket.status?.toLowerCase().replace('_', '-')}`}>
                            {ticket.status?.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-muted">{daysSince(ticket.createdAt)} days</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>

          {totalPages > 1 && (
            <Card className="shadow mt-3">
              <CardBody className="d-flex justify-content-between align-items-center">
                <div className="text-muted small">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, tickets.length)} of {tickets.length} tickets
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </CardBody>
            </Card>
          )}
        </>
      )}
    </>
  )
}

export default Tickets
