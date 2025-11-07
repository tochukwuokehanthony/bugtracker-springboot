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

  return (
    <>
      <Navbar />
      <Container>
        <h1 className="mb-4">My Assigned Tickets</h1>

        <Card>
          <CardBody>
            {loading ? (
              <div className="text-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : tickets.length === 0 ? (
              <p className="text-center">No tickets assigned to you yet.</p>
            ) : (
              <Table hover responsive>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Project</th>
                    <th>Type</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Created By</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => (
                    <tr key={ticket.id}>
                      <td>
                        <Link to={`/tickets/${ticket.id}`}>{ticket.title}</Link>
                      </td>
                      <td>{ticket.projectName}</td>
                      <td>
                        <Badge color="secondary">{ticket.type}</Badge>
                      </td>
                      <td>
                        <Badge color={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                      </td>
                      <td>
                        <Badge color={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                      </td>
                      <td>{ticket.createdByName}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </CardBody>
        </Card>
      </Container>
    </>
  )
}

export default Tickets