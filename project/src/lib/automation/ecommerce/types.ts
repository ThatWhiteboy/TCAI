// Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  subcategory?: string;
  variants: ProductVariant[];
  inventory: InventoryInfo;
  metrics: ProductMetrics;
  images: string[];
  tags: string[];
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  attributes: Record<string, string>;
  inventory: InventoryInfo;
}

export interface InventoryInfo {
  quantity: number;
  reserved: number;
  reorderPoint: number;
  reorderQuantity: number;
  leadTime: number; // in days
}

export interface ProductMetrics {
  views: number;
  addToCart: number;
  purchases: number;
  revenue: number;
  conversionRate: number;
  returnRate: number;
  ratings: number[];
}

// Price Optimization Types
export interface PriceOptimization {
  productId: string;
  oldPrice: number;
  newPrice: number;
  confidence: number;
  reason: string;
  expectedImpact: {
    revenue: number;
    sales: number;
    profit: number;
  };
}

// Inventory Types
export interface InventoryUpdate {
  productId: string;
  oldLevel: number;
  newLevel: number;
  reason: string;
  priority: 'low' | 'medium' | 'high';
  automated: boolean;
}

// Marketing Types
export interface MarketingAction {
  type: 'promotion' | 'email' | 'recommendation' | 'display';
  target: {
    products?: string[];
    categories?: string[];
    customerSegments?: string[];
  };
  parameters: {
    discount?: number;
    duration?: number;
    placement?: string;
    message?: string;
    priority?: number;
  };
  expectedImpact: {
    metric: string;
    improvement: number;
  };
}

// Order Types
export interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  status: OrderStatus;
  payment: PaymentInfo;
  shipping: ShippingInfo;
  metrics: OrderMetrics;
  timestamps: OrderTimestamps;
}

export interface OrderItem {
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
  discount?: number;
}

export type OrderStatus = 
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface PaymentInfo {
  method: string;
  status: 'pending' | 'completed' | 'failed';
  amount: number;
  currency: string;
  transactionId?: string;
}

export interface ShippingInfo {
  method: string;
  carrier: string;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  address: Address;
  cost: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface OrderMetrics {
  processingTime: number;
  shippingTime?: number;
  customerSatisfaction?: number;
  issuesReported: string[];
}

export interface OrderTimestamps {
  created: Date;
  processed?: Date;
  shipped?: Date;
  delivered?: Date;
  cancelled?: Date;
  refunded?: Date;
}