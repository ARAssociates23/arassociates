
import React from "react";
import { Control } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { InvestorFormValues } from "./schema";

interface SchemeItemProps {
  control: Control<InvestorFormValues>;
  index: number;
  canRemove: boolean;
  onRemove: () => void;
}

const SchemeItem: React.FC<SchemeItemProps> = ({ control, index, canRemove, onRemove }) => {
  return (
    <div className="border rounded-md p-4 mb-4">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-medium">Scheme {index + 1}</h4>
        {canRemove && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
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
          control={control}
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
          control={control}
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
          control={control}
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
          control={control}
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
          control={control}
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
          control={control}
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
  );
};

export default SchemeItem;
