
import React, { useState, useEffect } from 'react';
import { InvestorDetails, RedemptionDetail } from '@/types/investor';
import InvestorCard from '@/components/InvestorCard';
import { Button } from '@/components/ui/button';
import { Pencil, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { 
  calculateSipAmountToDate,
  calculateRemainingUnits,
  formatDateString
} from '@/services/navService';

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
    units: number;
    redemptions: RedemptionDetail[];
    netAmount?: number;
  }>>([]);

  useEffect(() => {
    const processSchemes = async () => {
      if (investor?.schemes) {
        const processedSchemes = investor.schemes.map((scheme) => {
          // Get original amount invested
          let calculatedAmount = scheme.amountInvested;

          // For SIP schemes, pass both amountInvested and dateStarted
          if (scheme.sipLs === "SIP" && scheme.dateStarted) {
            calculatedAmount = calculateSipAmountToDate(scheme.amountInvested, scheme.dateStarted);
          }

          // Get units (either provided or use default)
          let units = scheme.units || 0;

          // Calculate net amount after redemptions
          const totalRedemptionAmount = (scheme.redemptions || []).reduce((total, redemption) => {
            if (redemption.amount) {
              return total + redemption.amount;
            } else if (redemption.nav && redemption.units) {
              return total + (redemption.nav * redemption.units);
            }
            return total;
          }, 0);

          // For SIP, we adjust the calculated amount, for lumpsum we adjust the original investment
          const netAmount = scheme.sipLs === "SIP" 
            ? calculatedAmount - totalRedemptionAmount
            : scheme.amountInvested - totalRedemptionAmount;

          return {
            original: scheme.amountInvested,
            calculated: calculatedAmount,
            sipLs: scheme.sipLs,
            dateStarted: scheme.dateStarted,
            units,
            redemptions: scheme.redemptions || [],
            netAmount: Math.max(0, netAmount)
          };
        });

        setCalculatedSchemes(processedSchemes);
      }
    };

    processSchemes();
  }, [investor]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  // Create shareable text function
  const createShareableText = () => {
    if (!investor) return "";
    
    // Calculate total invested amount
    const totalInvested = calculatedSchemes.reduce((total, scheme) => {
      return total + scheme.calculated;
    }, 0);
    
    // Calculate total net amount after redemptions
    const totalNetAmount = calculatedSchemes.reduce((total, scheme) => {
      return total + (scheme.netAmount || 0);
    }, 0);
    
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
    
    // Add investment summary
    if (totalInvested > 0) {
      text += `💰 Investment Summary\n`;
      text += `Total Amount Invested: ${formatCurrency(totalInvested)}\n`;
      if (totalNetAmount !== totalInvested) {
        text += `Current Net Investment: ${formatCurrency(totalNetAmount)}\n`;
      }
      text += `Total Schemes: ${investor.schemes?.length || 0}\n\n`;
    }
    
    // Add nominee details if available
    if (investor.nomineeName) {
      text += `👥 Nominee Details\n`;
      text += `Name: ${investor.nomineeName}\n`;
      text += investor.nomineeRelationship ? `Relationship: ${investor.nomineeRelationship}\n` : '';
      text += investor.nomineeDob ? `Date of Birth: ${formatDateString(investor.nomineeDob)}\n` : '';
      text += investor.nomineeAadhar ? `Aadhar: ${investor.nomineeAadhar}\n` : '';
      
      if (investor.nomineeIsNri) {
        text += investor.nomineePassport ? `Passport: ${investor.nomineePassport}\n` : '';
        text += investor.nomineeExpiryDate ? `Expiry Date: ${formatDateString(investor.nomineeExpiryDate)}\n` : '';
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
      text += `📋 Investment Schemes Details\n`;
      
      investor.schemes.forEach((scheme, index) => {
        const schemeData = calculatedSchemes[index];
        if (!schemeData) return;
        
        const calculatedAmount = schemeData.calculated || scheme.amountInvested;
        const units = schemeData.units;
        const redemptions = schemeData.redemptions;
        
        // Calculate remaining units after redemptions
        const totalUnitsRedeemed = redemptions.reduce((total, redemption) => total + (redemption.units || 0), 0);
        const remainingUnits = Math.max(0, units - totalUnitsRedeemed);
        
        text += `\nScheme ${index + 1}:\n`;
        text += `AMC: ${scheme.amc}\n`;
        text += `Scheme Name: ${scheme.schemeName}\n`;
        text += `Folio Number: ${scheme.folioNo}\n`;
        if (scheme.isin) text += `ISIN: ${scheme.isin}\n`;
        text += `Type: ${scheme.sipLs}\n`;
        
        if (scheme.sipLs === "SIP" && scheme.dateStarted) {
          text += `Monthly Amount: ${formatCurrency(scheme.amountInvested)}\n`;
          text += `Total Invested to Date: ${formatCurrency(calculatedAmount)}\n`;
          text += `Start Date: ${formatDateString(scheme.dateStarted)}\n`;
        } else {
          text += `Amount: ${formatCurrency(scheme.amountInvested)}\n`;
        }
        
        text += `Total Units: ${units.toFixed(3)}\n`;
        if (totalUnitsRedeemed > 0) {
          text += `Remaining Units: ${remainingUnits.toFixed(3)}\n`;
        }
        
        text += scheme.arnCode ? `ARN Code: ${scheme.arnCode}\n` : '';
        
        // Add redemption details if available
        if (redemptions && redemptions.length > 0) {
          text += `\nRedemption History:\n`;
          
          let totalUnits = 0;
          let totalAmount = 0;
          
          redemptions.forEach((redemption, idx) => {
            text += `${idx + 1}. Date: ${formatDateString(redemption.date)}, `;
            text += `Units: ${redemption.units.toFixed(3)}, `;
            
            if (redemption.nav) {
              text += `NAV: ${redemption.nav.toFixed(2)}, `;
              text += `Amount: ${formatCurrency(redemption.units * redemption.nav)}\n`;
              totalAmount += (redemption.units * redemption.nav);
            } else if (redemption.amount) {
              text += `Amount: ${formatCurrency(redemption.amount)}\n`;
              totalAmount += redemption.amount;
            } else {
              text += `Amount: Not specified\n`;
            }
            
            totalUnits += redemption.units;
          });
          
          text += `Total Redeemed: ${totalUnits.toFixed(3)} units, ${formatCurrency(totalAmount)}\n`;
          text += `Remaining Units: ${Math.max(0, units - totalUnits).toFixed(3)}\n`;
        }
      });
    }
    
    return text;
  };
  
  const handleShare = async () => {
    if (!investor) return;
    
    // Create shareable text with all details
    const shareText = createShareableText();
    
    try {
      // Try clipboard first as it's more reliable
      await navigator.clipboard.writeText(shareText);
      toast.success("Copied to clipboard", {
        description: "Comprehensive investor details have been copied to clipboard."
      });
    } catch (clipboardError) {
      console.log('Clipboard failed, trying Web Share API:', clipboardError);
      
      // Fallback to Web Share API if clipboard fails
      try {
        if (navigator.share) {
          await navigator.share({
            title: `${investor.name}'s Investment Details`,
            text: shareText
          });
          toast.success("Shared successfully", {
            description: "Investor details have been shared."
          });
        } else {
          throw new Error('Web Share API not supported');
        }
      } catch (shareError) {
        console.log('Web Share API also failed:', shareError);
        
        // Final fallback - show the text in a way user can copy manually
        toast.error("Sharing not available", {
          description: "Please enable clipboard access or try a different browser. The data is ready to copy."
        });
      }
    }
  };
  
  // Update the InvestorCard component to include the calculated SIP amounts and net amounts after redemptions
  const investorWithCalculatedData = investor ? {
    ...investor,
    schemes: investor.schemes.map((scheme, index) => {
      const schemeData = calculatedSchemes[index];
      
      if (!schemeData) return scheme;
      
      return {
        ...scheme,
        calculatedAmount: schemeData.calculated,
        netAmount: schemeData.netAmount, // Add the net amount after redemptions
        units: schemeData.units || scheme.units || 0
      };
    })
  } : null;
  
  if (!investor) return null;
  
  return (
    <section className="animate-fade-in glass-card p-2 rounded-lg mb-4 sm:mb-8 overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 p-2 sm:p-3 glass bg-blue-900/20 backdrop-blur-md rounded-t-lg gap-3 sm:gap-0">
        <h3 className="text-lg sm:text-xl font-semibold text-blue-300">Investor Details</h3>
        
        <div className="flex gap-2 w-full sm:w-auto">
          {onEditInvestor && (
            <Button
              onClick={() => onEditInvestor(investor.pan)}
              variant="outline"
              size="sm"
              className="text-amber-400 border-amber-800/30 hover:bg-amber-900/20 hover:text-amber-300 transition-all duration-300 hover:shadow-sm glass flex-1 sm:flex-initial text-xs sm:text-sm"
            >
              <Pencil className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" /> Edit
            </Button>
          )}
          
          <Button
            onClick={handleShare}
            variant="outline"
            size="sm"
            className="text-blue-400 border-blue-800/30 hover:bg-blue-900/20 hover:text-blue-300 transition-all duration-300 hover:shadow-sm glass flex-1 sm:flex-initial text-xs sm:text-sm"
          >
            <Share2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" /> Share
          </Button>
        </div>
      </div>
      
      <div className="transition-all duration-300 hover:shadow-md glass backdrop-blur-md overflow-hidden">
        <InvestorCard investor={investorWithCalculatedData} />
      </div>
    </section>
  );
};

export default InvestorDetailsSection;
