import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppRouter } from './routes/AppRouter';
import './App.css';

/**
 * ARCHITECTURAL DECISION: Root Application Component
 * 
 * WHY THIS HIERARCHY:
 * 1. BrowserRouter: Supplies client-side URL history & SPA routing context.
 * 2. AuthProvider: Supplies reactive session status & automatic 401 handling.
 * 3. AppRouter: Manages route boundaries and protected AppShell rendering.
 */
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app-root">
          <AppRouter />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
