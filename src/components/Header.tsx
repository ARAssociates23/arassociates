
import React from 'react';
import { Search } from 'lucide-react';

const Header = () => {
  return (
    <div className="bg-finance text-white p-4 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <Search className="h-6 w-6 mr-2" />
          <h1 className="text-xl font-bold">Folio Finder Elite</h1>
        </div>
        <div className="text-sm opacity-80">
          Advanced Investor Search Portal
        </div>
      </div>
    </div>
  );
};

export default Header;
