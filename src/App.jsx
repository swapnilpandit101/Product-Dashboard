import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { AppRouter } from './routes/AppRouter';
import './App.css';

/**
 * ARCHITECTURAL DECISION: Root Application Component
 * 
 * WHY THIS HIERARCHY:
 * 1. BrowserRouter: Supplies client-side URL history & SPA routing context.
 * 2. ToastProvider: Supplies application-wide toast notification triggers and floating container.
 * 3. AuthProvider: Supplies reactive session status & automatic 401 handling.
 * 4. AppRouter: Manages route boundaries and protected AppShell rendering.
 */
function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <div className="app-root">
            <AppRouter />
          </div>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
