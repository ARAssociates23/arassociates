
import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { ChevronDown, Plus, Save, Trash2, X } from "lucide-react";
import { InvestorDetails, emptyInvestor } from "@/types/investor";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";

// Schema for the investor form
const schemeSchema = z.object({
  amc: z.string().min(1, "AMC is required"),
  schemeName: z.string().min(1, "Scheme name is required"),
  folioNo: z.string().min(1, "Folio number is required"),
  sipLs: z.enum(["SIP", "LS"]),
  amountInvested: z.number().min(0, "Amount must be a positive number"),
  dateStarted: z.string(),
  arnCode: z.string(),
});

const investorSchema = z.object({
  pan: z.string().min(10, "Valid PAN is required").max(10, "PAN must be exactly 10 characters"),
  name: z.string().min(1, "Name is required"),
  address: z.string(), // Made optional by removing the min validation
  mobile: z.string().min(10, "Valid mobile number is required").max(10, "Mobile number must be exactly 10 digits"),
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
  nomineeIsNri: z.boolean(),
  nomineePassport: z.string(),
  nomineeExpiryDate: z.string(),
  nomineeAddress: z.string(),
  
  // Bank details
  bankName: z.string().min(1, "Bank name is required"),
  bankBranch: z.string(),
  accountNumber: z.string().min(1, "Account number is required"),
  ifsc: z.string(), // Made optional by removing the min validation
  accountType: z.string().min(1, "Account type is required"),
  
  // Scheme details
  schemes: z.array(schemeSchema).min(1, "At least one scheme is required"),
});

// This defines the type that will be returned by the form, ensuring it matches InvestorDetails
type InvestorFormValues = z.infer<typeof investorSchema>;

interface InvestorFormProps {
  onSave: (investor: InvestorDetails) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: InvestorDetails | null;
  isEditing?: boolean;
}

const InvestorForm: React.FC<InvestorFormProps> = ({ 
  onSave, 
  open, 
  onOpenChange, 
  initialData = null, 
  isEditing = false 
}) => {
  const { toast } = useToast();
  
  const form = useForm<InvestorFormValues>({
    resolver: zodResolver(investorSchema),
    defaultValues: initialData || emptyInvestor,
  });

  // Reset form when initialData changes
  useEffect(() => {
    if (open) {
      form.reset(initialData || emptyInvestor);
    }
  }, [form, initialData, open]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "schemes",
  });

  const onSubmit = (data: InvestorFormValues) => {
    // Since we've validated with zod, we can be confident that the data meets the InvestorDetails requirements
    onSave(data as InvestorDetails);
    form.reset(emptyInvestor);
    toast({
      title: isEditing ? "Investor Updated" : "Investor Added",
      description: isEditing 
        ? "Investor details have been successfully updated." 
        : "Investor details have been successfully saved.",
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl md:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-finance text-xl font-bold mb-4">
            {isEditing ? "Edit Investor" : "Add New Investor"}
          </SheetTitle>
        </SheetHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-10">
            <div className="bg-finance-highlight p-4 rounded-md mb-4">
              <h3 className="text-lg font-semibold text-finance mb-3">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="pan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PAN*</FormLabel>
                      <FormControl>
                        <Input placeholder="ABCDE1234F" {...field} disabled={isEditing} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="Full Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile*</FormLabel>
                      <FormControl>
                        <Input placeholder="10-digit mobile number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email*</FormLabel>
                      <FormControl>
                        <Input placeholder="Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Address*</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Full Address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="residentialStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Residential Status*</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="RESIDENT INDIVIDUAL">RESIDENT INDIVIDUAL</SelectItem>
                          <SelectItem value="NON RESIDENT">NON RESIDENT</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nationality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nationality*</FormLabel>
                      <FormControl>
                        <Input placeholder="Nationality" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="annualIncome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Annual Income</FormLabel>
                      <FormControl>
                        <Input placeholder="Annual Income" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="occupation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Occupation</FormLabel>
                      <FormControl>
                        <Input placeholder="Occupation" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mothersName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mother's Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Mother's Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="bg-finance-highlight p-4 rounded-md mb-4">
              <h3 className="text-lg font-semibold text-finance mb-3">Nominee Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nomineeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nominee Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Nominee Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nomineeDob"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nomineeRelationship"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relationship</FormLabel>
                      <FormControl>
                        <Input placeholder="Relationship" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nomineeAadhar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Aadhar Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Aadhar Number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nomineeIsNri"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Is NRI
                        </FormLabel>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {form.watch("nomineeIsNri") && (
                  <>
                    <FormField
                      control={form.control}
                      name="nomineePassport"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Passport Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Passport Number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="nomineeExpiryDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Passport Expiry Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
                <FormField
                  control={form.control}
                  name="nomineeAddress"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Nominee Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Nominee Address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="bg-finance-highlight p-4 rounded-md mb-4">
              <h3 className="text-lg font-semibold text-finance mb-3">Bank Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="bankName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bank Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="Bank Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bankBranch"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Branch</FormLabel>
                      <FormControl>
                        <Input placeholder="Bank Branch" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="accountNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Number*</FormLabel>
                      <FormControl>
                        <Input placeholder="Account Number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ifsc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>IFSC Code*</FormLabel>
                      <FormControl>
                        <Input placeholder="IFSC Code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="accountType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Type*</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select account type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="SAVINGS">SAVINGS</SelectItem>
                          <SelectItem value="CURRENT">CURRENT</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="bg-finance-highlight p-4 rounded-md mb-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-finance">Investment Schemes</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({
                    amc: "",
                    schemeName: "",
                    folioNo: "",
                    sipLs: "SIP",
                    amountInvested: 0,
                    dateStarted: "",
                    arnCode: ""
                  })}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Scheme
                </Button>
              </div>
              
              {fields.map((field, index) => (
                <div key={field.id} className="border rounded-md p-4 mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium">Scheme {index + 1}</h4>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`schemes.${index}.amc`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>AMC*</FormLabel>
                          <FormControl>
                            <Input placeholder="AMC Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`schemes.${index}.schemeName`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Scheme Name*</FormLabel>
                          <FormControl>
                            <Input placeholder="Scheme Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`schemes.${index}.folioNo`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Folio Number*</FormLabel>
                          <FormControl>
                            <Input placeholder="Folio Number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`schemes.${index}.sipLs`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SIP / Lumpsum*</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="SIP">SIP</SelectItem>
                              <SelectItem value="LS">Lumpsum</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`schemes.${index}.amountInvested`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount*</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="Amount Invested" 
                              {...field} 
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`schemes.${index}.dateStarted`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`schemes.${index}.arnCode`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ARN Code</FormLabel>
                          <FormControl>
                            <Input placeholder="ARN Code" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <SheetClose asChild>
                <Button variant="outline" type="button">
                  <X className="h-4 w-4 mr-1" /> Cancel
                </Button>
              </SheetClose>
              <Button type="submit">
                <Save className="h-4 w-4 mr-1" /> {isEditing ? 'Update' : 'Save'} Investor
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default InvestorForm;
