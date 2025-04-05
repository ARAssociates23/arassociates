
import React from "react";
import { Control, UseFormWatch } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { InvestorFormValues } from "./schema";

interface NomineeSectionProps {
  control: Control<InvestorFormValues>;
  watch: UseFormWatch<InvestorFormValues>;
}

const NomineeSection: React.FC<NomineeSectionProps> = ({ control, watch }) => {
  const nomineeIsNri = watch("nomineeIsNri");

  return (
    <div className="bg-finance-highlight p-4 rounded-md mb-4">
      <h3 className="text-lg font-semibold text-finance mb-3">Nominee Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
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
          control={control}
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
          control={control}
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
          control={control}
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
          control={control}
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
                <FormLabel>Is NRI</FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        {nomineeIsNri && (
          <>
            <FormField
              control={control}
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
              control={control}
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
          control={control}
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
  );
};

export default NomineeSection;
