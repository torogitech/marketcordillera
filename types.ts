
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

export type StoreStatus = 'Available' | 'Occupied' | 'Reserved';

export interface Store {
  id: string;
  name: string;
  seats: number; // Represents Capacity/Staff
  status: StoreStatus;
  currentOrderId?: string;
  lastActive?: string;
  // Owner Details
  ownerName?: string;
  ownerEmail?: string;
  ownerPhone?: string;
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
}

export type AccommodationStatus = 'Available' | 'Booked' | 'Maintenance' | 'Cleaning';
export type RoomType = 'Standard' | 'Deluxe' | 'Suite' | 'Penthouse';

export interface Accommodation {
  id: string;
  roomNumber: string;
  type: RoomType;
  pricePerNight: number;
  status: AccommodationStatus;
  floor: number;
  capacity: number;
  features: string[];
  image?: string;
  currentGuest?: string;
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

export type RiderStatus = 'Available' | 'On Delivery' | 'Offline' | 'Break';
export type VehicleType = 'Motorcycle' | 'Bicycle' | 'Car';

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
