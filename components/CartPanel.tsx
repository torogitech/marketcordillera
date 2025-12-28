import React from 'react';
import { CartItem, DiningOption } from '../types';
import { Trash2, Edit3, Search, User, ClipboardList, X } from 'lucide-react';
import { STORES } from '../constants';

interface CartPanelProps {
  cart: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQty: (id: string, delta: number) => void;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  className?: string;
  onClose?: () => void;
  activeStoreId?: string;
  onStoreChange?: (id: string) => void;
}

const CartPanel: React.FC<CartPanelProps> = ({ 
  cart, 
  onRemove, 
  onUpdateQty,
  subtotal,
  discount,
  tax,
  total,
  className,
  onClose,
  activeStoreId,
  onStoreChange
}) => {
  return (
    <div className={`fixed right-0 top-0 h-screen bg-white border-l border-gray-100 w-[400px] flex flex-col shadow-2xl z-30 ${className}`}>
      
      {/* Top Controls */}
      <div className="p-6 pb-2 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 text-sm transition-all"
            />
          </div>
          {onClose && (
            <button 
              onClick={onClose}
              className="p-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-500 transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
             <select className="w-full appearance-none pl-4 pr-8 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-orange-500 cursor-pointer">
              <option>{DiningOption.DINE_IN}</option>
              <option>{DiningOption.TAKE_AWAY}</option>
              <option>{DiningOption.DELIVERY}</option>
            </select>
          </div>
          <select 
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-orange-500 cursor-pointer"
            value={activeStoreId}
            onChange={(e) => onStoreChange?.(e.target.value)}
          >
            {STORES.map(store => (
              <option key={store.id} value={store.id}>{store.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
           <User size={18} className="text-gray-400" />
           <h2 className="font-bold text-gray-800 text-lg">Order #20</h2>
        </div>
        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-medium">Active</span>
      </div>

      {/* Cart Items - Scrollable */}
      <div className="flex-1 overflow-y-auto px-6 space-y-4 pb-4">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
            <ClipboardList size={48} className="opacity-20" />
            <p className="text-sm">No items in order</p>
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex gap-4">
                <div className="w-16 h-16 flex-shrink-0">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover rounded-lg border border-gray-100"
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-800 text-sm">{item.name}</h4>
                      <p className="text-orange-500 font-bold text-sm mt-1">
                        ₱{item.price.toFixed(2)} <span className="text-gray-400 font-normal text-xs">x {item.quantity} = ₱{(item.price * item.quantity).toFixed(2)}</span>
                      </p>
                    </div>
                    <button 
                      onClick={() => onRemove(item.id)}
                      className="flex items-center space-x-1 text-red-500 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors text-xs font-medium ml-2 flex-shrink-0"
                    >
                      <Trash2 size={14} />
                      <span>Remove</span>
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-1">
                      <button 
                        onClick={() => onUpdateQty(item.id, -1)}
                        className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-orange-600 text-sm font-bold disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQty(item.id, 1)}
                        className="w-6 h-6 flex items-center justify-center bg-orange-500 rounded shadow-sm text-white hover:bg-orange-600 text-sm font-bold"
                      >
                        +
                      </button>
                    </div>
                    <button className="flex items-center space-x-1 text-xs text-gray-400 hover:text-gray-600 border border-gray-200 px-2 py-1 rounded bg-white">
                      <Edit3 size={10} />
                      <span>Notes</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer - Calculation & Actions */}
      <div className="p-6 bg-gray-50 border-t border-gray-100">
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Sub total :</span>
            <span className="font-semibold text-gray-800">₱{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Product Discount :</span>
            <span className="font-semibold text-gray-800">{discount > 0 ? `-₱${discount.toFixed(2)}` : '₱0.00'}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Tax (5%) :</span>
            <span className="font-semibold text-gray-800">₱{tax.toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-200 my-2"></div>
          <div className="flex justify-between text-base font-bold text-gray-900">
            <span>Total :</span>
            <span className="text-xl">₱{total.toFixed(2)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
           <button className="bg-gray-800 hover:bg-gray-900 text-white py-3 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-gray-200">
             KOT & Print
           </button>
           <button className="bg-white border border-gray-200 text-gray-600 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
             Draft
           </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
           <button className="bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-orange-200">
             Bill & Payment
           </button>
           <button className="bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-green-200">
             Bill & Print
           </button>
        </div>
      </div>
    </div>
  );
};

export default CartPanel;