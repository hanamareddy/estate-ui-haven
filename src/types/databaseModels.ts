
export interface PropertyListing {
  id: string;
  name: string;
  sale: number;
  rent: number;
  city: string;
  year: string;
  created_at?: string;
}

export interface PriceTrend {
  id: string;
  city: string;
  region?: string;
  year: string;
  month: string;
  month_num: number;
  value: number;
  created_at?: string;
}

export interface RegionalPrice {
  id: string;
  city: string;
  name: string;
  price: number;
  year: string;
  created_at?: string;
}

export interface MortgageRate {
  id: string;
  bank: string;
  rate: number;
  min_loan_amount?: number;
  max_loan_amount?: number;
  min_term?: number;
  max_term?: number;
  processing_fee?: number;
  created_at?: string;
  updated_at?: string;
}

export interface LoanApplication {
  id: string;
  user_id: string;
  property_id?: string;
  loan_amount: number;
  property_value: number;
  down_payment: number;
  interest_rate: number;
  loan_term_years: number;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface Property {
  id: string;
  title: string;
  address: string;
  price: number;
  type: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  images?: string[];
  status: string;
  user_id: string;
  latitude?: number;
  longitude?: number;
  created_at?: string;
  updated_at?: string;
  [key: string]: any; // Allow for other properties
}

export interface NearbyProperty {
  id: string;
  title: string;
  price: number;
  address: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  status: string;
  latitude: number;
  longitude: number;
  distanceInKm?: string;
  images?: string[];
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}
