import { z } from "zod";

// Schema for redemption
export const redemptionSchema = z.object({
  date: z.string().min(1, "Date is required"),
  units: z.number().min(0.001, "Units must be greater than 0"),
  amount: z.number().optional(),
  nav: z.number().optional()
});

// Schema for mutual fund schemes
export const schemeSchema = z.object({
  amc: z.string().min(1, "AMC is required"),
  schemeName: z.string().min(1, "Scheme name is required"),
  folioNo: z.string().min(1, "Folio number is required"),
  isin: z.string().optional(),
  ticker: z.string().optional(),  // New optional ticker field
  sipLs: z.enum(["SIP", "LS"]),
  amountInvested: z.number().min(1, "Amount must be greater than 0"),
  dateStarted: z.string().optional(),
  arnCode: z.string(),
  redemptions: z.array(redemptionSchema).optional()
});

// Complete investor schema
export const investorSchema = z.object({
  // Personal information
  pan: z.string().min(10, "PAN must be at least 10 characters").toUpperCase(),
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  mobile: z.string().min(10, "Mobile number must be at least 10 digits"),
  email: z.string().email("Invalid email address"),
  residentialStatus: z.string().min(1, "Residential status is required"),
  nationality: z.string().min(1, "Nationality is required"),
  annualIncome: z.string(),
  mothersName: z.string(),
  occupation: z.string(),
  
  // Nominee details
  nomineeName: z.string(),
  nomineeDob: z.string(),
  nomineeRelationship: z.string(),
  nomineeAadhar: z.string(),
  nomineeIsNri: z.boolean().default(false),
  nomineePassport: z.string(),
  nomineeExpiryDate: z.string(),
  nomineeAddress: z.string(),
  
  // Bank details
  bankName: z.string().min(1, "Bank name is required"),
  bankBranch: z.string(),
  accountNumber: z.string().min(1, "Account number is required"),
  ifsc: z.string().min(1, "IFSC code is required"),
  accountType: z.string().min(1, "Account type is required"),
  
  // Investment schemes
  schemes: z.array(schemeSchema).min(1, "At least one scheme is required")
});

// Define the form values type from the schema
export type InvestorFormValues = z.infer<typeof investorSchema>;
