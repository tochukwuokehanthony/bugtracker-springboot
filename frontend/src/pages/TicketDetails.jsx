import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card, CardBody, Badge, Row, Col, Button, Form, FormGroup, Input, Label, Modal, ModalHeader, ModalBody } from 'reactstrap'
import { ticketAPI, commentAPI, userAPI } from '../api/endpoints'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import { timeAgo, daysSince, formatDate } from '../utils/timeUtils'

const TicketDetails = () => {
  const { id } = useParams()
  const { user, isAdmin } = useAuth()
  const [ticket, setTicket] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [commentContent, setCommentContent] = useState('')
  const [assignModalOpen, setAssignModalOpen] = useState(false)
  const [allUsers, setAllUsers] = useState([])
  const [selectedUserId, setSelectedUserId] = useState('')

  useEffect(() => {
    fetchTicketDetails()
    if (isAdmin()) {
      fetchAllUsers()
    }
  }, [id])

  const fetchTicketDetails = async () => {
    try {
      const [ticketRes, commentsRes] = await Promise.all([
        ticketAPI.getTicketById(id),
        commentAPI.getCommentsByTicketId(id),
      ])

      setTicket(ticketRes.data)
      setComments(commentsRes.data)
    } catch (error) {
      toast.error('Failed to load ticket details')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault()

    if (!commentContent.trim()) {
      return
    }

    try {
      await commentAPI.createComment({
        content: commentContent,
        ticketId: parseInt(id),
      })
      setCommentContent('')
      toast.success('Comment added')
      fetchTicketDetails()
    } catch (error) {
      toast.error('Failed to add comment')
      console.error(error)
    }
  }

  const fetchAllUsers = async () => {
    try {
      const response = await userAPI.getAllUsers()
      setAllUsers(response.data)
    } catch (error) {
      toast.error('Failed to load users')
      console.error(error)
    }
  }

  const handleOpenAssignModal = () => {
    fetchAllUsers()
    setAssignModalOpen(true)
  }

  const handleAssignUser = async () => {
    if (!selectedUserId) {
      toast.warning('Please select a user')
      return
    }

    try {
      await ticketAPI.assignDeveloper(parseInt(id), parseInt(selectedUserId))
      toast.success('User assigned to ticket')
      setAssignModalOpen(false)
      setSelectedUserId('')
      fetchTicketDetails()
    } catch (error) {
      toast.error('Failed to assign user')
      console.error(error)
    }
  }

  const handleUnassignUser = async (userId) => {
    try {
      await ticketAPI.unassignDeveloper(parseInt(id), userId)
      toast.success('User unassigned from ticket')
      fetchTicketDetails()
    } catch (error) {
      toast.error('Failed to unassign user')
      console.error(error)
    }
  }

  const handleCloseTicket = async () => {
    if (!window.confirm('Are you sure you want to close this ticket? This action can only be done by admins.')) {
      return
    }

    try {
      await ticketAPI.updateTicket(parseInt(id), {
        ...ticket,
        status: 'CLOSED'
      })
      toast.success('Ticket closed successfully')
      fetchTicketDetails()
    } catch (error) {
      toast.error('Failed to close ticket')
      console.error(error)
    }
  }

  const handleReopenTicket = async () => {
    if (!window.confirm('Are you sure you want to reopen this ticket?')) {
      return
    }

    try {
      await ticketAPI.updateTicket(parseInt(id), {
        ...ticket,
        status: 'OPEN'
      })
      toast.success('Ticket reopened successfully')
      fetchTicketDetails()
    } catch (error) {
      toast.error('Failed to reopen ticket')
      console.error(error)
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'BUG':
        return <img src="/bug-icon.svg" alt="Bug" style={{ width: '32px', height: '32px' }} />
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
        <p className="text-muted mt-3">Loading ticket details...</p>
      </div>
    )
  }

  return (
    <>
      <div className="page-header mb-4">
        <div className="d-flex align-items-center gap-2 mb-2">
          <Link to="/tickets" className="text-muted text-decoration-none">
            <span>← Tickets</span>
          </Link>
          <span className="text-muted">/</span>
          <span className="text-muted">#{id}</span>
        </div>
        <div className="d-flex align-items-start gap-3">
          <div className="fs-2">{getTypeIcon(ticket.type)}</div>
          <div className="flex-grow-1">
            <h1 className="page-title mb-2">{ticket.title}</h1>
            <div className="d-flex gap-2 flex-wrap align-items-center">
              <Badge color="secondary" className="text-uppercase px-3 py-2">
                {ticket.type}
              </Badge>
              <span className={`badge priority-badge priority-${ticket.priority?.toLowerCase()} px-3 py-2`}>
                {ticket.priority}
              </span>
              <span className={`badge status-badge status-${ticket.status?.toLowerCase().replace('_', '-')} px-3 py-2`}>
                {ticket.status?.replace('_', ' ')}
              </span>
              {isAdmin() && ticket.status !== 'CLOSED' && (
                <Button size="sm" color="success" onClick={handleCloseTicket} className="ms-2">
                  ✓ Close Ticket
                </Button>
              )}
              {isAdmin() && ticket.status === 'CLOSED' && (
                <Button size="sm" color="warning" onClick={handleReopenTicket} className="ms-2">
                  ↻ Reopen Ticket
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Row className="g-4">
        <Col md="8">
          <Card className="mb-4">
            <CardBody>
              <h5 className="fw-bold mb-3">📝 Description</h5>
              <p className="text-muted">{ticket.description || 'No description provided'}</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h5 className="fw-bold mb-4">💬 Comments ({comments.length})</h5>

              <Card className="bg-light border-0 mb-4">
                <CardBody>
                  <Form onSubmit={handleCommentSubmit}>
                    <FormGroup className="mb-3">
                      <Input
                        type="textarea"
                        placeholder="Add your comment..."
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        rows="3"
                        className="form-control"
                      />
                    </FormGroup>
                    <Button color="primary" type="submit" className="action-btn">
                      <span className="me-2">💬</span> Add Comment
                    </Button>
                  </Form>
                </CardBody>
              </Card>

              {comments.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted mb-0">No comments yet. Be the first to share your thoughts!</p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {comments.map((comment) => (
                    <Card key={comment.id} className="border-0 shadow-sm">
                      <CardBody>
                        <div className="d-flex align-items-start gap-3">
                          <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                               style={{ width: '40px', height: '40px', fontSize: '0.875rem', fontWeight: 'bold', flexShrink: 0 }}>
                            {comment.userName?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                          <div className="flex-grow-1">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <div>
                                <strong className="d-block">{comment.userName}</strong>
                                <small className="text-muted">{timeAgo(comment.createdAt)}</small>
                              </div>
                            </div>
                            <p className="mb-0">{comment.content}</p>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </Col>

        <Col md="4">
          <Card className="sticky-top" style={{ top: '1rem' }}>
            <CardBody>
              <h5 className="fw-bold mb-4">ℹ️ Details</h5>

              <div className="mb-3 pb-3 border-bottom">
                <small className="text-muted d-block mb-1">Project</small>
                <strong>
                  <Link to={`/projects/${ticket.projectId}`} className="text-decoration-none">
                    📁 {ticket.projectName}
                  </Link>
                </strong>
              </div>

              <div className="mb-3 pb-3 border-bottom">
                <small className="text-muted d-block mb-1">Created By</small>
                <div className="d-flex align-items-center gap-2">
                  <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                       style={{ width: '28px', height: '28px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    {ticket.createdByName?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <strong>{ticket.createdByName}</strong>
                </div>
              </div>

              <div className="mb-3 pb-3 border-bottom">
                <small className="text-muted d-block mb-1">Time Estimate</small>
                <strong>⏱️ {ticket.timeEstimate ? `${ticket.timeEstimate} hours` : 'Not set'}</strong>
              </div>

              <div className="mb-3 pb-3 border-bottom">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <small className="text-muted">Assigned Developers</small>
                  {isAdmin() && (
                    <Button size="sm" color="primary" onClick={handleOpenAssignModal}>
                      <span className="me-1">➕</span> Assign
                    </Button>
                  )}
                </div>
                {ticket.assignedDeveloperIds && ticket.assignedDeveloperIds.length > 0 ? (
                  <div className="d-flex flex-column gap-2">
                    {allUsers.filter(u => ticket.assignedDeveloperIds.includes(u.id)).map(dev => (
                      <div key={dev.id} className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center gap-2">
                          <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                               style={{ width: '28px', height: '28px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                            {dev.firstName?.charAt(0)}{dev.lastName?.charAt(0)}
                          </div>
                          <span className="small">{dev.firstName} {dev.lastName}</span>
                        </div>
                        {isAdmin() && (
                          <Button
                            size="sm"
                            color="danger"
                            outline
                            onClick={() => handleUnassignUser(dev.id)}
                            style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem' }}
                          >
                            ✕
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <small className="text-muted">No developers assigned</small>
                )}
              </div>

              <div className="mb-3 pb-3 border-bottom">
                <small className="text-muted d-block mb-1">Days Outstanding</small>
                <strong>📅 {daysSince(ticket.createdAt)} days</strong>
              </div>

              <div className="mb-3 pb-3 border-bottom">
                <small className="text-muted d-block mb-1">Created</small>
                <strong>🕒 {timeAgo(ticket.createdAt)}</strong>
              </div>

              <div className="mb-0">
                <small className="text-muted d-block mb-1">Last Updated</small>
                <strong>🔄 {timeAgo(ticket.updatedAt)}</strong>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Assign Developer Modal */}
      <Modal isOpen={assignModalOpen} toggle={() => setAssignModalOpen(false)} centered>
        <ModalHeader toggle={() => setAssignModalOpen(false)} className="border-0 pb-0">
          <div>
            <h4 className="mb-1 gradient-text">Assign Developer</h4>
            <p className="text-muted small mb-0">Select a user to assign to this ticket</p>
          </div>
        </ModalHeader>
        <ModalBody className="pt-2">
          <Form onSubmit={(e) => { e.preventDefault(); handleAssignUser(); }}>
            <FormGroup className="mb-3">
              <Label for="userId" className="form-label">User</Label>
              <Input
                type="select"
                id="userId"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="form-control"
              >
                <option value="">Select a user...</option>
                {allUsers
                  .filter(u => !ticket?.assignedDeveloperIds?.includes(u.id))
                  .map(user => (
                    <option key={user.id} value={user.id}>
                      {user.firstName} {user.lastName} ({user.email})
                    </option>
                  ))}
              </Input>
            </FormGroup>
            <div className="d-flex gap-2">
              <Button color="primary" type="submit" className="action-btn flex-grow-1">
                <span className="me-2">👤</span> Assign User
              </Button>
              <Button color="secondary" outline onClick={() => setAssignModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    </>
  )
}

export default TicketDetails