
import React from 'react';
import { InvestorDetails } from '@/types/investor';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTheme } from './theme-provider';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  
  if (results.length === 0) {
    return null;
  }

  if (isMobile) {
    return (
      <div className="space-y-4">
        {results.map((investor) => (
          <div key={investor.pan} className="bg-slate-800 p-3 rounded-lg shadow-sm border border-slate-700">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-sm text-white">{investor.name}</span>
              <div className="flex gap-1">
                <Button 
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0 hover:bg-slate-700 text-white"
                  onClick={() => onViewDetails(investor.pan)}
                >
                  <Eye className="h-4 w-4 text-blue-400" />
                </Button>
                <Button 
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0 hover:bg-slate-700 text-white"
                  onClick={() => onEditInvestor(investor.pan)}
                >
                  <Pencil className="h-4 w-4 text-amber-400" />
                </Button>
                <Button 
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0 hover:bg-slate-700 text-white"
                  onClick={() => onDeleteInvestor(investor.pan)}
                >
                  <Trash2 className="h-4 w-4 text-red-400" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-1 text-xs text-gray-300">
              <div>
                <span className="font-medium">PAN:</span> {investor.pan}
              </div>
              <div>
                <span className="font-medium">Mobile:</span> {investor.mobile}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Desktop view with dark theme
  return (
    <div className="w-full overflow-x-auto bg-slate-800 rounded-lg">
      <Table className="bg-slate-800">
        <TableHeader>
          <TableRow className="bg-blue-600 hover:bg-blue-600 border-b border-slate-600">
            <TableHead className="text-white font-semibold">PAN</TableHead>
            <TableHead className="text-white font-semibold">Name</TableHead>
            <TableHead className="text-white font-semibold">Mobile</TableHead>
            <TableHead className="text-white font-semibold">Email</TableHead>
            <TableHead className="text-white font-semibold text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-slate-800">
          {results.map((investor) => (
            <TableRow key={investor.pan} className="bg-slate-800 hover:bg-slate-700 border-b border-slate-600 transition-colors duration-200">
              <TableCell className="font-medium text-white">{investor.pan}</TableCell>
              <TableCell className="text-gray-200">{investor.name}</TableCell>
              <TableCell className="text-gray-200">{investor.mobile}</TableCell>
              <TableCell className="text-gray-200">{investor.email}</TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center gap-3">
                  <Button 
                    size="sm"
                    variant="ghost"
                    className="text-blue-400 hover:text-blue-300 hover:bg-slate-700 flex items-center gap-1"
                    onClick={() => onViewDetails(investor.pan)}
                  >
                    <Eye className="h-4 w-4" /> <span className="text-gray-200">View</span>
                  </Button>
                  <Button 
                    size="sm"
                    variant="ghost"
                    className="text-amber-400 hover:text-amber-300 hover:bg-slate-700 flex items-center gap-1"
                    onClick={() => onEditInvestor(investor.pan)}
                  >
                    <Pencil className="h-4 w-4" /> <span className="text-gray-200">Edit</span>
                  </Button>
                  <Button 
                    size="sm"
                    variant="ghost"
                    className="text-red-400 hover:text-red-300 hover:bg-slate-700 flex items-center gap-1"
                    onClick={() => onDeleteInvestor(investor.pan)}
                  >
                    <Trash2 className="h-4 w-4" /> <span className="text-gray-200">Delete</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SearchResults;
