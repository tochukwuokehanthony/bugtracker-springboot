import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input, Button } from 'reactstrap'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const success = await login({ email, password })

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
            <p className="auth-subtitle">Welcome back! Please login to your account</p>
            <Form onSubmit={handleSubmit}>
              <FormGroup className="mb-4">
                <Label for="email" className="form-label">Email Address</Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="form-control"
                />
              </FormGroup>
              <FormGroup className="mb-4">
                <Label for="password" className="form-label">Password</Label>
                <Input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </Button>
            </Form>
            <div className="text-center mt-4">
              <p className="text-muted mb-0">
                Don't have an account?{' '}
                <Link to="/register" className="fw-bold">
                  Register here
                </Link>
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default Login