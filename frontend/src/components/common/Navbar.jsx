import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  Navbar as BSNavbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap'

const Navbar = () => {
  const { user, logout } = useAuth()

  return (
    <BSNavbar color="dark" dark expand="md" className="modern-navbar mb-4">
      <div className="container-fluid px-4">
        <NavbarBrand tag={Link} to="/" className="d-flex align-items-center">
          <span className="me-2" style={{ fontSize: '1.5rem' }}>🐛</span>
          <span>Bug Tracker</span>
        </NavbarBrand>
        <Nav className="ms-auto d-flex align-items-center" navbar>
          <NavItem>
            <NavLink tag={Link} to="/">
              📊 Dashboard
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to="/projects">
              📁 Projects
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to="/tickets">
              🎫 My Tickets
            </NavLink>
          </NavItem>
          <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret className="d-flex align-items-center">
              <div className="d-flex align-items-center">
                <div className="rounded-circle bg-white text-primary d-flex align-items-center justify-content-center me-2"
                     style={{ width: '32px', height: '32px', fontSize: '0.875rem', fontWeight: 'bold' }}>
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </div>
                <span>{user?.firstName} {user?.lastName}</span>
              </div>
            </DropdownToggle>
            <DropdownMenu end>
              <DropdownItem header className="text-muted">
                <small>{user?.email}</small>
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem onClick={logout} className="text-danger">
                🚪 Logout
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
      </div>
    </BSNavbar>
  )
}

export default Navbar