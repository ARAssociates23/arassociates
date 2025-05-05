
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';

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
    <header className="bg-gradient-to-r from-blue-900/90 to-blue-950/90 text-white p-4 shadow-md transition-colors duration-300 dark:from-slate-900/95 dark:to-slate-950 backdrop-blur-lg border-b border-white/10 relative z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackClick}
              className="text-white hover:bg-white/10 transition-colors"
            >
              ← Back
            </Button>
          )}
          {title && (
            <Link to="/" className="text-xl font-bold tracking-tight text-blue-100 hover:text-white transition-opacity">
              {title}
            </Link>
          )}
        </div>
        <div className="flex items-center">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
