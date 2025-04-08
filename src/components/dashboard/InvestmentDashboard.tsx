
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type AmcDistribution = {
  name: string;
  value: number;
  color: string;
};

const InvestmentDashboard = () => {
  const [totalInvestment, setTotalInvestment] = useState<number>(0);
  const [amcDistribution, setAmcDistribution] = useState<AmcDistribution[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Generate color based on index
  const getColor = (index: number) => {
    const colors = [
      '#0088FE', '#00C49F', '#FFBB28', '#FF8042', 
      '#8884D8', '#82CA9D', '#FFC658', '#8DD1E1',
      '#A4DE6C', '#D0ED57', '#83A6E0', '#8C564B'
    ];
    return colors[index % colors.length];
  };

  useEffect(() => {
    const fetchInvestmentData = async () => {
      setLoading(true);
      try {
        // Fetch all investors' scheme data
        const { data: investors, error } = await supabase
          .from('investors')
          .select('schemes');

        if (error) throw error;

        // Calculate total investment and AMC distribution
        let total = 0;
        const amcMap = new Map<string, number>();

        investors.forEach(investor => {
          if (investor.schemes && Array.isArray(investor.schemes)) {
            investor.schemes.forEach((scheme: any) => {
              if (scheme.amountInvested && !isNaN(scheme.amountInvested)) {
                let amount = Number(scheme.amountInvested);
                
                // Calculate total invested amount for SIP schemes
                if (scheme.sipLs === "SIP" && scheme.dateStarted) {
                  const startDate = new Date(scheme.dateStarted);
                  const currentDate = new Date();
                  
                  // Check if the start date is valid and in the past
                  if (!isNaN(startDate.getTime()) && startDate <= currentDate) {
                    // Calculate months difference (including partial months)
                    const monthsDiff = (
                      (currentDate.getFullYear() - startDate.getFullYear()) * 12 +
                      (currentDate.getMonth() - startDate.getMonth())
                    );
                    
                    // Calculate total SIP amount (original amount * number of months)
                    amount = amount * (monthsDiff + 1); // +1 to include the first month
                  }
                }
                
                // Add to total
                total += amount;
                
                // Add to AMC distribution
                const amc = scheme.amc || 'Unknown';
                const currentAmount = amcMap.get(amc) || 0;
                amcMap.set(amc, currentAmount + amount);
              }
            });
          }
        });

        // Format AMC distribution for chart
        const amcData: AmcDistribution[] = Array.from(amcMap.entries())
          .map(([name, value], index) => ({
            name,
            value,
            color: getColor(index)
          }))
          .sort((a, b) => b.value - a.value); // Sort by value descending

        setTotalInvestment(total);
        setAmcDistribution(amcData);
      } catch (error) {
        console.error('Error fetching investment data:', error);
        toast({
          title: "Error",
          description: "Failed to load investment data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInvestmentData();
  }, [toast]);

  // Format currency amount
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Calculate percentage of total
  const calculatePercentage = (value: number) => {
    return totalInvestment > 0 ? ((value / totalInvestment) * 100).toFixed(1) + '%' : '0%';
  };

  // Custom legend renderer
  const renderLegend = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full mt-2">
        {amcDistribution.map((item, index) => (
          <div key={index} className="flex items-center">
            <div
              className="h-3 w-3 rounded-full mr-2 flex-shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm truncate mr-1">{item.name}</span>
            <span className="text-sm text-muted-foreground ml-auto">
              {calculatePercentage(item.value)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight text-finance">Investment Dashboard</h2>
      
      {loading ? (
        <div className="flex justify-center p-8">
          <p className="text-muted-foreground">Loading investment data...</p>
        </div>
      ) : (
        <>
          {/* Total Investment Card */}
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Total Investment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-finance">
                {formatCurrency(totalInvestment)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Across all investors and schemes (SIP amounts calculated to current date)
              </div>
            </CardContent>
          </Card>

          {/* AMC Distribution Card */}
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">AMC Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {amcDistribution.length > 0 ? (
                <div className="flex flex-col items-center">
                  <div className="h-80 w-full max-w-md mx-auto">
                    <ChartContainer
                      config={{
                        total: { label: 'Total' },
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={amcDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={false}
                            outerRadius="80%"
                            innerRadius="60%"
                            dataKey="value"
                            nameKey="name"
                          >
                            {amcDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <ChartTooltip 
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                const data = payload[0].payload;
                                return (
                                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                                    <div className="font-medium">{data.name}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {formatCurrency(data.value)}
                                    </div>
                                    <div className="text-xs font-medium">
                                      {calculatePercentage(data.value)}
                                    </div>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>

                  {/* Legend - Separate from chart */}
                  {renderLegend()}
                </div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-muted-foreground">No investment data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default InvestmentDashboard;
