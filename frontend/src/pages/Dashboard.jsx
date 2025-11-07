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

  return (
    <>
      <Navbar />
      <Container>
        <h1 className="mb-4">Dashboard</h1>
        <Row>
          <Col md="6" className="mb-4">
            <Card>
              <CardBody>
                <CardTitle tag="h3">My Projects</CardTitle>
                <h2 className="display-4">{projects.length}</h2>
                <Button tag={Link} to="/projects" color="primary">
                  View All Projects
                </Button>
              </CardBody>
            </Card>
          </Col>
          <Col md="6" className="mb-4">
            <Card>
              <CardBody>
                <CardTitle tag="h3">Assigned Tickets</CardTitle>
                <h2 className="display-4">{tickets.length}</h2>
                <Button tag={Link} to="/tickets" color="primary">
                  View My Tickets
                </Button>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col md="12">
            <Card>
              <CardBody>
                <CardTitle tag="h4">Recent Projects</CardTitle>
                {projects.length === 0 ? (
                  <p>No projects yet. Create your first project!</p>
                ) : (
                  <ul className="list-group">
                    {projects.slice(0, 5).map((project) => (
                      <li key={project.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <Link to={`/projects/${project.id}`}>{project.name}</Link>
                        <span className="badge bg-primary rounded-pill">{project.ticketCount} tickets</span>
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