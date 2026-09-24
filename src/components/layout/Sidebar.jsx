import { NavLink } from 'react-router-dom';
import { LayoutList, PlusCircle, X } from 'lucide-react';
import './Sidebar.css';

/**
 * ARCHITECTURAL DECISION: Fixed Responsive Sidebar Component
 * 
 * WHY THIS COMPONENT IS FIXED & CLIENT-ROUTED:
 * 1. Fixed Layout: The sidebar stays permanently anchored on desktop (height: 100vh) while
 *    only the main content scrolls.
 * 2. Stable Remount Prevention: Maintained at the AppShell level, preventing expensive remounts
 *    when switching between /products, /products/new, /products/:id, etc.
 * 3. Active Route Highlighting: Uses React Router NavLink's `isActive` property to apply
 *    `.sidebar-item-active` without any CSS `:hover` states.
 * 4. Responsive Mobile Drawer: Slides in/out on mobile when toggled via Navbar, closing
 *    automatically on navigation click.
 */
export function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isOpen && (
        <div
          className="sidebar-backdrop"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand-box">
            <div className="sidebar-brand-badge">
              <img
                src="/favicon.svg"
                alt="SP Admin Logo"
                className="sidebar-brand-img"
                width="20"
                height="20"
              />
            </div>
            <span className="sidebar-brand-text">SP Admin</span>
          </div>
          {/* Mobile close button */}
          <button
            type="button"
            onClick={onClose}
            className="sidebar-mobile-close-btn"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-navigation">
          <div className="sidebar-section-title">Navigation</div>
          
          <NavLink
            to="/products"
            end
            onClick={onClose}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? 'sidebar-item-active' : ''}`
            }
          >
            <LayoutList size={18} className="sidebar-item-icon" />
            <span className="sidebar-item-label">Products</span>
          </NavLink>

          <NavLink
            to="/products/new"
            onClick={onClose}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? 'sidebar-item-active' : ''}`
            }
          >
            <PlusCircle size={18} className="sidebar-item-icon" />
            <span className="sidebar-item-label">Add Product</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-footer-text">
            Product Admin SPA v1.0
          </div>
        </div>
      </aside>
    </>
  );
}
