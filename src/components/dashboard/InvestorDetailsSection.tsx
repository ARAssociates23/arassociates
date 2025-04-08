
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
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const createShareableText = () => {
    // Format basic details
    let text = `📊 INVESTOR DETAILS\n\n`;
    text += `👤 Personal Information\n`;
    text += `Name: ${investor.name}\n`;
    text += `PAN: ${investor.pan}\n`;
    text += `Mobile: ${investor.mobile}\n`;
    text += `Email: ${investor.email}\n`;
    text += `Address: ${investor.address}\n`;
    text += `Residential Status: ${investor.residentialStatus}\n`;
    text += `Nationality: ${investor.nationality}\n`;
    text += investor.annualIncome ? `Annual Income: ${investor.annualIncome}\n` : '';
    text += investor.occupation ? `Occupation: ${investor.occupation}\n` : '';
    text += investor.mothersName ? `Mother's Name: ${investor.mothersName}\n\n` : '\n';
    
    // Add nominee details if available
    if (investor.nomineeName) {
      text += `👥 Nominee Details\n`;
      text += `Name: ${investor.nomineeName}\n`;
      text += investor.nomineeRelationship ? `Relationship: ${investor.nomineeRelationship}\n` : '';
      text += investor.nomineeDob ? `Date of Birth: ${investor.nomineeDob}\n` : '';
      text += investor.nomineeAadhar ? `Aadhar: ${investor.nomineeAadhar}\n` : '';
      
      if (investor.nomineeIsNri) {
        text += investor.nomineePassport ? `Passport: ${investor.nomineePassport}\n` : '';
        text += investor.nomineeExpiryDate ? `Expiry Date: ${investor.nomineeExpiryDate}\n` : '';
      }
      
      text += investor.nomineeAddress ? `Address: ${investor.nomineeAddress}\n\n` : '\n';
    }
    
    // Add bank details if available
    if (investor.bankName) {
      text += `🏦 Bank Details\n`;
      text += `Bank Name: ${investor.bankName}\n`;
      text += investor.bankBranch ? `Branch: ${investor.bankBranch}\n` : '';
      text += `Account Number: ${investor.accountNumber}\n`;
      text += investor.ifsc ? `IFSC: ${investor.ifsc}\n` : '';
      text += investor.accountType ? `Account Type: ${investor.accountType}\n\n` : '\n';
    }
    
    // Add scheme details if available
    if (investor.schemes && investor.schemes.length > 0) {
      text += `💰 Investment Schemes\n`;
      
      investor.schemes.forEach((scheme, index) => {
        text += `\nScheme ${index + 1}:\n`;
        text += `AMC: ${scheme.amc}\n`;
        text += `Scheme Name: ${scheme.schemeName}\n`;
        text += `Folio Number: ${scheme.folioNo}\n`;
        text += `Type: ${scheme.sipLs}\n`;
        text += `Amount: ${formatCurrency(scheme.amountInvested)}\n`;
        text += scheme.dateStarted ? `Started: ${scheme.dateStarted}\n` : '';
        text += scheme.arnCode ? `ARN Code: ${scheme.arnCode}\n` : '';
      });
    }
    
    return text;
  };
  
  const handleShare = async () => {
    // Create shareable text with all details
    const shareText = createShareableText();
    
    try {
      if (navigator.share) {
        // Use Web Share API if available
        await navigator.share({
          title: `${investor.name}'s Investment Details`,
          text: shareText
        });
        toast({
          title: "Shared successfully",
          description: "Investor details have been shared.",
          variant: "default",
          className: "bg-green-50 border-green-200",
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareText);
        toast({
          title: "Copied to clipboard",
          description: "Comprehensive investor details have been copied to clipboard.",
          variant: "default",
          className: "bg-blue-50 border-blue-200",
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
