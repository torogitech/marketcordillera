
import { Category, Product, Order, DiningOption, Store, Restaurant, User, Rider, AuditLogEntry, Customer } from './types';

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
    image: 'https://images.unsplash.com/photo-1513104890138-7?auto=format&fit=crop&q=80&w=300' 
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
    store: 'Fresh Mart Baguio',
    items: ['Shrimp Basil Salad', 'Beef Burger'],
    total: 1120.00,
    status: 'Completed',
    date: 'June 10, 2024 09:52 AM',
    type: DiningOption.DINE_IN
  },
  {
    id: '#286',
    customerName: 'Floyd Miles',
    store: 'Cordi Electronics',
    items: ['Onion Rings', 'Fresh Tomatoes'],
    total: 1120.00,
    status: 'Preparing',
    date: 'June 10, 2024 09:54 AM',
    type: DiningOption.DINE_IN
  },
  {
    id: '#285',
    customerName: 'Jane Cooper',
    store: 'Mountain Pharmacy',
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
    id: 's1', 
    name: 'Fresh Mart Baguio', 
    address: 'Session Rd, Baguio City',
    status: 'Open', 
    type: 'Grocery',
    inventoryCount: 1240,
    inventoryLevel: 92,
    todayRevenue: 45200,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400',
    lastRestocked: '2 hours ago',
    ownerName: 'Alice Johnson',
    ownerEmail: 'alice.j@freshmart.ph',
    ownerPhone: '+63 912 345 6789',
    lat: 16.4120,
    lng: 120.5960
  },
  { 
    id: 's2', 
    name: 'Cordi Electronics', 
    address: 'Harrison Rd, Baguio City',
    status: 'Open', 
    type: 'Electronics',
    inventoryCount: 450,
    inventoryLevel: 85,
    todayRevenue: 128500,
    image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=400',
    lastRestocked: 'Yesterday',
    ownerName: 'Bob Smith',
    ownerEmail: 'bob.s@corditech.ph',
    ownerPhone: '+63 923 456 7890',
    lat: 16.4095,
    lng: 120.5980
  },
  { 
    id: 's3', 
    name: 'Mountain Pharmacy', 
    address: 'Magsaysay Ave, Baguio City',
    status: 'Stock Low', 
    type: 'Pharmacy',
    inventoryCount: 2100,
    inventoryLevel: 24,
    todayRevenue: 28400,
    image: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&q=80&w=400',
    lastRestocked: '3 days ago',
    ownerName: 'Charlie Brown',
    ownerEmail: 'charlie.b@mountainmed.ph',
    ownerPhone: '+63 934 567 8901',
    lat: 16.4150,
    lng: 120.5900
  },
  { 
    id: 's4', 
    name: 'Baguio Highland Boutique', 
    address: 'Upper Session, Baguio City',
    status: 'Open', 
    type: 'Boutique',
    inventoryCount: 850,
    inventoryLevel: 98,
    todayRevenue: 15600,
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=400',
    lastRestocked: 'Today',
    ownerName: 'Diana Prince',
    ownerEmail: 'diana.p@highland.ph',
    ownerPhone: '+63 945 678 9012',
    lat: 16.4115,
    lng: 120.5995
  },
  { 
    id: 's5', 
    name: 'La Trinidad Veggie Hub', 
    address: 'Trading Post, La Trinidad',
    status: 'Maintenance', 
    type: 'Grocery',
    inventoryCount: 3200,
    inventoryLevel: 10,
    todayRevenue: 0,
    image: 'https://images.unsplash.com/photo-1488459711635-de84fd23d5fa?auto=format&fit=crop&q=80&w=400',
    lastRestocked: '1 week ago',
    ownerName: 'Evan Wright',
    ownerEmail: 'evan.w@veggiehub.ph',
    ownerPhone: '+63 956 789 0123',
    lat: 16.4550,
    lng: 120.5920
  },
  { 
    id: 's6', 
    name: 'Summit Supply Co.', 
    address: 'Loakan Rd, Baguio City',
    status: 'Open', 
    type: 'General',
    inventoryCount: 5400,
    inventoryLevel: 75,
    todayRevenue: 62300,
    image: 'https://images.unsplash.com/photo-1534452286302-2f56303c616d?auto=format&fit=crop&q=80&w=400',
    lastRestocked: '2 days ago',
    ownerName: 'Fiona Gallagher',
    ownerEmail: 'fiona.g@summit.ph',
    ownerPhone: '+63 967 890 1234',
    lat: 16.3850,
    lng: 120.6100
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
    lng: 120.5950,
    permitNumber: 'BP-2024-00123',
    tinNumber: '123-456-789-000',
    sanitaryPermitStatus: 'Valid',
    fireSafetyPermit: 'FS-2024-8821',
    permitExpiry: '2025-12-31'
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
    lng: 120.5960,
    permitNumber: 'BP-2024-00998',
    tinNumber: '998-765-432-000',
    sanitaryPermitStatus: 'Valid',
    fireSafetyPermit: 'FS-2024-1102',
    permitExpiry: '2025-06-15'
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
    lng: 120.6500,
    sanitaryPermitStatus: 'Expired'
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
    lng: 120.5900,
    sanitaryPermitStatus: 'Pending'
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
    lng: 120.5800,
    sanitaryPermitStatus: 'Valid'
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
    lng: 120.6100,
    sanitaryPermitStatus: 'Valid'
  },
];

