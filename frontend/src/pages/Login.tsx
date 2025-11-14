import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AuthLayout } from '@/components/layout';
import { Button, Input, Card } from '@/components/ui';
import {
  SaveSessionModal,
  type GuestSessionData,
} from '@/components/game/SaveSessionModal';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const guestSession = location.state?.guestSession as
    | GuestSessionData
    | undefined;

  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: '',
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

    if (!formData.usernameOrEmail.trim()) {
      newErrors.usernameOrEmail = 'Username or email is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
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
      await login(formData);

      if (guestSession) {
        setShowSaveSession(true);
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage =
        error instanceof Error && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : undefined;
      setApiError(errorMessage || 'Invalid credentials. Please try again.');
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
          <h1 className='text-pacman-yellow font-family-arcade text-6xl mb-2 text-center'>
            DCISMan
          </h1>
          <p className='text-ghost-cyan font-family-vt323 text-2xl'>
            Login to save your game stats
          </p>
        </div>

        {apiError && (
          <div className='bg-ghost-red border-2 border-ghost-red-dark text-white px-4 py-3 rounded-lg mb-6 font-family-vt323 text-2xl'>
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-6'>
          <Input
            label='Username or Email'
            type='text'
            name='usernameOrEmail'
            value={formData.usernameOrEmail}
            onChange={handleChange}
            error={errors.usernameOrEmail}
            placeholder='Enter username or email'
          />

          <Input
            label='Password'
            type='password'
            name='password'
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder='Enter password'
          />

          <Button
            type='submit'
            variant='primary'
            isLoading={loading}
            className='w-full'
          >
            {loading ? 'Loading...' : 'Login'}
          </Button>
        </form>
        <div className='mt-4 text-center'>
          <Link to='/'>
            <Button variant='secondary' className='w-full'>
              Back to game
            </Button>
          </Link>
        </div>
        
        <div className='mt-6 text-center'>
          <p className='text-white font-family-vt323 text-2xl'>
            New player?{' '}
            <Link
              to='/register'
              className='text-pacman-yellow hover:text-pacman-yellow-light underline'
            >
              Register Here
            </Link>
          </p>
        </div>
      </Card>

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
