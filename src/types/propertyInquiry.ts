
export interface PropertyInquiry {
  id: string;
  property: string;
  message: string;
  sellerResponse?: string | null;
  status: 'pending' | 'responded' | 'closed';
  createdAt: string;
  updatedAt: string;
}

export interface UserInquiry {
  id: string;
  property: {
    id: string;
    title: string;
    price: number;
    location: string;
    city: string;
    state: string;
    images: string[];
    type: string;
    status: string;
  };
  message: string;
  sellerResponse?: string | null;
  status: 'pending' | 'responded' | 'closed';
  createdAt: string;
  updatedAt: string;
}

export interface SellerInquiry {
  id: string;
  property: {
    id: string;
    title: string;
    price: number;
    location: string;
    city: string;
    state: string;
    images: string[];
    type: string;
    status: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  message: string;
  sellerResponse?: string | null;
  status: 'pending' | 'responded' | 'closed';
  createdAt: string;
  updatedAt: string;
}
