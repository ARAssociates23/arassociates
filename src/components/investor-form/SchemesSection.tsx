
import React from "react";
import { Control, UseFieldArrayReturn, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Plus, Info } from "lucide-react";
import SchemeItem from "./SchemeItem";
import { InvestorFormValues } from "./schema";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SchemesSectionProps {
  control: Control<InvestorFormValues>;
  fieldArray: UseFieldArrayReturn<InvestorFormValues, "schemes", "id">;
  register: any;
  setValue: any;
  getValues: any;
  errors: any;
  watch: any;
}

const SchemesSection: React.FC<SchemesSectionProps> = ({ 
  control, 
  fieldArray,
  register,
  setValue,
  getValues,
  errors,
  watch
}) => {
  const { fields, append, remove } = fieldArray;

  // Function to add a new redemption
  const appendRedemption = (schemeIndex: number) => {
    const currentRedemptions = getValues(`schemes.${schemeIndex}.redemptions`) || [];
    setValue(`schemes.${schemeIndex}.redemptions`, [
      ...currentRedemptions,
      {
        date: new Date().toISOString(),
        units: 0
      }
    ]);
  };

  // Function to remove a redemption
  const removeRedemption = (schemeIndex: number, redemptionIndex: number) => {
    const currentRedemptions = [...getValues(`schemes.${schemeIndex}.redemptions`)];
    currentRedemptions.splice(redemptionIndex, 1);
    setValue(`schemes.${schemeIndex}.redemptions`, currentRedemptions);
  };
  
  // Function to add a new scheme with default values
  const handleAddScheme = () => {
    append({
      amc: "",
      schemeName: "",
      folioNo: "",
      schemeCode: "",
      isin: "",  // Add ISIN field with empty default
      sipLs: "SIP",
      amountInvested: 0,
      dateStarted: "",
      arnCode: "",
      units: 0,
      redemptions: []
    });
  };

  return (
    <div className="bg-finance-highlight p-4 rounded-md mb-4">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <h3 className="text-lg font-semibold text-finance">Investment Schemes</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="ml-2 text-gray-500 hover:text-gray-700">
                  <Info className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p>For SIP investments, the total invested amount will be calculated automatically based on the start date and monthly investment amount.</p>
                <p className="mt-1">You can provide an ISIN code to automatically fetch NAV data when available.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddScheme}
        >
          <Plus className="h-4 w-4 mr-1" /> Add Scheme
        </Button>
      </div>
      
      {fields.map((field, index) => (
        <SchemeItem 
          key={field.id}
          control={control}
          index={index}
          register={register}
          setValue={setValue}
          getValues={getValues}
          errors={errors}
          append={handleAddScheme}
          remove={() => remove(index)}
          appendRedemption={appendRedemption}
          removeRedemption={removeRedemption}
          watch={watch}
        />
      ))}
    </div>
  );
};

export default SchemesSection;
