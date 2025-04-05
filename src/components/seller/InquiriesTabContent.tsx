
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Check, Clock, MessageSquare, User, Search } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

// Sample data for demonstration
const sampleInquiries = [
  {
    id: '1',
    buyerName: 'John Smith',
    buyerEmail: 'john@example.com',
    propertyTitle: 'Manglore Apartment',
    message: 'Is this property still available? I would like to schedule a viewing this weekend if possible.',
    date: '2025-04-01T10:30:00Z',
    status: 'pending',
    propertyId: '67ed67412033cce091b7d5f5'
  },
  {
    id: '2',
    buyerName: 'Sarah Johnson',
    buyerEmail: 'sarah@example.com',
    propertyTitle: 'New Apartment',
    message: 'I\'m interested in the property. Could you tell me more about the neighborhood and nearby amenities?',
    date: '2025-04-02T14:15:00Z',
    status: 'responded',
    response: 'Hello Sarah, the property is located in a quiet residential area with a shopping mall within 1km and schools nearby. Would you like to schedule a viewing?',
    propertyId: '67eb34dcbe4dc730a241c1b0'
  },
  {
    id: '3',
    buyerName: 'Mike Davis',
    buyerEmail: 'mike@example.com',
    propertyTitle: 'Manglore Apartment',
    message: 'What\'s the age of the building? And have there been any recent renovations?',
    date: '2025-04-03T09:45:00Z',
    status: 'pending',
    propertyId: '67ed67412033cce091b7d5f5'
  }
];

const InquiryCard = ({ inquiry, onRespond }) => {
  const [response, setResponse] = useState('');
  const [isResponding, setIsResponding] = useState(false);

  const handleSubmitResponse = () => {
    if (!response.trim()) return;
    onRespond(inquiry.id, response);
    setIsResponding(false);
    setResponse('');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <Avatar>
              <AvatarFallback>{inquiry.buyerName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base">{inquiry.buyerName}</CardTitle>
              <CardDescription>{inquiry.buyerEmail}</CardDescription>
              <div className="mt-1">
                <Badge variant="outline" className="mr-2">
                  Property: {inquiry.propertyTitle}
                </Badge>
                <Badge className={inquiry.status === 'pending' ? 'bg-yellow-500' : 'bg-green-500'}>
                  {inquiry.status === 'pending' ? 'Pending' : 'Responded'}
                </Badge>
              </div>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            {formatDate(inquiry.date)}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-muted p-3 rounded-md">
            <p className="text-sm">
              <MessageSquare className="inline-block h-4 w-4 mr-2 opacity-70" />
              {inquiry.message}
            </p>
          </div>
          
          {inquiry.response && (
            <div className="bg-primary/10 p-3 rounded-md ml-6">
              <p className="text-sm">
                <Check className="inline-block h-4 w-4 mr-2 text-primary opacity-70" />
                {inquiry.response}
              </p>
            </div>
          )}
          
          {isResponding && (
            <div className="space-y-2">
              <Textarea
                placeholder="Type your response..."
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsResponding(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitResponse}>
                  Send Response
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      {!isResponding && inquiry.status === 'pending' && (
        <CardFooter>
          <Button onClick={() => setIsResponding(true)} className="w-full">
            Respond to Inquiry
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

const InquiriesTabContent = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [inquiries, setInquiries] = useState(sampleInquiries);

  const handleRespondToInquiry = (id, responseText) => {
    setInquiries(inquiries.map(inq => 
      inq.id === id 
        ? { ...inq, status: 'responded', response: responseText } 
        : inq
    ));
  };

  const filteredInquiries = inquiries.filter(inquiry => {
    // Filter by tab
    if (activeTab === 'pending' && inquiry.status !== 'pending') return false;
    if (activeTab === 'responded' && inquiry.status !== 'responded') return false;
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        inquiry.buyerName.toLowerCase().includes(term) ||
        inquiry.propertyTitle.toLowerCase().includes(term) ||
        inquiry.message.toLowerCase().includes(term)
      );
    }
    
    return true;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Inquiries</CardTitle>
        <CardDescription>
          Manage and respond to inquiries about your listings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search inquiries..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">
                All Inquiries ({inquiries.length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                <Clock className="mr-1 h-4 w-4" />
                Pending ({inquiries.filter(i => i.status === 'pending').length})
              </TabsTrigger>
              <TabsTrigger value="responded">
                <Check className="mr-1 h-4 w-4" />
                Responded ({inquiries.filter(i => i.status === 'responded').length})
              </TabsTrigger>
            </TabsList>
            
            <Separator className="my-4" />
            
            <TabsContent value="all" className="space-y-4">
              {filteredInquiries.length > 0 ? (
                filteredInquiries.map(inquiry => (
                  <InquiryCard 
                    key={inquiry.id} 
                    inquiry={inquiry} 
                    onRespond={handleRespondToInquiry} 
                  />
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <User className="mx-auto h-12 w-12 opacity-20" />
                  <p className="mt-2">No inquiries found</p>
                  {searchTerm && (
                    <Button 
                      variant="link" 
                      onClick={() => setSearchTerm('')}
                      className="mt-2"
                    >
                      Clear search
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="pending" className="space-y-4">
              {filteredInquiries.length > 0 ? (
                filteredInquiries.map(inquiry => (
                  <InquiryCard 
                    key={inquiry.id} 
                    inquiry={inquiry} 
                    onRespond={handleRespondToInquiry} 
                  />
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Clock className="mx-auto h-12 w-12 opacity-20" />
                  <p className="mt-2">No pending inquiries</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="responded" className="space-y-4">
              {filteredInquiries.length > 0 ? (
                filteredInquiries.map(inquiry => (
                  <InquiryCard 
                    key={inquiry.id} 
                    inquiry={inquiry} 
                    onRespond={handleRespondToInquiry} 
                  />
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Check className="mx-auto h-12 w-12 opacity-20" />
                  <p className="mt-2">No responded inquiries</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

export default InquiriesTabContent;
