
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
  X
} from 'lucide-react';

interface SidebarProps {
  currentView: 'dashboard' | 'menu' | 'stores' | 'restaurants' | 'delivery' | 'settings' | 'customer';
  onViewChange: (view: 'dashboard' | 'menu' | 'stores' | 'restaurants' | 'delivery' | 'settings' | 'customer') => void;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, onLogout, isOpen, onClose }) => {
  const menuItems = [
    { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { id: 'menu', icon: <ShoppingBag size={20} />, label: 'Menu' },
    { id: 'stores', icon: <Store size={20} />, label: 'Stores' },
    { id: 'restaurants', icon: <Utensils size={20} />, label: 'Restaurants' },
    { id: 'delivery', icon: <Truck size={20} />, label: 'Delivery' },
    { id: 'payments', icon: <CreditCard size={20} />, label: 'Payments' },
    { id: 'customer', icon: <Users size={20} />, label: 'Customer' },
    { id: 'invoice', icon: <FileText size={20} />, label: 'Invoice' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed left-0 top-0 z-50 h-screen w-64 bg-white border-r border-gray-100 flex flex-col overflow-y-auto scrollbar-hide transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
        lg:translate-x-0 lg:z-20
      `}>
        {/* Sidebar Header */}
        <div className="p-6 flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
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
          <button 
            onClick={onClose}
            className="lg:hidden p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Branding on Mobile Top (Optional, but helps context) */}
        <div className="lg:hidden px-6 pb-6 border-b border-gray-50 mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-black text-sm italic shadow-lg shadow-orange-200">
              M
            </div>
            <span className="text-lg font-black text-gray-900 tracking-tight">Market<span className="text-orange-500">Cordi</span></span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (['dashboard', 'menu', 'stores', 'restaurants', 'delivery', 'customer', 'settings'].includes(item.id)) {
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

        <div className="p-4 border-t border-gray-100 mt-auto">
          <button 
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
