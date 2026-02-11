import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Header } from './components/layout';
import { LoginPage, HomePage, RegistrationPage, AdminPage } from './pages';
import { apiService } from './services';
import { PageType, User, UserRole } from './types';
import { muiTheme } from './styles';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is already authenticated on app load
    const token = apiService.getToken();
    const user = apiService.getCurrentUser();

    if (token && user) {
      setIsAuthenticated(true);
      setCurrentUser(user);
    }
  }, []);

  const handlePageChange = (page: PageType) => {
    setCurrentPage(page);
  };

  const handleLoginSuccess = (token: string, userid: string) => {
    const user = apiService.getCurrentUser();
    if (user) {
      setIsAuthenticated(true);
      setCurrentUser(user);
      setCurrentPage('home');
    }
  };

  const handleRegistrationSuccess = () => {
    // Redirect to login page after successful registration
    setCurrentPage('login');
  };

  const handleSwitchToLogin = () => {
    setCurrentPage('login');
  };

  const handleSwitchToRegister = () => {
    setCurrentPage('register');
  };

  const handleLogout = () => {
    apiService.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentPage('home');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'login':
        return (
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            onSwitchToRegister={handleSwitchToRegister}
          />
        );
      case 'register':
        return (
          <RegistrationPage
            onRegistrationSuccess={handleRegistrationSuccess}
            onSwitchToLogin={handleSwitchToLogin}
          />
        );
      case 'admin':
        if (!currentUser || currentUser.role !== UserRole.ADMIN) {
          // Redirect non-admin users to home
          setCurrentPage('home');
          return (
            <HomePage
              isAuthenticated={isAuthenticated}
              currentUser={currentUser}
              onLoginSuccess={handleLoginSuccess}
              onSwitchToRegister={handleSwitchToRegister}
            />
          );
        }
        return <AdminPage currentUser={currentUser} />;
      case 'home':
      default:
        return (
          <HomePage
            isAuthenticated={isAuthenticated}
            currentUser={currentUser}
            onLoginSuccess={handleLoginSuccess}
            onSwitchToRegister={handleSwitchToRegister}
          />
        );
    }
  };

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <div className="App">
        <Header
          currentPage={currentPage}
          onPageChange={handlePageChange}
          isAuthenticated={isAuthenticated}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
        <main className="App-main">
          {renderCurrentPage()}
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
