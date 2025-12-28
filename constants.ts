
import { Category, Product, Order, DiningOption, Store, Restaurant, Accommodation, User, Rider, AuditLogEntry } from './types';

export const CATEGORIES: Category[] = [
  { id: 'all', name: 'Show All' },
  { 
    id: 'burger', 
    name: 'Burger', 
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=300' 
  },
  { 
    id: 'pizza', 
    name: 'Pizza', 
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=300' 
  },
  { 
    id: 'salad', 
    name: 'Salads', 
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=300' 
  },
  { 
    id: 'soup', 
    name: 'Soup', 
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=300' 
  },
  { 
    id: 'beverage', 
    name: 'Beverages', 
    image: 'https://images.unsplash.com/photo-1544145945-f904253d0c71?auto=format&fit=crop&q=80&w=300' 
  },
];

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Shrimp Basil Salad',
    price: 560.00,
    category: 'salad',
    image: 'https://picsum.photos/seed/salad1/300/300',
    calories: 120,
    ingredients: ['Fresh Shrimp', 'Thai Basil', 'Romaine Lettuce', 'Cherry Tomatoes', 'Lime Vinaigrette']
  },
  {
    id: '2',
    name: 'Onion Rings',
    price: 560.00,
    category: 'salad',
    image: 'https://picsum.photos/seed/onion/300/300',
    calories: 250,
    ingredients: ['White Onion', 'Tempura Batter', 'Breadcrumbs', 'Sea Salt', 'Paprika']
  },
  {
    id: '3',
    name: 'Smoked Bacon',
    price: 560.00,
    category: 'burger',
    image: 'https://picsum.photos/seed/bacon/300/300',
    calories: 400,
    ingredients: ['Pork Belly', 'Hickory Smoke', 'Brown Sugar', 'Black Pepper']
  },
  {
    id: '4',
    name: 'Fresh Tomatoes',
    price: 560.00,
    category: 'salad',
    image: 'https://picsum.photos/seed/tomato/300/300',
    calories: 40,
    ingredients: ['Organic Vine Tomatoes']
  },
  {
    id: '5',
    name: 'Chicken Burger',
    price: 560.00,
    category: 'burger',
    image: 'https://picsum.photos/seed/chicken/300/300',
    calories: 550,
    ingredients: ['Grilled Chicken Breast', 'Sesame Bun', 'Lettuce', 'Mayo', 'Pickles']
  },
  {
    id: '6',
    name: 'Red Onion Rings',
    price: 560.00,
    category: 'salad',
    image: 'https://picsum.photos/seed/redonion/300/300',
    calories: 120,
    ingredients: ['Red Onion', 'Cornmeal', 'Spices', 'Vegetable Oil']
  },
  {
    id: '7',
    name: 'Beef Burger',
    price: 560.00,
    category: 'burger',
    image: 'https://picsum.photos/seed/beef/300/300',
    calories: 600,
    ingredients: ['Angus Beef Patty', 'Cheddar Cheese', 'Brioche Bun', 'Caramelized Onions', 'BBQ Sauce']
  },
  {
    id: '8',
    name: 'Grilled Burger',
    price: 560.00,
    category: 'burger',
    image: 'https://picsum.photos/seed/grilled/300/300',
    calories: 580,
    ingredients: ['Flame Grilled Patty', 'Whole Wheat Bun', 'Mustard', 'Tomato Slices']
  },
  {
    id: '9',
    name: 'Vegetable Pizza',
    price: 560.00,
    category: 'pizza',
    image: 'https://picsum.photos/seed/vegepizza/300/300',
    calories: 450,
    ingredients: ['Pizza Dough', 'Tomato Sauce', 'Mozzarella', 'Bell Peppers', 'Mushrooms', 'Olives']
  },
  {
    id: '10',
    name: 'Fish & Chips',
    price: 560.00,
    category: 'seafood',
    image: 'https://picsum.photos/seed/fish/300/300',
    calories: 700,
    ingredients: ['Cod Fillet', 'Beer Batter', 'Potato Fries', 'Tartar Sauce', 'Lemon Wedge']
  },
];

