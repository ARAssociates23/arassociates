
import React from 'react';
import { InvestorDetails } from '@/types/investor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

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

  return (
    <Card className="w-full mb-4 overflow-hidden border-finance-light hover:shadow-md transition-shadow duration-300">
      <CardHeader className="bg-finance-highlight">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-finance text-xl">{investor.name}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <span className="font-semibold">PAN:</span> {investor.pan}
              <Separator orientation="vertical" className="h-4" />
              <span className="font-semibold">Mobile:</span> {investor.mobile}
            </CardDescription>
          </div>
          <Badge variant="outline" className="border-finance text-finance">
            {investor.residentialStatus}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          {/* Contact Details */}
          <div>
            <h3 className="text-lg font-semibold text-finance mb-2">Contact Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Address</span>
                <span>{investor.address || 'Not Provided'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Email</span>
                <span>{investor.email || 'Not Provided'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Nationality</span>
                <span>{investor.nationality || 'Not Provided'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Annual Income</span>
                <span>{investor.annualIncome || 'Not Provided'}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Nominee Details */}
          <div>
            <h3 className="text-lg font-semibold text-finance mb-2">Nominee Details</h3>
            {investor.nomineeName ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Name</span>
                  <span>{investor.nomineeName}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Relationship</span>
                  <span>{investor.nomineeRelationship || 'Not Provided'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Date of Birth</span>
                  <span>{investor.nomineeDob || 'Not Provided'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Aadhar Card No.</span>
                  <span>{investor.nomineeAadhar || 'Not Provided'}</span>
                </div>
                {investor.nomineeIsNri && (
                  <>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Passport No.</span>
                      <span>{investor.nomineePassport || 'Not Provided'}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Expiry Date</span>
                      <span>{investor.nomineeExpiryDate || 'Not Provided'}</span>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">No nominee details provided</p>
            )}
          </div>

          <Separator />

          {/* Bank Details */}
          <div>
            <h3 className="text-lg font-semibold text-finance mb-2">Bank Details</h3>
            {investor.bankName ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Bank Name</span>
                  <span>{investor.bankName}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Branch</span>
                  <span>{investor.bankBranch || 'Not Provided'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Account Number</span>
                  <span>{investor.accountNumber || 'Not Provided'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">IFSC</span>
                  <span>{investor.ifsc || 'Not Provided'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Account Type</span>
                  <span>{investor.accountType || 'Not Provided'}</span>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No bank details provided</p>
            )}
          </div>

          <Separator />

          {/* Scheme Details */}
          <div>
            <h3 className="text-lg font-semibold text-finance mb-2">Scheme Details</h3>
            {investor.schemes && investor.schemes.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse min-w-full">
                  <thead>
                    <tr className="bg-finance-highlight text-finance text-left">
                      <th className="p-2">AMC</th>
                      <th className="p-2">Scheme</th>
                      <th className="p-2">Folio No.</th>
                      <th className="p-2">SIP/LS</th>
                      <th className="p-2">Amount</th>
                      <th className="p-2">Total</th>
                      <th className="p-2">Date Started</th>
                      <th className="p-2">ARN Code</th>
                    </tr>
                  </thead>
                  <tbody>
                    {investor.schemes.map((scheme, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="p-2 border-t">{scheme.amc}</td>
                        <td className="p-2 border-t">{scheme.schemeName}</td>
                        <td className="p-2 border-t font-medium">{scheme.folioNo}</td>
                        <td className="p-2 border-t">{scheme.sipLs}</td>
                        <td className="p-2 border-t">{formatCurrency(scheme.amountInvested)}</td>
                        <td className="p-2 border-t">
                          {scheme.sipLs === "SIP" && scheme.calculatedAmount 
                            ? formatCurrency(scheme.calculatedAmount)
                            : scheme.sipLs === "SIP" 
                              ? "Calculating..."
                              : formatCurrency(scheme.amountInvested)}
                        </td>
                        <td className="p-2 border-t">{scheme.dateStarted || 'N/A'}</td>
                        <td className="p-2 border-t">{scheme.arnCode}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-muted-foreground">No scheme details available</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestorCard;
