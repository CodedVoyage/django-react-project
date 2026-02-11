import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { AccountCircle as LoginIcon } from '@mui/icons-material';
import { apiService } from '../../services';
import { LoginCredentials } from '../../types';

interface MuiLoginFormProps {
  onLoginSuccess?: (token: string, userid: string) => void;
  onSwitchToRegister?: () => void;
  title?: string;
  subtitle?: string;
}

const MuiLoginForm: React.FC<MuiLoginFormProps> = ({
  onLoginSuccess,
  onSwitchToRegister,
  title = "Welcome Back",
  subtitle = "Please sign in to your account"
}) => {
  const [formData, setFormData] = useState<LoginCredentials>({
    userid: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<LoginCredentials>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginCredentials> = {};

    if (!formData.userid.trim()) {
      newErrors.userid = 'User ID is required';
    } else if (formData.userid.trim().length < 3) {
      newErrors.userid = 'User ID must be at least 3 characters';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof LoginCredentials) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    // Clear submit error
    if (submitError) {
      setSubmitError('');
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError('');

      const response = await apiService.login(formData);

      if (response.success && response.token && response.user) {
        if (onLoginSuccess) {
          onLoginSuccess(response.token, response.user.userid);
        }
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      setSubmitError('Login failed. Please check your credentials and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card sx={{ maxWidth: 350, width: '100%', mx: 'auto' }}>
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <LoginIcon
            sx={{
              fontSize: 48,
              color: 'primary.main',
              mb: 1
            }}
          />
          <Typography variant="h4" component="h1" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        </Box>

        {/* Error Alert */}
        {submitError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {submitError}
          </Alert>
        )}

        {/* Form */}
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label="User ID"
            name="userid"
            type="text"
            value={formData.userid}
            onChange={handleInputChange('userid')}
            error={!!errors.userid}
            helperText={errors.userid}
            required
            disabled={isSubmitting}
            fullWidth
            placeholder="Enter your user ID"
          />

          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange('password')}
            error={!!errors.password}
            helperText={errors.password}
            required
            disabled={isSubmitting}
            fullWidth
            placeholder="Enter your password"
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isSubmitting}
            fullWidth
            startIcon={isSubmitting ? <CircularProgress size={20} /> : undefined}
            sx={{ mt: 2, py: 1.5 }}
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MuiLoginForm;