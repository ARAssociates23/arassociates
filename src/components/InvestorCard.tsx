
import React from 'react';
import { InvestorDetails, RedemptionDetail } from '@/types/investor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { formatDateString } from '@/services/navService';

interface InvestorCardProps {
  investor: InvestorDetails;
}

const InvestorCard: React.FC<InvestorCardProps> = ({ investor }) => {
  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  // Helper function to format date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Not available';
    try {
      return formatDateString(dateString);
    } catch (error) {
      return dateString;
    }
  };

  // Helper to calculate total amount redeemed for a scheme
  const calculateTotalRedemption = (redemptions: RedemptionDetail[] = []) => {
    return redemptions.reduce((total, redemption) => {
      if (redemption.amount) return total + redemption.amount;
      if (redemption.units && redemption.nav) return total + (redemption.units * redemption.nav);
      return total;
    }, 0);
  };

  // Helper to calculate total units redeemed for a scheme
  const calculateTotalUnitsRedeemed = (redemptions: RedemptionDetail[] = []) => {
    return redemptions.reduce((total, redemption) => total + (redemption.units || 0), 0);
  };

  return (
    <Card className="w-full mb-4 overflow-hidden glass-card transition-all duration-300 hover:shadow-xl">
      <CardHeader className="bg-finance-highlight/70 dark:bg-finance-highlight backdrop-blur-sm">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-finance text-xl dark:text-green-400">{investor.name}</CardTitle>
            <CardDescription className="flex items-center gap-2 dark:text-gray-200">
              <span className="font-semibold">PAN:</span> {investor.pan}
              <Separator orientation="vertical" className="h-4" />
              <span className="font-semibold">Mobile:</span> {investor.mobile}
            </CardDescription>
          </div>
          <Badge variant="outline" className="border-finance text-finance dark:border-green-400 dark:text-green-400">
            {investor.residentialStatus}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4 relative">
        <div className="space-y-4">
          {/* Contact Details */}
          <div>
            <h3 className="text-lg font-semibold text-finance dark:text-green-400 mb-2">Contact Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 dark:text-gray-400">Address</span>
                <span className="dark:text-gray-200">{investor.address || 'Not Provided'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 dark:text-gray-400">Email</span>
                <span className="dark:text-gray-200">{investor.email || 'Not Provided'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 dark:text-gray-400">Nationality</span>
                <span className="dark:text-gray-200">{investor.nationality || 'Not Provided'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 dark:text-gray-400">Annual Income</span>
                <span className="dark:text-gray-200">{investor.annualIncome || 'Not Provided'}</span>
              </div>
            </div>
          </div>

          <Separator className="dark:bg-gray-700/50" />

          {/* Nominee Details */}
          <div>
            <h3 className="text-lg font-semibold text-finance dark:text-green-400 mb-2">Nominee Details</h3>
            {investor.nomineeName ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Name</span>
                  <span className="dark:text-gray-200">{investor.nomineeName}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Relationship</span>
                  <span className="dark:text-gray-200">{investor.nomineeRelationship || 'Not Provided'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Date of Birth</span>
                  <span className="dark:text-gray-200">{formatDate(investor.nomineeDob) || 'Not Provided'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Aadhar Card No.</span>
                  <span className="dark:text-gray-200">{investor.nomineeAadhar || 'Not Provided'}</span>
                </div>
                {investor.nomineeIsNri && (
                  <>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Passport No.</span>
                      <span className="dark:text-gray-200">{investor.nomineePassport || 'Not Provided'}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Expiry Date</span>
                      <span className="dark:text-gray-200">{formatDate(investor.nomineeExpiryDate) || 'Not Provided'}</span>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground dark:text-gray-300">No nominee details provided</p>
            )}
          </div>

          <Separator className="dark:bg-gray-700/50" />

          {/* Bank Details */}
          <div>
            <h3 className="text-lg font-semibold text-finance dark:text-green-400 mb-2">Bank Details</h3>
            {investor.bankName ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Bank Name</span>
                  <span className="dark:text-gray-200">{investor.bankName}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Branch</span>
                  <span className="dark:text-gray-200">{investor.bankBranch || 'Not Provided'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Account Number</span>
                  <span className="dark:text-gray-200">{investor.accountNumber || 'Not Provided'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 dark:text-gray-400">IFSC</span>
                  <span className="dark:text-gray-200">{investor.ifsc || 'Not Provided'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Account Type</span>
                  <span className="dark:text-gray-200">{investor.accountType || 'Not Provided'}</span>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground dark:text-gray-300">No bank details provided</p>
            )}
          </div>

          <Separator className="dark:bg-gray-700/50" />

          {/* Scheme Details */}
          <div>
            <h3 className="text-lg font-semibold text-finance dark:text-green-400 mb-2">Scheme Details</h3>
            {investor.schemes && investor.schemes.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse min-w-full">
                  <thead>
                    <tr className="bg-finance-highlight/70 dark:bg-gray-800/80 text-finance dark:text-green-400 text-left">
                      <th className="p-2">AMC</th>
                      <th className="p-2">Scheme</th>
                      <th className="p-2">Folio No.</th>
                      <th className="p-2">SIP/LS</th>
                      <th className="p-2">Amount</th>
                      <th className="p-2">Total</th>
                      <th className="p-2">Units</th>
                      <th className="p-2">Current NAV</th>
                      <th className="p-2">Last Updated</th>
                      <th className="p-2">Current Value</th>
                      <th className="p-2">Date Started</th>
                      <th className="p-2">ARN Code</th>
                    </tr>
                  </thead>
                  <tbody>
                    {investor.schemes.map((scheme, index) => {
                      // Calculate remaining units after redemptions
                      const totalUnitsRedeemed = calculateTotalUnitsRedeemed(scheme.redemptions);
                      const remainingUnits = (scheme.units || 0) - totalUnitsRedeemed;
                      
                      return (
                        <React.Fragment key={index}>
                          <tr className={index % 2 === 0 ? 'bg-white/50 dark:bg-gray-800/30' : 'bg-gray-50/80 dark:bg-gray-700/20'}>
                            <td className="p-2 border-t border-gray-200 dark:border-gray-700/50 dark:text-gray-200">{scheme.amc}</td>
                            <td className="p-2 border-t border-gray-200 dark:border-gray-700/50 dark:text-gray-200">{scheme.schemeName}</td>
                            <td className="p-2 border-t border-gray-200 dark:border-gray-700/50 font-medium dark:text-gray-200">{scheme.folioNo}</td>
                            <td className="p-2 border-t border-gray-200 dark:border-gray-700/50 dark:text-gray-200">{scheme.sipLs}</td>
                            <td className="p-2 border-t border-gray-200 dark:border-gray-700/50 dark:text-gray-200">{formatCurrency(scheme.amountInvested)}</td>
                            <td className="p-2 border-t border-gray-200 dark:border-gray-700/50 dark:text-gray-200">
                              {scheme.sipLs === "SIP" && scheme.calculatedAmount 
                                ? formatCurrency(scheme.calculatedAmount)
                                : scheme.sipLs === "SIP" 
                                  ? "Calculating..."
                                  : formatCurrency(scheme.amountInvested)}
                            </td>
                            <td className="p-2 border-t border-gray-200 dark:border-gray-700/50 dark:text-gray-200">
                              {scheme.units ? 
                                <div>
                                  <div>{scheme.units.toFixed(3)}</div>
                                  {totalUnitsRedeemed > 0 && (
                                    <div className="text-xs text-green-600 dark:text-green-400">
                                      Remaining: {remainingUnits.toFixed(3)}
                                    </div>
                                  )}
                                </div> : 'N/A'}
                            </td>
                            <td className="p-2 border-t border-gray-200 dark:border-gray-700/50 text-right dark:text-gray-200">
                              {scheme.currentNav 
                                ? scheme.currentNav.toFixed(2)
                                : "Fetching..."}
                            </td>
                            <td className="p-2 border-t border-gray-200 dark:border-gray-700/50 text-xs dark:text-gray-300">
                              {scheme.lastUpdated 
                                ? formatDate(scheme.lastUpdated)
                                : "Not available"}
                            </td>
                            <td className="p-2 border-t border-gray-200 dark:border-gray-700/50 dark:text-gray-200">
                              {scheme.currentValue 
                                ? formatCurrency(scheme.currentValue)
                                : "Calculating..."}
                            </td>
                            <td className="p-2 border-t border-gray-200 dark:border-gray-700/50 dark:text-gray-200">{formatDate(scheme.dateStarted) || 'N/A'}</td>
                            <td className="p-2 border-t border-gray-200 dark:border-gray-700/50 dark:text-gray-200">{scheme.arnCode}</td>
                          </tr>
                          
                          {/* Redemptions sub-table */}
                          {scheme.redemptions && scheme.redemptions.length > 0 && (
                            <tr>
                              <td colSpan={12} className="p-0 bg-gray-50/50 dark:bg-gray-800/20">
                                <div className="px-8 py-2">
                                  <p className="text-xs font-semibold mb-1 text-finance dark:text-green-400">Redemption History</p>
                                  <table className="w-full text-xs">
                                    <thead>
                                      <tr className="text-left bg-gray-100/80 dark:bg-gray-700/30">
                                        <th className="p-1 dark:text-gray-200">Date</th>
                                        <th className="p-1 dark:text-gray-200">Units</th>
                                        <th className="p-1 dark:text-gray-200">NAV</th>
                                        <th className="p-1 dark:text-gray-200">Amount</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {scheme.redemptions.map((redemption, redIndex) => (
                                        <tr key={redIndex} className="border-t border-gray-100 dark:border-gray-700/30">
                                          <td className="p-1 dark:text-gray-200">{formatDate(redemption.date)}</td>
                                          <td className="p-1 dark:text-gray-200">{redemption.units.toFixed(3)}</td>
                                          <td className="p-1 dark:text-gray-200">{redemption.nav ? redemption.nav.toFixed(2) : 'N/A'}</td>
                                          <td className="p-1 dark:text-gray-200">
                                            {redemption.amount 
                                              ? formatCurrency(redemption.amount)
                                              : redemption.nav 
                                                ? formatCurrency(redemption.units * redemption.nav)
                                                : 'N/A'
                                            }
                                          </td>
                                        </tr>
                                      ))}
                                      <tr className="bg-gray-100/80 dark:bg-gray-700/30 font-semibold">
                                        <td className="p-1 dark:text-gray-200" colSpan={2}>Total Redeemed</td>
                                        <td className="p-1 dark:text-gray-200">{totalUnitsRedeemed.toFixed(3)} units</td>
                                        <td className="p-1 dark:text-gray-200">{formatCurrency(calculateTotalRedemption(scheme.redemptions))}</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-muted-foreground dark:text-gray-300">No scheme details available</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestorCard;
