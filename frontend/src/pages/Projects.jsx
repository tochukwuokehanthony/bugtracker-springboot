import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Container, Button, Table, Card, CardBody, CardTitle, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input } from 'reactstrap'
import Navbar from '../components/common/Navbar'
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
      <Navbar />
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Projects</h1>
          <Button color="primary" onClick={toggleModal}>
            Create Project
          </Button>
        </div>

        <Card>
          <CardBody>
            {loading ? (
              <div className="text-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : projects.length === 0 ? (
              <p className="text-center">No projects found. Create your first project!</p>
            ) : (
              <Table hover responsive>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Created By</th>
                    <th>Tickets</th>
                    <th>Team Size</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project.id}>
                      <td>
                        <Link to={`/projects/${project.id}`}>{project.name}</Link>
                      </td>
                      <td>{project.description || 'No description'}</td>
                      <td>{project.createdByName}</td>
                      <td>{project.ticketCount}</td>
                      <td>{project.teamMemberIds?.length || 0}</td>
                      <td>
                        <Button tag={Link} to={`/projects/${project.id}`} color="info" size="sm">
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </CardBody>
        </Card>

        {/* Create Project Modal */}
        <Modal isOpen={modalOpen} toggle={toggleModal}>
          <ModalHeader toggle={toggleModal}>Create New Project</ModalHeader>
          <ModalBody>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label for="name">Project Name *</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
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
              <Button color="primary" type="submit" block>
                Create Project
              </Button>
            </Form>
          </ModalBody>
        </Modal>
      </Container>
    </>
  )
}

export default Projects