
import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { ArrowLeft } from "lucide-react";
import { InvestorDetails, emptyInvestor } from "@/types/investor";

import { Form } from "@/components/ui/form";
import { 
  Sheet, 
  SheetClose, 
  SheetContent, 
  SheetHeader, 
  SheetTitle 
} from "./ui/sheet";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Import refactored components
import { investorSchema, InvestorFormValues } from "./investor-form/schema";
import PersonalInfoSection from "./investor-form/PersonalInfoSection";
import NomineeSection from "./investor-form/NomineeSection";
import BankDetailsSection from "./investor-form/BankDetailsSection";
import SchemesSection from "./investor-form/SchemesSection";
import FormActions from "./investor-form/FormActions";

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

  const fieldArray = useFieldArray({
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
          <div className="flex items-center justify-between">
            <SheetClose asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </SheetClose>
            <SheetTitle className="text-finance text-xl font-bold">
              {isEditing ? "Edit Investor" : "Add New Investor"}
            </SheetTitle>
            <div className="w-8"></div> {/* Spacer to center the title */}
          </div>
        </SheetHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-32 lg:pb-10">
            {/* Personal Information Section */}
            <PersonalInfoSection control={form.control} isEditing={isEditing} />
            
            {/* Nominee Details Section */}
            <NomineeSection control={form.control} watch={form.watch} />
            
            {/* Bank Details Section */}
            <BankDetailsSection control={form.control} />
            
            {/* Investment Schemes Section - Pass all required props */}
            <SchemesSection 
              control={form.control} 
              fieldArray={fieldArray} 
              register={form.register}
              setValue={form.setValue}
              getValues={form.getValues}
              errors={form.formState.errors}
              watch={form.watch}
            />

            {/* Form Actions */}
            <FormActions isEditing={isEditing} />
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default InvestorForm;
