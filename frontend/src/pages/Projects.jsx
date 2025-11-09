import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, CardBody, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input } from 'reactstrap'
import { projectAPI } from '../api/endpoints'
import { toast } from 'react-toastify'

const Projects = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  })

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await projectAPI.getAllProjects()
      setProjects(response.data)
    } catch (error) {
      toast.error('Failed to load projects')
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
      await projectAPI.createProject(formData)
      toast.success('Project created successfully')
      setFormData({ name: '', description: '' })
      toggleModal()
      fetchProjects()
    } catch (error) {
      toast.error('Failed to create project')
      console.error(error)
    }
  }

  return (
    <>
      <div className="page-header">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h1 className="page-title">Projects</h1>
            <p className="text-muted mb-0">Manage and track all your projects</p>
          </div>
          <Button color="primary" onClick={toggleModal} className="action-btn">
            <span className="me-2">➕</span> Create Project
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted mt-3">Loading projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <Card className="border-0">
          <CardBody>
            <div className="empty-state">
              <div className="empty-state-icon">📁</div>
              <h3 className="mb-2">No Projects Yet</h3>
              <p className="mb-4">Get started by creating your first project!</p>
              <Button color="primary" onClick={toggleModal} className="action-btn">
                <span className="me-2">➕</span> Create Your First Project
              </Button>
            </div>
          </CardBody>
        </Card>
      ) : (
        <div className="row g-4">
          {projects.map((project) => (
            <div key={project.id} className="col-md-6 col-lg-4">
              <Card className="project-card h-100">
                <CardBody className="d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="flex-grow-1">
                      <h5 className="mb-1">
                        <Link to={`/projects/${project.id}`} className="text-decoration-none text-dark fw-bold">
                          {project.name}
                        </Link>
                      </h5>
                      <small className="text-muted">
                        <span className="me-1">👤</span> {project.createdByName}
                      </small>
                    </div>
                  </div>

                  <p className="text-muted small flex-grow-1 mb-3">
                    {project.description || 'No description provided'}
                  </p>

                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex gap-3">
                      <div>
                        <span className="text-muted small d-block">Tickets</span>
                        <strong className="text-primary">{project.ticketCount || 0}</strong>
                      </div>
                      <div>
                        <span className="text-muted small d-block">Team</span>
                        <strong className="text-primary">{project.teamMemberIds?.length || 0}</strong>
                      </div>
                    </div>
                  </div>

                  <Button
                    tag={Link}
                    to={`/projects/${project.id}`}
                    color="primary"
                    size="sm"
                    className="w-100 action-btn"
                  >
                    View Details →
                  </Button>
                </CardBody>
              </Card>
            </div>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      <Modal isOpen={modalOpen} toggle={toggleModal} centered>
        <ModalHeader toggle={toggleModal} className="border-0 pb-0">
          <div>
            <h4 className="mb-1 gradient-text">Create New Project</h4>
            <p className="text-muted small mb-0">Start a new project to track bugs and features</p>
          </div>
        </ModalHeader>
        <ModalBody className="pt-2">
          <Form onSubmit={handleSubmit}>
            <FormGroup className="mb-3">
              <Label for="name" className="form-label">Project Name *</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Mobile App Redesign"
                required
                className="form-control"
              />
            </FormGroup>
            <FormGroup className="mb-4">
              <Label for="description" className="form-label">Description</Label>
              <Input
                type="textarea"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe what this project is about..."
                rows="4"
                className="form-control"
              />
            </FormGroup>
            <Button color="primary" type="submit" block className="action-btn w-100">
              <span className="me-2">✨</span> Create Project
            </Button>
          </Form>
        </ModalBody>
      </Modal>
    </>
  )
}

export default Projects