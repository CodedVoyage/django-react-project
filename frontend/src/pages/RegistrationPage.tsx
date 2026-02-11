import React, { useState } from 'react';
import { Box, Container, Alert, Snackbar } from '@mui/material';
import { MuiRegistrationForm } from '../components/ui';

interface RegistrationPageProps {
  onRegistrationSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

const RegistrationPage: React.FC<RegistrationPageProps> = ({
  onRegistrationSuccess,
  onSwitchToLogin
}) => {
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleRegistrationSuccess = (message: string) => {
    setSuccessMessage(message);
    onRegistrationSuccess?.();
  };

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 80px)',
        background: 'linear-gradient(135deg, #0A9396 0%, #94D2BD 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // py: { xs: 4, md: 6 },
      }}
    >
      <Container maxWidth="md">  {/* ← Changed from "sm" to "md" — this is key */}

        <MuiRegistrationForm
          onRegistrationSuccess={handleRegistrationSuccess}
          onSwitchToLogin={onSwitchToLogin}
          title="Create Account"
          subtitle="Join us today"
        />

        <Snackbar
          open={!!successMessage}
          autoHideDuration={6000}
          onClose={() => setSuccessMessage('')}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setSuccessMessage('')}
            severity="success"
            variant="filled"
            sx={{ width: '100%' }}
          >
            {successMessage}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default RegistrationPage;