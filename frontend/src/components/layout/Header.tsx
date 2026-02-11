import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  Chip,
} from '@mui/material';
import {
  Home as HomeIcon,
  AccountCircle as LoginIcon,
  PersonAdd as RegisterIcon,
  AdminPanelSettings as AdminIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { PageType, User, UserRole } from '../../types';
import Button from '../ui/Button';

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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              onClick={() => onPageChange('home')}
              variant={currentPage === 'home' ? 'primary' : 'outlined-primary'}
              startIcon={<HomeIcon />}
              size="small"
            >
              Home
            </Button>

            {!isAuthenticated ? (
              <>
                <Button
                  onClick={() => onPageChange('register')}
                  variant={currentPage === 'register' ? 'secondary' : 'outlined-secondary'}
                  startIcon={<RegisterIcon />}
                  size="small"
                >
                  Register
                </Button>
              </>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {/* Admin Panel Button */}
                {currentUser?.role === UserRole.ADMIN && (
                  <Button
                    onClick={() => onPageChange('admin')}
                    variant={currentPage === 'admin' ? 'danger' : 'outlined-danger'}
                    startIcon={<AdminIcon />}
                    size="small"
                  >
                    Admin Panel
                  </Button>
                )}

                {/* User Info */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {currentUser?.username || 'User'}
                  </Typography>
                  </Box>
                  <Box
                  component="img"
                  src={currentUser?.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.username}`}
                  alt={currentUser?.username || 'User'}
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid',
                    borderColor: 'primary.main',
                  }}
                  />
                </Box>

                <Button
                  onClick={onLogout}
                  variant="danger"
                  startIcon={<LogoutIcon />}
                  size="small"
                >
                  Logout
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;