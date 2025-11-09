import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input, Button } from 'reactstrap'

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  })
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const success = await register(formData)

    if (success) {
      navigate('/')
    }

    setLoading(false)
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <Card>
          <CardBody className="p-5">
            <div className="auth-logo">
              <img src="/bug-tracker-logo.svg" alt="Bug Tracker Logo" style={{ width: '120px', height: '120px' }} />
            </div>
            <h2 className="auth-title">Bug Tracker</h2>
            <p className="auth-subtitle">Create your account to get started</p>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md="6">
                  <FormGroup className="mb-3">
                    <Label for="firstName" className="form-label">First Name</Label>
                    <Input
                      type="text"
                      id="firstName"
                      name="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="form-control"
                    />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup className="mb-3">
                    <Label for="lastName" className="form-label">Last Name</Label>
                    <Input
                      type="text"
                      id="lastName"
                      name="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="form-control"
                    />
                  </FormGroup>
                </Col>
              </Row>
              <FormGroup className="mb-3">
                <Label for="email" className="form-label">Email Address</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="john.doe@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
              </FormGroup>
              <FormGroup className="mb-4">
                <Label for="password" className="form-label">Password</Label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Minimum 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                  className="form-control"
                />
              </FormGroup>
              <Button
                color="primary"
                block
                type="submit"
                disabled={loading}
                className="btn btn-primary w-100 py-3 mt-3"
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </Form>
            <div className="text-center mt-4">
              <p className="text-muted mb-0">
                Already have an account?{' '}
                <Link to="/login" className="fw-bold">
                  Login here
                </Link>
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default Register