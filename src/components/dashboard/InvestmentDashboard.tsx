
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  getCurrentNav, 
  calculateUnits,
  calculateSipAmountToDate,
  calculateNetInvestment,
  calculateRemainingUnits,
  formatDateString 
} from '@/services/navService';
import { SchemeDetail, RedemptionDetail } from '@/types/investor';

type AmcDistribution = {
  name: string;
  value: number;
  color: string;
};

const InvestmentDashboard = () => {
  const [totalInvestment, setTotalInvestment] = useState<number>(0);
  const [totalCurrentValue, setTotalCurrentValue] = useState<number>(0);
  const [amcDistribution, setAmcDistribution] = useState<AmcDistribution[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [totalRedemptions, setTotalRedemptions] = useState<number>(0);
  const [netInvestment, setNetInvestment] = useState<number>(0);
  const [dataError, setDataError] = useState<boolean>(false);
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

  // Mock NAV data for development/fallback
  const getMockNav = (schemeName: string) => {
    // Generate a realistic NAV value between 20 and 200
    const baseValue = Math.floor(schemeName.length * 7.5) % 180 + 20;
    return baseValue + Math.random() * 5;
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
        
        console.log("Fetched investors data:", investors);

        // Calculate total investment and AMC distribution
        let total = 0;
        let currentValue = 0;
        let totalRedeemed = 0;
        const amcMap = new Map<string, number>();
        let navFetchFailed = false;

        for (const investor of investors) {
          if (investor.schemes && Array.isArray(investor.schemes)) {
            for (const schemeData of investor.schemes) {
              // Use type assertion to treat schemes as SchemeDetail
              const scheme = schemeData as unknown as SchemeDetail;
              
              if (scheme.amountInvested && !isNaN(scheme.amountInvested)) {
                let amount = Number(scheme.amountInvested);
                
                // Calculate total invested amount for SIP schemes
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
                
                // Fetch current NAV for this scheme from AMFI
                try {
                  console.log(`Attempting to fetch NAV for ${scheme.schemeName}`);
                  const nav = await getCurrentNav(scheme.schemeName, scheme.amc);
                  
                  // If NAV fetch fails, use mock data as fallback
                  let finalNav = nav;
                  if (!finalNav) {
                    console.log(`Using mock NAV for ${scheme.schemeName}`);
                    finalNav = getMockNav(scheme.schemeName);
                    navFetchFailed = true;
                  }
                  
                  if (finalNav) {
                    // Calculate units if not already provided
                    let units = scheme.units || 0;
                    if (units === 0 && finalNav > 0) {
                      units = calculateUnits(amount, finalNav);
                    }
                    
                    // Calculate remaining units after redemptions
                    const remainingUnits = calculateRemainingUnits(units, redemptions);
                    
                    // Calculate current value based on remaining units
                    const value = remainingUnits * finalNav;
                    console.log(`Calculated value for ${scheme.schemeName}: ${value} (${remainingUnits} units × ${finalNav} NAV)`);
                    
                    // Add to total current value
                    currentValue += value;
                  }
                } catch (err) {
                  console.error('Error fetching NAV:', err);
                  navFetchFailed = true;
                  
                  // Fallback to mock data
                  const mockNav = getMockNav(scheme.schemeName);
                  let units = scheme.units || calculateUnits(amount, mockNav);
                  const remainingUnits = calculateRemainingUnits(units, redemptions);
                  const value = remainingUnits * mockNav;
                  currentValue += value;
                }
                
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
          .map(([name, value], index) => ({
            name,
            value,
            color: getColor(index)
          }))
          .sort((a, b) => b.value - a.value); // Sort by value descending

        setTotalInvestment(total);
        setTotalRedemptions(totalRedeemed);
        setNetInvestment(total - totalRedeemed);
        setTotalCurrentValue(currentValue);
        setAmcDistribution(amcData);
        setLastUpdated(new Date().toISOString());
        setDataError(navFetchFailed);
        
        if (navFetchFailed) {
          toast({
            title: "Note",
            description: "Some NAV data couldn't be fetched. Using estimated values.",
            variant: "default",
          });
        }
        
        console.log("Dashboard data processed:", {
          totalInvestment: total,
          totalRedemptions: totalRedeemed,
          netInvestment: total - totalRedeemed,
          totalCurrentValue: currentValue,
          amcDistribution: amcData.length
        });
        
      } catch (error) {
        console.error('Error fetching investment data:', error);
        setDataError(true);
        toast({
          title: "Error",
          description: "Failed to load investment data. Using sample data.",
          variant: "destructive",
        });
        
        // Generate sample data for better user experience
        generateSampleData();
      } finally {
        setLoading(false);
      }
    };
    
    // Generate sample data if real data fails to load
    const generateSampleData = () => {
      const total = 1250000;
      const redeemed = 320000;
      const net = total - redeemed;
      const current = net * 1.15; // 15% return
      
      const amcs = [
        { name: "HDFC Mutual Fund", value: net * 0.35, color: getColor(0) },
        { name: "SBI Mutual Fund", value: net * 0.25, color: getColor(1) },
        { name: "Axis Mutual Fund", value: net * 0.15, color: getColor(2) },
        { name: "ICICI Prudential", value: net * 0.12, color: getColor(3) },
        { name: "Aditya Birla SL", value: net * 0.08, color: getColor(4) },
        { name: "Others", value: net * 0.05, color: getColor(5) }
      ];
      
      setTotalInvestment(total);
      setTotalRedemptions(redeemed);
      setNetInvestment(net);
      setTotalCurrentValue(current);
      setAmcDistribution(amcs);
      setLastUpdated(new Date().toISOString());
    };

    fetchInvestmentData();
    
    // Set up an interval to refresh NAV data every 30 minutes
    const interval = setInterval(() => {
      fetchInvestmentData();
    }, 30 * 60 * 1000); // 30 minutes
    
    return () => clearInterval(interval);
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
    return netInvestment > 0 ? ((value / netInvestment) * 100).toFixed(1) + '%' : '0%';
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return `${date.toLocaleDateString('en-IN')} ${date.toLocaleTimeString('en-IN')}`;
    } catch (error) {
      return 'Unknown';
    }
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
      <h2 className="text-2xl font-bold tracking-tight text-finance dark:text-green-400">Investment Dashboard</h2>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Skeleton loaders for cards */}
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg border border-white/20 dark:border-gray-700/30">
              <CardHeader className="pb-2">
                <div className="h-6 w-36 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {/* Investment Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Investment Card */}
            <Card className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg border border-white/20 dark:border-gray-700/30 hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Total Investment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-finance dark:text-green-400">
                  {formatCurrency(totalInvestment)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Total invested amount (SIPs calculated to current date)
                </div>
              </CardContent>
            </Card>

            {/* Net Investment Card (after redemptions) */}
            <Card className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg border border-white/20 dark:border-gray-700/30 hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Net Investment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-finance dark:text-green-400">
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

            {/* Current Value Card */}
            <Card className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg border border-white/20 dark:border-gray-700/30 hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Current Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-finance dark:text-green-400">
                  {formatCurrency(totalCurrentValue)}
                </div>
                <div className="flex flex-col text-xs mt-1">
                  <div className="flex items-center">
                    <span className={totalCurrentValue > netInvestment ? "text-green-600 dark:text-green-400 font-medium" : "text-red-600 dark:text-red-400 font-medium"}>
                      {totalCurrentValue > netInvestment ? "+" : ""}
                      {netInvestment > 0 ? ((totalCurrentValue - netInvestment) / netInvestment * 100).toFixed(2) : 0}%
                    </span>
                    <span className="text-muted-foreground ml-2">
                      {dataError ? "Based on estimated values" : "Based on current NAV values"}
                    </span>
                  </div>
                  <div className="text-muted-foreground mt-1">
                    Last updated: {formatDate(lastUpdated)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AMC Distribution Card */}
          <Card className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg border border-white/20 dark:border-gray-700/30">
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
