
export interface PropertyInquiry {
  id: string;
  property: string;
  message: string;
  sellerResponse?: string | null;
  status: 'pending' | 'responded' | 'closed';
  createdAt: string;
  updatedAt: string;
}
