
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
          <div key={investor.pan} className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm border border-gray-100 dark:border-slate-700">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-sm dark:text-white">{investor.name}</span>
              <div className="flex gap-1">
                <Button 
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0 dark:hover:bg-slate-700 dark:text-white"
                  onClick={() => onViewDetails(investor.pan)}
                >
                  <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </Button>
                <Button 
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0 dark:hover:bg-slate-700 dark:text-white"
                  onClick={() => onEditInvestor(investor.pan)}
                >
                  <Pencil className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </Button>
                <Button 
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0 dark:hover:bg-slate-700 dark:text-white"
                  onClick={() => onDeleteInvestor(investor.pan)}
                >
                  <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-1 text-xs text-gray-600 dark:text-gray-300">
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

  // Desktop view
  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-blue-600 dark:bg-blue-800 text-white">
            <TableHead className="text-white">PAN</TableHead>
            <TableHead className="text-white">Name</TableHead>
            <TableHead className="text-white">Mobile</TableHead>
            <TableHead className="text-white">Email</TableHead>
            <TableHead className="text-white text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((investor) => (
            <TableRow key={investor.pan} className="hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors duration-200">
              <TableCell className="font-medium dark:text-white">{investor.pan}</TableCell>
              <TableCell className="dark:text-gray-200">{investor.name}</TableCell>
              <TableCell className="dark:text-gray-200">{investor.mobile}</TableCell>
              <TableCell className="dark:text-gray-200">{investor.email}</TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center gap-3">
                  <Button 
                    size="sm"
                    variant="ghost"
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-slate-800 flex items-center gap-1"
                    onClick={() => onViewDetails(investor.pan)}
                  >
                    <Eye className="h-4 w-4" /> <span className="dark:text-gray-200">View</span>
                  </Button>
                  <Button 
                    size="sm"
                    variant="ghost"
                    className="text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300 hover:bg-amber-50 dark:hover:bg-slate-800 flex items-center gap-1"
                    onClick={() => onEditInvestor(investor.pan)}
                  >
                    <Pencil className="h-4 w-4" /> <span className="dark:text-gray-200">Edit</span>
                  </Button>
                  <Button 
                    size="sm"
                    variant="ghost"
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-slate-800 flex items-center gap-1"
                    onClick={() => onDeleteInvestor(investor.pan)}
                  >
                    <Trash2 className="h-4 w-4" /> <span className="dark:text-gray-200">Delete</span>
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
