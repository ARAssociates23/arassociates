
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { LoginCredentials } from '@/services/authService';

interface LoginFormProps {
  onSubmit: (credentials: LoginCredentials) => void;
  loading: boolean;
  error: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, loading, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ email, password });
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor="loginEmail">Email</Label>
          <Input
            id="loginEmail"
            type="email"
            className="rounded-lg"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="loginPassword">Password</Label>
          <div className="relative">
            <Input
              id="loginPassword"
              type={showPassword ? "text" : "password"}
              className="rounded-lg"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button 
              type="button"
              className="absolute right-3 top-[50%] transform -translate-y-1/2"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? 
                <EyeOff className="h-4 w-4 text-gray-500" /> : 
                <Eye className="h-4 w-4 text-gray-500" />
              }
            </button>
          </div>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
      <div className="flex flex-col mt-6">
        <Button 
          className="w-full bg-finance hover:bg-finance-dark rounded-lg" 
          type="submit"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
