import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './theme-toggle';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'Investor Management',
  showBackButton = false,
  onBackClick
}) => {
  return (
    <header className="bg-finance dark:bg-gray-800 text-white p-4 shadow-md transition-colors duration-300">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackClick}
              className="text-white hover:bg-finance-dark dark:hover:bg-gray-700 transition-colors"
            >
              ← Back
            </Button>
          )}
          <Link to="/" className="text-xl font-bold tracking-tight hover:opacity-90 transition-opacity">
            {title}
          </Link>
        </div>
        
        <div className="flex items-center space-x-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
