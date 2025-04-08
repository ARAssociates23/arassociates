
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
  sipLs: "SIP" | "LS"; // Changed from string to union type
  amountInvested: number;
  dateStarted: string;
  arnCode: string;
  schemeCode?: string; // New field for AMFI scheme code
  isin?: string; // New field for ISIN
  calculatedAmount?: number; // Optional calculated amount for SIPs
  currentNav?: number; // Optional current NAV value
  currentValue?: number; // Optional current value (units * NAV)
  lastUpdated?: string; // When the NAV was last updated
};

// New investor form initial values
export const emptyInvestor: InvestorDetails = {
  pan: "",
  name: "",
  address: "",
  mobile: "",
  email: "",
  residentialStatus: "",
  nationality: "INDIAN",
  annualIncome: "",
  mothersName: "",
  occupation: "",
  
  nomineeName: "",
  nomineeDob: "",
  nomineeRelationship: "",
  nomineeAadhar: "",
  nomineeIsNri: false,
  nomineePassport: "",
  nomineeExpiryDate: "",
  nomineeAddress: "",
  
  bankName: "",
  bankBranch: "",
  accountNumber: "",
  ifsc: "",
  accountType: "",
  
  schemes: [{
    amc: "",
    schemeName: "",
    folioNo: "",
    sipLs: "SIP",
    amountInvested: 0,
    dateStarted: "",
    arnCode: ""
  }]
};

// Interface for AMFI NAV data response
export interface AmfiNavData {
  schemeCode: string;
  schemeName: string;
  nav: string;
  date: string;
}
