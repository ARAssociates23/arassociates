import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { 
  calculateSipAmountToDate,
  calculateRemainingUnits,
} from '@/services/navService';
import { SchemeDetail } from '@/types/investor';

type AmcDistribution = {
  name: string;
  value: number;
  color: string;
};

const InvestmentDashboard = () => {
  const [totalInvestment, setTotalInvestment] = useState<number>(0);
  const [amcDistribution, setAmcDistribution] = useState<AmcDistribution[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalRedemptions, setTotalRedemptions] = useState<number>(0);
  const [netInvestment, setNetInvestment] = useState<number>(0);
  const [fetchingError, setFetchingError] = useState<string | null>(null);
  const { toast: toastHook } = useToast();

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
      setFetchingError(null);
      try {
        // Fetch all investors' scheme data
        const { data: investors, error } = await supabase
          .from('investors')
          .select('schemes');

        if (error) throw error;
        
        console.log("Fetched investors data:", investors);

        if (!investors || investors.length === 0) {
          setFetchingError("No investment data found");
          setLoading(false);
          return;
        }

        // Calculate total investment and AMC distribution
        let total = 0;
        let totalRedeemed = 0;
        const amcMap = new Map<string, number>();

        for (const investor of investors) {
          if (investor.schemes && Array.isArray(investor.schemes)) {
            for (const schemeData of investor.schemes) {
              // Use type assertion to treat schemes as SchemeDetail
              const scheme = schemeData as unknown as SchemeDetail;
              
              if (scheme.amountInvested && !isNaN(scheme.amountInvested)) {
                let amount = Number(scheme.amountInvested);

                // Pass both amount and dateStarted to calculateSipAmountToDate for SIPs
                if (scheme.sipLs === "SIP" && scheme.dateStarted) {
                  amount = calculateSipAmountToDate(amount, scheme.dateStarted);
                }
                
                // Add to total invested
                total += amount;
                
                // Calculate redemptions
                const redemptions = scheme.redemptions || [];
                const redeemed = redemptions.reduce((sum, red) => {
                  if (red.amount) return sum + red.amount;
                  if (red.units && red.nav) return sum + (red.units * red.nav);
                  return sum;
                }, 0);
                
                totalRedeemed += redeemed;
                
                // Add to AMC distribution (use invested amount - redemptions)
                const netAmount = amount - redeemed;
                if (netAmount > 0) {
                  const amc = scheme.amc || 'Unknown';
                  const currentAmount = amcMap.get(amc) || 0;
                  amcMap.set(amc, currentAmount + netAmount);
                }
              }
            }
          }
        }

        // Format AMC distribution for chart
        const amcData: AmcDistribution[] = Array.from(amcMap.entries())
          .filter(([_, value]) => value > 0) // Filter out zero or negative values
          .map(([name, value], index) => ({
            name,
            value,
            color: getColor(index)
          }))
          .sort((a, b) => b.value - a.value); // Sort by value descending

        setTotalInvestment(total);
        setTotalRedemptions(totalRedeemed);
        setNetInvestment(total - totalRedeemed);
        setAmcDistribution(amcData);
        
        console.log("Dashboard data processed:", {
          totalInvestment: total,
          totalRedemptions: totalRedeemed,
          netInvestment: total - totalRedeemed,
          amcDistribution: amcData.length
        });
        
      } catch (error) {
        console.error('Error fetching investment data:', error);
        setFetchingError("Failed to load investment data");
        toastHook({
          title: "Error",
          description: "Failed to load investment data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInvestmentData();
  }, [toastHook]);

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
    return netInvestment > 0 ? ((value / netInvestment) * 100).toFixed(1) + '%' : '0%';
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
      <h2 className="text-2xl font-bold tracking-tight text-blue-800 dark:text-blue-400">Investment Dashboard</h2>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Skeleton loaders for cards */}
          {[...Array(2)].map((_, i) => (
            <Card key={i} className="dashboard-card animate-pulse bg-white dark:bg-slate-800/50">
              <CardHeader className="pb-2">
                <div className="h-6 w-36 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : fetchingError ? (
        <div className="p-6 text-center bg-white dark:bg-slate-800/50 rounded-lg shadow-md">
          <p className="text-lg text-red-500 dark:text-red-400">{fetchingError}</p>
          <button 
            className="mt-4 px-4 py-2 bg-blue-600 text-white dark:bg-blue-600 dark:text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-700 transition-colors"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          {/* Investment Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Total Investment Card */}
            <Card className="dashboard-card bg-white dark:bg-slate-800/50 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Total Investment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(totalInvestment)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Total invested amount (SIPs calculated to current date)
                </div>
              </CardContent>
            </Card>

            {/* Net Investment Card (after redemptions) */}
            <Card className="dashboard-card bg-white dark:bg-slate-800/50 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Net Investment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(netInvestment)}
                </div>
                <div className="flex flex-col text-xs mt-1">
                  <div className="flex items-center">
                    <span className="text-amber-600 dark:text-amber-400 font-medium">
                      {formatCurrency(totalRedemptions)}
                    </span>
                    <span className="text-muted-foreground ml-2">
                      Total redeemed amount
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AMC Distribution Card */}
          <Card className="dashboard-card bg-white dark:bg-slate-800/50 shadow-md">
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
                                  <div className="rounded-lg border bg-white/80 dark:bg-gray-800/80 p-2 shadow-sm backdrop-blur-sm">
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
                <div className="flex h-64 items-center justify-center">
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
