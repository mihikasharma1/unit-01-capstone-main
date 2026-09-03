import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import LandingPage from './pages/LandingPage/LandingPage';
import LoginPage from './pages/LoginPage/LoginPage';
import SignupPage from './pages/SignupPage/SignupPage';
import BrowseRecipesPage from './pages/BrowseRecipesPage/BrowseRecipesPage';
import RecipeDetailPage from './pages/RecipeDetailPage/RecipeDetailPage';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import NewRecipePage from './pages/NewRecipePage/NewRecipePage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar />

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/recipes" element={<BrowseRecipesPage />} />
          <Route path="/recipes/:id" element={<RecipeDetailPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/new"
            element={
              <ProtectedRoute>
                <NewRecipePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/:id/edit"
            element={
              <ProtectedRoute>
                <NewRecipePage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
