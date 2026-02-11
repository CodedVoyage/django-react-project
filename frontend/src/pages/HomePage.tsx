import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Chip,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  MenuBook as GettingStartedIcon,
  Close as CloseIcon,
  PlayArrow as PlayIcon,
  Code as CodeIcon,
  Security as SecurityIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import { MuiLoginForm } from '../components/ui';
import { apiService } from '../services';
import { ApiData, User, UserRole } from '../types';

interface HomePageProps {
  isAuthenticated?: boolean;
  currentUser?: User | null;
  onLoginSuccess?: (token: string, userid: string) => void;
  onSwitchToRegister?: () => void;
}

const HomePage: React.FC<HomePageProps> = ({
  isAuthenticated = false,
  currentUser,
  onLoginSuccess,
  onSwitchToRegister
}) => {
  const [apiData, setApiData] = useState<ApiData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [isTestingPost, setIsTestingPost] = useState<boolean>(false);
  const [gettingStartedOpen, setGettingStartedOpen] = useState<boolean>(false);

  useEffect(() => {
    // Only fetch API data for admin users
    if (currentUser?.role === UserRole.ADMIN) {
      fetchApiData();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const fetchApiData = async () => {
    try {
      setLoading(true);
      const data = await apiService.getApiInfo();
      setApiData(data);
      setError('');
    } catch (err: any) {
      setError('Failed to connect to Django backend. Make sure the server is running on http://localhost:8000');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const testPost = async () => {
    try {
      setIsTestingPost(true);
      const response = await apiService.testPost({
        test: 'data from React',
        timestamp: new Date().toISOString(),
      });
      alert(`POST Test Successful! Response: ${response.message}`);
    } catch (err) {
      alert('POST Test Failed!');
      console.error('POST Error:', err);
    } finally {
      setIsTestingPost(false);
    }
  };

  const renderGettingStartedContent = () => (
    <Box sx={{ p: 3, height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h2" color="primary">
          Getting Started Guide
        </Typography>
        <IconButton onClick={() => setGettingStartedOpen(false)} color="inherit">
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto', pr: 1 }}>
        {/* Quick Start Section */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <PlayIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h5" component="h3">
              Quick Start
            </Typography>
          </Box>
          <Typography variant="body1" paragraph>
            Welcome to CodeWithAbhi - a modern role-based authentication system built with React and Django.
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText
                primary="1. Register a new account or login with existing credentials"
                secondary="New users start with 'User' role by default"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="2. Explore features based on your role"
                secondary="Each role has different access levels and capabilities"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="3. Test admin features with: admin / admin123"
                secondary="Full system access including user management"
              />
            </ListItem>
          </List>
        </Paper>

        {/* Architecture Section */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CodeIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h5" component="h3">
              Architecture Overview
            </Typography>
          </Box>
          <Typography variant="body1" paragraph>
            This application demonstrates modern web development practices:
          </Typography>
          <Box sx={{ pl: 2 }}>
            <Typography variant="body2" paragraph>
              <strong>Frontend (React + TypeScript):</strong>
            </Typography>
            <List dense sx={{ pl: 2, mb: 2 }}>
              <ListItem>• Material-UI (MUI) for component library</ListItem>
              <ListItem>• Axios for API communication</ListItem>
              <ListItem>• Role-based routing and access control</ListItem>
              <ListItem>• Token-based authentication</ListItem>
            </List>

            <Typography variant="body2" paragraph>
              <strong>Backend (Django + DRF):</strong>
            </Typography>
            <List dense sx={{ pl: 2 }}>
              <ListItem>• Django REST Framework for API endpoints</ListItem>
              <ListItem>• Token authentication system</ListItem>
              <ListItem>• Role-based permissions</ListItem>
              <ListItem>• CORS enabled for cross-origin requests</ListItem>
            </List>
          </Box>
        </Paper>

        {/* Authentication Section */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <SecurityIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h5" component="h3">
              Authentication System
            </Typography>
          </Box>
          <Typography variant="body1" paragraph>
            Our robust authentication system includes:
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom color="error.main">
              Admin Role
            </Typography>
            <Alert severity="error" sx={{ mb: 2 }}>
              Full system access - Use responsibly!
            </Alert>
            <List dense sx={{ pl: 2 }}>
              <ListItem>• View and manage all users</ListItem>
              <ListItem>• Change user roles (User ↔ Moderator ↔ Admin)</ListItem>
              <ListItem>• Activate/deactivate user accounts</ListItem>
              <ListItem>• Monitor system connection status</ListItem>
              <ListItem>• Access admin-only API endpoints</ListItem>
            </List>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom color="warning.main">
              Moderator Role
            </Typography>
            <Alert severity="warning" sx={{ mb: 2 }}>
              Content management capabilities
            </Alert>
            <List dense sx={{ pl: 2 }}>
              <ListItem>• Enhanced content management features</ListItem>
              <ListItem>• User moderation capabilities</ListItem>
              <ListItem>• Access to moderator dashboard</ListItem>
              <ListItem>• Content approval workflows (coming soon)</ListItem>
            </List>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom color="primary.main">
              User Role
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              Standard application access
            </Alert>
            <List dense sx={{ pl: 2 }}>
              <ListItem>• Access to all standard features</ListItem>
              <ListItem>• Personal profile management</ListItem>
              <ListItem>• Basic application functionality</ListItem>
              <ListItem>• Secure authentication and sessions</ListItem>
            </List>
          </Box>
        </Paper>

        {/* Features Section */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <DashboardIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h5" component="h3">
              Key Features
            </Typography>
          </Box>

          <Typography variant="body2" paragraph>
            <strong>🏗️ Microfrontend Architecture:</strong> Component-based structure with separated concerns
          </Typography>
          <Typography variant="body2" paragraph>
            <strong>🔐 Real Backend Integration:</strong> No mock data - actual Django API communication
          </Typography>
          <Typography variant="body2" paragraph>
            <strong>🎨 Material Design:</strong> Beautiful, responsive UI with custom theming
          </Typography>
          <Typography variant="body2" paragraph>
            <strong>📱 Responsive Design:</strong> Works seamlessly on desktop, tablet, and mobile
          </Typography>
          <Typography variant="body2" paragraph>
            <strong>⚡ TypeScript:</strong> Type-safe development with better IDE support
          </Typography>
          <Typography variant="body2" paragraph>
            <strong>🛡️ Security First:</strong> JWT tokens, CORS policies, and input validation
          </Typography>
        </Paper>

        {/* API Endpoints Section */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" component="h3" gutterBottom>
            Available API Endpoints
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Chip label="POST /api/auth/register/" variant="outlined" size="small" />
            <Chip label="POST /api/auth/login/" variant="outlined" size="small" />
            <Chip label="GET /api/auth/users/ (Admin Only)" variant="outlined" size="small" />
            <Chip label="POST /api/auth/change-role/ (Admin Only)" variant="outlined" size="small" />
            <Chip label="POST /api/auth/toggle-status/ (Admin Only)" variant="outlined" size="small" />
            <Chip label="GET /api/ (System Info)" variant="outlined" size="small" />
            <Chip label="POST /api/test/ (Test Endpoint)" variant="outlined" size="small" />
          </Box>
        </Paper>

        {/* Tips Section */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" component="h3" gutterBottom>
            Pro Tips
          </Typography>
          <Alert severity="success" sx={{ mb: 2 }}>
            <Typography variant="body2" paragraph>
              <strong>For Developers:</strong> Check the browser's Network tab to see real API requests being sent to Django backend.
            </Typography>
          </Alert>
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2" paragraph>
              <strong>Testing Roles:</strong> Create multiple accounts or use the admin panel to test different role behaviors.
            </Typography>
          </Alert>
          <Alert severity="warning">
            <Typography variant="body2">
              <strong>Backend Required:</strong> Make sure the Django server is running on http://localhost:8000 for full functionality.
            </Typography>
          </Alert>
        </Paper>
      </Box>
    </Box>
  );

  return (
    <Box sx={{
      minHeight: 'calc(100vh - 80px)',
      background: 'linear-gradient(135deg, #E9D8A6 0%, #94D2BD 100%)',
      py: 5,
    }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' }, alignItems: 'flex-start', pt: 5 }}>
          <Box sx={{ flex: !isAuthenticated ? '60%' : '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ textAlign: { xs: 'center', md: 'left' }, mb: 6 }}>
              <Typography variant="h2" component="h1" gutterBottom>
                CodeWithAbhi
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {isAuthenticated
                  ? `Welcome back, ${currentUser?.username}!`
                  : 'Role-based microfrontend authentication'
                }
              </Typography>
              {isAuthenticated && currentUser && (
                <Chip
                  label={`Role: ${currentUser.role.toUpperCase()}`}
                  color={currentUser.role === UserRole.ADMIN ? 'error' : currentUser.role === UserRole.MODERATOR ? 'warning' : 'primary'}
                  sx={{ mt: 1, mr: 2 }}
                />
              )}
              {/* Getting Started Button */}
              <Button
                variant="contained"
                startIcon={<GettingStartedIcon />}
                onClick={() => setGettingStartedOpen(true)}
                sx={{
                  mt: isAuthenticated ? 1 : 2,
                  backgroundColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                }}
              >
                Getting Started
              </Button>
            </Box>

            {isAuthenticated && (
              // Authenticated user dashboard content
              <Box>
                <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
                  {currentUser?.role === UserRole.ADMIN
                    ? 'Admin Dashboard - API Connection Status'
                    : `${currentUser?.role} Dashboard`
                  }
                  {currentUser?.role === UserRole.ADMIN && (
                    <Chip label="Admin Only" color="error" size="small" sx={{ ml: 2 }} />
                  )}
                </Typography>

                {currentUser?.role === UserRole.ADMIN ? (
                  // Admin-only API status content
                  <Box>
                    {/* Loading State */}
                    {loading && (
                      <Card sx={{ mb: 3 }}>
                        <CardContent sx={{ textAlign: 'center', py: 4 }}>
                          <CircularProgress size={48} sx={{ mb: 2 }} />
                          <Typography variant="h6">Checking connection status...</Typography>
                        </CardContent>
                      </Card>
                    )}

                    {/* Error State */}
                    {error && (
                      <Alert
                        severity="error"
                        icon={<ErrorIcon />}
                        sx={{ mb: 3 }}
                      >
                        <Typography variant="body1" component="div">
                          <strong>Connection Error</strong>
                        </Typography>
                        <Typography variant="body2">{error}</Typography>
                      </Alert>
                    )}

                    {/* Success State */}
                    {apiData && (
                      <Card sx={{ mb: 3 }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                            <Typography variant="h6">Django API Connection Successful!</Typography>
                          </Box>

                          <Box sx={{ display: 'flex', gap: 2, mb: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="body1">
                                <strong>Message:</strong> {apiData.message}
                              </Typography>
                            </Box>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="body1">
                                <strong>Status:</strong>
                                <Chip
                                  label={apiData.status}
                                  color="success"
                                  size="small"
                                  sx={{ ml: 1 }}
                                />
                              </Typography>
                            </Box>
                          </Box>

                          {apiData.endpoints && (
                            <Box>
                              <Typography variant="body1" component="div" gutterBottom>
                                <strong>Available Endpoints:</strong>
                              </Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {apiData.endpoints.map((endpoint, index) => (
                                  <Chip
                                    key={index}
                                    label={endpoint}
                                    variant="outlined"
                                    size="small"
                                  />
                                ))}
                              </Box>
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    )}

                    {/* Action Buttons */}
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Admin API Testing
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                          <Button
                            onClick={fetchApiData}
                            variant="outlined"
                            startIcon={loading ? <CircularProgress size={20} /> : <RefreshIcon />}
                            disabled={loading}
                            size="large"
                          >
                            Refresh Connection Status
                          </Button>

                          <Button
                            onClick={testPost}
                            variant="contained"
                            startIcon={isTestingPost ? <CircularProgress size={20} /> : <SendIcon />}
                            disabled={isTestingPost}
                            size="large"
                          >
                            Test Admin POST
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Box>
                ) : (
                  // Regular user content
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Welcome, {currentUser?.username}!
                      </Typography>
                      <Typography variant="body1" paragraph>
                        You are logged in as a <strong>{currentUser?.role}</strong>.
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        Role-based features:
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        {currentUser?.role === UserRole.MODERATOR ? (
                          <Alert severity="info">
                            As a Moderator, you have access to content management features (coming soon).
                          </Alert>
                        ) : (
                          <Alert severity="success">
                            As a User, you have access to all standard features of the application.
                          </Alert>
                        )}
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Your Account Details:</strong><br />
                        User ID: {currentUser?.userid}<br />
                        Email: {currentUser?.email}<br />
                        Mobile: {currentUser?.mobile}<br />
                        Member since: {new Date(currentUser?.createdAt || '').toLocaleDateString()}
                      </Typography>
                    </CardContent>
                  </Card>
                )}
              </Box>
            )}
          </Box>

          {/* Right Section - Login Form (only show if not authenticated) */}
          {!isAuthenticated && (
            <Box sx={{
              flex: { xs: '100%', md: '40%' },
              display: 'flex',
              flexDirection: 'column',
              position: { xs: 'static', md: 'sticky' },
              top: { md: '100px' },
              alignSelf: 'flex-start',
              height: 'fit-content'
            }}>
              <MuiLoginForm
                onLoginSuccess={onLoginSuccess}
                onSwitchToRegister={onSwitchToRegister}
              />
            </Box>
          )}
        </Box>
      </Container>

      {/* Getting Started Drawer */}
      <Drawer
        anchor="right"
        open={gettingStartedOpen}
        onClose={() => setGettingStartedOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100vw', sm: '90vw', md: '60vw', lg: '50vw' },
            maxWidth: '800px',
            height: '100vh',
            backgroundColor: 'background.default',
            borderLeft: '2px solid',
            borderColor: 'divider',
          },
        }}
      >
        {renderGettingStartedContent()}
      </Drawer>
    </Box>
  );
};

export default HomePage;