import { Link, useLocation } from 'react-router-dom'
import { Nav, NavItem, NavLink } from 'reactstrap'
import { useAuth } from '../../context/AuthContext'
import './Sidebar.css'

const Sidebar = () => {
  const location = useLocation()
  const { user } = useAuth()

  const routes = [
    {
      path: '/',
      name: 'Dashboard',
      icon: '📊',
    },
    {
      path: '/projects',
      name: 'Projects',
      icon: '📁',
    },
    {
      path: '/tickets',
      name: 'My Tickets',
      icon: '🎫',
    },
  ]

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <Link to="/" className="sidebar-brand">
          <span className="brand-icon">🐛</span>
          <span className="brand-text">Bug Tracker</span>
        </Link>
      </div>

      <div className="sidebar-user">
        <div className="user-avatar">
          {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
        </div>
        <div className="user-info">
          <h6 className="user-name">{user?.firstName} {user?.lastName}</h6>
          <p className="user-email">{user?.email}</p>
        </div>
      </div>

      <hr className="sidebar-divider" />

      <Nav vertical className="sidebar-nav">
        {routes.map((route, index) => (
          <NavItem key={index}>
            <NavLink
              tag={Link}
              to={route.path}
              className={`sidebar-link ${isActive(route.path) ? 'active' : ''}`}
            >
              <span className="nav-icon">{route.icon}</span>
              <span className="nav-text">{route.name}</span>
            </NavLink>
          </NavItem>
        ))}
      </Nav>
    </div>
  )
}

export default Sidebar
