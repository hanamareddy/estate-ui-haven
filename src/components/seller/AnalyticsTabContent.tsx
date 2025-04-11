
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Loader2 } from 'lucide-react';
import { propertyAPI } from '@/services/api';
import { toast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate, useSearchParams } from 'react-router-dom';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const AnalyticsTabContent = () => {
  const [searchParams] = useSearchParams();
  const propertyIdFromUrl = searchParams.get('property');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<any>({
    views: [],
    inquiries: [],
    favorites: [],
    properties: []
  });
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(propertyIdFromUrl);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnalytics();
  }, [selectedPropertyId]);

  useEffect(() => {
    if (propertyIdFromUrl) {
      setSelectedPropertyId(propertyIdFromUrl);
    }
  }, [propertyIdFromUrl]);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await propertyAPI.getAnalytics(selectedPropertyId || undefined);
      
      if (response && response.data) {
        // Format data for charts
        const formattedData = {
          views: formatTimeSeriesData(response.data.views),
          inquiries: formatTimeSeriesData(response.data.inquiries),
          favorites: response.data.favoritesByProperty || [],
          properties: response.data.properties || []
        };
        
        setAnalytics(formattedData);
      }
    } catch (err: any) {
      console.error('Error fetching analytics:', err);
      setError(err.message || 'Failed to load analytics data');
      toast({
        title: 'Error',
        description: 'Failed to load analytics data. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const formatTimeSeriesData = (data: any[] = []) => {
    // Group data by month/week and calculate totals
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    if (!data || !Array.isArray(data)) return [];
    
    const grouped = data.reduce((acc: any, item: any) => {
      const date = new Date(item.date);
      const month = months[date.getMonth()];
      
      if (!acc[month]) {
        acc[month] = 0;
      }
      acc[month] += item.count;
      return acc;
    }, {});
    
    // Convert to array format for charts
    return Object.keys(grouped).map(month => ({
      name: month,
      value: grouped[month]
    }));
  };

  const handlePropertyChange = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
    
    // Update URL
    navigate({
      search: `?tab=analytics&property=${propertyId}`
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-10">
          <Loader2 className="mr-2 h-8 w-8 animate-spin" />
          <p>Loading analytics data...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error Loading Analytics</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <button 
            className="px-4 py-2 bg-primary text-white rounded" 
            onClick={fetchAnalytics}
          >
            Retry
          </button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle>Property Analytics</CardTitle>
            <CardDescription>
              View performance metrics for your properties
            </CardDescription>
          </div>
          
          {analytics.properties && analytics.properties.length > 0 && (
            <div className="w-full md:w-64">
              <Select 
                value={selectedPropertyId || 'all'} 
                onValueChange={handlePropertyChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select property" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Properties</SelectItem>
                  {analytics.properties.map((property: any) => (
                    <SelectItem key={property._id} value={property._id}>
                      {property.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="views">Views</TabsTrigger>
            <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Property Views</CardTitle>
                </CardHeader>
                <CardContent>
                  {analytics.views.length > 0 ? (
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart
                        data={analytics.views}
                        margin={{
                          top: 5, right: 5, left: 5, bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" name="Views" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-48 bg-muted/20 rounded">
                      <p className="text-muted-foreground">No view data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Property Inquiries</CardTitle>
                </CardHeader>
                <CardContent>
                  {analytics.inquiries.length > 0 ? (
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart
                        data={analytics.inquiries}
                        margin={{
                          top: 5, right: 5, left: 5, bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" name="Inquiries" stroke="#82ca9d" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-48 bg-muted/20 rounded">
                      <p className="text-muted-foreground">No inquiry data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Favorites by Property</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                {analytics.favorites.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        dataKey="count"
                        nameKey="propertyTitle"
                        data={analytics.favorites}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {analytics.favorites.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [`${value} favorites`, name]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-48 w-full bg-muted/20 rounded">
                    <p className="text-muted-foreground">No favorites data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="views">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Detailed View Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                {analytics.views.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={analytics.views}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Views" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-64 bg-muted/20 rounded">
                    <p className="text-muted-foreground">No view data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="inquiries">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Detailed Inquiry Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                {analytics.inquiries.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={analytics.inquiries}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="value" name="Inquiries" stroke="#82ca9d" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-64 bg-muted/20 rounded">
                    <p className="text-muted-foreground">No inquiry data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="favorites">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Favorites Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {analytics.favorites.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        dataKey="count"
                        nameKey="propertyTitle"
                        data={analytics.favorites}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {analytics.favorites.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [`${value} favorites`, name]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-64 bg-muted/20 rounded">
                    <p className="text-muted-foreground">No favorites data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AnalyticsTabContent;
