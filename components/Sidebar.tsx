
import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Store, 
  Utensils, 
  Truck, 
  CreditCard, 
  Users, 
  FileText, 
  Settings, 
  LogOut,
  BedDouble
} from 'lucide-react';

interface SidebarProps {
  currentView: 'dashboard' | 'menu' | 'stores' | 'restaurants' | 'accommodations' | 'delivery' | 'settings';
  onViewChange: (view: 'dashboard' | 'menu' | 'stores' | 'restaurants' | 'accommodations' | 'delivery' | 'settings') => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { id: 'menu', icon: <ShoppingBag size={20} />, label: 'Menu' },
    { id: 'stores', icon: <Store size={20} />, label: 'Stores' },
    { id: 'restaurants', icon: <Utensils size={20} />, label: 'Restaurants' },
    { id: 'accommodations', icon: <BedDouble size={20} />, label: 'Accommodations' },
    { id: 'delivery', icon: <Truck size={20} />, label: 'Delivery' },
    { id: 'payments', icon: <CreditCard size={20} />, label: 'Payments' },
    { id: 'customer', icon: <Users size={20} />, label: 'Customer' },
    { id: 'invoice', icon: <FileText size={20} />, label: 'Invoice' },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 h-screen fixed left-0 top-0 z-20 overflow-y-auto scrollbar-hide">
      <div className="p-6 flex items-center space-x-3 mb-6">
        <img 
          src="https://picsum.photos/seed/avatar/50/50" 
          alt="Profile" 
          className="w-10 h-10 rounded-full border-2 border-orange-100"
        />
        <div>
          <h3 className="font-bold text-gray-800 text-sm">Alvin T.</h3>
          <p className="text-xs text-gray-500">Product Designer</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              if (['dashboard', 'menu', 'stores', 'restaurants', 'accommodations', 'delivery'].includes(item.id)) {
                onViewChange(item.id as any);
              }
            }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              currentView === item.id 
                ? 'bg-orange-50 text-orange-600 font-semibold shadow-sm' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            {item.icon}
            <span className="text-sm">{item.label}</span>
          </button>
        ))}

        <div className="pt-4 pb-2 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Back Office
        </div>

        <button 
          onClick={() => onViewChange('settings')}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
            currentView === 'settings' 
              ? 'bg-orange-50 text-orange-600 font-semibold shadow-sm' 
              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <Settings size={20} />
          <span className="text-sm">Settings</span>
        </button>
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200"
        >
          <LogOut size={20} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
