
import React from 'react';
import { InvestorDetails as InvestorDetailsType } from '@/types/investor';
import InvestorCard from '@/components/InvestorCard';

interface InvestorDetailsProps {
  investor: InvestorDetailsType | null;
}

const InvestorDetails: React.FC<InvestorDetailsProps> = ({ investor }) => {
  if (!investor) return null;
  
  return (
    <section>
      <h3 className="text-xl font-semibold text-finance mb-4">Investor Details</h3>
      <InvestorCard investor={investor} />
    </section>
  );
};

export default InvestorDetails;
