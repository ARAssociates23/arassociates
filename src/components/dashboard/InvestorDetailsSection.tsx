import React, { useState, useEffect } from 'react';
import { InvestorDetails, RedemptionDetail } from '@/types/investor';
import InvestorCard from '@/components/InvestorCard';
import { Button } from '@/components/ui/button';
import { Pencil, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { 
  calculateSipAmountToDate,
  calculateNetInvestment,
  calculateRemainingUnits,
  formatDateString
} from '@/services/navService';
import { getCurrentNav } from '@/services/mfApiService';

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
    units: number;
    redemptions: RedemptionDetail[];
    netAmount?: number;
  }>>([]);

  useEffect(() => {
    const processSchemes = async () => {
      if (investor?.schemes) {
        const processedSchemes = await Promise.all(investor.schemes.map(async (scheme) => {
          // Get original amount invested
          let calculatedAmount = scheme.amountInvested;
          
          // Only calculate for SIP schemes with a start date
          if (scheme.sipLs === "SIP" && scheme.dateStarted) {
            calculatedAmount = calculateSipAmountToDate(scheme.amountInvested, scheme.dateStarted);
          }
          
          // Get units (either provided or calculated from NAV)
          let units = scheme.units || 0;
          let currentNav: number | undefined;
          let currentValue: number | undefined;
          let lastUpdated: string | undefined;
          
          try {
            // Try to get current NAV using scheme code or name
            if (scheme.schemeCode) {
              console.log(`Using scheme code ${scheme.schemeCode} to fetch NAV`);
              const { getLatestNAV } = await import('@/services/mfApiService');
              const navData = await getLatestNAV(scheme.schemeCode);
              
              if (navData) {
                currentNav = parseFloat(navData.nav);
                lastUpdated = navData.date;
              }
            } else {
              // Fallback to using scheme name and AMC
              console.log(`Using scheme name and AMC to fetch NAV: ${scheme.schemeName}, ${scheme.amc}`);
              currentNav = await getCurrentNav(scheme.schemeName, scheme.amc);
              
              if (currentNav) {
                lastUpdated = new Date().toISOString();
              }
            }
            
            if (currentNav) {
              // Calculate units if not provided
              if (units === 0) {
                units = calculatedAmount / currentNav;
              }
              
              // Calculate remaining units after redemptions
              const remainingUnits = calculateRemainingUnits(units, scheme.redemptions);
              
              // Calculate current value based on remaining units
              currentValue = remainingUnits * currentNav;
            }
          } catch (error) {
            console.error('Error fetching NAV:', error);
          }

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
            currentNav,
            currentValue,
            lastUpdated,
            units,
            redemptions: scheme.redemptions || [],
            netAmount: Math.max(0, netAmount)
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

  // Create shareable text function
  const createShareableText = () => {
    if (!investor) return "";
    
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
      text += `💰 Investment Schemes\n`;
      
      investor.schemes.forEach((scheme, index) => {
        const schemeData = calculatedSchemes[index];
        if (!schemeData) return;
        
        const calculatedAmount = schemeData.calculated || scheme.amountInvested;
        const currentNav = schemeData.currentNav;
        const units = schemeData.units;
        const redemptions = schemeData.redemptions;
        
        // Calculate remaining units after redemptions
        const totalUnitsRedeemed = redemptions.reduce((total, redemption) => total + (redemption.units || 0), 0);
        const remainingUnits = Math.max(0, units - totalUnitsRedeemed);
        
        // Calculate current value based on remaining units, not total units
        const currentValue = currentNav ? remainingUnits * currentNav : schemeData.currentValue;
        const lastUpdated = schemeData.lastUpdated;
        
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
        
        if (currentNav) {
          text += `Current NAV: ${currentNav.toFixed(2)}\n`;
        }
        
        if (currentValue !== undefined) {
          text += `Current Value: ${formatCurrency(currentValue)}\n`;
        }
        
        text += scheme.arnCode ? `ARN Code: ${scheme.arnCode}\n` : '';
        
        if (lastUpdated) {
          text += `Last Updated: ${formatDateString(lastUpdated)}\n`;
        }
        
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
      if (navigator.share) {
        // Use Web Share API if available
        await navigator.share({
          title: `${investor.name}'s Investment Details`,
          text: shareText
        });
        toast("Shared successfully", {
          description: "Investor details have been shared."
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareText);
        toast("Copied to clipboard", {
          description: "Comprehensive investor details have been copied to clipboard."
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast("Sharing failed", {
          description: "There was an error sharing the investor details."
      });
    }
  };
  
  // Update the InvestorCard component to include the calculated SIP amounts, NAV data and net amounts after redemptions
  const investorWithCalculatedData = investor ? {
    ...investor,
    schemes: investor.schemes.map((scheme, index) => {
      const schemeData = calculatedSchemes[index];
      
      if (!schemeData) return scheme;
      
      // Calculate remaining units after redemptions
      const totalUnitsRedeemed = (schemeData.redemptions || []).reduce((total, redemption) => 
        total + (redemption.units || 0), 0);
      const remainingUnits = Math.max(0, schemeData.units - totalUnitsRedeemed);
      
      // Calculate current value based on remaining units, not total units
      const currentValue = schemeData.currentNav 
        ? remainingUnits * schemeData.currentNav 
        : schemeData.currentValue;
      
      return {
        ...scheme,
        calculatedAmount: schemeData.calculated,
        netAmount: schemeData.netAmount, // Add the net amount after redemptions
        currentNav: schemeData.currentNav,
        currentValue: currentValue,
        lastUpdated: schemeData.lastUpdated,
        units: schemeData.units || scheme.units || 0
      };
    })
  } : null;
  
  if (!investor) return null;
  
  return (
    <section className="animate-fade-in glass-card p-2 rounded-lg mb-8">
      <div className="flex justify-between items-center mb-4 p-3 glass bg-blue-900/20 backdrop-blur-md rounded-t-lg">
        <h3 className="text-xl font-semibold text-blue-300">Investor Details</h3>
        
        <div className="flex gap-2">
          {onEditInvestor && (
            <Button
              onClick={() => onEditInvestor(investor.pan)}
              variant="outline"
              size="sm"
              className="text-amber-400 border-amber-800/30 hover:bg-amber-900/20 hover:text-amber-300 transition-all duration-300 hover:shadow-sm glass"
            >
              <Pencil className="h-4 w-4 mr-2" /> Edit
            </Button>
          )}
          
          <Button
            onClick={() => {}} // Handle share functionality
            variant="outline"
            size="sm"
            className="text-blue-400 border-blue-800/30 hover:bg-blue-900/20 hover:text-blue-300 transition-all duration-300 hover:shadow-sm glass"
          >
            <Share2 className="h-4 w-4 mr-2" /> Share
          </Button>
        </div>
      </div>
      
      <div className="transition-all duration-300 hover:shadow-md glass backdrop-blur-md">
        <InvestorCard investor={investorWithCalculatedData} />
      </div>
    </section>
  );
};

export default InvestorDetailsSection;
