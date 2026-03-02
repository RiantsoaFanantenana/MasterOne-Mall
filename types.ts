
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

export interface MallEvent {
  id: number;
  shop_id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  is_public: boolean;
  created_at: string;
  status: 'draft' | 'published' | 'archived' | 'cancelled';
}

export interface Discount {
  id: number;
  shop_id: number;
  title: string;
  description: string;
  value: string;
  start_date: string;
  end_date: string;
  status: 'active' | 'expired' | 'scheduled';
  created_at: string;
}

export interface Coupon {
  id: string;
  create_at: string;
  start_date: string;
  end_date: string;
  used_date: string | null;
  description: string;
}

export interface BoxTicket {
  id: number;
  shop_id: number;
  create_at: string;
  description: string;
  validation_date: string | null;
  rejection_date: string | null;
}

export interface Subscription {
  id: number;
  shop_id: number;
  type_id: number;
  start_date: string;
  end_date: string;
  ruptured_date: string | null;
}

// Added SubscriptionType interface to fix compilation errors
export interface SubscriptionType {
  id: number;
  name: string;
  price: number;
  features: string[];
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

export interface ChatConversation {
  id: number;
  client_name: string;
  client_id: string;
  shop_id: number;
  last_message: string;
  timestamp: number;
  unread: boolean;
  messages: { role: 'user' | 'shop', content: string, timestamp: number }[];
}

// types/client.types.ts
export interface Wallet {
  balance: number;
  points: number;
  transactions: Transaction[];
}

export interface Transaction {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  date: string;
  status: 'pending' | 'completed';
}

export interface Favorite {
  shopId: number;
  shopName: string;
  logo: string;
  addedAt: string;
}

export interface ClientReview {
  id: number;
  shopId: number;
  shopName: string;
  rating: number;
  comment: string;
  date: string;
  reply?: string;
}

// types/search.types.ts
export interface SearchFilters {
  query: string;
  shopType?: string;
  floor?: number;
  hasEvents?: boolean;
}

export interface SearchResult {
  shops: ShopProfile[];
  total: number;
  page: number;
}