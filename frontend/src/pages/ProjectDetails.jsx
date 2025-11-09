import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card, CardBody, Button, Row, Col, Badge, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, CardTitle } from 'reactstrap'
import { projectAPI, ticketAPI } from '../api/endpoints'
import { toast } from 'react-toastify'

const ProjectDetails = () => {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    type: 'BUG',
    status: 'OPEN',
  })

  useEffect(() => {
    fetchProjectDetails()
  }, [id])

  const fetchProjectDetails = async () => {
    try {
      setError(null)
      const [projectRes, ticketsRes] = await Promise.all([
        projectAPI.getProjectById(id),
        ticketAPI.getTicketsByProjectId(id),
      ])

      setProject(projectRes.data)
      setTickets(ticketsRes.data)
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load project details')
      toast.error('Failed to load project details')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const toggleModal = () => setModalOpen(!modalOpen)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await ticketAPI.createTicket({
        ...formData,
        projectId: parseInt(id),
      })
      toast.success('Ticket created successfully')
      setFormData({ title: '', description: '', priority: 'MEDIUM', type: 'BUG', status: 'OPEN' })
      toggleModal()
      fetchProjectDetails()
    } catch (error) {
      toast.error('Failed to create ticket')
      console.error(error)
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
      case 'DOCUMENTATION':
        return '📚'
      default:
        return '📋'
    }
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted mt-3">Loading project details...</p>
      </div>
    )
  }

  if (error || !project) {
    return (
      <Card className="border-0">
        <CardBody>
          <div className="empty-state">
            <div className="empty-state-icon">❌</div>
            <h3 className="mb-2">Project Not Found</h3>
            <p className="mb-4">{error || 'The project you are looking for does not exist.'}</p>
            <Button tag={Link} to="/projects" color="primary" className="action-btn">
              ← Back to Projects
            </Button>
          </div>
        </CardBody>
      </Card>
    )
  }

  const openTickets = tickets.filter(t => t.status === 'OPEN').length
  const inProgressTickets = tickets.filter(t => t.status === 'IN_PROGRESS').length
  const closedTickets = tickets.filter(t => t.status === 'CLOSED').length

  return (
    <>
      <div className="page-header">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <Link to="/projects" className="text-muted text-decoration-none">
                <span>← Projects</span>
              </Link>
              <span className="text-muted">/</span>
              <span className="text-muted">{project.name}</span>
            </div>
            <h1 className="page-title mb-2">{project.name}</h1>
            <p className="text-muted mb-0">
              <span className="me-3">
                <span className="me-1">👤</span> Created by {project.createdByName}
              </span>
              <span>
                <span className="me-1">👥</span> {project.teamMemberIds?.length || 0} team members
              </span>
            </p>
          </div>
          <Button color="primary" onClick={toggleModal} className="action-btn">
            <span className="me-2">➕</span> Create Ticket
          </Button>
        </div>
      </div>

      <Row className="g-4 mb-4">
        <Col md="12">
          <Card>
            <CardBody>
              <h5 className="mb-3 fw-bold">📝 Description</h5>
              <p className="text-muted mb-0">{project.description || 'No description provided'}</p>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row className="g-4 mb-4">
        <Col md="3">
          <Card className="stat-card h-100">
            <CardBody className="position-relative">
              <span className="stat-icon">🎫</span>
              <CardTitle tag="h6" className="text-white-50 text-uppercase mb-2">Total Tickets</CardTitle>
              <h2 className="display-4 text-white mb-0">{tickets.length}</h2>
            </CardBody>
          </Card>
        </Col>
        <Col md="3">
          <Card className="stat-card h-100">
            <CardBody className="position-relative">
              <span className="stat-icon">📋</span>
              <CardTitle tag="h6" className="text-white-50 text-uppercase mb-2">Open</CardTitle>
              <h2 className="display-4 text-white mb-0">{openTickets}</h2>
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
              <span className="stat-icon">✅</span>
              <CardTitle tag="h6" className="text-white-50 text-uppercase mb-2">Closed</CardTitle>
              <h2 className="display-4 text-white mb-0">{closedTickets}</h2>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Card>
        <CardBody>
          <h4 className="mb-4 fw-bold">Tickets</h4>
          {tickets.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🎫</div>
              <h5 className="mb-2">No Tickets Yet</h5>
              <p className="mb-4">Create your first ticket to start tracking bugs and features!</p>
              <Button color="primary" onClick={toggleModal} className="action-btn">
                <span className="me-2">➕</span> Create First Ticket
              </Button>
            </div>
          ) : (
            <div className="row g-3">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="col-12">
                  <Card className="ticket-card">
                    <CardBody>
                      <div className="row align-items-center">
                        <div className="col-md-7">
                          <div className="d-flex align-items-start gap-3">
                            <div className="fs-3">{getTypeIcon(ticket.type)}</div>
                            <div className="flex-grow-1">
                              <h5 className="mb-1">
                                <Link to={`/tickets/${ticket.id}`} className="text-decoration-none text-dark fw-bold">
                                  {ticket.title}
                                </Link>
                              </h5>
                              <div className="text-muted small">
                                <span>👥 {ticket.assignedDeveloperIds?.length || 0} assigned</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-5">
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
          )}
        </CardBody>
      </Card>

      {/* Create Ticket Modal */}
      <Modal isOpen={modalOpen} toggle={toggleModal} centered size="lg">
        <ModalHeader toggle={toggleModal} className="border-0 pb-0">
          <div>
            <h4 className="mb-1 gradient-text">Create New Ticket</h4>
            <p className="text-muted small mb-0">Add a new ticket to {project.name}</p>
          </div>
        </ModalHeader>
        <ModalBody className="pt-2">
          <Form onSubmit={handleSubmit}>
            <FormGroup className="mb-3">
              <Label for="title" className="form-label">Title *</Label>
              <Input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Fix login button not working"
                required
                className="form-control"
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <Label for="description" className="form-label">Description</Label>
              <Input
                type="textarea"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the issue or feature in detail..."
                rows="4"
                className="form-control"
              />
            </FormGroup>
            <Row>
              <Col md="4">
                <FormGroup className="mb-3">
                  <Label for="type" className="form-label">Type</Label>
                  <Input type="select" id="type" name="type" value={formData.type} onChange={handleChange} className="form-control">
                    <option value="BUG">🐛 Bug</option>
                    <option value="FEATURE">✨ Feature</option>
                    <option value="ENHANCEMENT">⚡ Enhancement</option>
                    <option value="DOCUMENTATION">📚 Documentation</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup className="mb-3">
                  <Label for="priority" className="form-label">Priority</Label>
                  <Input type="select" id="priority" name="priority" value={formData.priority} onChange={handleChange} className="form-control">
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup className="mb-4">
                  <Label for="status" className="form-label">Status</Label>
                  <Input type="select" id="status" name="status" value={formData.status} onChange={handleChange} className="form-control">
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="CLOSED">Closed</option>
                  </Input>
                </FormGroup>
              </Col>
            </Row>
            <Button color="primary" type="submit" block className="action-btn w-100">
              <span className="me-2">✨</span> Create Ticket
            </Button>
          </Form>
        </ModalBody>
      </Modal>
    </>
  )
}

export default ProjectDetails