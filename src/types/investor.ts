
export type InvestorDetails = {
  pan: string;
  name: string;
  address: string;
  mobile: string;
  email: string;
  residentialStatus: string;
  nationality: string;
  annualIncome: string;
  mothersName: string;
  occupation: string;
  
  // Nominee details
  nomineeName: string;
  nomineeDob: string;
  nomineeRelationship: string;
  nomineeAadhar: string;
  nomineeIsNri: boolean;
  nomineePassport: string;
  nomineeExpiryDate: string;
  nomineeAddress: string;
  
  // Bank details
  bankName: string;
  bankBranch: string;
  accountNumber: string;
  ifsc: string;
  accountType: string;
  
  // Scheme details
  schemes: SchemeDetail[];
};

export type SchemeDetail = {
  amc: string;
  schemeName: string;
  folioNo: string;
  sipLs: string; // SIP or LS
  amountInvested: number;
  dateStarted: string;
  arnCode: string;
};
