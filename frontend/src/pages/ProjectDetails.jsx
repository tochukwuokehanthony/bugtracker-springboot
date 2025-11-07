import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Container, Card, CardBody, Button, Row, Col, Badge, Table, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input } from 'reactstrap'
import Navbar from '../components/common/Navbar'
import { projectAPI, ticketAPI } from '../api/endpoints'
import { toast } from 'react-toastify'

const ProjectDetails = () => {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
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
      const [projectRes, ticketsRes] = await Promise.all([
        projectAPI.getProjectById(id),
        ticketAPI.getTicketsByProjectId(id),
      ])

      setProject(projectRes.data)
      setTickets(ticketsRes.data)
    } catch (error) {
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
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>{project.name}</h1>
          <Button color="primary" onClick={toggleModal}>
            Create Ticket
          </Button>
        </div>

        <Row className="mb-4">
          <Col md="12">
            <Card>
              <CardBody>
                <h5>Description</h5>
                <p>{project.description || 'No description provided'}</p>
                <p>
                  <strong>Created by:</strong> {project.createdByName}
                </p>
                <p>
                  <strong>Team members:</strong> {project.teamMemberIds?.length || 0}
                </p>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Card>
          <CardBody>
            <h4 className="mb-3">Tickets ({tickets.length})</h4>
            {tickets.length === 0 ? (
              <p className="text-center">No tickets yet. Create one to get started!</p>
            ) : (
              <Table hover responsive>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Assigned To</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => (
                    <tr key={ticket.id}>
                      <td>
                        <Link to={`/tickets/${ticket.id}`}>{ticket.title}</Link>
                      </td>
                      <td>
                        <Badge color="secondary">{ticket.type}</Badge>
                      </td>
                      <td>
                        <Badge color={ticket.priority === 'HIGH' ? 'danger' : ticket.priority === 'MEDIUM' ? 'warning' : 'success'}>
                          {ticket.priority}
                        </Badge>
                      </td>
                      <td>
                        <Badge color={ticket.status === 'OPEN' ? 'info' : ticket.status === 'IN_PROGRESS' ? 'warning' : 'success'}>
                          {ticket.status}
                        </Badge>
                      </td>
                      <td>{ticket.assignedDeveloperIds?.length || 0} developers</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </CardBody>
        </Card>

        {/* Create Ticket Modal */}
        <Modal isOpen={modalOpen} toggle={toggleModal}>
          <ModalHeader toggle={toggleModal}>Create New Ticket</ModalHeader>
          <ModalBody>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label for="title">Title *</Label>
                <Input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="description">Description</Label>
                <Input
                  type="textarea"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                />
              </FormGroup>
              <FormGroup>
                <Label for="type">Type</Label>
                <Input type="select" id="type" name="type" value={formData.type} onChange={handleChange}>
                  <option value="BUG">Bug</option>
                  <option value="FEATURE">Feature</option>
                  <option value="ENHANCEMENT">Enhancement</option>
                  <option value="DOCUMENTATION">Documentation</option>
                </Input>
              </FormGroup>
              <FormGroup>
                <Label for="priority">Priority</Label>
                <Input type="select" id="priority" name="priority" value={formData.priority} onChange={handleChange}>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </Input>
              </FormGroup>
              <Button color="primary" type="submit" block>
                Create Ticket
              </Button>
            </Form>
          </ModalBody>
        </Modal>
      </Container>
    </>
  )
}

export default ProjectDetails