export const REVENUE_DATA = [
  { day: 'Mon', value: 4500 },
  { day: 'Tue', value: 5200 },
  { day: 'Wed', value: 4800 },
  { day: 'Thu', value: 6100 },
  { day: 'Fri', value: 8500 },
  { day: 'Sat', value: 9200 },
  { day: 'Sun', value: 7800 },
];

export const RECENT_ORDERS: Order[] = [
  {
    id: '#289',
    customerName: 'Devon Lane',
    store: 'Store 02',
    items: ['Shrimp Basil Salad', 'Beef Burger'],
    total: 1120.00,
    status: 'Completed',
    date: 'June 10, 2024 09:52 AM',
    type: DiningOption.DINE_IN
  },
  {
    id: '#286',
    customerName: 'Floyd Miles',
    store: 'Store 05',
    items: ['Onion Rings', 'Fresh Tomatoes'],
    total: 1120.00,
    status: 'Preparing',
    date: 'June 10, 2024 09:54 AM',
    type: DiningOption.DINE_IN
  },
  {
    id: '#285',
    customerName: 'Jane Cooper',
    store: 'Store 03',
    items: ['Smoked Bacon', 'Chicken Burger', 'Coke'],
    total: 1680.00,
    status: 'Pending',
    date: 'June 10, 2024 10:37 AM',
    type: DiningOption.DINE_IN
  },
  {
    id: '#283',
    customerName: 'Savannah Nguyen',
    store: '-',
    items: ['Vegetable Pizza'],
    total: 560.00,
    status: 'Completed',
    date: 'June 10, 2024 10:34 AM',
    type: DiningOption.TAKE_AWAY
  },
];

export const STORES: Store[] = [
  { 
    id: 't1', 
    name: 'Store 01', 
    seats: 20, 
    status: 'Available', 
    lastActive: '10 mins ago',
    ownerName: 'Alice Johnson',
    ownerEmail: 'alice.j@store01.com',
    ownerPhone: '+1 (555) 123-4567'
  },
  { 
    id: 't2', 
    name: 'Store 02', 
    seats: 45, 
    status: 'Occupied', 
    currentOrderId: '#289', 
    lastActive: 'Now',
    ownerName: 'Bob Smith',
    ownerEmail: 'bob.smith@store02.com',
    ownerPhone: '+1 (555) 234-5678'
  },
  { 
    id: 't3', 
    name: 'Store 03', 
    seats: 15, 
    status: 'Reserved', 
    lastActive: '1 hour ago',
    ownerName: 'Charlie Brown',
    ownerEmail: 'charlie.b@store03.com',
    ownerPhone: '+1 (555) 345-6789'
  },
  { 
    id: 't4', 
    name: 'Store 04', 
    seats: 30, 
    status: 'Available', 
    lastActive: '2 hours ago',
    ownerName: 'Diana Prince',
    ownerEmail: 'diana.p@store04.com',
    ownerPhone: '+1 (555) 456-7890'
  },
  { 
    id: 't5', 
    name: 'Store 05', 
    seats: 25, 
    status: 'Occupied', 
    currentOrderId: '#286', 
    lastActive: '5 mins ago',
    ownerName: 'Evan Wright',
    ownerEmail: 'evan.w@store05.com',
    ownerPhone: '+1 (555) 567-8901'
  },
  { 
    id: 't6', 
    name: 'Store 06', 
    seats: 50, 
    status: 'Available', 
    lastActive: 'Yesterday',
    ownerName: 'Fiona Gallagher',
    ownerEmail: 'fiona.g@store06.com',
    ownerPhone: '+1 (555) 678-9012'
  },
  { 
    id: 't7', 
    name: 'Store 07', 
    seats: 40, 
    status: 'Available', 
    lastActive: '30 mins ago',
    ownerName: 'George Lucas',
    ownerEmail: 'george.l@store07.com',
    ownerPhone: '+1 (555) 789-0123'
  },
  { 
    id: 't8', 
    name: 'Store 08', 
    seats: 20, 
    status: 'Reserved', 
    lastActive: 'Now',
    ownerName: 'Hannah Montana',
    ownerEmail: 'hannah.m@store08.com',
    ownerPhone: '+1 (555) 890-1234'
  },
  { 
    id: 't9', 
    name: 'Flagship Store', 
    seats: 100, 
    status: 'Available', 
    lastActive: 'Yesterday',
    ownerName: 'Ian Malcolm',
    ownerEmail: 'ian.m@flagship.com',
    ownerPhone: '+1 (555) 901-2345'
  },
];

