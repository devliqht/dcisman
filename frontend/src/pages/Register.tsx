import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AuthLayout } from '@/components/layout';
import { Button, Input, Card } from '@/components/ui';
import { SaveSessionModal, type GuestSessionData } from '@/components/game/SaveSessionModal';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();

  const guestSession = location.state?.guestSession as GuestSessionData | undefined;

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [showSaveSession, setShowSaveSession] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setApiError('');
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (formData.username.length > 50) {
      newErrors.username = 'Username must not exceed 50 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    setApiError('');

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      // If there's a guest session, show save session modal
      if (guestSession) {
        setShowSaveSession(true);
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage =
        error instanceof Error && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : undefined;
      setApiError(errorMessage || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSession = async () => {
    // TODO: Implement backend endpoint to save retroactive session
    // For now, just navigate to dashboard
    console.log('Saving guest session:', guestSession);
    setShowSaveSession(false);
    navigate('/');
  };

  const handleSkipSession = () => {
    setShowSaveSession(false);
    navigate('/');
  };

  return (
    <AuthLayout>
      <Card className='w-full'>
        <div className='text-center mb-8'>
          <h1 className='text-pacman-yellow font-family-arcade text-3xl mb-2 text-center'>
            Join DCISMan
          </h1>
          <p className='text-ghost-pink font-family-vt323 text-2xl'>
            Create Your Account
          </p>
        </div>

        {apiError && (
          <div className='bg-ghost-red border-2 border-ghost-red-dark text-white px-4 py-3 rounded-lg mb-6 font-family-vt323 text-2xl'>
            {apiError}
          </div>
        )}
        <form onSubmit={handleSubmit} className='space-y-5'>
          <Input
            label='Username'
            type='text'
            name='username'
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
            placeholder='Choose a username'
          />

          <Input
            label='Email'
            type='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder='Enter your email'
          />

          <Input
            label='Password'
            type='password'
            name='password'
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder='Create password'
          />

          <Input
            label='Confirm Password'
            type='password'
            name='confirmPassword'
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            placeholder='Confirm password'
          />

          <Button
            type='submit'
            variant='primary'
            isLoading={loading}
            className='w-full'
          >
            {loading ? 'Creating...' : 'Create Account'}
          </Button>
        </form>

        <div className='mt-6 text-center'>
          <p className='text-white font-family-vt323 text-2xl'>
            Already have an account?{' '}
            <Link
              to='/login'
              className='text-pacman-yellow hover:text-pacman-yellow-light underline'
            >
              Login Here
            </Link>
          </p>
        </div>
      </Card>

      {/* Save Session Modal */}
      {showSaveSession && guestSession && (
        <SaveSessionModal
          session={guestSession}
          onSave={handleSaveSession}
          onSkip={handleSkipSession}
        />
      )}
    </AuthLayout>
  );
};
