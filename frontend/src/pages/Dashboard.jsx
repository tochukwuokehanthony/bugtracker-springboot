import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Container, Row, Col, Card, CardBody, CardTitle, Button } from 'reactstrap'
import Navbar from '../components/common/Navbar'
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
      <>
        <Navbar />
        <Container>
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </Container>
      </>
    )
  }

  const openTickets = tickets.filter(t => t.status === 'OPEN').length
  const inProgressTickets = tickets.filter(t => t.status === 'IN_PROGRESS').length

  return (
    <>
      <Navbar />
      <Container className="py-4">
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

        <Row className="g-4">
          <Col md="6">
            <Card className="h-100">
              <CardBody>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <CardTitle tag="h4" className="mb-0">Recent Projects</CardTitle>
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
            <Card className="h-100">
              <CardBody>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <CardTitle tag="h4" className="mb-0">Recent Tickets</CardTitle>
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
      </Container>
    </>
  )
}

export default Dashboard