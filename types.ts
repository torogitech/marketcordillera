
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  brand?: string;
  calories?: number;
  ingredients?: string[];
}

export interface CartItem extends Product {
  quantity: number;
  notes?: string;
}

export interface Category {
  id: string;
  name: string;
  image?: string;
}

export enum DiningOption {
  DINE_IN = 'Dine In',
  TAKE_AWAY = 'Take Away',
  DELIVERY = 'Delivery'
}

export interface OrderSummary {
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
}

export type OrderStatus = 'Completed' | 'Pending' | 'Preparing' | 'Cancelled';

export interface Order {
  id: string;
  customerName: string;
  store: string; // renamed from tableNo
  items: string[]; // List of item names for simplicity in dashboard
  total: number;
  status: OrderStatus;
  date: string;
  type: DiningOption;
}

export type StoreStatus = 'Open' | 'Closed' | 'Stock Low' | 'Maintenance';
export type StoreType = 'Grocery' | 'Pharmacy' | 'Electronics' | 'Boutique' | 'General';

export interface Store {
  id: string;
  name: string;
  address: string;
  status: StoreStatus;
  type: StoreType;
  inventoryCount: number;
  inventoryLevel: number; // percentage
  todayRevenue: number;
  image: string;
  lastRestocked?: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  lat?: number;
  lng?: number;
}

export type RestaurantStatus = 'Open' | 'Closed' | 'Busy' | 'Maintenance';

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  status: RestaurantStatus;
  capacity: number;
  activeOrders: number;
  todayRevenue: number;
  image?: string;
  // Extended Details
  cuisineType: string;
  rating: number;
  establishedYear: number;
  description: string;
  // Structured Address
  region?: string;
  province?: string;
  city?: string;
  barangay?: string;
  // Location
  lat?: number;
  lng?: number;
  // Owner Details
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  // Operation Hours
  openingTime: string;
  closingTime: string;
  // Business Permits & Compliance
  permitNumber?: string;
  tinNumber?: string;
  sanitaryPermitStatus?: 'Valid' | 'Expired' | 'Pending';
  fireSafetyPermit?: string;
  permitExpiry?: string;
}

// Added missing types for Accommodation management
export type RoomType = 'Standard' | 'Deluxe' | 'Suite' | 'Penthouse';
export type AccommodationStatus = 'Available' | 'Booked' | 'Cleaning' | 'Maintenance';

export interface Accommodation {
  id: string;
  roomNumber: string;
  type: RoomType;
  floor: number;
  capacity: number;
  pricePerNight: number;
  status: AccommodationStatus;
  image: string;
  currentGuest?: string;
  features: string[];
}

export type UserRole = 'Admin' | 'Manager' | 'Cashier' | 'Chef' | 'Waiter' | 'Staff';
export type UserStatus = 'Active' | 'Inactive' | 'Invited';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastActive: string;
  avatar: string;
  phone?: string;
}

export type RiderStatus = 'Available' | 'On Delivery' | 'Offline' | 'Break' | 'Suspended';
export type VehicleType = 'Motorcycle' | 'Bicycle' | 'Car';

export interface RiderActivity {
  id: string;
  orderId: string;
  time: string;
  status: 'On Time' | 'Delayed';
  rating: number;
  earnings: number;
}

export interface Rider {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: RiderStatus;
  availabilityDetail?: string;
  vehicle: VehicleType;
  deliveries: number;
  rating: number;
  avatar: string;
  // Performance Metrics
  avgDeliveryTime: number; // in minutes
  successRate: number; // percentage
  cancellationRate: number; // percentage
  totalCommission: number; // Total money earned
  recentActivity?: RiderActivity[];
  // Rating breakdown
  ratingDistribution?: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  // Structured Address for Logistics
  address?: string;
  region?: string;
  province?: string;
  city?: string;
  barangay?: string;
}

export type MembershipTier = 'Gold' | 'Silver' | 'Bronze' | 'Regular';
export type CustomerStatus = 'Active' | 'Inactive' | 'Blocked';
export type CustomerType = 'Regular' | 'Restaurant Owner' | 'Store Owner' | 'Delivery Rider';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  joinDate: string;
  lastOrderDate: string;
  totalSpent: number;
  orderCount: number;
  tier: MembershipTier;
  status: CustomerStatus;
  type: CustomerType;
  address?: string;
  preferences?: string[];
}

export interface AuditLogEntry {
  id: string;
  actor: {
    name: string;
    avatar: string;
  };
  action: string;
  type: 'Create' | 'Update' | 'Status' | 'Delete' | 'Security';
  target: string;
  timestamp: string;
}
