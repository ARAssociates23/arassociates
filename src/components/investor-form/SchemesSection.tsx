
import React from "react";
import { Control, UseFieldArrayReturn, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Plus, InfoCircle } from "lucide-react";
import SchemeItem from "./SchemeItem";
import { InvestorFormValues } from "./schema";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SchemesSectionProps {
  control: Control<InvestorFormValues>;
  fieldArray: UseFieldArrayReturn<InvestorFormValues, "schemes", "id">;
}

const SchemesSection: React.FC<SchemesSectionProps> = ({ control, fieldArray }) => {
  const { fields, append, remove } = fieldArray;

  return (
    <div className="bg-finance-highlight p-4 rounded-md mb-4">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <h3 className="text-lg font-semibold text-finance">Investment Schemes</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="ml-2 text-gray-500 hover:text-gray-700">
                  <InfoCircle className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p>For SIP investments, the total invested amount will be calculated automatically based on the start date and monthly investment amount.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
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
        <SchemeItem 
          key={field.id}
          control={control}
          index={index}
          canRemove={fields.length > 1}
          onRemove={() => remove(index)}
        />
      ))}
    </div>
  );
};

export default SchemesSection;
