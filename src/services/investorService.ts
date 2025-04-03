
import { InvestorDetails } from '../types/investor';

// Mock data based on the image
const investors: InvestorDetails[] = [
  {
    pan: "AWZPN8725C",
    name: "WIEZIJVI NYUWI",
    address: "Address as per AADHAR",
    mobile: "9986635982",
    email: "richbond.will123@gmail.com",
    residentialStatus: "RESIDENT INDIVIDIAL/NON RESIDENT",
    nationality: "INDIAN",
    annualIncome: "",
    mothersName: "",
    occupation: "",
    
    // Nominee details
    nomineeName: "",
    nomineeDob: "",
    nomineeRelationship: "",
    nomineeAadhar: "",
    nomineeIsNri: true,
    nomineePassport: "",
    nomineeExpiryDate: "",
    nomineeAddress: "",
    
    // Bank details
    bankName: "",
    bankBranch: "",
    accountNumber: "",
    ifsc: "",
    accountType: "",
    
    // Scheme details
    schemes: [
      {
        amc: "SBI MUTUAL FUND",
        schemeName: "SBI CONTRA FUND",
        folioNo: "40816052",
        sipLs: "SIP",
        amountInvested: 5000,
        dateStarted: "",
        arnCode: "284804"
      }
    ]
  },
  // Add more mock data
  {
    pan: "ABCDE1234F",
    name: "JOHN SMITH",
    address: "123 Main Street",
    mobile: "9876543210",
    email: "john.smith@example.com",
    residentialStatus: "RESIDENT INDIVIDIAL",
    nationality: "INDIAN",
    annualIncome: "10,00,000",
    mothersName: "MARY SMITH",
    occupation: "SOFTWARE ENGINEER",
    
    // Nominee details
    nomineeName: "JANE SMITH",
    nomineeDob: "15-05-1990",
    nomineeRelationship: "SPOUSE",
    nomineeAadhar: "1234-5678-9012",
    nomineeIsNri: false,
    nomineePassport: "",
    nomineeExpiryDate: "",
    nomineeAddress: "123 Main Street",
    
    // Bank details
    bankName: "HDFC BANK",
    bankBranch: "MAIN BRANCH",
    accountNumber: "123456789012",
    ifsc: "HDFC0001234",
    accountType: "SAVINGS",
    
    // Scheme details
    schemes: [
      {
        amc: "HDFC MUTUAL FUND",
        schemeName: "HDFC TOP 100 FUND",
        folioNo: "50123456",
        sipLs: "SIP",
        amountInvested: 10000,
        dateStarted: "01-01-2022",
        arnCode: "123456"
      },
      {
        amc: "ICICI PRUDENTIAL",
        schemeName: "ICICI PRU BLUECHIP FUND",
        folioNo: "60123456",
        sipLs: "LS",
        amountInvested: 100000,
        dateStarted: "15-06-2021",
        arnCode: "123456"
      }
    ]
  },
  {
    pan: "XYZMN9876P",
    name: "PRIYA PATEL",
    address: "456 Park Avenue",
    mobile: "8765432109",
    email: "priya.patel@example.com",
    residentialStatus: "RESIDENT INDIVIDIAL",
    nationality: "INDIAN",
    annualIncome: "15,00,000",
    mothersName: "NEETA PATEL",
    occupation: "DOCTOR",
    
    // Nominee details
    nomineeName: "RAJ PATEL",
    nomineeDob: "22-08-1985",
    nomineeRelationship: "BROTHER",
    nomineeAadhar: "9876-5432-1098",
    nomineeIsNri: false,
    nomineePassport: "",
    nomineeExpiryDate: "",
    nomineeAddress: "456 Park Avenue",
    
    // Bank details
    bankName: "ICICI BANK",
    bankBranch: "CENTRAL BRANCH",
    accountNumber: "987654321098",
    ifsc: "ICIC0007654",
    accountType: "SAVINGS",
    
    // Scheme details
    schemes: [
      {
        amc: "AXIS MUTUAL FUND",
        schemeName: "AXIS MIDCAP FUND",
        folioNo: "70123456",
        sipLs: "SIP",
        amountInvested: 7500,
        dateStarted: "10-03-2022",
        arnCode: "345678"
      }
    ]
  }
];

// Search function that takes a query string and returns matching investors
export const searchInvestors = (query: string): InvestorDetails[] => {
  if (!query || query.trim() === '') {
    return [];
  }
  
  const normalizedQuery = query.toLowerCase().trim();
  
  return investors.filter(investor => 
    investor.name.toLowerCase().includes(normalizedQuery) ||
    investor.mobile.includes(normalizedQuery) ||
    investor.schemes.some(scheme => scheme.folioNo.toLowerCase().includes(normalizedQuery))
  );
};

// Get investor by PAN
export const getInvestorByPan = (pan: string): InvestorDetails | undefined => {
  return investors.find(investor => investor.pan === pan);
};

// Add new investor 
export const addInvestor = (investor: InvestorDetails): void => {
  investors.push(investor);
};
