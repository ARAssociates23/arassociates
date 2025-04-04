
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from 'lucide-react';

export interface LoginCredentials {
  username: string;
  password: string;
}

// Simple authentication service with hardcoded credentials
// In a real app, this would be replaced with a proper backend service
const authenticate = (username: string, password: string): boolean => {
  // Hardcoded credentials for demo purposes
  return username === 'admin' && password === 'password';
};

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    if (authenticate(username, password)) {
      // Store authentication state
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', username);
      
      // Notify success
      toast({
        title: "Login Successful",
        description: `Welcome back, ${username}!`,
      });
      
      // Redirect to home page
      navigate('/');
    } else {
      setError('Invalid username or password');
      toast({
        title: "Login Failed",
        description: "Invalid username or password",
        variant: "destructive",
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Login to AR Associates</CardTitle>
          <CardDescription>
            Enter your credentials to access the investor portal
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  className="absolute right-3 top-[50%] transform -translate-y-1/2"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
                </button>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button className="w-full bg-finance hover:bg-finance-dark" type="submit">
              Login
            </Button>
            <p className="text-xs text-gray-500 mt-4">
              Note: For demo purposes, use username: admin and password: password
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
