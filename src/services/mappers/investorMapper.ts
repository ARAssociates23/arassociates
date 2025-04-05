
import { InvestorDetails, SchemeDetail } from '@/types/investor';
import { InvestorRow } from '../types/investorTypes';

// Helper function to map database investor to application investor format
export const mapDbInvestorToAppInvestor = (investor: InvestorRow): InvestorDetails => {
  // Parse JSON fields if they exist
  let schemes: SchemeDetail[] = [];
  try {
    if (investor.schemes) {
      schemes = JSON.parse(JSON.stringify(investor.schemes)) as SchemeDetail[];
    }
  } catch (e) {
    console.error('Error parsing schemes:', e);
  }

  let nomineeDetails = {} as Record<string, any>;
  try {
    if (investor.nominee_details) {
      nomineeDetails = JSON.parse(JSON.stringify(investor.nominee_details)) || {};
    }
  } catch (e) {
    console.error('Error parsing nominee details:', e);
  }

  return {
    pan: investor.pan,
    name: investor.name,
    address: investor.address || '',
    mobile: investor.mobile || '',
    email: investor.email || '',
    residentialStatus: investor.residential_status || '',
    nationality: investor.nationality || 'INDIAN',
    annualIncome: investor.annual_income || '',
    mothersName: investor.mothers_name || '',
    occupation: investor.occupation || '',
    
    // Nominee details
    nomineeName: nomineeDetails?.nomineeName || '',
    nomineeDob: nomineeDetails?.nomineeDob || '',
    nomineeRelationship: nomineeDetails?.nomineeRelationship || '',
    nomineeAadhar: nomineeDetails?.nomineeAadhar || '',
    nomineeIsNri: nomineeDetails?.nomineeIsNri || false,
    nomineePassport: nomineeDetails?.nomineePassport || '',
    nomineeExpiryDate: nomineeDetails?.nomineeExpiryDate || '',
    nomineeAddress: nomineeDetails?.nomineeAddress || '',
    
    // Bank details
    bankName: investor.bank_name || '',
    bankBranch: investor.bank_branch || '',
    accountNumber: investor.account_number || '',
    ifsc: investor.ifsc || '',
    accountType: investor.account_type || '',
    
    // Scheme details - use parsed schemes or default to a basic scheme
    schemes: schemes.length > 0 ? schemes : [{
      amc: '',
      schemeName: '',
      folioNo: investor.folio_number || '',
      sipLs: 'SIP',
      amountInvested: 0,
      dateStarted: '',
      arnCode: investor.arn || ''
    }]
  };
};

// Get prepared nominee details as JSON object from investor
export const mapInvestorToNomineeDetails = (investor: InvestorDetails): Record<string, any> => {
  return {
    nomineeName: investor.nomineeName,
    nomineeDob: investor.nomineeDob,
    nomineeRelationship: investor.nomineeRelationship,
    nomineeAadhar: investor.nomineeAadhar,
    nomineeIsNri: investor.nomineeIsNri,
    nomineePassport: investor.nomineePassport,
    nomineeExpiryDate: investor.nomineeExpiryDate,
    nomineeAddress: investor.nomineeAddress
  };
};
