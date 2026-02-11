import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  Chip,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Home as HomeIcon,
  AccountCircle as LoginIcon,
  PersonAdd as RegisterIcon,
  AdminPanelSettings as AdminIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import { PageType, User, UserRole } from '../../types';

interface HeaderProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
  isAuthenticated: boolean;
  currentUser?: User | null;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  currentPage,
  onPageChange,
  isAuthenticated,
  currentUser,
  onLogout,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showPersonalDetails, setShowPersonalDetails] = useState(false);
  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
    setShowPersonalDetails(false);
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    onLogout?.();
  };

  const handlePersonalDetailsClick = () => {
    setShowPersonalDetails(!showPersonalDetails);
  };
  const getRoleColor = (role?: UserRole): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
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
    <AppBar
      position="sticky"
      elevation={2}
      sx={{
        backgroundColor: 'background.paper',
        color: 'text.primary',
        borderBottom: '2px solid',
        borderColor: 'divider',
        boxShadow: '0 2px 4px rgba(0, 18, 25, 0.1)',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: 'space-between', py: 0.5 }}>
          {/* Brand */}
          <Typography
            variant="h5"
            component="h1"
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              cursor: 'pointer',
            }}
            onClick={() => onPageChange('home')}
          >
           
          </Typography>

          {/* Navigation */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Home">
              <IconButton
                onClick={() => onPageChange('home')}
                color={currentPage === 'home' ? 'primary' : 'default'}
                sx={{
                  backgroundColor: currentPage === 'home' ? 'primary.light' : 'transparent',
                  '&:hover': {
                    backgroundColor: currentPage === 'home' ? 'primary.light' : 'action.hover',
                  },
                }}
              >
                <HomeIcon />
              </IconButton>
            </Tooltip>

            {!isAuthenticated ? (
              <>
                <Tooltip title="Register">
                  <IconButton
                    onClick={() => onPageChange('register')}
                    color={currentPage === 'register' ? 'secondary' : 'default'}
                    sx={{
                      backgroundColor: currentPage === 'register' ? 'secondary.light' : 'transparent',
                      '&:hover': {
                        backgroundColor: currentPage === 'register' ? 'secondary.light' : 'action.hover',
                      },
                    }}
                  >
                    <RegisterIcon />
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {/* Admin Panel Icon */}
                {currentUser?.role === UserRole.ADMIN && (
                  <Tooltip title="Admin Panel">
                    <IconButton
                      onClick={() => onPageChange('admin')}
                      color={currentPage === 'admin' ? 'error' : 'default'}
                      sx={{
                        backgroundColor: currentPage === 'admin' ? 'error.light' : 'transparent',
                        '&:hover': {
                          backgroundColor: currentPage === 'admin' ? 'error.light' : 'action.hover',
                        },
                      }}
                    >
                      <AdminIcon />
                    </IconButton>
                  </Tooltip>
                )}

                {/* User Profile with Dropdown */}
                <Box 
                  sx={{ 
                    position: 'relative',
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    cursor: 'pointer',
                    padding: 0.5,
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                  onClick={handleProfileMenuOpen}
                  onMouseEnter={handleProfileMenuOpen}
                >
                  <Tooltip title={currentUser?.username || 'Profile'}>
                    <Avatar
                      src={currentUser?.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.username}`}
                      alt={currentUser?.username || 'User'}
                      sx={{
                        width: 32,
                        height: 32,
                        border: '2px solid',
                        borderColor: 'primary.main',
                      }}
                    />
                  </Tooltip>
                  <Chip 
                    label={currentUser?.role || UserRole.USER} 
                    color={getRoleColor(currentUser?.role)}
                    size="small"
                    sx={{ fontSize: '0.7rem', height: '20px' }}
                  />
                </Box>

                {/* Profile Dropdown Menu */}
                <Menu
                  anchorEl={anchorEl}
                  open={isMenuOpen}
                  onClose={handleProfileMenuClose}
                  onMouseLeave={handleProfileMenuClose}
                  MenuListProps={{
                    'aria-labelledby': 'profile-button',
                    onMouseLeave: handleProfileMenuClose,
                  }}
                  PaperProps={{
                    elevation: 8,
                    sx: {
                      mt: 1,
                      minWidth: 250,
                      '& .MuiMenuItem-root': {
                        px: 2,
                        py: 1,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  {/* User Info Header */}
                  <Box sx={{ px: 2, py: 1.5, backgroundColor: 'grey.50' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {currentUser?.username}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {currentUser?.email}
                    </Typography>
                    <Box sx={{ mt: 0.5 }}>
                      <Chip 
                        label={currentUser?.role || UserRole.USER} 
                        color={getRoleColor(currentUser?.role)}
                        size="small"
                      />
                    </Box>
                  </Box>
                  
                  <Divider />
                  
                  {/* Personal Details Toggle */}
                  <MenuItem onClick={handlePersonalDetailsClick}>
                    <ListItemIcon>
                      <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Personal Details" />
                  </MenuItem>
                  
                  {/* Personal Details - Show only when clicked */}
                  {showPersonalDetails && (
                    <>
                      <Box sx={{ px: 2, py: 1, backgroundColor: 'grey.25' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>
                          Account Information
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <PersonIcon fontSize="small" color="action" />
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Username
                            </Typography>
                            <Typography variant="body2">
                              {currentUser?.username}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <EmailIcon fontSize="small" color="action" />
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Email
                            </Typography>
                            <Typography variant="body2">
                              {currentUser?.email || 'Not provided'}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PhoneIcon fontSize="small" color="action" />
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Mobile
                            </Typography>
                            <Typography variant="body2">
                              {currentUser?.mobile || 'Not provided'}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      <Divider />
                    </>
                  )}
                  
                  {/* Logout */}
                  <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" sx={{ color: 'error.main' }} />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                  </MenuItem>
                </Menu>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;