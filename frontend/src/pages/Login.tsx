import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AuthLayout } from '@/components/layout';
import { Button, Input, Card } from '@/components/ui';
import { Pellet } from '@/components/decorative';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

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
      navigate('/');
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

  return (
    <AuthLayout>
      <Card className='w-full'>
        <div className='text-center mb-8'>
          <h1 className='text-pacman-yellow font-family-arcade text-6xl mb-2 text-center'>
            DCISMan
          </h1>
          <p className='text-ghost-cyan font-family-vt323 text-2xl'>
            Login to Play
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
            {loading ? 'Loading...' : 'Start Game'}
          </Button>
        </form>

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

        {/* Decorative pellets */}
        <div className='flex justify-center gap-4 mt-8'>
          <Pellet />
          <Pellet isPowerPellet />
          <Pellet />
        </div>
      </Card>
    </AuthLayout>
  );
};
