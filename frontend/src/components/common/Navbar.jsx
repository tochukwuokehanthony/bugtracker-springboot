import { useAuth } from '../../context/AuthContext'
import {
  Navbar as BSNavbar,
  Nav,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap'

const Navbar = () => {
  const { user, logout } = useAuth()

  return (
    <BSNavbar color="white" light expand="md" className="navbar-top shadow-sm mb-0">
      <div className="container-fluid px-4">
        <Nav className="ms-auto d-flex align-items-center" navbar>
          <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret className="d-flex align-items-center">
              <div className="d-flex align-items-center">
                <div className="rounded-circle d-flex align-items-center justify-content-center me-2"
                     style={{
                       width: '36px',
                       height: '36px',
                       fontSize: '0.875rem',
                       fontWeight: 'bold',
                       background: 'linear-gradient(87deg, #5e72e4 0, #825ee4 100%)',
                       color: 'white'
                     }}>
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </div>
                <span className="text-dark">{user?.firstName} {user?.lastName}</span>
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