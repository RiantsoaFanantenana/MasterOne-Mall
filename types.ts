
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface MetricData {
  name: string;
  value: number;
  trend: number;
}

// MasterOne Mall ERP Types
export interface ShopType {
  id: number;
  type_name: string;
}

export interface Box {
  id: number;
  box_number: string;
  floor: number;
  surface_area: number; // m2
  status: 'available' | 'occupied' | 'maintenance';
}

export interface ShopProfile {
  user_id: number;
  id_type: number;
  id_box: string;
  shop_name: string;
  logo: string;
  cover_pic: string;
  description: string;
  subscription_status: 'standard' | 'premium';
  opening_hours?: OpeningHour[];
  exceptions?: OpeningHourException[];
}

export interface Contract {
  id: number;
  shop_id: number;
  box_id: string;
  start_date: string;
  end_date: string;
  monthly_rent: number;
  status: 'active' | 'expiring' | 'closed';
}

export interface SubscriptionType {
  id: number;
  name: string;
  price: number;
  features: string[];
}

export interface RentHistory {
  id: number;
  box_number: string;
  amount: number;
  date: string;
  paid: boolean;
}

export interface BoxingRequest {
  id: number;
  shop_mail: string;
  description: string;
  create_at: string;
}

export interface OpeningHour {
  id: number;
  day: string;
  start_time: string;
  end_time: string;
}

export interface OpeningHourException {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
}
