import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { MuiLoginForm } from '../components/ui';

interface LoginPageProps {
  onLoginSuccess?: (token: string, userid: string) => void;
  onSwitchToRegister?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onSwitchToRegister }) => {
  return (
    <Box sx={{
      minHeight: 'calc(100vh - 80px)',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: 5,
    }}>
      <Container maxWidth="sm">
        <MuiLoginForm
          onLoginSuccess={onLoginSuccess}
          onSwitchToRegister={onSwitchToRegister}
          title="Welcome Back"
          subtitle="Please sign in to your account"
        />
      </Container>
    </Box>
  );
};

export default LoginPage;