export const RIDERS: Rider[] = [
  { 
    id: 'ri1', name: 'James Baguio', phone: '+63 912 345 6789', email: 'james.b@marketcordi.ph', status: 'Available', vehicle: 'Motorcycle', deliveries: 1240, rating: 4.9, avatar: 'https://picsum.photos/seed/ri1/150', avgDeliveryTime: 22, successRate: 99.2, cancellationRate: 0.5, totalCommission: 45200.50,
    recentActivity: [
      { id: 'ra1', orderId: '#9821', time: '15 mins ago', status: 'On Time', rating: 5.0, earnings: 85.50 },
      { id: 'ra2', orderId: '#9815', time: '1h ago', status: 'On Time', rating: 4.8, earnings: 120.00 },
      { id: 'ra3', orderId: '#9799', time: '3h ago', status: 'Delayed', rating: 4.5, earnings: 95.00 },
    ],
    ratingDistribution: { 5: 980, 4: 150, 3: 80, 2: 20, 1: 10 }
  },
  { 
    id: 'ri2', name: 'Maria Santos', phone: '+63 923 456 7890', email: 'maria.s@marketcordi.ph', status: 'On Delivery', vehicle: 'Motorcycle', deliveries: 856, rating: 4.7, avatar: 'https://picsum.photos/seed/ri2/150', avgDeliveryTime: 28, successRate: 97.5, cancellationRate: 1.2, totalCommission: 32450.00,
    recentActivity: [
      { id: 'ra4', orderId: '#9830', time: 'Now', status: 'On Time', rating: 5.0, earnings: 75.00 },
      { id: 'ra5', orderId: '#9802', time: '4h ago', status: 'On Time', rating: 4.9, earnings: 110.00 },
    ],
    ratingDistribution: { 5: 600, 4: 180, 3: 50, 2: 15, 1: 11 }
  },
  { 
    id: 'ri3', name: 'Jun Luna', phone: '+63 934 567 8901', email: 'jun.l@marketcordi.ph', status: 'Break', vehicle: 'Bicycle', deliveries: 432, rating: 4.8, avatar: 'https://picsum.photos/seed/ri3/150', avgDeliveryTime: 35, successRate: 98.8, cancellationRate: 0.2, totalCommission: 15600.75,
    recentActivity: [
      { id: 'ra6', orderId: '#9788', time: 'Yesterday', status: 'On Time', rating: 4.7, earnings: 65.00 },
    ],
    ratingDistribution: { 5: 350, 4: 50, 3: 20, 2: 10, 1: 2 }
  },
  { id: 'ri4', name: 'Elena Cruz', phone: '+63 945 678 9012', email: 'elena.c@marketcordi.ph', status: 'Available', vehicle: 'Car', deliveries: 210, rating: 4.5, avatar: 'https://picsum.photos/seed/ri4/150', avgDeliveryTime: 18, successRate: 94.0, cancellationRate: 3.5, totalCommission: 8900.25, ratingDistribution: { 5: 120, 4: 50, 3: 25, 2: 10, 1: 5 } },
  { id: 'ri5', name: 'Rico Blanco', phone: '+63 956 789 0123', email: 'rico.b@marketcordi.ph', status: 'Offline', vehicle: 'Motorcycle', deliveries: 1540, rating: 4.9, avatar: 'https://picsum.photos/seed/ri5/150', avgDeliveryTime: 21, successRate: 99.8, cancellationRate: 0.1, totalCommission: 62300.00, ratingDistribution: { 5: 1450, 4: 60, 3: 20, 2: 8, 1: 2 } },
  { id: 'ri6', name: 'Sarah G.', phone: '+63 967 890 1234', email: 'sarah.g@marketcordi.ph', status: 'On Delivery', vehicle: 'Bicycle', deliveries: 95, rating: 4.6, avatar: 'https://picsum.photos/seed/ri6/150', avgDeliveryTime: 42, successRate: 96.2, cancellationRate: 1.0, totalCommission: 4500.50, ratingDistribution: { 5: 60, 4: 20, 3: 10, 2: 3, 1: 2 } },
];

