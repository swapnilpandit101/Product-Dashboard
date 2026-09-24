import { useNavigate } from 'react-router-dom';
import { Menu, LogOut, Package } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

/**
 * ARCHITECTURAL DECISION: Fixed Top Navbar Component
 * 
 * WHY THIS NAVBAR STAYS FIXED:
 * Sits beside the fixed desktop sidebar (top: 0; right: 0; left: sidebar-width) and above
 * the scrolling main content.
 * 
 * WHY LOGOUT IS SPA-ROUTED:
 * Logout calls AuthContext's `logout()` and `navigate('/login')`, preventing full browser
 * reloads and preserving application shell state transitions.
 */
export function Navbar({ onToggleSidebar, title = 'Product Dashboard' }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="navbar-menu-btn"
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} className="navbar-menu-icon" />
        </button>

        <div className="navbar-brand-mobile">
          <div className="navbar-brand-badge">
            <img
              src="/favicon.svg"
              alt="SP Admin Logo"
              className="navbar-brand-img"
              width="20"
              height="20"
            />
          </div>
          <span className="navbar-brand-text">SP Admin</span>
        </div>

        <h1 className="navbar-title">{title}</h1>
      </div>

      <div className="navbar-right">
        {user && (
          <div className="navbar-user">
            <div className="navbar-user-avatar">
              {user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="navbar-user-info">
              <span className="navbar-user-name">
                {user.firstName} {user.lastName}
              </span>
              <span className="navbar-user-role">Administrator</span>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handleLogout}
          className="navbar-logout-btn"
          title="Logout"
          aria-label="Logout"
        >
          <LogOut size={16} className="navbar-logout-icon" />
          <span className="navbar-logout-text">Logout</span>
        </button>
      </div>
    </header>
  );
}
