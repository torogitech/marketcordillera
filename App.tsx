
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ProductGrid from './components/ProductGrid';
import CartPanel from './components/CartPanel';
import ChefAssistant from './components/ChefAssistant';
import Dashboard from './components/Dashboard';
import StoreManagement from './components/TableManagement';
import RestaurantManagement from './components/RestaurantManagement';
import RestaurantDetails from './components/RestaurantDetails';
import DeliveryManagement from './components/DeliveryManagement';
import CustomerManagement from './components/CustomerManagement';
import Settings from './components/Settings';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import { Product, CartItem, Restaurant } from './types';
import { PRODUCTS, CATEGORIES, RECENT_ORDERS, STORES, RESTAURANTS } from './constants';
import { ClipboardList, Menu as MenuIcon } from 'lucide-react';

const App: React.FC = () => {
  // Application-level Routing State
  const [appState, setAppState] = useState<'landing' | 'login' | 'dashboard'>('landing');
  
  // Internal Dashboard Routing State
  const [currentView, setCurrentView] = useState<'dashboard' | 'menu' | 'stores' | 'restaurants' | 'restaurant-details' | 'delivery' | 'settings' | 'customer'>('dashboard');
  
  const [activeCategory, setActiveCategory] = useState('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeStoreId, setActiveStoreId] = useState<string>('t1');
  const [isChefOpen, setIsChefOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Restaurant State Management
  const [restaurants, setRestaurants] = useState<Restaurant[]>(RESTAURANTS);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleUpdateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const handleSwitchStore = (storeId: string) => {
    if (storeId === activeStoreId) return;
    setActiveStoreId(storeId);
    const storeObj = STORES.find(s => s.id === storeId);
    if (!storeObj) return;
    const mockOrder = RECENT_ORDERS.find(o => o.store === storeObj.name);
    if (mockOrder) {
      const loadedItems: CartItem[] = [];
      mockOrder.items.forEach(itemName => {
        const product = PRODUCTS.find(p => p.name === itemName);
        if (product) {
          const existing = loadedItems.find(i => i.id === product.id);
          if (existing) { existing.quantity += 1; } else { loadedItems.push({ ...product, quantity: 1 }); }
        }
      });
      setCart(loadedItems);
    } else {
      setCart([]);
    }
  };

  const handleRestaurantSelect = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setCurrentView('restaurant-details');
    setIsSidebarOpen(false); // Close sidebar on mobile when navigating
  };

  const handleRestaurantUpdate = (updated: Restaurant) => {
    setRestaurants(prev => prev.map(r => r.id === updated.id ? updated : r));
    setSelectedRestaurant(updated);
  };

  const handleLogout = () => {
    setAppState('landing');
    setIsSidebarOpen(false);
  };

  const handleViewChange = (view: any) => {
    setCurrentView(view);
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = 0;
  const tax = subtotal * 0.05;
  const total = subtotal - discount + tax;

  const renderDashboardView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'stores':
        return (
          <StoreManagement 
            cart={cart}
            activeStoreId={activeStoreId}
            onStoreSelect={handleSwitchStore}
            onNavigateToMenu={() => setCurrentView('menu')}
            onOpenCart={() => setIsCartOpen(true)}
          />
        );
      case 'restaurants':
        return (
          <RestaurantManagement 
            restaurants={restaurants}
            onRestaurantSelect={handleRestaurantSelect}
          />
        );
      case 'restaurant-details':
        if (!selectedRestaurant) return <RestaurantManagement restaurants={restaurants} onRestaurantSelect={handleRestaurantSelect} />;
        return (
          <RestaurantDetails 
            restaurant={selectedRestaurant} 
            onBack={() => setCurrentView('restaurants')}
            onUpdate={handleRestaurantUpdate}
          />
        );
      case 'delivery':
        return <DeliveryManagement />;
      case 'customer':
        return <CustomerManagement />;
      case 'settings':
        return <Settings />;
      case 'menu':
      default:
        return (
          <ProductGrid 
            products={PRODUCTS}
            categories={CATEGORIES}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            onAddToCart={handleAddToCart}
          />
        );
    }
  };

  if (appState === 'landing') {
    return <LandingPage onLoginClick={() => setAppState('login')} />;
  }

  if (appState === 'login') {
    return <LoginPage onLoginSuccess={() => setAppState('dashboard')} onBackToLanding={() => setAppState('landing')} />;
  }

  // Determine sidebar active state
  let sidebarView: 'dashboard' | 'menu' | 'stores' | 'restaurants' | 'delivery' | 'settings' | 'customer' = 'dashboard';
  if (currentView === 'restaurant-details') { sidebarView = 'restaurants'; } 
  else if (['dashboard', 'menu', 'stores', 'restaurants', 'delivery', 'settings', 'customer'].includes(currentView)) {
    sidebarView = currentView as any;
  }

  return (
    <div className="flex bg-gray-100 min-h-screen relative">
      {/* Mobile Header with Toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 z-30 px-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-black text-sm italic shadow-lg shadow-orange-200">
            M
          </div>
          <span className="text-lg font-black text-gray-900 tracking-tight">Market<span className="text-orange-500">Cordi</span></span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
        >
          <MenuIcon size={24} />
        </button>
      </div>

      <Sidebar 
        currentView={sidebarView}
        onViewChange={handleViewChange}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <main className="flex-1 flex flex-col lg:flex-row relative pt-16 lg:pt-0">
        {renderDashboardView()}
      </main>

      {/* Floating Cart Button */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-xl shadow-orange-500/20 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center"
      >
        <ClipboardList size={24} />
        {cart.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white animate-bounce">
            {cart.length}
          </span>
        )}
      </button>

      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-[400px] animate-[slideLeft_0.3s_ease-out] shadow-2xl">
            <CartPanel 
              cart={cart}
              onRemove={handleRemoveFromCart}
              onUpdateQty={handleUpdateQty}
              subtotal={subtotal}
              discount={discount}
              tax={tax}
              total={total}
              activeStoreId={activeStoreId}
              onStoreChange={handleSwitchStore}
              className="w-full h-full static shadow-none"
              onClose={() => setIsCartOpen(false)}
            />
          </div>
        </div>
      )}

      <ChefAssistant isOpen={isChefOpen} onClose={() => setIsChefOpen(false)} />
      
      <style>{`
        @keyframes slideLeft {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default App;
