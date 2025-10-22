import React from 'react';
import { HashRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { startServer } from './server';

import Header from './components/layout/Header';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import BookDetailPage from './pages/BookDetailPage';
import ReaderPage from './pages/ReaderPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ManageBooksPage from './pages/admin/ManageBooksPage';
import ManageAuthorsPage from './pages/admin/ManageAuthorsPage';

// Start the mock server when the app loads
startServer();

const AppLayout: React.FC = () => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-grow">
      <Outlet />
    </main>
  </div>
);

const PrivateRoute: React.FC = () => {
    const { user } = useAuth();
    return user ? <Outlet /> : <Navigate to="/login" replace />;
};

const AdminRoute: React.FC = () => {
    const { isAdmin } = useAuth();
    return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};


const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/book/:id" element={<BookDetailPage />} />
            
            <Route element={<PrivateRoute />}>
                <Route path="/profile" element={<ProfilePage />} />
            </Route>

             <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminDashboardPage />} />
                <Route path="/admin/books" element={<ManageBooksPage />} />
                <Route path="/admin/authors" element={<ManageAuthorsPage />} />
            </Route>

          </Route>
          
          <Route element={<PrivateRoute />}>
             <Route path="/read/:id" element={<ReaderPage />} />
          </Route>
          
          {/* Routes without Header */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
