
import React from "react";
import { Control, UseFieldArrayReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import SchemeItem from "./SchemeItem";
import { InvestorFormValues } from "./schema";

interface SchemesSectionProps {
  control: Control<InvestorFormValues>;
  fieldArray: UseFieldArrayReturn<InvestorFormValues, "schemes", "id">;
}

const SchemesSection: React.FC<SchemesSectionProps> = ({ control, fieldArray }) => {
  const { fields, append, remove } = fieldArray;

  return (
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
