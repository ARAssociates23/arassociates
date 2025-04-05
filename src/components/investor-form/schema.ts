
import { z } from "zod";

// Schema for the investor form
export const schemeSchema = z.object({
  amc: z.string().min(1, "AMC is required"),
  schemeName: z.string().min(1, "Scheme name is required"),
  folioNo: z.string().min(1, "Folio number is required"),
  sipLs: z.enum(["SIP", "LS"]),
  amountInvested: z.number().min(0, "Amount must be a positive number"),
  dateStarted: z.string(),
  arnCode: z.string(),
});

export const investorSchema = z.object({
  pan: z.string().min(10, "Valid PAN is required").max(10, "PAN must be exactly 10 characters"),
  name: z.string().min(1, "Name is required"),
  address: z.string(),
  mobile: z.string().min(10, "Valid mobile number is required").max(10, "Mobile number must be exactly 10 digits"),
  email: z.string().email("Invalid email address"),
  residentialStatus: z.string(),
  nationality: z.string(),
  annualIncome: z.string(),
  mothersName: z.string(),
  occupation: z.string(),
  
  // Nominee details
  nomineeName: z.string(),
  nomineeDob: z.string(),
  nomineeRelationship: z.string(),
  nomineeAadhar: z.string(),
  nomineeIsNri: z.boolean(),
  nomineePassport: z.string(),
  nomineeExpiryDate: z.string(),
  nomineeAddress: z.string(),
  
  // Bank details
  bankName: z.string().min(1, "Bank name is required"),
  bankBranch: z.string(),
  accountNumber: z.string().min(1, "Account number is required"),
  ifsc: z.string(),
  accountType: z.string().min(1, "Account type is required"),
  
  // Scheme details
  schemes: z.array(schemeSchema).min(1, "At least one scheme is required"),
});

// Define the form values type from the schema
export type InvestorFormValues = z.infer<typeof investorSchema>;
