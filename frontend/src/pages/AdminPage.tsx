import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
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
  TextField,
  InputAdornment,
  Tooltip,
  Tab,
  Tabs,
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
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Lock as LockIcon,
  People as PeopleIcon,
  Cable as ConnectionIcon,
  Storage as ResourceIcon,
  Dashboard as DashboardIcon,
  Memory as MemoryIcon,
  Speed as SpeedIcon,
  CloudUpload as CloudUploadIcon,
} from '@mui/icons-material';
import Button from '../components/ui/Button';
import { apiService } from '../services';
import { User, UserRole, ApiData } from '../types';

// Extended User interface for admin view
interface AdminUser extends User {
  password?: string;
}

interface PasswordCellProps {
  password: string;
  userId: string;
}

// Tab Panel Component
const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};
const PasswordCell: React.FC<PasswordCellProps> = ({ password, userId }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
    setShowPassword(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setTimeout(() => setShowPassword(false), 100); // Small delay for better UX
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const maskedPassword = '*'.repeat(password.length);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 300 }}>
      <TextField
        size="small"
        value={showPassword ? password : maskedPassword}
        onFocus={handleFocus}
        onBlur={handleBlur}
        InputProps={{
          readOnly: true,
          style: {
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            cursor: 'pointer',
          },
          startAdornment: (
            <InputAdornment position="start">
              <LockIcon sx={{ color: 'text.secondary', fontSize: 16 }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <Tooltip title={showPassword ? 'Hide password' : 'Show password'}>
                <IconButton
                  onClick={togglePasswordVisibility}
                  edge="end"
                  size="small"
                  sx={{ p: 0.5 }}
                >
                  {showPassword ? (
                    <VisibilityOffIcon fontSize="small" />
                  ) : (
                    <VisibilityIcon fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
            </InputAdornment>
          ),
        }}
        sx={{
          width: '100%',
          minWidth: 250,
          '& .MuiOutlinedInput-root': {
            backgroundColor: isFocused ? 'action.hover' : 'background.default',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
            '& input': {
              padding: '8px 4px',
              textAlign: 'left',
            },
          },
          '& .MuiInputBase-input': {
            cursor: 'pointer',
            userSelect: showPassword ? 'text' : 'none',
          },
        }}
      />
    </Box>
  );
};

interface AdminPageProps {
  currentUser: User;
}

type AdminTab = 'users' | 'connections' | 'resources';

interface TabPanelProps {
  children?: React.ReactNode;
  index: AdminTab;
  value: AdminTab;
}

// Password cell component with masking functionality
const AdminPage: React.FC<AdminPageProps> = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [updating, setUpdating] = useState<string>(''); // ID of user being updated
  const [apiData, setApiData] = useState<ApiData | null>(null);
  const [apiLoading, setApiLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string>('');
  const [isTestingPost, setIsTestingPost] = useState<boolean>(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: AdminTab) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    fetchUsers();
    // Only fetch API data if we're on connections tab
    if (activeTab === 'connections') {
      fetchApiData();
    }
  }, [activeTab]);

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
            Admin Dashboard
          </Typography>
        </Box>

        {/* Navigation Tabs */}
        <Card sx={{ mb: 3 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange} 
              aria-label="admin dashboard tabs"
              variant="fullWidth"
              sx={{
                '& .MuiTab-root': {
                  minHeight: 60,
                  fontSize: '0.95rem',
                  fontWeight: 500,
                },
              }}
            >
              <Tab 
                label="User Management" 
                value="users" 
                icon={<PeopleIcon />} 
                iconPosition="start"
                sx={{ 
                  color: activeTab === 'users' ? 'primary.main' : 'text.secondary',
                  fontWeight: activeTab === 'users' ? 600 : 400
                }}
              />
              <Tab 
                label="Connection Management" 
                value="connections" 
                icon={<ConnectionIcon />} 
                iconPosition="start"
                sx={{ 
                  color: activeTab === 'connections' ? 'secondary.main' : 'text.secondary',
                  fontWeight: activeTab === 'connections' ? 600 : 400
                }}
              />
              <Tab 
                label="Resource Management" 
                value="resources" 
                icon={<ResourceIcon />} 
                iconPosition="start"
                sx={{ 
                  color: activeTab === 'resources' ? 'success.main' : 'text.secondary',
                  fontWeight: activeTab === 'resources' ? 600 : 400
                }}
              />
            </Tabs>
          </Box>
        </Card>

        {/* Tab Content */}
        <TabPanel value={activeTab} index="users">
          {/* User Management Section */}
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" component="h2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PeopleIcon color="primary" />
                  User Management
                </Typography>
                <Button
                  onClick={fetchUsers}
                  variant="outlined-primary"
                  startIcon={<RefreshIcon />}
                  disabled={loading}
                  size="small"
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
                <TableContainer 
                  component={Paper} 
                  sx={{ 
                    mt: 2, 
                    borderRadius: 2,
                    overflow: 'auto',
                    maxHeight: '70vh',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <Table sx={{ minWidth: 1400 }} stickyHeader>
                    <TableHead>
                      <TableRow 
                        sx={{ 
                          backgroundColor: 'primary.main',
                          '& .MuiTableCell-head': {
                            color: 'white',
                            fontWeight: 600,
                            fontSize: '0.95rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                          }
                        }}
                      >
                        <TableCell sx={{ minWidth: 120 }}>User ID</TableCell>
                        <TableCell sx={{ minWidth: 150 }}>Username</TableCell>
                        <TableCell sx={{ minWidth: 200 }}>Email</TableCell>
                        <TableCell sx={{ minWidth: 140 }}>Mobile</TableCell>
                        <TableCell sx={{ minWidth: 300 }}>Password</TableCell>
                        <TableCell sx={{ minWidth: 120 }}>Role</TableCell>
                        <TableCell sx={{ minWidth: 100 }}>Status</TableCell>
                        <TableCell sx={{ minWidth: 120 }}>Created</TableCell>
                        <TableCell align="center" sx={{ minWidth: 100 }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users.map((user, index) => (
                        <TableRow 
                          key={user.id}
                          sx={{
                            backgroundColor: index % 2 === 0 ? 'background.default' : 'action.hover',
                            '&:hover': {
                              backgroundColor: 'action.selected',
                              transform: 'scale(1.001)',
                              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                            },
                            transition: 'all 0.2s ease-in-out',
                          }}
                        >
                          <TableCell sx={{ minWidth: 120 }}>
                            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 500 }}>
                              {user.userid}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ minWidth: 150 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {getRoleIcon(user.role)}
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {user.username}
                              </Typography>
                              {user.id === currentUser.id && (
                                <Chip 
                                  label="You" 
                                  color="info" 
                                  size="small" 
                                  sx={{ fontSize: '0.7rem', height: '20px' }}
                                />
                              )}
                            </Box>
                          </TableCell>
                          <TableCell sx={{ minWidth: 200 }}>
                            <Typography variant="body2">{user.email}</Typography>
                          </TableCell>
                          <TableCell sx={{ minWidth: 140 }}>
                            <Typography variant="body2">{user.mobile}</Typography>
                          </TableCell>
                          <TableCell sx={{ minWidth: 300 }}>
                            <PasswordCell 
                              password={(user as any).password || '••••••••'} 
                              userId={user.id} 
                            />
                          </TableCell>
                          <TableCell sx={{ minWidth: 120 }}>
                            <FormControl size="small" disabled={updating === user.id}>
                              <Select
                                value={user.role}
                                onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                                sx={{
                                  fontSize: '0.875rem',
                                  '& .MuiSelect-select': {
                                    py: 1,
                                  }
                                }}
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
                              sx={{
                                fontWeight: 500,
                                minWidth: 70,
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              {new Date(user.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Tooltip title={user.isActive ? 'Deactivate User' : 'Activate User'}>
                              <IconButton
                                onClick={() => handleToggleStatus(user.id)}
                                disabled={updating === user.id || user.id === currentUser.id}
                                color={user.isActive ? 'error' : 'success'}
                                size="small"
                                sx={{
                                  '&:hover': {
                                    transform: 'scale(1.1)',
                                  },
                                  transition: 'transform 0.2s ease-in-out',
                                }}
                              >
                                {updating === user.id ? (
                                  <CircularProgress size={20} />
                                ) : user.isActive ? (
                                  <CloseIcon />
                                ) : (
                                  <CheckIcon />
                                )}
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </TabPanel>

        <TabPanel value={activeTab} index="connections">
          {/* Connection Management Section */}
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ConnectionIcon color="secondary" />
                Connection Management
              </Typography>

              <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                Test and monitor system API connections.
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
                <Button
                  onClick={fetchApiData}
                  variant="outlined-primary"
                  startIcon={apiLoading ? <CircularProgress size={16} /> : <RefreshIcon />}
                  disabled={apiLoading}
                  size="small"
                >
                  Test API Connection
                </Button>

                <Button
                  onClick={testPost}
                  variant="primary"
                  startIcon={isTestingPost ? <CircularProgress size={16} /> : <SendIcon />}
                  disabled={isTestingPost}
                  size="small"
                >
                  Test POST Request
                </Button>
              </Box>

              {apiLoading && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  Testing connection to backend API...
                </Alert>
              )}

              {apiError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  <strong>Connection Failed:</strong> {apiError}
                </Alert>
              )}

              {apiData && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  <strong>Connection Successful!</strong> Status: {apiData.status}
                  {apiData.endpoints && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" gutterBottom>Available endpoints:</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {apiData.endpoints.map((endpoint, index) => (
                          <Chip key={index} label={endpoint} variant="outlined" size="small" />
                        ))}
                      </Box>
                    </Box>
                  )}
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabPanel>

        <TabPanel value={activeTab} index="resources">
          {/* Resource Management Section */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              <Card sx={{ flex: '1 1 300px', minWidth: 300 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MemoryIcon color="primary" />
                    Memory Usage
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CircularProgress variant="determinate" value={75} size={60} />
                    <Box>
                      <Typography variant="h4">75%</Typography>
                      <Typography variant="body2" color="text.secondary">8GB / 16GB</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            
              <Card sx={{ flex: '1 1 300px', minWidth: 300 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SpeedIcon color="secondary" />
                    CPU Usage
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CircularProgress variant="determinate" value={45} size={60} color="secondary" />
                    <Box>
                      <Typography variant="h4">45%</Typography>
                      <Typography variant="body2" color="text.secondary">4 cores active</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            
              <Card sx={{ flex: '1 1 300px', minWidth: 300 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CloudUploadIcon color="success" />
                    Storage
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CircularProgress variant="determinate" value={60} size={60} color="success" />
                    <Box>
                      <Typography variant="h4">60%</Typography>
                      <Typography variant="body2" color="text.secondary">120GB / 200GB</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
            
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DashboardIcon color="primary" />
                  System Resources Overview
                </Typography>
                <Alert severity="info" sx={{ mt: 2 }}>
                  Resource management features are coming soon. This section will include:
                  <ul>
                    <li>Database management and optimization</li>
                    <li>File storage monitoring and cleanup</li>
                    <li>Cache management</li>
                    <li>System performance metrics</li>
                    <li>Backup and restore operations</li>
                  </ul>
                </Alert>
                
                <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                  <Button variant="outlined-primary" size="small" disabled>
                    Optimize Database
                  </Button>
                  <Button variant="outlined-secondary" size="small" disabled>
                    Clear Cache
                  </Button>
                  <Button variant="outlined-success" size="small" disabled>
                    Run Backup
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </TabPanel>
      </Container>
    </Box>
  );
};

export default AdminPage;