export const RESTAURANTS: Restaurant[] = [
  { 
    id: 'r1', 
    name: 'Gourmet Central', 
    address: 'Baguio City, Benguet, Cordillera', 
    status: 'Open', 
    capacity: 150, 
    activeOrders: 12, 
    todayRevenue: 12500, 
    image: 'https://picsum.photos/seed/rest1/200/200',
    ownerName: 'Isabella Rossi',
    ownerEmail: 'isabella.rossi@gourmetcentral.com',
    ownerPhone: '+1 (212) 555-0123',
    cuisineType: 'Italian Fine Dining',
    rating: 4.8,
    establishedYear: 2015,
    description: 'A premium Italian dining experience in the heart of Baguio.',
    openingTime: '11:00',
    closingTime: '23:00',
    lat: 16.4110,
    lng: 120.5950
  },
  { 
    id: 'r2', 
    name: 'Sea Breeze Bistro', 
    address: 'Baguio City, Benguet, Cordillera', 
    status: 'Busy', 
    capacity: 80, 
    activeOrders: 24, 
    todayRevenue: 8900, 
    image: 'https://picsum.photos/seed/rest2/200/200',
    ownerName: 'Carlos Mendez',
    ownerEmail: 'carlos.m@seabreeze.com',
    ownerPhone: '+1 (305) 555-0188',
    cuisineType: 'Seafood & Grill',
    rating: 4.5,
    establishedYear: 2018,
    description: 'Fresh flavors in the summer capital.',
    openingTime: '10:00',
    closingTime: '22:00',
    lat: 16.4023,
    lng: 120.5960
  },
  { 
    id: 'r3', 
    name: 'Mountain Peak Diner', 
    address: 'Itogon, Benguet, Cordillera', 
    status: 'Closed', 
    capacity: 100, 
    activeOrders: 0, 
    todayRevenue: 0, 
    image: 'https://picsum.photos/seed/rest3/200/200',
    ownerName: 'Sarah Jenkins',
    ownerEmail: 'sarah.j@mountainpeak.com',
    ownerPhone: '+1 (303) 555-0199',
    cuisineType: 'American Comfort',
    rating: 4.2,
    establishedYear: 2010,
    description: 'Hearty meals for mountain lovers.',
    openingTime: '06:00',
    closingTime: '20:00',
    lat: 16.3500,
    lng: 120.6500
  },
  { 
    id: 'r4', 
    name: 'Urban Spice', 
    address: 'La Trinidad, Benguet, Cordillera', 
    status: 'Open', 
    capacity: 200, 
    activeOrders: 8, 
    todayRevenue: 15400, 
    image: 'https://picsum.photos/seed/rest4/200/200',
    ownerName: 'Raj Patel',
    ownerEmail: 'raj.patel@urbanspice.com',
    ownerPhone: '+1 (312) 555-0144',
    cuisineType: 'Modern Indian',
    rating: 4.7,
    establishedYear: 2019,
    description: 'Traditional Indian flavors with a modern twist.',
    openingTime: '12:00',
    closingTime: '23:30',
    lat: 16.4500,
    lng: 120.5900
  },
  { 
    id: 'r5', 
    name: 'Sunset Grill', 
    address: 'Baguio City, Benguet, Cordillera', 
    status: 'Maintenance', 
    capacity: 120, 
    activeOrders: 0, 
    todayRevenue: 11200, 
    image: 'https://picsum.photos/seed/rest5/200/200',
    ownerName: 'Michael Chen',
    ownerEmail: 'm.chen@sunsetgrill.la',
    ownerPhone: '+1 (323) 555-0166',
    cuisineType: 'Californian Fusion',
    rating: 4.4,
    establishedYear: 2012,
    description: 'Farm-to-table ingredients meeting West Coast vibes.',
    openingTime: '16:00',
    closingTime: '02:00',
    lat: 16.4050,
    lng: 120.5800
  },
  { 
    id: 'r6', 
    name: 'Fusion Bay', 
    address: 'Baguio City, Benguet, Cordillera', 
    status: 'Open', 
    capacity: 90, 
    activeOrders: 5, 
    todayRevenue: 5600, 
    image: 'https://picsum.photos/seed/rest6/200/200',
    ownerName: 'Emma Watson',
    ownerEmail: 'emma.w@fusionbay.sf',
    ownerPhone: '+1 (415) 555-0177',
    cuisineType: 'Asian Fusion',
    rating: 4.6,
    establishedYear: 2021,
    description: 'A creative blend of Japanese and Peruvian cuisines.',
    openingTime: '11:30',
    closingTime: '22:30',
    lat: 16.4150,
    lng: 120.6100
  },
];

