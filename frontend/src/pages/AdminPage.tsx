import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  IconButton,
  Divider,
} from '@mui/material';
import {
  AdminPanelSettings as AdminIcon,
  Person as UserIcon,
  SupervisorAccount as ModeratorIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { apiService } from '../services';
import { User, UserRole, ApiData } from '../types';

interface AdminPageProps {
  currentUser: User;
}

const AdminPage: React.FC<AdminPageProps> = ({ currentUser }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [updating, setUpdating] = useState<string>(''); // ID of user being updated
  const [apiData, setApiData] = useState<ApiData | null>(null);
  const [apiLoading, setApiLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string>('');
  const [isTestingPost, setIsTestingPost] = useState<boolean>(false);

  useEffect(() => {
    fetchUsers();
    fetchApiData();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersList = await apiService.getAllUsers();
      setUsers(usersList);
      setError('');
    } catch (err: any) {
      console.error('Failed to fetch users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchApiData = async () => {
    try {
      setApiLoading(true);
      const data = await apiService.getApiInfo();
      setApiData(data);
      setApiError('');
    } catch (err: any) {
      setApiError('Failed to connect to Django backend. Make sure the server is running on http://localhost:8000');
      console.error('API Error:', err);
    } finally {
      setApiLoading(false);
    }
  };

  const testPost = async () => {
    try {
      setIsTestingPost(true);
      const response = await apiService.testPost({
        test: 'data from Admin Panel',
        timestamp: new Date().toISOString(),
        admin: currentUser.username,
      });
      alert(`POST Test Successful! Response: ${response.message}`);
    } catch (err) {
      alert('POST Test Failed!');
      console.error('POST Error:', err);
    } finally {
      setIsTestingPost(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      setUpdating(userId);
      await apiService.changeUserRole({ userId, newRole });

      // Update local state
      setUsers(prev =>
        prev.map(user =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );

      alert('Role updated successfully!');
    } catch (err: any) {
      alert(`Failed to update role: ${err.message}`);
    } finally {
      setUpdating('');
    }
  };

  const handleToggleStatus = async (userId: string) => {
    try {
      setUpdating(userId);
      await apiService.toggleUserStatus(userId);

      // Update local state
      setUsers(prev =>
        prev.map(user =>
          user.id === userId ? { ...user, isActive: !user.isActive } : user
        )
      );

      alert('User status updated successfully!');
    } catch (err: any) {
      alert(`Failed to update status: ${err.message}`);
    } finally {
      setUpdating('');
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return <AdminIcon color="error" />;
      case UserRole.MODERATOR:
        return <ModeratorIcon color="warning" />;
      case UserRole.USER:
      default:
        return <UserIcon color="primary" />;
    }
  };

  const getRoleColor = (role: UserRole): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    switch (role) {
      case UserRole.ADMIN:
        return "error";
      case UserRole.MODERATOR:
        return "warning";
      case UserRole.USER:
      default:
        return "primary";
    }
  };

  return (
    <Box sx={{
      minHeight: 'calc(100vh - 80px)',
      background: 'linear-gradient(135deg, #E9D8A6 0%, #94D2BD 100%)',
      py: 4,
    }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
            <AdminIcon sx={{ fontSize: 48, color: 'primary.main' }} />
            Admin Panel
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Manage users and monitor system status
          </Typography>
        </Box>

        {/* Connection Status - Admin Only */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircleIcon color="primary" />
              System Connection Status
              <Chip label="Admin Only" color="error" size="small" />
            </Typography>

            {apiLoading && (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <CircularProgress size={48} sx={{ mb: 2 }} />
                <Typography variant="h6">Checking connection...</Typography>
              </Box>
            )}

            {apiError && (
              <Alert
                severity="error"
                icon={<ErrorIcon />}
                sx={{ mb: 3 }}
                action={
                  <Button color="inherit" size="small" onClick={fetchApiData} disabled={apiLoading}>
                    Retry
                  </Button>
                }
              >
                <Typography variant="body1" component="div">
                  <strong>Connection Error</strong>
                </Typography>
                <Typography variant="body2">{apiError}</Typography>
              </Alert>
            )}

            {apiData && (
              <Box>
                <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mb: 3 }}>
                  <Typography variant="body1" component="div">
                    <strong>Django API Connection Successful!</strong>
                  </Typography>
                  <Typography variant="body2">
                    Status: {apiData.status} | Message: {apiData.message}
                  </Typography>
                </Alert>

                {apiData.endpoints && (
                  <Box sx={{ mb: 3 }}>
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

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    onClick={fetchApiData}
                    variant="outlined"
                    startIcon={apiLoading ? <CircularProgress size={20} /> : <RefreshIcon />}
                    disabled={apiLoading}
                  >
                    Refresh Status
                  </Button>

                  <Button
                    onClick={testPost}
                    variant="contained"
                    startIcon={isTestingPost ? <CircularProgress size={20} /> : <SendIcon />}
                    disabled={isTestingPost}
                  >
                    Test Admin POST
                  </Button>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>

        <Divider sx={{ my: 4 }} />

        {/* User Management */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" component="h2">
                User Management
              </Typography>
              <Button
                onClick={fetchUsers}
                variant="outlined"
                startIcon={<RefreshIcon />}
                disabled={loading}
              >
                Refresh Users
              </Button>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {loading ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CircularProgress size={48} />
                <Typography variant="h6" sx={{ mt: 2 }}>Loading users...</Typography>
              </Box>
            ) : (
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>User ID</TableCell>
                      <TableCell>Username</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Mobile</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Created</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.userid}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {getRoleIcon(user.role)}
                            {user.username}
                            {user.id === currentUser.id && (
                              <Chip label="You" color="info" size="small" />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.mobile}</TableCell>
                        <TableCell>
                          <FormControl size="small" disabled={updating === user.id}>
                            <Select
                              value={user.role}
                              onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                            >
                              <MenuItem value={UserRole.USER}>User</MenuItem>
                              <MenuItem value={UserRole.MODERATOR}>Moderator</MenuItem>
                              <MenuItem value={UserRole.ADMIN}>Admin</MenuItem>
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={user.isActive ? 'Active' : 'Inactive'}
                            color={user.isActive ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => handleToggleStatus(user.id)}
                            disabled={updating === user.id || user.id === currentUser.id}
                            color={user.isActive ? 'error' : 'success'}
                            size="small"
                          >
                            {updating === user.id ? (
                              <CircularProgress size={20} />
                            ) : user.isActive ? (
                              <CloseIcon />
                            ) : (
                              <CheckIcon />
                            )}
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default AdminPage;