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
    <BSNavbar color="dark" dark expand="md" className="mb-4">
      <NavbarBrand tag={Link} to="/">
        Bug Tracker
      </NavbarBrand>
      <Nav className="ms-auto" navbar>
        <NavItem>
          <NavLink tag={Link} to="/">
            Dashboard
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={Link} to="/projects">
            Projects
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={Link} to="/tickets">
            My Tickets
          </NavLink>
        </NavItem>
        <UncontrolledDropdown nav inNavbar>
          <DropdownToggle nav caret>
            {user?.firstName} {user?.lastName}
          </DropdownToggle>
          <DropdownMenu end>
            <DropdownItem header>
              {user?.email}
            </DropdownItem>
            <DropdownItem divider />
            <DropdownItem onClick={logout}>
              Logout
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </Nav>
    </BSNavbar>
  )
}

export default Navbar