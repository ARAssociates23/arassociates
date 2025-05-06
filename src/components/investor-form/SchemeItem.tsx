
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
import { Trash2, Plus } from "lucide-react";
import { InvestorFormValues } from "./schema";

interface SchemeItemProps {
  control: Control<InvestorFormValues>;
  index: number;
  canRemove: boolean;
  onRemove: () => void;
}

const SchemeItem: React.FC<SchemeItemProps> = ({ control, index, canRemove, onRemove }) => {
  return (
    <div className="border rounded-md p-4 mb-4 dark:border-gray-700">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-medium dark:text-gray-200">Scheme {index + 1}</h4>
        {canRemove && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="dark:text-gray-300 dark:hover:text-white"
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
              <FormLabel className="dark:text-gray-300">AMC*</FormLabel>
              <FormControl>
                <Input placeholder="AMC Name" {...field} className="dark:bg-gray-800 dark:border-gray-700" />
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
              <FormLabel className="dark:text-gray-300">Scheme Name*</FormLabel>
              <FormControl>
                <Input placeholder="Scheme Name" {...field} className="dark:bg-gray-800 dark:border-gray-700" />
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
              <FormLabel className="dark:text-gray-300">Folio Number*</FormLabel>
              <FormControl>
                <Input placeholder="Folio Number" {...field} className="dark:bg-gray-800 dark:border-gray-700" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`schemes.${index}.isin`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="dark:text-gray-300">ISIN</FormLabel>
              <FormControl>
                <Input placeholder="ISIN Number" {...field} className="dark:bg-gray-800 dark:border-gray-700" />
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
              <FormLabel className="dark:text-gray-300">SIP / Lumpsum*</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="dark:bg-gray-800">
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
              <FormLabel className="dark:text-gray-300">Amount*</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Amount Invested" 
                  {...field} 
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  className="dark:bg-gray-800 dark:border-gray-700"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`schemes.${index}.units`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="dark:text-gray-300">Units</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Number of Units" 
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  className="dark:bg-gray-800 dark:border-gray-700"
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
              <FormLabel className="dark:text-gray-300">Start Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} className="dark:bg-gray-800 dark:border-gray-700" />
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
              <FormLabel className="dark:text-gray-300">ARN Code</FormLabel>
              <FormControl>
                <Input placeholder="ARN Code" {...field} className="dark:bg-gray-800 dark:border-gray-700" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      {/* Redemptions Section */}
      <div className="mt-4 border-t pt-4 dark:border-gray-700">
        <div className="flex justify-between items-center mb-3">
          <h5 className="font-medium text-sm dark:text-gray-300">Redemptions</h5>
          <FormField
            control={control}
            name={`schemes.${index}.redemptions`}
            render={({ field }) => (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const currentRedemptions = field.value || [];
                  field.onChange([...currentRedemptions, { date: '', units: 0, amount: 0 }]);
                }}
                className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Redemption
              </Button>
            )}
          />
        </div>
        
        <FormField
          control={control}
          name={`schemes.${index}.redemptions`}
          render={({ field }) => (
            <>
              {(field.value || []).map((_, redemptionIndex) => (
                <div key={redemptionIndex} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3 p-2 bg-gray-50 dark:bg-gray-800/50 rounded">
                  <FormField
                    control={control}
                    name={`schemes.${index}.redemptions.${redemptionIndex}.date`}
                    render={({ field: dateField }) => (
                      <FormItem>
                        <FormLabel className="text-xs dark:text-gray-300">Redemption Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...dateField} className="dark:bg-gray-800 dark:border-gray-700" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={control}
                    name={`schemes.${index}.redemptions.${redemptionIndex}.units`}
                    render={({ field: unitsField }) => (
                      <FormItem>
                        <FormLabel className="text-xs dark:text-gray-300">Units Redeemed</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Units" 
                            {...unitsField} 
                            onChange={(e) => unitsField.onChange(parseFloat(e.target.value) || 0)}
                            className="dark:bg-gray-800 dark:border-gray-700"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={control}
                    name={`schemes.${index}.redemptions.${redemptionIndex}.amount`}
                    render={({ field: amountField }) => (
                      <FormItem>
                        <FormLabel className="text-xs dark:text-gray-300">Amount Redeemed</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Amount" 
                            {...amountField} 
                            onChange={(e) => amountField.onChange(parseFloat(e.target.value) || 0)}
                            className="dark:bg-gray-800 dark:border-gray-700"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-red-500 h-10 dark:text-red-400"
                      onClick={() => {
                        const updatedRedemptions = [...field.value];
                        updatedRedemptions.splice(redemptionIndex, 1);
                        field.onChange(updatedRedemptions);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </>
          )}
        />
      </div>
    </div>
  );
};

export default SchemeItem;
