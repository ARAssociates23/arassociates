
import React from 'react';
import { InvestorDetails } from '@/types/investor';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash2 } from 'lucide-react';

interface SearchResultsProps {
  results: InvestorDetails[];
  onViewDetails: (pan: string) => void;
  onEditInvestor: (pan: string) => void;
  onDeleteInvestor: (pan: string) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ 
  results, 
  onViewDetails, 
  onEditInvestor, 
  onDeleteInvestor 
}) => {
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
            <th className="px-4 py-2 text-center">Actions</th>
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
                <div className="flex justify-center gap-3">
                  <Button 
                    size="sm"
                    variant="ghost"
                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 flex items-center gap-1"
                    onClick={() => onViewDetails(investor.pan)}
                  >
                    <Eye className="h-4 w-4" /> View
                  </Button>
                  <Button 
                    size="sm"
                    variant="ghost"
                    className="text-amber-600 hover:text-amber-800 hover:bg-amber-50 flex items-center gap-1"
                    onClick={() => onEditInvestor(investor.pan)}
                  >
                    <Pencil className="h-4 w-4" /> Edit
                  </Button>
                  <Button 
                    size="sm"
                    variant="ghost"
                    className="text-red-600 hover:text-red-800 hover:bg-red-50 flex items-center gap-1"
                    onClick={() => onDeleteInvestor(investor.pan)}
                  >
                    <Trash2 className="h-4 w-4" /> Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SearchResults;
