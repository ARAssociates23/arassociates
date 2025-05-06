
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
  isin?: string;
  ticker?: string;  // New field for API Ninjas integration
  sipLs: "SIP" | "LS";
  amountInvested: number;
  calculatedAmount?: number;
  netAmount?: number;
  units?: number;
  currentNav?: number;
  currentValue?: number;
  lastUpdated?: string;
  dateStarted?: string;
  arnCode: string;
  redemptions?: RedemptionDetail[];
};

export type RedemptionDetail = {
  date: string;
  units: number;
  amount?: number;
  nav?: number;
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
    arnCode: "",
    units: 0,
    redemptions: []
  }]
};

// Interface for AMFI NAV data response
export interface AmfiNavData {
  schemeCode: string;
  schemeName: string;
  nav: string;
  date: string;
}
