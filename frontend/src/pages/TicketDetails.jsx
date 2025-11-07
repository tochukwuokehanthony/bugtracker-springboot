import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Container, Card, CardBody, Badge, Row, Col, Button, Form, FormGroup, Input } from 'reactstrap'
import Navbar from '../components/common/Navbar'
import { ticketAPI, commentAPI } from '../api/endpoints'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'

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
        <h1 className="mb-4">{ticket.title}</h1>

        <Row>
          <Col md="8">
            <Card className="mb-4">
              <CardBody>
                <h5>Description</h5>
                <p>{ticket.description || 'No description provided'}</p>

                <hr />

                <Row>
                  <Col md="6">
                    <p>
                      <strong>Type:</strong> <Badge color="secondary">{ticket.type}</Badge>
                    </p>
                    <p>
                      <strong>Priority:</strong>{' '}
                      <Badge color={ticket.priority === 'HIGH' ? 'danger' : ticket.priority === 'MEDIUM' ? 'warning' : 'success'}>
                        {ticket.priority}
                      </Badge>
                    </p>
                  </Col>
                  <Col md="6">
                    <p>
                      <strong>Status:</strong>{' '}
                      <Badge color={ticket.status === 'OPEN' ? 'info' : ticket.status === 'IN_PROGRESS' ? 'warning' : 'success'}>
                        {ticket.status}
                      </Badge>
                    </p>
                    <p>
                      <strong>Created by:</strong> {ticket.createdByName}
                    </p>
                  </Col>
                </Row>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <h5 className="mb-3">Comments ({comments.length})</h5>

                <Form onSubmit={handleCommentSubmit} className="mb-4">
                  <FormGroup>
                    <Input
                      type="textarea"
                      placeholder="Add a comment..."
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      rows="3"
                    />
                  </FormGroup>
                  <Button color="primary" type="submit">
                    Add Comment
                  </Button>
                </Form>

                {comments.length === 0 ? (
                  <p className="text-muted">No comments yet. Be the first to comment!</p>
                ) : (
                  <div>
                    {comments.map((comment) => (
                      <Card key={comment.id} className="mb-3">
                        <CardBody>
                          <div className="d-flex justify-content-between">
                            <strong>{comment.userName}</strong>
                            <small className="text-muted">{new Date(comment.createdAt).toLocaleDateString()}</small>
                          </div>
                          <p className="mt-2 mb-0">{comment.content}</p>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>

          <Col md="4">
            <Card>
              <CardBody>
                <h5>Details</h5>
                <p>
                  <strong>Project:</strong> {ticket.projectName}
                </p>
                <p>
                  <strong>Time Estimate:</strong> {ticket.timeEstimate ? `${ticket.timeEstimate}h` : 'Not set'}
                </p>
                <p>
                  <strong>Assigned Developers:</strong> {ticket.assignedDeveloperIds?.length || 0}
                </p>
                <p>
                  <strong>Created:</strong> {new Date(ticket.createdAt).toLocaleDateString()}
                </p>
                <p>
                  <strong>Last Updated:</strong> {new Date(ticket.updatedAt).toLocaleDateString()}
                </p>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default TicketDetails