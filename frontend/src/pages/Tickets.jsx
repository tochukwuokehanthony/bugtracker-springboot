import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Container, Card, CardBody, Table, Badge } from 'reactstrap'
import Navbar from '../components/common/Navbar'
import { ticketAPI } from '../api/endpoints'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'

const Tickets = () => {
  const { user } = useAuth()
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTickets()
  }, [user])

  const fetchTickets = async () => {
    try {
      const response = await ticketAPI.getTicketsByUserId(user.id)
      setTickets(response.data)
    } catch (error) {
      toast.error('Failed to load tickets')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH':
        return 'danger'
      case 'MEDIUM':
        return 'warning'
      case 'LOW':
        return 'success'
      default:
        return 'secondary'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'OPEN':
        return 'info'
      case 'IN_PROGRESS':
        return 'warning'
      case 'CLOSED':
        return 'success'
      default:
        return 'secondary'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'BUG':
        return '🐛'
      case 'FEATURE':
        return '✨'
      case 'ENHANCEMENT':
        return '⚡'
      default:
        return '📋'
    }
  }

  return (
    <>
      <Navbar />
      <Container className="py-4">
        <div className="page-header">
          <h1 className="page-title">My Assigned Tickets</h1>
          <p className="text-muted">Track and manage all tickets assigned to you</p>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted mt-3">Loading tickets...</p>
          </div>
        ) : tickets.length === 0 ? (
          <Card className="border-0">
            <CardBody>
              <div className="empty-state">
                <div className="empty-state-icon">🎫</div>
                <h3 className="mb-2">No Tickets Assigned</h3>
                <p className="mb-4">You don't have any tickets assigned to you yet.</p>
              </div>
            </CardBody>
          </Card>
        ) : (
          <>
            <div className="d-flex gap-2 mb-4 flex-wrap">
              <Badge className="px-3 py-2">
                Total: <strong>{tickets.length}</strong>
              </Badge>
              <Badge color="info" className="px-3 py-2">
                Open: <strong>{tickets.filter(t => t.status === 'OPEN').length}</strong>
              </Badge>
              <Badge color="warning" className="px-3 py-2">
                In Progress: <strong>{tickets.filter(t => t.status === 'IN_PROGRESS').length}</strong>
              </Badge>
              <Badge color="success" className="px-3 py-2">
                Closed: <strong>{tickets.filter(t => t.status === 'CLOSED').length}</strong>
              </Badge>
            </div>

            <div className="row g-3">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="col-12">
                  <Card className="ticket-card">
                    <CardBody>
                      <div className="row align-items-center">
                        <div className="col-md-6">
                          <div className="d-flex align-items-start gap-3">
                            <div className="fs-3">{getTypeIcon(ticket.type)}</div>
                            <div className="flex-grow-1">
                              <h5 className="mb-1">
                                <Link to={`/tickets/${ticket.id}`} className="text-decoration-none text-dark fw-bold">
                                  {ticket.title}
                                </Link>
                              </h5>
                              <div className="text-muted small">
                                <span className="me-3">
                                  <span className="me-1">📁</span> {ticket.projectName}
                                </span>
                                <span>
                                  <span className="me-1">👤</span> {ticket.createdByName}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="d-flex justify-content-md-end align-items-center gap-2 mt-3 mt-md-0 flex-wrap">
                            <Badge color="secondary" className="text-uppercase">
                              {ticket.type}
                            </Badge>
                            <span className={`badge priority-badge priority-${ticket.priority?.toLowerCase()}`}>
                              {ticket.priority}
                            </span>
                            <span className={`badge status-badge status-${ticket.status?.toLowerCase().replace('_', '-')}`}>
                              {ticket.status?.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              ))}
            </div>
          </>
        )}
      </Container>
    </>
  )
}

export default Tickets