
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from './auth/LoginForm';
import RegisterForm from './auth/RegisterForm';
import { useAuthState } from '@/hooks/useAuthState';

const Login = () => {
  const { error, loading, isCheckingAuth, handleLogin, handleSignUp } = useAuthState();

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <p className="text-blue-600">Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md rounded-xl shadow-lg overflow-hidden glass-card">
        <CardHeader className="bg-slate-800/40 backdrop-blur-sm">
          <CardTitle className="text-2xl text-gradient">AR Associates</CardTitle>
          <CardDescription className="text-blue-300">
            Access the client portal
          </CardDescription>
        </CardHeader>
        
        <Tabs defaultValue="login">
          <TabsList className="grid w-full grid-cols-2 rounded-lg mt-4 mx-4">
            <TabsTrigger value="login" className="rounded-lg">Login</TabsTrigger>
            <TabsTrigger value="register" className="rounded-lg">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <CardContent>
              <LoginForm 
                onSubmit={handleLogin}
                loading={loading}
                error={error}
              />
            </CardContent>
          </TabsContent>
          
          <TabsContent value="register">
            <CardContent>
              <RegisterForm 
                onSubmit={handleSignUp}
                loading={loading}
                error={error}
              />
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Login;
