
import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line, Legend, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import BackToHomeButton from './BackToHomeButton';
import { Skeleton } from './ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { CompassIcon, TrendingUp } from './icons';

interface PriceData {
  month: string;
  value: number;
}

interface ListingData {
  name: string;
  sale: number;
  rent: number;
}

interface RegionalData {
  name: string;
  price: number;
}

export const MarketTrends = () => {
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [listingData, setListingData] = useState<ListingData[]>([]);
  const [regionalData, setRegionalData] = useState<RegionalData[]>([]);
  const [loading, setLoading] = useState(true);
  const [yearFilter, setYearFilter] = useState('2024');
  const [cities, setCities] = useState(['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad']);
  const [selectedCity, setSelectedCity] = useState('Mumbai');

  useEffect(() => {
    const fetchMarketData = async () => {
      setLoading(true);
      try {
        // Fetch price trend data
        const { data: priceData, error: priceError } = await supabase
          .from('price_trends')
          .select('*')
          .eq('year', yearFilter)
          .eq('city', selectedCity)
          .order('month_num', { ascending: true });
          
        if (priceError) throw priceError;
        
        // Fetch property listings data
        const { data: listingData, error: listingError } = await supabase
          .from('property_listings')
          .select('*')
          .eq('year', yearFilter)
          .eq('city', selectedCity);
          
        if (listingError) throw listingError;
        
        // Fetch regional price data
        const { data: regionalData, error: regionalError } = await supabase
          .from('regional_prices')
          .select('*')
          .eq('year', yearFilter)
          .eq('city', selectedCity);
          
        if (regionalError) throw regionalError;
        
        // Format data for charts
        const formattedPriceData = priceData?.map(item => ({
          month: item.month,
          value: item.value
        })) || [];
        
        const formattedListingData = listingData?.map(item => ({
          name: item.name,
          sale: item.sale,
          rent: item.rent
        })) || [];
        
        const formattedRegionalData = regionalData?.map(item => ({
          name: item.name,
          price: item.price
        })) || [];
        
        // If no data is returned, use fallback data
        setPriceData(formattedPriceData.length > 0 ? formattedPriceData : getFallbackPriceData());
        setListingData(formattedListingData.length > 0 ? formattedListingData : getFallbackListingData());
        setRegionalData(formattedRegionalData.length > 0 ? formattedRegionalData : getFallbackRegionalData());
      } catch (error) {
        console.error('Error fetching market data:', error);
        // Use fallback data if there's an error
        setPriceData(getFallbackPriceData());
        setListingData(getFallbackListingData());
        setRegionalData(getFallbackRegionalData());
      } finally {
        setLoading(false);
      }
    };
    
    fetchMarketData();
  }, [yearFilter, selectedCity]);
  
  // Fallback data if the database doesn't return anything
  const getFallbackPriceData = (): PriceData[] => {
    // Data for Mumbai, approximate prices in INR lakhs
    return [
      { month: 'Jan', value: 15000000 }, // 1.5 Cr
      { month: 'Feb', value: 15200000 },
      { month: 'Mar', value: 15500000 },
      { month: 'Apr', value: 15800000 },
      { month: 'May', value: 16000000 },
      { month: 'Jun', value: 16300000 },
      { month: 'Jul', value: 16500000 },
      { month: 'Aug', value: 16700000 },
      { month: 'Sep', value: 17000000 },
      { month: 'Oct', value: 17300000 },
      { month: 'Nov', value: 17500000 },
      { month: 'Dec', value: 17800000 }, // 1.78 Cr
    ];
  };
  
  const getFallbackListingData = (): ListingData[] => {
    return [
      { name: 'Houses', sale: 850, rent: 320 },
      { name: 'Apartments', sale: 1200, rent: 950 },
      { name: 'Land', sale: 240, rent: 0 },
      { name: 'Commercial', sale: 170, rent: 320 },
    ];
  };
  
  const getFallbackRegionalData = (): RegionalData[] => {
    return [
      { name: 'South Mumbai', price: 36000000 }, // 3.6 Cr
      { name: 'Western Suburbs', price: 18500000 }, // 1.85 Cr
      { name: 'Central Mumbai', price: 22000000 }, // 2.2 Cr
      { name: 'Navi Mumbai', price: 9500000 }, // 95 L
      { name: 'Thane', price: 8700000 }, // 87 L
    ];
  };

  // Custom tooltip for price chart
  const PriceTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-md border rounded-md">
          <p className="font-medium">{`${label}, ${yearFilter}`}</p>
          <p className="text-accent">{`Average Price: ${new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
          }).format(payload[0].value)}`}</p>
        </div>
      );
    }
    return null;
  };

  const BackToHomeSection = () => (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">Market Trends</h1>
      <BackToHomeButton />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <BackToHomeSection />
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-2 mb-2">
            <CompassIcon className="h-6 w-6 text-accent" />
            <h2 className="text-3xl md:text-4xl font-bold">Indian Real Estate Trends</h2>
          </div>
          <p className="text-muted-foreground">
            Stay informed about the latest real estate market trends and statistics across major Indian cities
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <select 
            className="px-4 py-2 border rounded-md bg-background"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          
          <select 
            className="px-4 py-2 border rounded-md bg-background"
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
          >
            <option value="2022">2022</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
          </select>
        </div>

        <Tabs defaultValue="price">
          <div className="flex justify-center mb-8">
            <TabsList>
              <TabsTrigger value="price">Price Trends</TabsTrigger>
              <TabsTrigger value="listings">Listings</TabsTrigger>
              <TabsTrigger value="regional">Regional Comparison</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="price" className="mt-0">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-accent" />
                      Property Price Trends - {selectedCity}
                    </CardTitle>
                    <CardDescription>Average property prices in {selectedCity} for {yearFilter}</CardDescription>
                  </div>
                  <div className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-medium">
                    +{(((priceData[priceData.length - 1]?.value || 0) / (priceData[0]?.value || 1) - 1) * 100).toFixed(1)}% YTD
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="h-80 flex items-center justify-center">
                    <Skeleton className="h-full w-full" />
                  </div>
                ) : (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={priceData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                        <YAxis 
                          tick={{ fontSize: 12 }}
                          domain={['dataMin - 1000000', 'dataMax + 1000000']}
                          tickFormatter={(value) => `₹${(value / 10000000).toFixed(1)}Cr`}
                        />
                        <Tooltip content={<PriceTooltip />} />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#6366f1" 
                          strokeWidth={3}
                          dot={{ r: 4, strokeWidth: 2 }}
                          activeDot={{ r: 6, strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="listings" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Property Listings by Type - {selectedCity}</CardTitle>
                <CardDescription>Number of properties available for sale and rent in {yearFilter}</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="h-80 flex items-center justify-center">
                    <Skeleton className="h-full w-full" />
                  </div>
                ) : (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={listingData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value}`, 'Listings']} />
                        <Legend />
                        <Bar dataKey="sale" name="For Sale" fill="#6366f1" />
                        <Bar dataKey="rent" name="For Rent" fill="#22c55e" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="regional" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Regional Price Comparison - {selectedCity}</CardTitle>
                <CardDescription>Average property prices by region in {yearFilter}</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="h-80 flex items-center justify-center">
                    <Skeleton className="h-full w-full" />
                  </div>
                ) : (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={regionalData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis 
                          type="number" 
                          tickFormatter={(value) => `₹${(value / 10000000).toFixed(1)}Cr`} 
                        />
                        <YAxis type="category" dataKey="name" width={120} />
                        <Tooltip 
                          formatter={(value) => [
                            `₹${(Number(value) / 10000000).toFixed(2)} Cr`,
                            'Average Price'
                          ]}
                        />
                        <Bar dataKey="price" fill="#f59e0b" barSize={30} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MarketTrends;
