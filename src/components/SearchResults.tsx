
import React from 'react';
import { InvestorDetails } from '@/types/investor';
import { Button } from '@/components/ui/button';
import { EyeIcon } from 'lucide-react';

interface SearchResultsProps {
  results: InvestorDetails[];
  onViewDetails: (pan: string) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, onViewDetails }) => {
  if (results.length === 0) {
    return null;
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse min-w-full">
        <thead>
          <tr className="bg-finance text-white">
            <th className="px-4 py-2 text-left">PAN</th>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Mobile</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {results.map((investor) => (
            <tr key={investor.pan} className="border-b hover:bg-finance-highlight transition-colors duration-200">
              <td className="px-4 py-2">{investor.pan}</td>
              <td className="px-4 py-2 font-medium">{investor.name}</td>
              <td className="px-4 py-2">{investor.mobile}</td>
              <td className="px-4 py-2">{investor.email}</td>
              <td className="px-4 py-2 text-center">
                <Button 
                  size="sm"
                  variant="ghost"
                  className="text-finance hover:text-finance-dark hover:bg-finance-light"
                  onClick={() => onViewDetails(investor.pan)}
                >
                  <EyeIcon className="h-4 w-4 mr-1" /> View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SearchResults;
