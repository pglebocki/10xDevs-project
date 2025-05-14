import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface AuthFormProps {
  type: 'login' | 'register';
  onSubmit: (email: string, password: string) => Promise<void>;
  error: string | null;
}

const AuthForm: React.FC<AuthFormProps> = ({ type, onSubmit, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!email) {
      setFormError('Email is required');
      return;
    }
    
    if (!password) {
      setFormError('Password is required');
      return;
    }
    
    if (type === 'register' && password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    setFormError(null);
    
    try {
      await onSubmit(email, password);
    } catch (err) {
      // Error is handled by the auth context and passed in as prop
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {type === 'login' ? 'Sign In' : 'Create an Account'}
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          {type === 'login' 
            ? 'Sign in to access your dashboard' 
            : 'Register to start monitoring developer activity'}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {(error || formError) && (
          <div className="bg-red-50 p-3 rounded-md border border-red-200 text-sm text-red-600">
            {error || formError}
          </div>
        )}
        
        <Input
          label="Email"
          type="email"
          id="email"
          placeholder="your.email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail className="h-4 w-4 text-gray-400" />}
          required
        />
        
        <Input
          label="Password"
          type="password"
          id="password"
          placeholder={type === 'register' ? 'Create a password' : 'Enter your password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<Lock className="h-4 w-4 text-gray-400" />}
          required
        />
        
        <Button 
          type="submit" 
          variant="primary" 
          size="lg" 
          fullWidth 
          isLoading={loading}
        >
          {type === 'login' ? 'Sign In' : 'Create Account'}
        </Button>
      </form>
      
      <div className="mt-6 text-center text-sm">
        {type === 'login' ? (
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
              Register
            </Link>
          </p>
        ) : (
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
              Sign In
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthForm;