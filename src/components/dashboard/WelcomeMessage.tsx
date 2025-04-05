
import React from 'react';

interface WelcomeMessageProps {
  show: boolean;
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ show }) => {
  if (!show) return null;
  
  return (
    <div className="text-center p-12 bg-finance-highlight rounded-lg border border-finance-light">
      <h3 className="text-xl font-semibold text-finance mb-2">Welcome to Folio Finder Elite</h3>
      <p className="text-gray-600 mb-4">
        Start by adding your first investor using the "Add Investor" button above.
      </p>
      <div className="text-sm text-gray-500">
        You'll be able to view personal details, nominee information, bank accounts, and investment schemes.
      </div>
    </div>
  );
};

export default WelcomeMessage;