export const CUSTOMERS: Customer[] = [
  {
    id: 'c1',
    name: 'Devon Lane',
    email: 'devon.lane@gmail.com',
    phone: '+63 912 345 6789',
    avatar: 'https://picsum.photos/seed/c1/150',
    joinDate: 'Jan 12, 2024',
    lastOrderDate: 'June 10, 2024',
    totalSpent: 12450.00,
    orderCount: 45,
    tier: 'Gold',
    status: 'Active',
    type: 'Restaurant Owner',
    preferences: ['Spicy Food', 'Eco-friendly Packaging']
  },
  {
    id: 'c2',
    name: 'Jane Cooper',
    email: 'jane.cooper@yahoo.com',
    phone: '+63 923 456 7890',
    avatar: 'https://picsum.photos/seed/c2/150',
    joinDate: 'Feb 05, 2024',
    lastOrderDate: 'June 10, 2024',
    totalSpent: 8900.50,
    orderCount: 32,
    tier: 'Silver',
    status: 'Active',
    type: 'Regular'
  },
  {
    id: 'c3',
    name: 'Floyd Miles',
    email: 'floyd.miles@outlook.com',
    phone: '+63 934 567 8901',
    avatar: 'https://picsum.photos/seed/c3/150',
    joinDate: 'Mar 20, 2024',
    lastOrderDate: 'June 09, 2024',
    totalSpent: 4200.00,
    orderCount: 15,
    tier: 'Bronze',
    status: 'Active',
    type: 'Delivery Rider'
  },
  {
    id: 'c4',
    name: 'Savannah Nguyen',
    email: 'savannah.n@me.com',
    phone: '+63 945 678 9012',
    avatar: 'https://picsum.photos/seed/c4/150',
    joinDate: 'Jan 02, 2024',
    lastOrderDate: 'June 08, 2024',
    totalSpent: 15600.75,
    orderCount: 58,
    tier: 'Gold',
    status: 'Active',
    type: 'Store Owner'
  },
  {
    id: 'c5',
    name: 'Robert Fox',
    email: 'robert.fox@marketcord.com',
    phone: '+63 956 789 0123',
    avatar: 'https://picsum.photos/seed/c5/150',
    joinDate: 'Dec 15, 2023',
    lastOrderDate: 'June 01, 2024',
    totalSpent: 3100.00,
    orderCount: 10,
    tier: 'Regular',
    status: 'Inactive',
    type: 'Regular'
  }
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
