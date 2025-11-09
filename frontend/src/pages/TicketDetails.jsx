import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card, CardBody, Badge, Row, Col, Button, Form, FormGroup, Input } from 'reactstrap'
import { ticketAPI, commentAPI } from '../api/endpoints'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import { timeAgo, daysSince, formatDate } from '../utils/timeUtils'

const TicketDetails = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const [ticket, setTicket] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [commentContent, setCommentContent] = useState('')

  useEffect(() => {
    fetchTicketDetails()
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
            <div className="d-flex gap-2 flex-wrap">
              <Badge color="secondary" className="text-uppercase px-3 py-2">
                {ticket.type}
              </Badge>
              <span className={`badge priority-badge priority-${ticket.priority?.toLowerCase()} px-3 py-2`}>
                {ticket.priority}
              </span>
              <span className={`badge status-badge status-${ticket.status?.toLowerCase().replace('_', '-')} px-3 py-2`}>
                {ticket.status?.replace('_', ' ')}
              </span>
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
                <small className="text-muted d-block mb-1">Assigned Developers</small>
                <strong>👥 {ticket.assignedDeveloperIds?.length || 0} developers</strong>
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
    </>
  )
}

export default TicketDetails