export const ACCOMMODATIONS: Accommodation[] = [
  { id: 'a1', roomNumber: '101', type: 'Standard', pricePerNight: 2500, status: 'Available', floor: 1, capacity: 2, features: ['WiFi', 'TV', 'AC'], image: 'https://picsum.photos/seed/room101/300/200' },
  { id: 'a2', roomNumber: '102', type: 'Deluxe', pricePerNight: 4500, status: 'Booked', floor: 1, capacity: 2, features: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Ocean View'], currentGuest: 'John Doe', image: 'https://picsum.photos/seed/room102/300/200' },
  { id: 'a3', roomNumber: '201', type: 'Suite', pricePerNight: 8500, status: 'Available', floor: 2, capacity: 4, features: ['WiFi', 'TV', 'AC', 'Kitchenette', 'Living Area'], image: 'https://picsum.photos/seed/room201/300/200' },
  { id: 'a4', roomNumber: '202', type: 'Standard', pricePerNight: 2500, status: 'Cleaning', floor: 2, capacity: 2, features: ['WiFi', 'TV', 'AC'], image: 'https://picsum.photos/seed/room202/300/200' },
  { id: 'a5', roomNumber: '301', type: 'Penthouse', pricePerNight: 25000, status: 'Maintenance', floor: 3, capacity: 6, features: ['WiFi', 'TV', 'AC', 'Full Kitchen', 'Private Pool', 'Butler'], image: 'https://picsum.photos/seed/room301/300/200' },
  { id: 'a6', roomNumber: '103', type: 'Standard', pricePerNight: 2500, status: 'Available', floor: 1, capacity: 2, features: ['WiFi', 'TV', 'AC'], image: 'https://picsum.photos/seed/room103/300/200' },
  { id: 'a7', roomNumber: '205', type: 'Deluxe', pricePerNight: 4500, status: 'Booked', floor: 2, capacity: 2, features: ['WiFi', 'TV', 'AC', 'Mini Bar'], currentGuest: 'Jane Smith', image: 'https://picsum.photos/seed/room205/300/200' },
  { id: 'a8', roomNumber: '105', type: 'Standard', pricePerNight: 2500, status: 'Available', floor: 1, capacity: 2, features: ['WiFi', 'TV', 'AC'], image: 'https://picsum.photos/seed/room105/300/200' },
];

export const RIDERS: Rider[] = [
  { id: 'ri1', name: 'James Baguio', phone: '+63 912 345 6789', email: 'james.b@marketcordi.ph', status: 'Available', vehicle: 'Motorcycle', deliveries: 1240, rating: 4.9, avatar: 'https://picsum.photos/seed/ri1/150', avgDeliveryTime: 22, successRate: 99.2, cancellationRate: 0.5 },
  { id: 'ri2', name: 'Maria Santos', phone: '+63 923 456 7890', email: 'maria.s@marketcordi.ph', status: 'On Delivery', vehicle: 'Motorcycle', deliveries: 856, rating: 4.7, avatar: 'https://picsum.photos/seed/ri2/150', avgDeliveryTime: 28, successRate: 97.5, cancellationRate: 1.2 },
  { id: 'ri3', name: 'Jun Luna', phone: '+63 934 567 8901', email: 'jun.l@marketcordi.ph', status: 'Break', vehicle: 'Bicycle', deliveries: 432, rating: 4.8, avatar: 'https://picsum.photos/seed/ri3/150', avgDeliveryTime: 35, successRate: 98.8, cancellationRate: 0.2 },
  { id: 'ri4', name: 'Elena Cruz', phone: '+63 945 678 9012', email: 'elena.c@marketcordi.ph', status: 'Available', vehicle: 'Car', deliveries: 210, rating: 4.5, avatar: 'https://picsum.photos/seed/ri4/150', avgDeliveryTime: 18, successRate: 94.0, cancellationRate: 3.5 },
  { id: 'ri5', name: 'Rico Blanco', phone: '+63 956 789 0123', email: 'rico.b@marketcordi.ph', status: 'Offline', vehicle: 'Motorcycle', deliveries: 1540, rating: 4.9, avatar: 'https://picsum.photos/seed/ri5/150', avgDeliveryTime: 21, successRate: 99.8, cancellationRate: 0.1 },
  { id: 'ri6', name: 'Sarah G.', phone: '+63 967 890 1234', email: 'sarah.g@marketcordi.ph', status: 'On Delivery', vehicle: 'Bicycle', deliveries: 95, rating: 4.6, avatar: 'https://picsum.photos/seed/ri6/150', avgDeliveryTime: 42, successRate: 96.2, cancellationRate: 1.0 },
];

export const USERS: User[] = [
  { id: 'u1', name: 'Alvin T.', email: 'saiful.uiux@gmail.com', role: 'Admin', status: 'Active', lastActive: 'Now', phone: '+1 (555) 012-3456', avatar: 'https://picsum.photos/seed/u1/150' },
  { id: 'u2', name: 'Jenny Wilson', email: 'jenny.w@marketcord.com', role: 'Manager', status: 'Active', lastActive: '2h ago', phone: '+1 (555) 023-4567', avatar: 'https://picsum.photos/seed/u2/150' },
  { id: 'u3', name: 'Robert Fox', email: 'robert.fox@marketcord.com', role: 'Chef', status: 'Inactive', lastActive: '2 days ago', phone: '+1 (555) 034-5678', avatar: 'https://picsum.photos/seed/u3/150' },
  { id: 'u4', name: 'Kristin Watson', email: 'kristin.w@marketcord.com', role: 'Cashier', status: 'Active', lastActive: '5m ago', phone: '+1 (555) 045-6789', avatar: 'https://picsum.photos/seed/u4/150' },
  { id: 'u5', name: 'Cody Fisher', email: 'cody.f@marketcord.com', role: 'Waiter', status: 'Invited', lastActive: '-', phone: '+1 (555) 056-7890', avatar: 'https://picsum.photos/seed/u5/150' },
  { id: 'u6', name: 'Esther Howard', email: 'esther.h@marketcord.com', role: 'Staff', status: 'Active', lastActive: '1d ago', phone: '+1 (555) 067-8901', avatar: 'https://picsum.photos/seed/u6/150' },
];

export const MOCK_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'l1',
    actor: { name: 'Alvin T.', avatar: 'https://picsum.photos/seed/u1/150' },
    action: 'Modified user permissions',
    type: 'Update',
    target: 'Jenny Wilson',
    timestamp: '10 mins ago'
  },
  {
    id: 'l2',
    actor: { name: 'Alvin T.', avatar: 'https://picsum.photos/seed/u1/150' },
    action: 'Invited new staff member',
    type: 'Create',
    target: 'Cody Fisher',
    timestamp: '1 hour ago'
  },
  {
    id: 'l3',
    actor: { name: 'Jenny Wilson', avatar: 'https://picsum.photos/seed/u2/150' },
    action: 'Changed user status to Active',
    type: 'Status',
    target: 'Kristin Watson',
    timestamp: '2 hours ago'
  },
  {
    id: 'l4',
    actor: { name: 'Alvin T.', avatar: 'https://picsum.photos/seed/u1/150' },
    action: 'Reset administrative password',
    type: 'Security',
    target: 'Self',
    timestamp: 'Yesterday'
  },
  {
    id: 'l5',
    actor: { name: 'Alvin T.', avatar: 'https://picsum.photos/seed/u1/150' },
    action: 'Removed inactive staff account',
    type: 'Delete',
    target: 'Robert Fox',
    timestamp: '2 days ago'
  }
];
