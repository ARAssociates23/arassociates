
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Trash2, Plus, MinusCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RedemptionDetail } from '@/types/investor';

interface SchemeItemProps {
  index: number;
  control: any;
  register?: any;
  setValue?: any;
  getValues?: any;
  errors?: any;
  append?: () => void;
  remove: (index: number) => void;
  appendRedemption?: (schemeIndex: number) => void;
  removeRedemption?: (schemeIndex: number, redemptionIndex: number) => void;
  watch?: any;
}

const SchemeItem: React.FC<SchemeItemProps> = ({
  index,
  control,
  register,
  setValue,
  getValues,
  errors,
  append,
  remove,
  appendRedemption,
  removeRedemption,
  watch
}) => {
  // Watch the redemptions array for this scheme
  const redemptions = watch ? watch(`schemes.${index}.redemptions`) : [];

  // Try to find scheme code when scheme name or AMC changes
  const schemeName = watch ? watch(`schemes.${index}.schemeName`) : '';
  const amc = watch ? watch(`schemes.${index}.amc`) : '';
  React.useEffect(() => {
    if (setValue && schemeName && amc) {
      // We'll implement scheme code finding in the next version
      console.log(`Scheme name or AMC changed: ${schemeName}, ${amc}`);
    }
  }, [schemeName, amc, setValue, index]);

  // Handle adding a new redemption
  const handleAddRedemption = () => {
    if (appendRedemption) {
      appendRedemption(index);
    }
  };

  // Handle removing a redemption
  const handleRemoveRedemption = (redemptionIndex: number) => {
    if (removeRedemption) {
      removeRedemption(index, redemptionIndex);
    }
  };

  return (
    <div key={index} className="mb-4 p-4 border rounded">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-lg font-semibold">Scheme {index + 1}</h4>
        <div className="flex gap-2">
          <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <FormField
        control={control}
        name={`schemes.${index}.amc`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>AMC</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter AMC" />
            </FormControl>
            <FormMessage>{errors?.schemes?.[index]?.amc?.message}</FormMessage>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`schemes.${index}.schemeName`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Scheme Name</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter scheme name" />
            </FormControl>
            <FormMessage>{errors?.schemes?.[index]?.schemeName?.message}</FormMessage>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`schemes.${index}.folioNo`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Folio Number</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter folio number" />
            </FormControl>
            <FormMessage>{errors?.schemes?.[index]?.folioNo?.message}</FormMessage>
          </FormItem>
        )}
      />

      {/* Scheme Code field for mfapi.in integration */}
      <FormField
        control={control}
        name={`schemes.${index}.schemeCode`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Scheme Code (Optional)</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter scheme code for mfapi.in" />
            </FormControl>
            <FormMessage>{errors?.schemes?.[index]?.schemeCode?.message}</FormMessage>
          </FormItem>
        )}
      />

      {/* ISIN field */}
      <FormField
        control={control}
        name={`schemes.${index}.isin`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>ISIN (Optional)</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter ISIN code" />
            </FormControl>
            <FormMessage>{errors?.schemes?.[index]?.isin?.message}</FormMessage>
          </FormItem>
        )}
      />

      {/* SIP/LS field */}
      <FormField
        control={control}
        name={`schemes.${index}.sipLs`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>SIP/LS</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="SIP">SIP</SelectItem>
                <SelectItem value="LS">LS</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage>{errors?.schemes?.[index]?.sipLs?.message}</FormMessage>
          </FormItem>
        )}
      />

      {/* Amount Invested field - Fixed to handle number conversion */}
      <FormField
        control={control}
        name={`schemes.${index}.amountInvested`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Amount Invested</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Enter amount"
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
              />
            </FormControl>
            <FormMessage>{errors?.schemes?.[index]?.amountInvested?.message}</FormMessage>
          </FormItem>
        )}
      />

      {/* Units field - Fixed to handle number conversion */}
      <FormField
        control={control}
        name={`schemes.${index}.units`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Units (Optional)</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Enter units"
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
              />
            </FormControl>
            <FormMessage>{errors?.schemes?.[index]?.units?.message}</FormMessage>
          </FormItem>
        )}
      />

      {/* Date Started field - Fixed to properly handle date to string conversion */}
      <FormField
        control={control}
        name={`schemes.${index}.dateStarted`}
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Date Started (SIP)</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(new Date(field.value), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={(date) => {
                    // Convert Date to ISO string for form validation
                    const dateString = date ? date.toISOString() : "";
                    field.onChange(dateString);
                    if (setValue) {
                      setValue(`schemes.${index}.dateStarted`, dateString);
                    }
                  }}
                  disabled={(date) => date > new Date()}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            <FormMessage>{errors?.schemes?.[index]?.dateStarted?.message}</FormMessage>
          </FormItem>
        )}
      />

      {/* ARN Code field */}
      <FormField
        control={control}
        name={`schemes.${index}.arnCode`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>ARN Code</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter ARN code" />
            </FormControl>
            <FormMessage>{errors?.schemes?.[index]?.arnCode?.message}</FormMessage>
          </FormItem>
        )}
      />

      {/* Redemption Details Section - Fixed dark theme */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-3">
          
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={handleAddRedemption}
            disabled={!appendRedemption}
            className="bg-slate-800 hover:bg-slate-700 text-white"
          >
            <Plus className="h-4 w-4 mr-1" /> Add Redemption
          </Button>
        </div>

        {redemptions && redemptions.length > 0 && (
          <div className="space-y-4">
            {redemptions.map((redemption: RedemptionDetail, redemptionIndex: number) => (
              <div
                key={redemptionIndex}
                className="p-3 border border-slate-600 rounded bg-slate-800 text-white"
              >
                <div className="flex justify-between items-center mb-3">
                  <h6 className="text-sm font-semibold text-white">Redemption {redemptionIndex + 1}</h6>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveRedemption(redemptionIndex)}
                    disabled={!removeRedemption}
                  >
                    <MinusCircle className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <FormField
                    control={control}
                    name={`schemes.${index}.redemptions.${redemptionIndex}.date`}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-xs text-slate-300">Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal text-xs bg-slate-700 border-slate-600 text-white hover:bg-slate-600",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(new Date(field.value), "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-3 w-3 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value ? new Date(field.value) : undefined}
                              onSelect={(date) => {
                                // Convert Date to ISO string for form validation
                                const dateString = date ? date.toISOString() : "";
                                field.onChange(dateString);
                                if (setValue) {
                                  setValue(`schemes.${index}.redemptions.${redemptionIndex}.date`, dateString);
                                }
                              }}
                              disabled={(date) => date > new Date()}
                              initialFocus
                              className="pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage>{errors?.schemes?.[index]?.redemptions?.[redemptionIndex]?.date?.message}</FormMessage>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name={`schemes.${index}.redemptions.${redemptionIndex}.units`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-slate-300">Units</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.001"
                            placeholder="Enter units"
                            className="text-xs bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage>{errors?.schemes?.[index]?.redemptions?.[redemptionIndex]?.units?.message}</FormMessage>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name={`schemes.${index}.redemptions.${redemptionIndex}.amount`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-slate-300">Amount (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="Enter amount"
                            className="text-xs bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                          />
                        </FormControl>
                        <FormMessage>{errors?.schemes?.[index]?.redemptions?.[redemptionIndex]?.amount?.message}</FormMessage>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name={`schemes.${index}.redemptions.${redemptionIndex}.nav`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-slate-300">NAV (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.0001"
                            placeholder="Enter NAV"
                            className="text-xs bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                          />
                        </FormControl>
                        <FormMessage>{errors?.schemes?.[index]?.redemptions?.[redemptionIndex]?.nav?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SchemeItem;
