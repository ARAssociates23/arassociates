
import React from 'react';
import { InvestorDetails } from '@/types/investor';
import InvestorCard from '@/components/InvestorCard';
import { Button } from '@/components/ui/button';
import { Pencil, Share2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface InvestorDetailsSectionProps {
  investor: InvestorDetails | null;
  onEditInvestor?: (pan: string) => void;
}

const InvestorDetailsSection: React.FC<InvestorDetailsSectionProps> = ({ 
  investor,
  onEditInvestor
}) => {
  if (!investor) return null;
  
  const handleShare = async () => {
    // Create shareable text
    const shareText = `Investor Details:\nName: ${investor.name}\nPAN: ${investor.pan}\nMobile: ${investor.mobile}`;
    
    try {
      if (navigator.share) {
        // Use Web Share API if available
        await navigator.share({
          title: `${investor.name}'s Details`,
          text: shareText
        });
        toast({
          title: "Shared successfully",
          description: "Investor details have been shared.",
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareText);
        toast({
          title: "Copied to clipboard",
          description: "Investor details have been copied to clipboard.",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast({
        title: "Sharing failed",
        description: "There was an error sharing the investor details.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <section className="animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-finance">Investor Details</h3>
        
        <div className="flex gap-2">
          {onEditInvestor && (
            <Button
              onClick={() => onEditInvestor(investor.pan)}
              variant="outline"
              size="sm"
              className="text-amber-600 border-amber-300 hover:bg-amber-50 hover:text-amber-700 transition-all duration-300 hover:shadow-sm"
            >
              <Pencil className="h-4 w-4 mr-2" /> Edit
            </Button>
          )}
          
          <Button
            onClick={handleShare}
            variant="outline"
            size="sm"
            className="text-blue-600 border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 hover:shadow-sm"
          >
            <Share2 className="h-4 w-4 mr-2" /> Share
          </Button>
        </div>
      </div>
      
      <div className="transition-all duration-300 hover:shadow-md">
        <InvestorCard investor={investor} />
      </div>
    </section>
  );
};

export default InvestorDetailsSection;
