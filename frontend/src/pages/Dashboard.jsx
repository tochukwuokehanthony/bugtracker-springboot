import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, Card, CardBody, CardTitle, Button } from 'reactstrap'
import PieChart from '../components/charts/PieChart'
import { projectAPI, ticketAPI } from '../api/endpoints'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'

const Dashboard = () => {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [user])

  const fetchDashboardData = async () => {
    try {
      const [projectsRes, ticketsRes] = await Promise.all([
        projectAPI.getProjectsByUserId(user.id),
        ticketAPI.getTicketsByUserId(user.id),
      ])

      setProjects(projectsRes.data)
      setTickets(ticketsRes.data)
    } catch (error) {
      toast.error('Failed to load dashboard data')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted mt-3">Loading dashboard...</p>
      </div>
    )
  }

  const openTickets = tickets.filter(t => t.status === 'OPEN').length
  const inProgressTickets = tickets.filter(t => t.status === 'IN_PROGRESS').length
  const closedTickets = tickets.filter(t => t.status === 'CLOSED').length

  // Ticket data by type
  const bugTickets = tickets.filter(t => t.type === 'BUG').length
  const featureTickets = tickets.filter(t => t.type === 'FEATURE').length
  const enhancementTickets = tickets.filter(t => t.type === 'ENHANCEMENT').length
  const docTickets = tickets.filter(t => t.type === 'DOCUMENTATION').length

  // Ticket data by priority
  const highPriority = tickets.filter(t => t.priority === 'HIGH').length
  const mediumPriority = tickets.filter(t => t.priority === 'MEDIUM').length
  const lowPriority = tickets.filter(t => t.priority === 'LOW').length

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Welcome back, {user?.firstName}!</h1>
        <p className="text-muted">Here's what's happening with your projects today</p>
      </div>

      <Row className="g-4 mb-4">
        <Col md="3">
          <Card className="stat-card h-100">
            <CardBody className="position-relative">
              <span className="stat-icon">📁</span>
              <CardTitle tag="h6" className="text-white-50 text-uppercase mb-2">Total Projects</CardTitle>
              <h2 className="display-4 text-white mb-0">{projects.length}</h2>
            </CardBody>
          </Card>
        </Col>
        <Col md="3">
          <Card className="stat-card h-100">
            <CardBody className="position-relative">
              <span className="stat-icon">🎫</span>
              <CardTitle tag="h6" className="text-white-50 text-uppercase mb-2">All Tickets</CardTitle>
              <h2 className="display-4 text-white mb-0">{tickets.length}</h2>
            </CardBody>
          </Card>
        </Col>
        <Col md="3">
          <Card className="stat-card h-100">
            <CardBody className="position-relative">
              <span className="stat-icon">🔄</span>
              <CardTitle tag="h6" className="text-white-50 text-uppercase mb-2">In Progress</CardTitle>
              <h2 className="display-4 text-white mb-0">{inProgressTickets}</h2>
            </CardBody>
          </Card>
        </Col>
        <Col md="3">
          <Card className="stat-card h-100">
            <CardBody className="position-relative">
              <span className="stat-icon">📋</span>
              <CardTitle tag="h6" className="text-white-50 text-uppercase mb-2">Open Tickets</CardTitle>
              <h2 className="display-4 text-white mb-0">{openTickets}</h2>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Analytics Charts */}
      <Row className="g-4 mb-4">
        <Col xl="4">
          <PieChart
            title="Tickets by Status"
            labels={['Open', 'In Progress', 'Closed']}
            data={[openTickets, inProgressTickets, closedTickets]}
            colors={[
              'rgba(17, 205, 239, 0.8)',
              'rgba(251, 99, 64, 0.8)',
              'rgba(45, 206, 137, 0.8)',
            ]}
          />
        </Col>
        <Col xl="4">
          <PieChart
            title="Tickets by Type"
            labels={['Bug', 'Feature', 'Enhancement', 'Documentation']}
            data={[bugTickets, featureTickets, enhancementTickets, docTickets]}
            colors={[
              'rgba(245, 54, 92, 0.8)',
              'rgba(94, 114, 228, 0.8)',
              'rgba(251, 99, 64, 0.8)',
              'rgba(17, 205, 239, 0.8)',
            ]}
          />
        </Col>
        <Col xl="4">
          <PieChart
            title="Tickets by Priority"
            labels={['High', 'Medium', 'Low']}
            data={[highPriority, mediumPriority, lowPriority]}
            colors={[
              'rgba(245, 54, 92, 0.8)',
              'rgba(251, 99, 64, 0.8)',
              'rgba(45, 206, 137, 0.8)',
            ]}
          />
        </Col>
      </Row>

      <Row className="g-4">
        <Col md="6">
          <Card className="h-100 shadow">
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <CardTitle tag="h5" className="mb-0 text-uppercase text-muted">Recent Projects</CardTitle>
                <Button tag={Link} to="/projects" color="primary" size="sm" className="action-btn">
                  View All
                </Button>
              </div>
              {projects.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">📁</div>
                  <p className="mb-2">No projects yet</p>
                  <Button tag={Link} to="/projects" color="primary" className="action-btn">
                    Create Your First Project
                  </Button>
                </div>
              ) : (
                <ul className="list-group list-group-flush">
                  {projects.slice(0, 5).map((project) => (
                    <li key={project.id} className="list-group-item px-0">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <Link to={`/projects/${project.id}`} className="fw-bold text-decoration-none">
                            {project.name}
                          </Link>
                          <p className="text-muted mb-0 small">{project.description || 'No description'}</p>
                        </div>
                        <span className="badge bg-primary rounded-pill">{project.ticketCount || 0}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>
        </Col>

        <Col md="6">
          <Card className="h-100 shadow">
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <CardTitle tag="h5" className="mb-0 text-uppercase text-muted">Recent Tickets</CardTitle>
                <Button tag={Link} to="/tickets" color="primary" size="sm" className="action-btn">
                  View All
                </Button>
              </div>
              {tickets.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">🎫</div>
                  <p className="mb-2">No tickets assigned</p>
                  <Button tag={Link} to="/tickets" color="primary" className="action-btn">
                    View Tickets
                  </Button>
                </div>
              ) : (
                <ul className="list-group list-group-flush">
                  {tickets.slice(0, 5).map((ticket) => (
                    <li key={ticket.id} className="list-group-item px-0">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <Link to={`/tickets/${ticket.id}`} className="fw-bold text-decoration-none">
                            {ticket.title}
                          </Link>
                          <div className="mt-1">
                            <span className={`badge status-badge status-${ticket.status?.toLowerCase().replace('_', '-')} me-2`}>
                              {ticket.status?.replace('_', ' ')}
                            </span>
                            <span className={`badge priority-badge priority-${ticket.priority?.toLowerCase()}`}>
                              {ticket.priority}
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default Dashboard