
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { SignUpCredentials } from '@/services/authService';

interface RegisterFormProps {
  onSubmit: (credentials: SignUpCredentials) => void;
  loading: boolean;
  error: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, loading, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ email, password, name });
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor="registerName">Name (Optional)</Label>
          <Input
            id="registerName"
            type="text"
            className="rounded-lg"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="registerEmail">Email</Label>
          <Input
            id="registerEmail"
            type="email"
            className="rounded-lg"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="registerPassword">Password</Label>
          <div className="relative">
            <Input
              id="registerPassword"
              type={showPassword ? "text" : "password"}
              className="rounded-lg"
              placeholder="Create a password"
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
          <UserPlus className="h-4 w-4 mr-2" />
          {loading ? 'Creating account...' : 'Create Account'}
        </Button>
      </div>
    </form>
  );
};

export default RegisterForm;
