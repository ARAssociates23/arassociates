
import React from 'react';
import { InvestorDetails } from '@/types/investor';
import InvestorCard from '@/components/InvestorCard';

interface InvestorDetailsSectionProps {
  investor: InvestorDetails | null;
}

const InvestorDetailsSection: React.FC<InvestorDetailsSectionProps> = ({ investor }) => {
  if (!investor) return null;
  
  return (
    <section>
      <h3 className="text-xl font-semibold text-finance mb-4">Investor Details</h3>
      <InvestorCard investor={investor} />
    </section>
  );
};

export default InvestorDetailsSection;
