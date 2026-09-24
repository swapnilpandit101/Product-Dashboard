import { useState, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from '../common/Navbar';
import './AppShell.css';

/**
 * ARCHITECTURAL DECISION: Stable Authenticated App Shell
 * 
 * WHY THIS APP SHELL IS REUSABLE & STABLE:
 * 1. Single Shared Frame: Wraps all authenticated pages (/products, /products/new, /products/:id, /products/:id/edit).
 * 2. Zero Unnecessary Remounts: The shell, sidebar, and navbar remain continuously mounted
 *    while React Router switches child views inside `<Outlet />`.
 * 3. Consistent Desktop Layout: Desktop view provides fixed left navigation (240px) and fixed top bar (64px).
 * 4. Responsive Mobile Content: Automatically expands content area to 100% width on tablet/mobile.
 */
export function AppShell() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const handleToggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const handleCloseSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  // Compute clean dynamic header title from pathname
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/products/new') return 'Add New Product';
    if (path.endsWith('/edit')) return 'Edit Product';
    if (path.startsWith('/products/') && path !== '/products') return 'Product Details';
    return 'Product Inventory';
  };

  return (
    <div className="app-shell">
      <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />
      
      <div className="app-shell-main-wrapper">
        <Navbar onToggleSidebar={handleToggleSidebar} title={getPageTitle()} />
        
        <main className="app-shell-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
