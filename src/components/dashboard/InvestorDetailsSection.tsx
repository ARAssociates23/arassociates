
import React from 'react';
import { InvestorDetails } from '@/types/investor';
import InvestorCard from '@/components/InvestorCard';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';

interface InvestorDetailsSectionProps {
  investor: InvestorDetails | null;
  onEditInvestor?: (pan: string) => void;
}

const InvestorDetailsSection: React.FC<InvestorDetailsSectionProps> = ({ 
  investor,
  onEditInvestor
}) => {
  if (!investor) return null;
  
  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-finance">Investor Details</h3>
        
        {onEditInvestor && (
          <Button
            onClick={() => onEditInvestor(investor.pan)}
            variant="outline"
            size="sm"
            className="text-amber-600 border-amber-300 hover:bg-amber-50 hover:text-amber-700"
          >
            <Pencil className="h-4 w-4 mr-2" /> Edit
          </Button>
        )}
      </div>
      
      <InvestorCard investor={investor} />
    </section>
  );
};

export default InvestorDetailsSection;
