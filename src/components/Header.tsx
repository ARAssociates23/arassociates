
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title = '',
  showBackButton = false,
  onBackClick
}) => {
  return (
    <header className="bg-blue-900 text-white p-4 shadow-md transition-colors duration-300 dark:bg-blue-950">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackClick}
              className="text-white hover:bg-blue-800 transition-colors"
            >
              ← Back
            </Button>
          )}
          {title && (
            <Link to="/" className="text-xl font-bold tracking-tight hover:opacity-90 transition-opacity">
              {title}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
