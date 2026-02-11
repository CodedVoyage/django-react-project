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
  InputAdornment,
} from '@mui/material';
import {
  PersonAdd as RegisterIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { apiService } from '../../services';
import { RegistrationCredentials } from '../../types';

interface MuiRegistrationFormProps {
  onRegistrationSuccess?: (message: string) => void;
  onSwitchToLogin?: () => void;
  title?: string;
  subtitle?: string;
}

const MuiRegistrationForm: React.FC<MuiRegistrationFormProps> = ({
  onRegistrationSuccess,
  onSwitchToLogin,
  title = "Create Account",
  subtitle = "Join us today"
}) => {
  const [formData, setFormData] = useState<RegistrationCredentials>({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    mobile: '',
  });
  const [errors, setErrors] = useState<Partial<RegistrationCredentials>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');

  const validateForm = (): boolean => {
    const newErrors: Partial<RegistrationCredentials> = {};

    if (!formData.username.trim()) newErrors.username = 'Username is required';
    else if (formData.username.trim().length < 3) newErrors.username = 'Username must be at least 3 characters';
    else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) newErrors.username = 'Username can only contain letters, numbers, and underscores';

    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email address';

    if (!formData.mobile.trim()) newErrors.mobile = 'Mobile number is required';
    else if (!/^\+?[\d\s\-\(\)]{10,15}$/.test(formData.mobile)) newErrors.mobile = 'Please enter a valid mobile number (10-15 digits)';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password))
      newErrors.password = 'Password must contain uppercase, lowercase, and number';

    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof RegistrationCredentials) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
    if (submitError) setSubmitError('');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await apiService.register(formData);
      if (response.success) {
        onRegistrationSuccess?.(response.message);
        setFormData({
          username: '',
          password: '',
          confirmPassword: '',
          email: '',
          mobile: '',
        });
      }
    } catch (error: any) {
      console.error('Registration failed:', error);
      setSubmitError('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card sx={{width: '100%', mx: 'auto', overflow: 'hidden' }}>
      <CardContent sx={{ p: { xs: 2, md: 2 } }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <RegisterIcon sx={{ fontSize: 56, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {subtitle}
          </Typography>
        </Box>

        {submitError && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {submitError}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
              gap: 3,
            }}
          >
            <TextField
              label="Username"
              fullWidth
              required
              disabled={isSubmitting}
              value={formData.username}
              onChange={handleInputChange('username')}
              error={!!errors.username}
              helperText={errors.username}
              placeholder="Enter your username"
              InputProps={{
                startAdornment: <InputAdornment position="start"><PersonIcon color="action" /></InputAdornment>,
              }}
            />

            <TextField
              label="Email"
              type="email"
              fullWidth
              required
              disabled={isSubmitting}
              value={formData.email}
              onChange={handleInputChange('email')}
              error={!!errors.email}
              helperText={errors.email}
              placeholder="yourname@example.com"
              InputProps={{
                startAdornment: <InputAdornment position="start"><EmailIcon color="action" /></InputAdornment>,
              }}
            />

            <TextField
              label="Mobile Number"
              type="tel"
              fullWidth
              required
              disabled={isSubmitting}
              value={formData.mobile}
              onChange={handleInputChange('mobile')}
              error={!!errors.mobile}
              helperText={errors.mobile}
              placeholder="+91 98765 43210"
              InputProps={{
                startAdornment: <InputAdornment position="start"><PhoneIcon color="action" /></InputAdornment>,
              }}
            />

            <TextField
              label="Password"
              type="password"
              fullWidth
              required
              disabled={isSubmitting}
              value={formData.password}
              onChange={handleInputChange('password')}
              error={!!errors.password}
              helperText={errors.password}
              placeholder="Create a strong password"
              InputProps={{
                startAdornment: <InputAdornment position="start"><LockIcon color="action" /></InputAdornment>,
              }}
            />

            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              required
              disabled={isSubmitting}
              value={formData.confirmPassword}
              onChange={handleInputChange('confirmPassword')}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              placeholder="Confirm your password"
              InputProps={{
                startAdornment: <InputAdornment position="start"><LockIcon color="action" /></InputAdornment>,
              }}
            />
          </Box>

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isSubmitting}
            fullWidth
            startIcon={
              isSubmitting ? <CircularProgress size={20} color="inherit" /> : <RegisterIcon />
            }
            sx={{ py: 1.5, mt: 4 }}
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </Button>

          <Box sx={{ textAlign: 'center', mt: 1 }}>
            <Typography variant="body2" color="text.secondary" component="span">
              Already have an account?{' '}
            </Typography>
            <Button
              variant="text"
              onClick={onSwitchToLogin}
              disabled={isSubmitting}
              sx={{ textTransform: 'none' }}
            >
              Sign in here
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MuiRegistrationForm;