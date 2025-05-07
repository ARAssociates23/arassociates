
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
  // Try to find scheme code when scheme name or AMC changes
  const schemeName = watch ? watch(`schemes.${index}.schemeName`) : '';
  const amc = watch ? watch(`schemes.${index}.amc`) : '';
  
  React.useEffect(() => {
    if (setValue && schemeName && amc) {
      // We'll implement scheme code finding in the next version
      console.log(`Scheme name or AMC changed: ${schemeName}, ${amc}`);
    }
  }, [schemeName, amc, setValue, index]);

  return (
    <div key={index} className="mb-4 p-4 border rounded">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-lg font-semibold">Scheme {index + 1}</h4>
        <div className="flex gap-2">
          {appendRedemption && (
            <Button type="button" variant="outline" size="icon" onClick={() => appendRedemption(index)}>
              <Plus className="h-4 w-4" />
            </Button>
          )}
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
              />
            </FormControl>
            <FormMessage>{errors?.schemes?.[index]?.amountInvested?.message}</FormMessage>
          </FormItem>
        )}
      />

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
                    if (date && setValue) {
                      setValue(`schemes.${index}.dateStarted`, date);
                    }
                    field.onChange(date);
                  }}
                  disabled={(date) =>
                    date > new Date()
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage>{errors?.schemes?.[index]?.dateStarted?.message}</FormMessage>
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
              <Input {...field} placeholder="Enter ARN code" />
            </FormControl>
            <FormMessage>{errors?.schemes?.[index]?.arnCode?.message}</FormMessage>
          </FormItem>
        )}
      />

      {/* Redemption Details */}
      {getValues && removeRedemption && (
        <div className="mt-4">
          <h5 className="text-sm font-medium">Redemption Details</h5>
          {getValues(`schemes.${index}.redemptions`) && getValues(`schemes.${index}.redemptions`).map((redemption: RedemptionDetail, redemptionIndex: number) => (
            <div key={redemptionIndex} className="mb-2 p-2 border rounded">
              <div className="flex justify-between items-center mb-2">
                <h6 className="text-xs font-semibold">Redemption {redemptionIndex + 1}</h6>
                <Button type="button" variant="destructive" size="icon" onClick={() => removeRedemption(index, redemptionIndex)}>
                  <MinusCircle className="h-3 w-3" />
                </Button>
              </div>

              <FormField
                control={control}
                name={`schemes.${index}.redemptions.${redemptionIndex}.date`}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-xs">Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal text-xs",
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
                            if (date && setValue) {
                              setValue(`schemes.${index}.redemptions.${redemptionIndex}.date`, date);
                            }
                            field.onChange(date);
                          }}
                          disabled={(date) =>
                            date > new Date()
                          }
                          initialFocus
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
                    <FormLabel className="text-xs">Units</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter units"
                        className="text-xs"
                        {...field}
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
                    <FormLabel className="text-xs">Amount (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter amount"
                        className="text-xs"
                        {...field}
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
                    <FormLabel className="text-xs">NAV (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter NAV"
                        className="text-xs"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage>{errors?.schemes?.[index]?.redemptions?.[redemptionIndex]?.nav?.message}</FormMessage>
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SchemeItem;
