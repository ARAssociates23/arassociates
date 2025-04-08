import React, { useState, useEffect } from 'react';
import { InvestorDetails } from '@/types/investor';
import InvestorCard from '@/components/InvestorCard';
import { Button } from '@/components/ui/button';
import { Pencil, Share2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { getCurrentNav, calculateUnits } from '@/services/navService';
import { cn } from '@/lib/utils';

interface InvestorDetailsSectionProps {
  investor: InvestorDetails | null;
  onEditInvestor?: (pan: string) => void;
}

const InvestorDetailsSection: React.FC<InvestorDetailsSectionProps> = ({ 
  investor,
  onEditInvestor
}) => {
  const [calculatedSchemes, setCalculatedSchemes] = useState<Array<{
    original: number;
    calculated: number;
    sipLs: "SIP" | "LS";
    dateStarted: string;
    currentNav?: number;
    currentValue?: number;
    lastUpdated?: string;
  }>>([]);

  useEffect(() => {
    const processSchemes = async () => {
      if (investor?.schemes) {
        const processedSchemes = await Promise.all(investor.schemes.map(async (scheme) => {
          let calculatedAmount = scheme.amountInvested;
          
          // Only calculate for SIP schemes with a start date
          if (scheme.sipLs === "SIP" && scheme.dateStarted) {
            const startDate = new Date(scheme.dateStarted);
            const currentDate = new Date();
            
            // Check if the start date is valid and in the past
            if (!isNaN(startDate.getTime()) && startDate <= currentDate) {
              // Calculate months difference (including partial months)
              const monthsDiff = (
                (currentDate.getFullYear() - startDate.getFullYear()) * 12 +
                (currentDate.getMonth() - startDate.getMonth())
              );
              
              // Calculate total SIP amount (original amount * number of months)
              calculatedAmount = scheme.amountInvested * (monthsDiff + 1); // +1 to include the first month
            }
          }

          // Fetch current NAV from AMFI
          let currentNav: number | undefined;
          let currentValue: number | undefined;
          let lastUpdated: string | undefined;
          
          try {
            // Get current NAV from AMFI data
            const nav = await getCurrentNav(scheme.schemeName, scheme.amc);
            
            if (nav) {
              currentNav = nav;
              lastUpdated = new Date().toISOString();
              
              // Calculate current value based on NAV
              const investedAmount = scheme.sipLs === "SIP" ? calculatedAmount : scheme.amountInvested;
              const units = calculateUnits(investedAmount, currentNav);
              currentValue = units * currentNav;
            }
          } catch (error) {
            console.error('Error fetching NAV:', error);
          }
          
          return {
            original: scheme.amountInvested,
            calculated: calculatedAmount,
            sipLs: scheme.sipLs,
            dateStarted: scheme.dateStarted,
            currentNav,
            currentValue,
            lastUpdated
          };
        }));
        
        setCalculatedSchemes(processedSchemes);
      }
    };
    
    processSchemes();
    
    // Set up an interval to refresh NAV data every 15 minutes
    const interval = setInterval(() => {
      processSchemes();
    }, 15 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [investor]);
  
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
        const schemeData = calculatedSchemes[index];
        const calculatedAmount = schemeData?.calculated || scheme.amountInvested;
        const currentNav = schemeData?.currentNav;
        const currentValue = schemeData?.currentValue;
        const lastUpdated = schemeData?.lastUpdated;
        
        text += `\nScheme ${index + 1}:\n`;
        text += `AMC: ${scheme.amc}\n`;
        text += `Scheme Name: ${scheme.schemeName}\n`;
        text += `Folio Number: ${scheme.folioNo}\n`;
        text += `Type: ${scheme.sipLs}\n`;
        
        if (scheme.sipLs === "SIP" && scheme.dateStarted) {
          text += `Monthly Amount: ${formatCurrency(scheme.amountInvested)}\n`;
          text += `Total Invested: ${formatCurrency(calculatedAmount)}\n`;
        } else {
          text += `Amount: ${formatCurrency(scheme.amountInvested)}\n`;
        }
        
        if (currentNav) {
          text += `Current NAV: ${currentNav.toFixed(2)}\n`;
        }
        
        if (currentValue) {
          text += `Current Value: ${formatCurrency(currentValue)}\n`;
        }
        
        text += scheme.dateStarted ? `Started: ${scheme.dateStarted}\n` : '';
        text += scheme.arnCode ? `ARN Code: ${scheme.arnCode}\n` : '';
        text += lastUpdated ? `Last Updated: ${new Date(lastUpdated).toLocaleDateString()} ${new Date(lastUpdated).toLocaleTimeString()}\n` : '';
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
  
  // Update the InvestorCard component to include the calculated SIP amounts and NAV data
  const investorWithCalculatedData = investor ? {
    ...investor,
    schemes: investor.schemes.map((scheme, index) => {
      const schemeData = calculatedSchemes[index];
      
      if (!schemeData) return scheme;
      
      return {
        ...scheme,
        calculatedAmount: schemeData.calculated,
        currentNav: schemeData.currentNav,
        currentValue: schemeData.currentValue,
        lastUpdated: schemeData.lastUpdated
      };
    })
  } : null;
  
  if (!investor) return null;
  
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
        <InvestorCard investor={investorWithCalculatedData} />
      </div>
    </section>
  );
};

export default InvestorDetailsSection;
